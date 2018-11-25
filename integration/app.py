#############
###IMPORTS###
#############

import os
import time
import json
import re

from flask import Flask, request, redirect, url_for, render_template, jsonify, session, abort
from werkzeug.utils import secure_filename

##########
###INIT###
##########

app = Flask(__name__)

@app.route("/")
def home():
	return render_template('./index.html')

if __name__ == '__main__':
	app.run(host='0.0.0.0',port=5000, debug=True)