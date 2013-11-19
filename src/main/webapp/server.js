(function() {
    "use strict";

    function Server() {
        this.fs = require("fs");
        this.basePath = "src/main/webapp/static/";
        this.testPath = "src/test/webapp/jasmine/";
        this.port = 7005;

        this.requestId = 0;
        this.http = require("http");
        this.http.createServer(function(request, response) {
            switch (request.method) {
                case "GET": {
                    return this.serveContent(request, response);
                }
                break;
                case "POST": {
                    return this.writeState(request, response);
                }
                break;
                case "PUT": {
                    return this.log(request, response);
                }
                break;
            }
        }.bind(this)).listen(this.port);
    }

    Server.prototype.serveContent = function(request, response) {
        var contentType, filePath, responseStatus, responseBody, etag, e;
        responseStatus = 200;
        etag = new Date();

        contentType = this.getFileType(request.url);
        if (!contentType) {
            contentType = "text/plain";
            responseStatus = 404;
            responseBody = "ERROR: Unknown file type\n";
        }
        else {
            filePath = this.basePath + request.url;
            if (request.url.indexOf("/test") === 0) {
                filePath = this.testPath + request.url.replace("/test", "");
            }
            if (this.fs.existsSync(filePath)) {
                etag = this.fs.statSync(filePath).mtime;
                if (request.headers[ "If-None-Match" ] === "" + etag.getTime()) {
                    responseStatus = 304;
                }
                else {
                    try {
                        responseBody = this.fs.readFileSync(filePath);
                    }
                    catch (e) {
                        responseStatus = 500;
                        responseBody = "ERROR: failed to read file " + filePath;
                    }
                }
            }
            else {
                responseStatus = 404;
                responseBody = "ERROR: file " + filePath + " doesn't exist";
            }
        }

        this.requestId++;
        console.log("<=[" + this.requestId + "]= " + request.url + " | status " + responseStatus + " =>");

        response.writeHead(responseStatus, {
            "Content-Type": contentType,
            "ETag": "" + etag.getTime()
        });
        response.end(responseBody);
    };

    Server.prototype._pendingWrites = [];

    Server.prototype.writeState = function(request, response) {
        var url;
        if (!request || !request.url) {
            return;
        }
        url = require("url").parse(request.url);
        if (!url || !url.pathname) {
            return;
        }
        this.readRequestBody(request, function(write, data) {
            var body, status;
            try {
                JSON.parse(data);
                write.data = data;
                if (this._pendingWrites.length) {
                    // Queue write so we don't have concurrent writes
                    this._pendingWrites.push(write);
                    return;
                }
                this._pendingWrites.push(write);
            }
            catch (e) {
                body = "Attempted to write invalid JSON to file " + write.fileName + ": " + e;// + "\n" + data;
                console.error(body);
                status = 500;
                write.response.writeHead(status, {});
                write.response.end(body);
            }
            this._writeFile();
        }.bind(this, {
            request: request,
            response: response,
            fileName: url.pathname.substring(1).replace(/\//g, ".") + ".json"
        }));
    };


    Server.prototype._writeFile = function() {
        var write = this._pendingWrites.shift();
        if (!write) {
            return;
        }

        this.fs.writeFile(this.basePath + write.fileName, write.data, function(write, e) {
            var body, status;
            if (e) {
                body = "Failed to save " + write.fileName + " because: " + e;
                console.log(body);
                status = 500;
            }
            else {
                body = "Saved " + write.fileName;
                console.log(body);
                status = 200;
            }
            write.response.writeHead(status, {});
            write.response.end(body);
            this._writeFile();
        }.bind(this, write));
    };


    Server.prototype.log = function(request, response) {
        if (!request) {
            return;
        }
        this.readRequestBody(request, function(data) {
            console.log(data + "\n");
            response.writeHead(200, {});
            response.end(data);
        }.bind(this));
    };

    Server.prototype.serializeRequest = function(request) {
        var p;
        console.log("Received request: {");
        for (p in request) {
            if (request.hasOwnProperty(p)) {
                console.log("\t" + p + ": " + request[ p ]);
            }
        }
        console.log("}");
    };

    Server.prototype.readRequestBody = function(request, callback) {
        var data;
        if (!request || typeof(callback) !== "function") {
            return;
        }
        if (request.body) {
            callback(request.body);
            return;
        }
        data = "";
        request.on("data", function(chunk) {
            data += chunk;
        }.bind(this));
        request.on("end", function() {
            callback(data);
        }.bind(this));
    };

    Server.prototype.isFileOfType = function(url, type) {
        var r = false;
        if (!url || !type) {
            return r;
        }
        r = url.indexOf(type) === url.length - type.length;
        return r;
    };

    Server.prototype.getFileType = function(url) {
        if (this.isFileOfType(url, ".gif")) {
            return "image/gif";
        }
        else if (this.isFileOfType(url, ".jpg") || this.isFileOfType(url, ".jpeg") || this.isFileOfType(url, ".jpe")) {
            return "image/jpeg";
        }
        else if (this.isFileOfType(url, ".png")) {
            return "image/png";
        }
        else if (this.isFileOfType(url, ".js") || this.isFileOfType(url, ".map")) {
            return "text/javascript";
        }
        else if (this.isFileOfType(url, ".css")) {
            return "text/css";
        }
        else if (this.isFileOfType(url, ".json")) {
            return "application/json";
        }
        else if (this.isFileOfType(url, ".html")) {
            return "text/html";
        }
        return null;
    };


    new Server();
})();
