import os
import os.path

import cherrypy
from cherrypy.lib import static

localDir = os.path.dirname(__file__)
absDir = os.path.join(os.getcwd(), localDir)


class FileDemo(object):

    @cherrypy.expose
    def index(self):
        return file("select-file.html")


    @cherrypy.expose
    def summary(self, myFile):
        out = """<html>
        <body>
            <h1 style="text-align:center;">Summary</h1>
            <div style="border:1px solid #8a8a8a;border-radius: 5px;padding: 10px; max-width:600px; margin:0 auto;">%s</div>
        </body>
        </html>"""

        data = myFile.file.read(8192)


        return out % (data)


    @cherrypy.expose
    def download(self):
        path = os.path.join(absDir, 'pdf_file.pdf')
        return static.serve_file(path, 'application/x-download',
                                 'attachment', os.path.basename(path))



tutconf = os.path.join(os.path.dirname(__file__), 'config_file.conf')

if __name__ == '__main__':
    # CherryPy always starts with app.root when trying to map request URIs
    # to objects, so we need to mount a request handler root. A request
    # to '/' will be mapped to HelloWorld().index().
    cherrypy.quickstart(FileDemo(), config=tutconf)
