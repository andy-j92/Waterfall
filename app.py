import os

import sys
reload(sys)
sys.setdefaultencoding('utf8')
from flask import Flask, request, render_template, send_from_directory



app = Flask(__name__)

APP_ROOT = os.path.dirname(os.path.abspath(__file__))


@app.route("/")
def index():
    return render_template("upload.html")


@app.route("/upload", methods=["POST"])
def upload():
    # folder_name = request.form['superhero']
    '''
    # this is to verify that folder to upload to exists.
    if os.path.isdir(os.path.join(APP_ROOT, 'files/{}'.format(folder_name))):
        print("folder exist")
    '''
    # target = os.path.join(APP_ROOT, 'files/{}'.format(folder_name))
    target = os.path.join(APP_ROOT, 'files/')
    print(target)
    if not os.path.isdir(target):
        os.mkdir(target)
    print(request.files.getlist("file"))
    for file in request.files.getlist("file"):
        print(file)
        print("{} is the file name".format(file.filename))
        filename = file.filename
        # This is to verify files are supported
        ext = os.path.splitext(filename)[1]
        if (ext == ".doc") or (ext == ".pdf"):
            print("File supported moving on...")
        else:
            render_template("Error.html", message="Files uploaded are not supported...")
        destination = "/".join([target, filename])
        print("Accept incoming file:", filename)
        print("Save it to:", destination)
        file.save(destination)

    # return send_from_directory("images", filename, as_attachment=True)
    return render_template("complete.html")

#
# @app.route('/upload/<filename>')
# def send_image(filename):
#     return send_from_directory("images", filename)


if __name__ == "__main__":
    app.run(port=8080, debug=True)
