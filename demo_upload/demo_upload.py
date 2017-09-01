# -*- coding:utf-8 -*-
import cherrypy
import os

# from modelmy import *
#
# import ctrler.
import shutil
import win32com
import win32con
import win32gui
import codecs
import pythoncom
from win32com.client import Dispatch
from cStringIO import StringIO
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from cStringIO import StringIO
def showTxtView(path):

    splited = os.path.splitext(path)
    txtpath = splited[0] + '.txt'
    msoffice = MSOffice2txt()
    # filename = u'C:\\761\\test\\test111.doc'
    if msoffice.translate(path, txtpath):
        print 'Successed!'
        # mystr = ''
        # with open(txtpath, 'r') as f:
        #     strList = f.readlines()
        #     for each in strList:
        #         mystr += each
        # return (mystr)
    else:
        print 'Failed!'
        return 'Failed'
    msoffice.close()

class MSOffice2txt():
    def __init__(self, fileType=['doc', 'ppt']):
        self.docCom = None
        self.pptCom = None
        self.pdfCom = None
        pythoncom.CoInitialize()
        if type(fileType) is not list:
            return 'Error, please check the fileType, it must be list[]'
        for ft in fileType:
            if ft == 'doc':
                self.docCom = self.docApplicationOpen()
            elif ft == 'ppt':
                self.pptCom = self.pptApplicationOpen()



    def close(self):
        self.docApplicationClose(self.docCom)
        self.pptApplicationClose(self.pptCom)

    def docApplicationOpen(self):
        docCom = win32com.client.Dispatch('Word.Application')
        # docCom.Visible = 1
        # docCom.DisplayAlerts = 0
        # docHwnd = win32gui.FindWindow(None, 'Microsoft Word')
        # win32gui.ShowWindow(docHwnd, win32con.SW_HIDE)
        return docCom

    def docApplicationClose(self, docCom):
        if docCom is not None:
            docCom.Quit()

    def doc2Txt(self, docCom, docFile, txtFile):
        doc = docCom.Documents.Open(FileName=docFile, ReadOnly=1)
        doc.SaveAs(txtFile, 2)
        doc.Close()

    def pptApplicationOpen(self):
        pptCom = win32com.client.Dispatch('PowerPoint.Application')
        # pptCom.Visible = 1
        # pptCom.DisplayAlerts = 0
        # pptHwnd = win32gui.FindWindow(None, 'Microsoft PowerPoint')
        # win32gui.ShowWindow(pptHwnd, win32con.SW_HIDE)
        return pptCom

    def pptApplicationClose(self, pptCom):
        if pptCom is not None:
            pptCom.Quit()

    def ppt2txt(self, pptCom, pptFile, txtFile):
        ppt = pptCom.Presentations.Open(pptFile, ReadOnly=1, Untitled=0, WithWindow=0)
        # f = codecs.open(txtFile, "w")
        f = codecs.open(txtFile, "w", 'gb18030')
        slide_count = ppt.Slides.Count
        for i in xrange(1, slide_count + 1):
            shape_count = ppt.Slides(i).Shapes.Count
            for j in xrange(1, shape_count + 1):
                if ppt.Slides(i).Shapes(j).HasTextFrame:
                    s = ppt.Slides(i).Shapes(j).TextFrame.TextRange.Text+ ' '
                    f.write(s)
        f.close()
        ppt.Close()
    def pdfApplicationOpen(self):
        return self.pdfCom
    def pdfApplicationClose(self, pdfCom):
        if pdfCom is not None:
            pdfCom.Quit()



    def translate(self, filename, txtFilename):
        if filename.endswith('doc') or filename.endswith('docx'):
            if self.docCom is None:
                self.docCom = self.docApplicationOpen()
            self.doc2Txt(self.docCom, filename, txtFilename)
            return True
        elif filename.endswith('ppt') or filename.endswith('pptx'):
            if self.pptCom is None:
                self.pptCom = self.pptApplicationOpen()
            self.ppt2txt(self.pptCom, filename, txtFilename)
            return True
        else:
            return False
class Test_Page(object):

    @cherrypy.expose
    def index(self):
        return file("select-file.html")
    @cherrypy.expose
    def result(self, myFile):
        out = """<html>
        <body>
            <h1 style="text-align:center;">Summary</h1>
            <div style="border:1px solid #8a8a8a;border-radius: 5px;padding: 10px; max-width:600px; margin:0 auto;">%s</div>
        </body>
        </html>"""



        upload_path = os.path.dirname(os.getcwd().replace("\\", "/") + '/temp_files/')
        upload_file = os.path.join(upload_path, myFile.filename)

        if os.path.splitext(myFile.filename)[1] == '.pdf':
            size = 0
            with open(upload_file, 'wb') as out:
                while True:
                    data = myFile.file.read(8192)
                    if not data:
                        break
                    out.write(data)

            data = convert_pdf_to_txt(os.getcwd().replace("\\", "/") + '/temp_files/' + myFile.filename)

        else:
            target = os.getcwd().replace("\\", "\\\\") + '\\\\' + 'temp_files' + '\\\\'
            size = 0
            if not os.path.isdir(target):
                os.mkdir(target)

            with open(target+myFile.filename, 'wb') as out:
                while True:
                    data = myFile.file.read(8192)
                    if not data:
                        break
                    out.write(data)

            data= showTxtView(target +myFile.filename)
        return data
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
                pagenos = set()

                for page in PDFPage.get_pages(fp, pagenos, maxpages=maxpages, password=password, caching=caching,
                                              check_extractable=True):
                    interpreter.process_page(page)

                text = retstr.getvalue()

                fp.close()
                device.close()
                retstr.close()

                return text







cherrypy.config.update({
    'server.socket_host': '127.0.0.1',
    'server.socket_port': 1216,
    'server.log_file': True,
    'server.log_to_screen': True,
    'server.log_tracebacks': True,
})
cherrypy.quickstart(Test_Page())