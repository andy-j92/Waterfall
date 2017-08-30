import os
import codecs
from file2txt import *


class moddel:
    def showTxtView(path):
        splited = os.path.splitext(path)
        txtpath = unicode(splited[0] + '.txt')
        msoffice = MSOffice2txt()
        # filename = u'C:\\761\\test\\test111.doc'
        if msoffice.translate(path, txtpath):
            print 'Successed!'
            with codecs.open(txtpath, 'r', 'gb18030') as f:
               str = f.readlines().decode('')
            return str
        else:
            print 'Failed!'
            return 'Failed'
        msoffice.close()
