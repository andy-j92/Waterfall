import os
import os.path

import cherrypy
<<<<<<< HEAD
from cherrypy.lib import static
=======
import tempfile
from cherrypy.lib import static
from pyteaser import Summarize

from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from cStringIO import StringIO
>>>>>>> 907e1509dc3c166f70daaf56b6fad41cd0e4bf58

localDir = os.path.dirname(__file__)
absDir = os.path.join(os.getcwd(), localDir)


class FileDemo(object):

<<<<<<< HEAD
=======
    

>>>>>>> 907e1509dc3c166f70daaf56b6fad41cd0e4bf58
    @cherrypy.expose
    def index(self):
        return file("select-file.html")


    @cherrypy.expose
<<<<<<< HEAD
    def summary(self, myFile):
=======
    def result(self, myFile):
>>>>>>> 907e1509dc3c166f70daaf56b6fad41cd0e4bf58
        out = """<html>
        <body>
            <h1 style="text-align:center;">Summary</h1>
            <div style="border:1px solid #8a8a8a;border-radius: 5px;padding: 10px; max-width:600px; margin:0 auto;">%s</div>
        </body>
        </html>"""
<<<<<<< HEAD

        data = myFile.file.read(8192)


        return out % (data)
=======
        upload_path = os.path.dirname(os.getcwd().replace("\\","/")+'/temp_files/')
        upload_file = os.path.join(upload_path, myFile.filename)

        if os.path.splitext(myFile.filename)[1] == '.pdf':
            size = 0
            with open(upload_file, 'wb') as out:
                while True:
                    data = myFile.file.read(8192)
                    if not data:
                        break
                    out.write(data)

            data = convert_pdf_to_txt(os.getcwd().replace("\\","/")+'/temp_files/' + myFile.filename)
        else: 
            data = myFile.file.read(8192)


        return data
>>>>>>> 907e1509dc3c166f70daaf56b6fad41cd0e4bf58


    @cherrypy.expose
    def download(self):
        path = os.path.join(absDir, 'pdf_file.pdf')
        return static.serve_file(path, 'application/x-download',
                                 'attachment', os.path.basename(path))



<<<<<<< HEAD
tutconf = os.path.join(os.path.dirname(__file__), 'config_file.conf')

=======


def convert_pdf_to_txt(path):
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
    return text
    
tutconf = os.path.join(os.path.dirname(__file__), 'config_file.conf')





>>>>>>> 907e1509dc3c166f70daaf56b6fad41cd0e4bf58
if __name__ == '__main__':
    # CherryPy always starts with app.root when trying to map request URIs
    # to objects, so we need to mount a request handler root. A request
    # to '/' will be mapped to HelloWorld().index().
    cherrypy.quickstart(FileDemo(), config=tutconf)
