(function() {
    "use strict";

    function JasmineSpecRunner() {
        this.fs = require("fs");
        this.srcPath = "src/main/webapp/static/js/";
        this.srcOrder = [ "js.js", "serializable.js", "event.js" ];
        this.srcExcludes = [ "admin.js", "listener.js", "jquery.gameMap.js" ];
        this.specPath = "src/test/webapp/jasmine/spec/";
        this.specExcludes = [];
        this.port = 7006;

        this.requestId = 0;
        this.http = require("http");
        this.http.createServer(function(request, response) {
            switch (request.method) {
                case "GET": {
                    return this.serveContent(request, response);
                }
                break;
            }
        }.bind(this)).listen(this.port);
    }

    JasmineSpecRunner.prototype.getConfig = function() {
        var configFactory, setter;
        this.config = null;
        console.log("Loading karma.config.js...");
        configFactory = require("./karma.conf.js");
        setter = {
            set: function(options) {
                console.log("...karma.config.js loaded:\n\tfiles: " + JSON.stringify(options.files) + "\n\texcludes: " + JSON.stringify(options.excludes));
                this.config = options;
            }.bind(this)
        };
        configFactory(setter);
    };

    JasmineSpecRunner.prototype.matchFilePattern = function(target, pattern) {
        if (target.indexOf(pattern) !== -1) {
            return true;
        }
        else {
            pattern = pattern.replace("**", ".*");
            return (new RegExp(pattern)).test(target);
        }
    };

    JasmineSpecRunner.prototype.resolveFile = function(files, file) {
        var path, pathFiles, i, j;
        if (!file || typeof(file) !== "string") { // handle Objects later
            return;
        }
        console.log("Resolving file " + file);
        if (file.indexOf("*") === -1) {
            // Fully qualified path
            files.push(file);
        }
        else {
            // Path pattern, lookup files
            path = file.split("*").shift();
            console.log("Resolving files in " + path);
            pathFiles = this.fs.readdirSync(path) || [];
            console.log("Files in " + path + ":\n[ " + pathFiles.join(", ") + " ]");
            for (i = 0; pathFiles && i < pathFiles.length; i++) {
                // Skip if we've already included it
                if (files.indexOf(pathFiles[ i ]) !== -1 || pathFiles[ i ].indexOf(".js") === -1) {
                    continue;
                }
                // Make sure it doesn't match anything on our exclude list before adding it
                for (j = 0; this.config.exclude && j < this.config.exclude.length; j++) {
                    if (!this.matchFilePattern(pathFiles[ i ], this.config.exclude[ j])) {
                        files.push(path + (path.charAt(path.length - 1) !== "/" && pathFiles[ i ].charAt(0) !== "/" ? "/" : "") + pathFiles[ i ]);
                    }
                }
            }
        }
    };

    JasmineSpecRunner.prototype.findFiles = function() {
        var files, i;
        files = [];
        for (i = 0; i < this.config.files.length; i++) {
            this.resolveFile(files, this.config.files[ i ]);
        }
        return files;
    };

    JasmineSpecRunner.prototype.serveTestRunner = function(request, response) {
        var files, nl, responseBody, i;

        this.getConfig();
        files = this.findFiles();

        this.requestId++;
        console.log("Request #" + this.requestId + " included files: [" + files.join(", ") + "]");

        nl = "\n";
        responseBody = "<!DOCTYPE HTML>" + nl +
            "<html>" + nl +
            "<head>" + nl +
            "    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />" + nl +
            "    <title>Jasmine Spec Runner</title>" + nl +
            "    <link rel=\"shortcut icon\" type=\"image/png\" href=\"src/test/webapp/jasmine/lib/jasmine-1.2.0/jasmine_favicon.png\">" + nl +
            "    <link rel=\"stylesheet\" type=\"text/css\" href=\"src/test/webapp/jasmine/lib/jasmine-1.2.0/jasmine.css\">" + nl +
            "    <script type=\"text/javascript\" src=\"src/test/webapp/jasmine/lib/jasmine-1.2.0/jasmine.js\"></script>" + nl +
            "    <script type=\"text/javascript\" src=\"src/test/webapp/jasmine/lib/jasmine-1.2.0/jasmine-html.js\"></script>" + nl +
            "    <!-- include source files here... -->" + nl;

        for (i = 0; i < files.length; i++) {
            responseBody += "    <script src=\"../../../../" + files[ i ] + "\"></script>" + nl;
        }

        responseBody += "    <script type=\"text/javascript\">" + nl +
            "    (function() {" + nl +
            "        var jasmineEnv = jasmine.getEnv();" + nl +
            "        jasmineEnv.updateInterval = 1000;" + nl +
            "        var htmlReporter = new jasmine.HtmlReporter();" + nl +
            "        jasmineEnv.addReporter(htmlReporter);" + nl +
            "        jasmineEnv.specFilter = function(spec) {" + nl +
            "            return htmlReporter.specFilter(spec);" + nl +
            "        };" + nl +
            "        var currentWindowOnload = window.onload;" + nl +
            "        window.onload = function() {" + nl +
            "            if (currentWindowOnload) {" + nl +
            "                currentWindowOnload();" + nl +
            "            }" + nl +
            "            execJasmine();" + nl +
            "        };" + nl +
            "        function execJasmine() {" + nl +
            "            jasmineEnv.execute();" + nl +
            "        }" + nl +
            "    })();" + nl +
            "    </script>" + nl +
            "</head>" + nl +
            "<body></body>" + nl +
            "</html>" + nl;

        response.writeHead(200, {
            "Content-Type": "text/html"
        });
        response.end(responseBody);
    };

    JasmineSpecRunner.prototype.serveContent = function(request, response) {
        var contentType, filePath, responseStatus, responseBody, etag, e;
        responseStatus = 200;
        etag = new Date();

        contentType = this.getFileType(request.url);
        if (!contentType) {
            contentType = "text/plain";
            responseStatus = 404;
            responseBody = "ERROR: Unknown file type\n";
        }
        else if (contentType === "text/specrunner") {
            return this.serveTestRunner(request, response);
        }
        else {
            filePath = request.url.trim();
            if (filePath.indexOf("/base") === 0) {
                filePath = filePath.substr(5);
            }
            if (filePath.charAt(0) === "/") {
                filePath = filePath.substr(1);
            }
            filePath = "./" + filePath;
            if (filePath.indexOf("?") !== -1) {
                // Strip query params
                filePath = filePath.substring(0, filePath.indexOf("?"));
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
        console.log("<=[" + this.requestId + "]= " + (filePath || request.url) + " | status " + responseStatus + " =>");

        response.writeHead(responseStatus, {
            "Content-Type": contentType,
            "ETag": "" + etag.getTime()
        });
        response.end(responseBody);
    };

    JasmineSpecRunner.prototype.isFileOfType = function(url, type) {
        var r = false;
        if (!url || !type) {
            return r;
        }
        r = url.indexOf(type) === url.length - type.length;
        return r;
    };

    JasmineSpecRunner.prototype.getFileType = function(url) {
        if (url.indexOf("?") !== -1) {
            // Strip query params
            url = url.substring(0, url.indexOf("?"));
        }
        if (url === "https://localhost:7006/" || url === "/") {
            return "text/specrunner";
        }
        else if (this.isFileOfType(url, ".gif")) {
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


    new JasmineSpecRunner();
})();
