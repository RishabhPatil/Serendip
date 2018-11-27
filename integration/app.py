#############
###IMPORTS###
#############

import os
import time
import json
import re
import random
import numpy as np
from flask import Flask, request, redirect, url_for, render_template, jsonify, session, abort
from werkzeug.utils import secure_filename
from sklearn.metrics.pairwise import cosine_similarity
##########
###INIT###
##########

DATA_FOLDER = './static/data/'
with open(DATA_FOLDER+"doc_ids.json") as f:
	doc_ids = json.load(f)

with open(DATA_FOLDER+"doc_topic.json") as f:
	doc_topic = json.load(f)

for i in doc_topic:
	doc_topic[i] = np.array(doc_topic[i]).astype(np.float32)

with open(DATA_FOLDER+"word_ids.json") as f:
	word_ids = json.load(f)

with open(DATA_FOLDER+"word_topic.json") as f:
	word_topic = json.load(f)

topic_words_list = []
topic_words_json = {}
for i in range(30):
	temp_l = []
	with open(DATA_FOLDER+"topic"+str(i)+".csv", "r") as f:
		data = f.read()
	data = data.split("\n")[1:]
	topic_words_json['t'+str(i)] = {}
	for j in data:
		t = j.split(",")
		topic_words_json['t'+str(i)][t[0]] = float(t[1])
		temp_l.append([t[0],float(t[1])])
	topic_words_list.append(temp_l)

colors = [[int(random.random()*128 + 127) for i in range(3)] for i in range(30)]
# matrix
# topic distribution : all words in a topic
# topics in a document (same as matrix?)
# document text
# document ids?
# topic overview : topic per sentence

app = Flask(__name__)

@app.route("/docsearch")
def docsearch():
	words = []
	asdf = request.args
	t_array = [0 for i in range(30)]
	for i in asdf:
		w = request.args.get(i)
		if w in word_ids:
			wid = word_ids[w]
			if str(wid) in word_topic:
				topics = word_topic[str(wid)]
				for tix in topics:
					t = topics[tix]
					t_array[int(t[0])] += float(t)
				words.append(t_array)

	topic_score_array = {"children":[]}
	for i in range(30):
		if t_array[i]!=0:
			temp_j = {"topic":"topic"+str(i)}
			temp_j['score'] = t_array[i]
			temp_j['color'] = "rgb("+str(colors[i][0])+','+str(colors[i][1])+','+str(colors[i][2])+")"
			topic_score_array["children"].append(temp_j)

	scores = []
	for i in doc_topic:
		score = cosine_similarity([doc_topic[i]],[t_array])[0][0]
		if score:
			scores.append([i,doc_topic[i].tolist()])
	scores = sorted(scores, key=lambda x:x[1], reverse=True)

	doc_topic_string = "Document,topics,length"
	for i in scores:
		t = doc_ids[i[0]]
		for j in range(30):
			doc_topic_string += "\n"+t+",topic"+str(j)+","+str(i[1][j])
	with open(DATA_FOLDER+"Extension.csv","w") as f:
		f.write(doc_topic_string)

	return jsonify({"scores":scores, "topic_scores":topic_score_array})

@app.route("/get_doc")
def get_doc():
	docid = request.args.get('docid')
	with open(DATA_FOLDER+"doc"+str(docid)+".txt", "r", encoding="ISO-8859-1") as f:
		txt = f.read()
	txt = txt.replace("\n","<br>")
	return jsonify({"html":txt})

@app.route("/get_colors")
def get_colors():
	return jsonify({"colors":colors})

@app.route("/get_topic_words_json")
def get_topic_words_json():
	return jsonify({"topic_words_json": topic_words_json})

@app.route("/get_word_ranks")
def get_word_ranks():
	# words = ['heaven', 'sun']
	# print(len(topic_words_list))
	words = []
	asdf = request.args
	print(asdf)
	for i in asdf:
		words.append(request.args.get(i))
	print(words)
	if not words:
		print("NO words Found!")
		topic_lens = []
		for i in range(30):
			topic_lens.append({'name':"topic"+str(i), 'len':len(topic_words_list[i])})
		return jsonify({'topic_lens':topic_lens, "ranks":[]})

	ranks = []
	for word in words:
		trank = []
		for i in range(len(topic_words_list)):
			tlen = len(topic_words_list[i])
			sorted_list = sorted(topic_words_list[i], key=lambda x:x[1])
			tr = 999
			for ix in range(tlen):
				if word.lower() == sorted_list[ix][0].lower():
					tr = ix+1
					break
			trank.append(tr)
		ranks.append(trank)
	npr = np.array(ranks)
	tnpr = npr.T
	snpr = np.min(tnpr,axis=1)
	ixs = np.argsort(snpr)
	topic_lens = []
	for i in ixs:
		topic_lens.append({'name':"topic"+str(i), 'len':len(topic_words_list[i])})
	new_ranks = tnpr[ixs].T.tolist()
	# print(new_ranks.tolist())
	return jsonify({'topic_lens':topic_lens, "ranks":new_ranks})

@app.route("/")
def home():
	# get_word_ranks()
	return render_template('./index.html')

# def get_line_graph_data(topic_id):




if __name__ == '__main__':
	app.run(host='0.0.0.0',port=5000, debug=True)