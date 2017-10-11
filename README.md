PyTeaser
========

PyTeaser takes any news article and extract a brief summary from it. It's based on the original [Scala](https://github.com/MojoJolo/textteaser) project.


CVAnalyzer
==========

Summarizes CVs into a short paragraph.

# Environment

## Web Server
```
Web Server Side: Linux/Ubuntu
```
```
Client Side: Any platform that supports a Browser and has WiFi connection
```

## Local Server
```
Local Server Side: Linux/Ubuntu
```
```
Client Side: Linux/Ubuntu
```

# Installation:
Requires Python 2.7.
```
sudo pip install requirements.txt
```

# How to run the server and use the service:
*python2.7 is required for this project

1. Open terminal on Linux/Ubuntu machine
2. Navigate to Server directory
3. Type in "python server.py"
4. Go to favourite browser and type in "localhost"
5. The website should appear and you may start using it

6. Click on "UPLOAD CV(S)"
7. Click choose files and upload the files given in the Testfils directory on github. File type supported are .pdf .doc .docx .ppt. pptx
8. Click on summarize. This will generate a summary of the content in the files uploaded.
9. You may enter any word in the text box to refine the search. Example, type in "mobile". The summary should change to give a blurb of text consiting the word "mobile".
10. Click extract on the top right hand corner. Key words will be extracted and you may choose any of the keywords you want to create a summary of. An example is chosing the word "Technology".
11. To view this webpage on mobile view right click on the webpage and click inspect. Alternatively press ctrl+shift+i if on windows using chrome.
12. Change view from responsive to any of the mobile phones. Navigate around and test the responsivness.


You may also test our system by typing in "18.220.214.223" in the address bar in Chrome. This will access the server currently running on AWS cloud.
