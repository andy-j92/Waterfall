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

sample_nodes = [
    'node1',
    'node2',
]


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

#     @cherrypy.tools.json_out()
#     def get(self, name):
#         # Handle a GET for a specific node
# 
#         if name not in sample_nodes:
#             raise cherrypy.HTTPError(
#                 404, 'Node \"{0}\" not found'.format(name))
# 
#         return [{'name': name}]

#     @cherrypy.tools.json_in()
#     @cherrypy.tools.json_out()
#     def nodes(self, name):
#         """
#         /nodes/<name> (POST)
#         /nodes/<name> (PUT)
#         /nodes/<name> (DELETE)
#         """
# 
#         if cherrypy.request.method == 'POST':
#             # Handle a nodes create request. It might be preferred to
#             # create a separate "action" for this controller as opposed
#             # to overriding this handler.
# 
#             # Successful POST request
#             return ('You\'re wanting to create a node named'
#                     ' \"{0}\"?'.format(name))
# 
#         elif cherrypy.request.method == 'PUT':
#             if name not in sample_nodes:
#                 raise cherrypy.HTTPError(
#                     404, 'Node \"{0}\" not found'.format(name))
# 
#             # Empty response (http status 204) for successful PUT request
#             cherrypy.response.status = 204
# 
#             return ''
#         elif cherrypy.request.method == 'DELETE':
#             # Empty response (http status 204) for successful DELETE request
#             cherrypy.response.status = 204
# 
#             return ''


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

    # /nodes/{name} (GET)
    #
    # Request "/nodes/notfound" (GET) to test the 404 (not found) handler
#     dispatcher.connect(name='nodes',
#                        route='/nodes/{name}',
#                        action='get',
#                        controller=APIController(),
#                        conditions={'method': ['GET']})
# 
#     # /nodes/{name} (POST)
#     # /nodes/{name} (PUT)
#     # /nodes/{name} (DELETE)
#     dispatcher.connect(name='nodes',
#                        route='/nodes/{name}',
#                        action='nodes',
#                        controller=APIController(),
#                        conditions={'method': ['POST', 'PUT', 'DELETE']})

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