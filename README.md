PyTeaser
========

PyTeaser takes any news article and extract a brief summary from it. It's based on the original [Scala](https://github.com/MojoJolo/textteaser) project.


CV Analyzer
==========

Summarizes CVs into a short paragraph.

See [**Home**](https://github.com/andy-j92/Waterfall/wiki) for more details about the CV Analyser software.

# Environment & Installation

## Environment

### Web Server
```
Web Server Side: Linux/Ubuntu

```

```
Client Side: Any platform that supports a Browser and has WiFi connection
```

### Local Server
```
Local Server Side: Linux/Ubuntu
```

```
Client Side: Linux/Ubuntu
```

## Installation
```
Requires Python 2.7
```

```
sudo pip install requirements.txt
```
See [**Environment & Installation**](https://github.com/andy-j92/Waterfall/wiki/Environment-&-Installation) for more details.

# Run test script
```
python tests.py
```
See [**Test Script**](https://github.com/andy-j92/Waterfall/wiki/Test-Script) for more details.

# How to run the server
### Local server
1. Open terminal on Linux/Ubuntu machine.
2. Navigate to Server directory.
3. Type in "python server.py".
4. Go to favourite browser and type in "localhost".
5. The website should appear and you may start using it.

### Web server
1. Type in "18.220.214.223" in the address bar in Chrome or other web browsers. This will access the server currently running on AWS cloud.

See [**Deploying server**](https://github.com/andy-j92/Waterfall/wiki/Deploying-server) for more details.

# How to use the service
1. Click on "UPLOAD CV(S)".
2. Click choose files and upload the files given in the TestFiles in Server directory on github. File type supported are .pdf .doc .docx .ppt. pptx.
3. Click on summarize. This will generate a summary of the content in the files uploaded.
4. Click extract on the top right hand corner. Key words will be extracted and you may choose any of the keywords you want to create a summary of. An example is chosing the word "Technology".
5. To view this webpage on mobile view right click on the webpage and click inspect. Alternatively press ctrl+shift+i if on windows using chrome.
6. Change view from responsive to any of the mobile phones. Navigate around and test the responsivness.

# System Architecture
CV Analyzer provides a set of [**APIs**](https://github.com/andy-j92/Waterfall/wiki/Project-APIs) to the client side.
See [**System Architecture**](https://github.com/andy-j92/Waterfall/wiki/System-Architecture) for more details.

<br/>
More information about how to run and improve the project is given in the wiki pages below.

https://github.com/andy-j92/Waterfall/wiki
