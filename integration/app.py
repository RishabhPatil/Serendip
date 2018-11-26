#############
###IMPORTS###
#############

import os
import time
import json
import re
import random

from flask import Flask, request, redirect, url_for, render_template, jsonify, session, abort
from werkzeug.utils import secure_filename

##########
###INIT###
##########

DATA_FOLDER = './static/data/'
with open(DATA_FOLDER+"doc_ids.json") as f:
	doc_ids = json.load(f)

topic_words_json = {}
for i in range(30):
	with open(DATA_FOLDER+"topic"+str(i)+".csv", "r") as f:
		data = f.read()
	data = data.split("\n")[1:]
	topic_words_json['t'+str(i)] = {}
	for j in data:
		t = j.split(",")
		topic_words_json['t'+str(i)][t[0]] = float(t[1])


colors = [[int(random.random()*128 + 127) for i in range(3)] for i in range(30)]
# matrix
# topic distribution : all words in a topic
# topics in a document (same as matrix?)
# document text
# document ids?
# topic overview : topic per sentence

app = Flask(__name__)

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


@app.route("/")
def home():
	return render_template('./index.html')

# def get_line_graph_data(topic_id):




if __name__ == '__main__':
	app.run(host='0.0.0.0',port=5000, debug=True)