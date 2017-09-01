# -*- coding:utf-8 -*-
import os
from win32com import client as wc
rootdir =os.getcwd()
# rootdir =os.getcwd()
word = wc.Dispatch('Word.Application')

try:
    f_list = []
    os_dict = {i:[j,k] for i ,j,k in os.walk(rootdir)}
    for parent,dirnames,filenames in os.walk(rootdir):
        for filename in filenames:
            if u'.doc' in filename and u'~$' not in filename:
                title = filename[:-4]
                f_list.append(filename)
                word.Visible = 0
                doc = word.Documents.Open(os.path.join(parent,filename))

                if u'txt' in dirnames :
                    if title+'.txt' not in os_dict[os.path.join(parent,'txt')][1]:
                        doc.SaveAs(os.path.join(parent,'txt',title+'.txt'), 4)
                else:
                    os.mkdir(os.path.join(parent,'txt'))
                    doc.SaveAs(os.path.join(parent,'txt', title + '.txt'),4)


finally:
    word.Quit()
print(f_list)
