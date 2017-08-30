# -*- coding:utf-8 -*-
import cherrypy
import os
import file2txt
from modelmy import *
#
# import ctrler.
import shutil
import win32com
import win32con
import win32gui
import codecs
from win32com.client import Dispatch
from cStringIO import StringIO

def showTxtView(path):
    retstr = StringIO()
    splited = os.path.splitext(path)
    txtpath = splited[0] + '.txt'
    msoffice = file2txt.MSOffice2txt()
    # filename = u'C:\\761\\test\\test111.doc'
    if msoffice.translate(path, txtpath):
        print 'Successed!'
        mystr = ''
        with open(txtpath, 'r') as f:
            strList = f.readlines()
            for each in strList:
                mystr += each
        return (mystr)
    else:
        print 'Failed!'
        return 'Failed'
    msoffice.close()

class Test_Page(object):

    @cherrypy.expose
    def index(self):
        return """
             <form action="upload" enctype="multipart/form-data" method="post">
                 <input name="myFile" type="file" />
                 <input type="submit" />
             </form>
        """
    @cherrypy.expose
    def upload(self, myFile):
        target = "C:\\761\\"
        # print(target)
        if not os.path.isdir(target):
            os.mkdir(target)
        filename = myFile.filename


        print filename
        with open(target+filename, 'wb') as out:
            while True:
                data = myFile.file.read(8192)
                if not data:
                    break
                out.write(data)

        data = showTxtView(target+filename)




        return data

        # with codecs.open(target+filename,"w") as f:
        #     # ss = myFile.file.readlines()
        #     done = 0
        #     while not done:
        #         aLine = myFile.file.readline()
        #         if (aLine != ''):
        #             # print aLine
        #             f.write(aLine)
        #         else:
        #             done = 1
        #         # f.write(eachline.encode('UTF-8'))
        #     # shutil.copyfileobj(cherrypy.request.body, f)
        #
        #
        # # return send_from_directory("", filename, as_attachment=True)
        # mystrlist = showTxtView(target+filename)
        # mystr = ''
        # for each in mystrlist:
        #     print each
        #     mystr += str(each)
        # return mystr
cherrypy.config.update({
    'server.socket_host': '127.0.0.1',
    'server.socket_port': 1206,
    'server.log_file': True,
    'server.log_to_screen': True,
    'server.log_tracebacks': True,
})
cherrypy.quickstart(Test_Page())