(function() {
	var app, http, fs, port, basePath, requestId;
	
	function serializeRequest(request) {
		var p;
		console.log("Received request: {");
		for (p in request) {
			if (request.hasOwnProperty(p)) {
				console.log ("\t" + p + ": " + request[ p ]);
			}
		}
		console.log("}");
	}

	fs = require("fs");
	basePath = "src/main/webapp/static/";
	port = 7005;

	requestId = 0;
	http = require("http");
	http.createServer(function(request, response) {
		var matchFileType, path, contentType, filePath, responseStatus, responseBody, etag, e;
		responseStatus = 200;
		etag = new Date();
		
		matchFileType = function(url, type) {
			var r = false;
			if (!url || !type) {
				return r;
			}
			r = url.indexOf(type) === url.length - type.length;
			return r;
		};
		if (matchFileType(request.url, ".gif")) {
			contentType = "image/gif";
		}
		else if (matchFileType(request.url, ".jpg") || matchFileType(request.url, ".jpeg") || matchFileType(request.url, ".jpe")) {
			contentType = "image/jpeg";
		}
		else if (matchFileType(request.url, ".png")) {
			contentType = "image/png";
		}
		else if (matchFileType(request.url, ".js") || matchFileType(request.url, ".map")) {
			contentType = "text/javascript";
		}
		else if (matchFileType(request.url, ".css")) {
			contentType = "text/css";
		}
		else if (matchFileType(request.url, ".json")) {
			contentType = "application/json";
		}
		else if (matchFileType(request.url, ".html")) {
			contentType = "text/html";
		}
		else {
			contentType = "text/plain";
			responseStatus = 404;
			responseBody = "ERROR: Unknown file type\n";
		}
		
		if (contentType) {
			filePath = basePath + request.url;
			if (fs.existsSync(filePath)) {
				etag = fs.statSync(filePath).mtime;
				if (request.headers[ "If-None-Match" ] === "" + etag.getTime()) {
					responseStatus = 304;
				}
				else {
					try {
						responseBody = fs.readFileSync(filePath);
					}
					catch (e) {
						contentType = "text/plain";
						responseStatus = 500;
						responseBody = "ERROR: failed to read file " + filePath;
					}
				}
			}
			else {
				contentType = "text/plain";
				responseStatus = 404;
				responseBody = "ERROR: file " + filePath + " doesn't exist";
			}
		}
		
		requestId++;
		console.log("<=[" + requestId + "]= " + request.url + " | status " + responseStatus + " =>");

		response.writeHead(responseStatus, {
			"Content-Type" : contentType,
			"ETag": "" + etag.getTime()
		});
		response.end(responseBody);
	}).listen(port);
})();
