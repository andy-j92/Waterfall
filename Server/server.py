#!/usr/bin/env python

# pylint: disable=invalid-name

"""
CherryPy-based webservice daemon with background threads
"""
import os, os.path
import random
import string
import threading
import json
import cherrypy
from cherrypy.process import plugins

def worker():
    """Background Timer that runs the hello() function every 5 seconds

    TODO: this needs to be fixed/optimized. I don't like creating the thread
    repeatedly.
    """

    while True:
        t = threading.Timer(5.0, hello)
        t.start()
        t.join()


def hello():
    """Output 'hello' on the console"""

    print ('hello')


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

#     @cherrypy.tools.json_out()
    def upload(self):
        # Regular request for '/nodes' URI
        return open('index.html')

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
                       route='/upload',
                       action='upload',
                       controller=APIController(),
                       conditions={'method': ['GET']})

    config = {
        'global': {
            'server.socket_host': '0.0.0.0',
            # 'server.socket_port': 8080,
        },
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
            'tools.staticdir.dir': './public'
        }
    }

    cherrypy.tree.mount(root=None, config=config)

    cherrypy.engine.start()
    cherrypy.engine.block()