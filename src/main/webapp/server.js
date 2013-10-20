(function() {
    "use strict";
    
    function Server() {
        this.fs = require("fs");
        this.basePath = "src/main/webapp/static/";
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

    Server.prototype.writeState = function(request, response) {
        var url, fileName;
        if (!request || !request.url) {
            return;
        }
        url = require("url").parse(request.url);
        if (!url || !url.pathname) {
            return;
        }
        fileName = url.pathname.substring(1).replace(/\//g, ".") + ".json";
        this.readRequestBody(request, function(data) {
            this.fs.writeFile(this.basePath + fileName, data, function(e) {
                var status, body;
                if (e) {
                    body = "Failed to save " + fileName + " because: " + e;
                    console.log(body);
                    status = 500;
                }
                else {
                    body = "Saved " + fileName;
                    console.log(body);
                    status = 200;
                }
                response.writeHead(status, {});
                response.end(body);
            });
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
        if (!request || typeof(callback) !== "function") {
            return;
        }
        request.on("readable", function() {
            var data, chunk, fileName;
            data = "";
            while (null !== (chunk = request.read())) {
                data += chunk;
            }
            
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
