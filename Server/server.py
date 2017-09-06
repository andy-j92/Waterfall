#!/usr/bin/env python

# pylint: disable=invalid-name

"""
CherryPy-based webservice daemon with background threads
"""
from cStringIO import StringIO
import codecs
import json
import os, os.path
import random
import string
import threading

import cherrypy
from cherrypy.process import plugins
import docx
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.pdfpage import PDFPage
from pptx import Presentation
import pyteaser
import textrazor


# import pyteaser
def worker():
    """Background Timer that runs the hello() function every 5 seconds

    TODO: this needs to be /optimized. I don't like creating the thread
    repeatedly.fixed
    """
    
    while True:
        t = threading.Timer(10.0, hello)
        t.start()
        t.join()


def hello():
    """Output 'hello' on the console"""
    
    print ('Server running...')
    # Summarize("hi my name is nipoon")
    # x = pyteaser.Summarize("Video provides a powerful way to help you prove your point. When you click Online Video, you can paste in the embed code for the video you want to add. You can also type a keyword to search online for the video that best fits your document.")
    # print(x)

class MyBackgroundThread(plugins.SimplePlugin):
    """CherryPy plugin to create a background worker thread"""

    def __init__(self, bus):
        plugins.SimplePlugin.__init__(self, bus)

        self.t = None

    def start(self):
        """Plugin entrypoint"""

        self.t = threading.Thread(target=worker)
        self.t.daemon = True
        self.t.start()

    # Start at a higher priority that "Daemonize" (which we're not using
    # yet but may in the future)
    start.priority = 85


class APIController(object): \
        # pylint: disable=too-few-public-methods

    """Controller for fictional "nodes" webservice APIs"""

# #     @cherrypy.tools.json_out()
    def upload(self):
        # Regular request for '/nodes' URI
        return open('index.html')


    @cherrypy.expose
    def test(self):
        return file("./Public/html/summaries.html")

    @cherrypy.expose
    def upload(self):
        return file("./Public/html/select-file.html")

    @cherrypy.expose
    def newcv(self):
        return file("./Public/html/NewCV.html")

    @cherrypy.expose
    def keywordsearch(self):
        return file("./Public/html/KeyWordSearch.html")

    def result(self, myFile):
        out = """<html>
        <body>
            <h1 style="text-align:center;">Summary</h1>
            <div style="border:1px solid #8a8a8a;border-radius: 5px;padding: 10px; max-width:600px; margin:0 auto;">%s</div>
        </body>
        </html>"""

        upload_file = './temp_files/' + myFile.filename

        if os.path.splitext(myFile.filename)[1] == '.pdf':
            size = 0
            with open(upload_file, 'wb') as out:
                while True:
                    data = myFile.file.read(8192)
                    if not data:
                        break
                    out.write(data)

            data = convertPdf('./temp_files/' + myFile.filename)
        elif os.path.splitext(myFile.filename)[1] == '.pptx':
            target = './temp_files'

            size = 0
            if not os.path.isdir(target):
                os.mkdir(target)

            with open(target + myFile.filename, 'wb') as out:
                while True:
                    data = myFile.file.read(8192)
                    if not data:
                        break
                    out.write(data)

            data = convertPptx(target + myFile.filename)
        elif os.path.splitext(myFile.filename)[1] == '.docx':
            target = './temp_files'
            size = 0
            if not os.path.isdir(target):
                os.mkdir(target)

            with open(target + myFile.filename, 'wb') as out:
                while True:
                    data = myFile.file.read(8192)
                    if not data:
                        break
                    out.write(data)

            data = convertDocx(target + myFile.filename)

        else:
            data = "Invalid file type!"

        return pyteaser.Summarize(data)


def convertDocx(path):

	document = docx.Document(path)
	docText = ''.join([
	    paragraph.text.encode('utf-8') for paragraph in document.paragraphs
	])
	print(docText)
	return docText

def convertPptx(path):

	prs = Presentation(path)
	# text_runs will be populated with a list of strings,
	# one for each text run in presentation
	text_runs = []
	full_string = ""

	for slide in prs.slides:
	    for shape in slide.shapes:
	        if not shape.has_text_frame:
	            continue
	        for paragraph in shape.text_frame.paragraphs:
	            for run in paragraph.runs:
	                text_runs.append(run.text)


	full_string = ''.join(text_runs)
	print(full_string)
	return full_string

def convertPdf(path):
    rsrcmgr = PDFResourceManager()
    retstr = StringIO()
    codec = 'utf-8'
    laparams = LAParams()
    device = TextConverter(rsrcmgr, retstr, codec=codec, laparams=laparams)
    fp = file(path, 'rb')
    interpreter = PDFPageInterpreter(rsrcmgr, device)
    password = ""
    maxpages = 0
    caching = True
    pagenos=set()

    for page in PDFPage.get_pages(fp, pagenos, maxpages=maxpages, password=password,caching=caching, check_extractable=True):
        interpreter.process_page(page)

    text = retstr.getvalue()

    fp.close()
    device.close()
    retstr.close()
    print(text)
    return text

def jsonify_error(status, message, traceback, version): \
        # pylint: disable=unused-argument

    """JSONify all CherryPy error responses (created by raising the
    cherrypy.HTTPError exception)
    """

    cherrypy.response.headers['Content-Type'] = 'application/json'
    response_body = json.dumps(
        {
            'error': {
                'http_status': status,
                'message': message,
            }
        })

    cherrypy.response.status = status

    return response_body


if __name__ == '__main__':
    MyBackgroundThread(cherrypy.engine).subscribe()

    dispatcher = cherrypy.dispatch.RoutesDispatcher()

    # /nodes (GET)
    dispatcher.connect(name='upload',
                       route='/',
                       action='upload',
                       controller=APIController(),
                       conditions={'method': ['GET']})

    # /nodes (GET)
    dispatcher.connect(name='result',
                       route='/result',
                       action='result',
                       controller=APIController(),
                       conditions={'method': ['POST']})

    # /nodes (GET)
    dispatcher.connect(name='newcv',
                       route='/newcv',
                       action='newcv',
                       controller=APIController(),
                       conditions={'method': ['GET']})

    # /nodes (GET)
    dispatcher.connect(name='keywordsearch',
                       route='/keywordsearch',
                       action='keywordsearch',
                       controller=APIController(),
                       conditions={'method': ['GET']})   

    # /nodes (GET)
    dispatcher.connect(name='test',
                       route='/test',
                       action='test',
                       controller=APIController(),
                       conditions={'method': ['GET']})   

    config = {
        '/': {
            'request.dispatch': dispatcher,
            'error_page.default': jsonify_error,
            'tools.sessions.on': True,
            'tools.staticdir.root': os.path.abspath(os.getcwd())
        },
              
        '/generator': {
            'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
            'tools.response_headers.on': True,
            'tools.response_headers.headers': [('Content-Type', 'text/plain')],
        },
          
        '/static': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': 'Public/'
        }
    }

    cherrypy.tree.mount(root=None, config=config)
    cherrypy.server.socket_host = '0.0.0.0'
    cherrypy.server.socket_port = 80

    cherrypy.engine.start()
    cherrypy.engine.block()