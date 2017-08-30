#coding:utf-8
import win32com
import win32con
import win32gui
import codecs
from win32com.client import Dispatch
import pythoncom
  
class MSOffice2txt():
     def __init__(self, fileType=['doc','ppt']):
         self.docCom = None
         self.pptCom = None
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
         docCom.Visible = 1
         docCom.DisplayAlerts = 0
         docHwnd = win32gui.FindWindow(None, 'Microsoft Word')
         win32gui.ShowWindow(docHwnd, win32con.SW_HIDE)
         return docCom
 
     def docApplicationClose(self,docCom):
         if docCom is not None:
             docCom.Quit()
 
     def doc2Txt(self, docCom, docFile, txtFile):
         doc = docCom.Documents.Open(FileName=docFile,ReadOnly=1)
         doc.SaveAs(txtFile, 2)
         doc.Close()
 
     
 
     def pptApplicationOpen(self):
         pptCom = win32com.client.Dispatch('PowerPoint.Application')
         pptCom.Visible = 1
         pptCom.DisplayAlerts = 0
         pptHwnd = win32gui.FindWindow(None, 'Microsoft PowerPoint')
         win32gui.ShowWindow(pptHwnd, win32con.SW_HIDE)
         return pptCom
 
     def pptApplicationClose(self, pptCom):
         if pptCom is not None:
             pptCom.Quit()
 
     def ppt2txt(self, pptCom, pptFile, txtFile):
         ppt = pptCom.Presentations.Open(pptFile,ReadOnly=1, Untitled=0, WithWindow=0)
         f = codecs.open(txtFile,"w",'gb18030')
         slide_count = ppt.Slides.Count
         for i in xrange(1,slide_count + 1):
             shape_count = ppt.Slides(i).Shapes.Count
             for j in xrange(1,shape_count + 1):
                 if ppt.Slides(i).Shapes(j).HasTextFrame:
                     s = ppt.Slides(i).Shapes(j).TextFrame.TextRange.Text
                     f.write(s)
         f.close()
         ppt.Close()
 
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
 
if __name__=='__main__':
     msoffice = MSOffice2txt()
     filename = u'C:\\761\\test222.doc'
     if msoffice.translate(filename, 'temp.txt'):
         print 'Successed!'
     else:
         print 'Failed!'
     msoffice.close()
     
