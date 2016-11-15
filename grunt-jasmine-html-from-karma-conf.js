/*
 * grunt-jasmine-html-from-karma-conf
 *
 *
 * Copyright (c) 2014 Nathaniel Blumberg
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function gruntJasmineHtmlFromKarmaConf(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask("jasmine_html_from_karma_conf", "Generates and hosts a Jasmine HTML Spec Runner based off a local karma.conf.js.", function () {
        var options, karmaConfig, html, i, connect, http, app, srcMap, cssRegex;
        cssRegex = /.css$/

        function loadKarmaConfig() {
            var path, absolutePath, relativePath, loadPath;
            path = require("path");
            absolutePath = path.resolve(options.configFile);
            relativePath = path.relative(__dirname, absolutePath);
            loadPath = "./" + relativePath;
            if (options.verbose) {
                grunt.log.writeln("Loading " + loadPath + " (" + absolutePath + ")");
            }
            require(loadPath)({
                set: function (config) {
                    karmaConfig = config;
                }
            });
            if (options.verbose) {
                try {
                    grunt.log.writeln(JSON.stringify(karmaConfig, null, "  "));
                }
                catch (e) {
                }
            }
        }

        srcMap = {};
        function makeScript(src, id) {
            // vvv Don't repeat includes
            if (srcMap.hasOwnProperty(src)) {
                return "";
            }
            srcMap[ src ] = true;
            // ^^^ Don't repeat includes
            return "    <script " + (id ? "id=\"" + id + "\" " : "") + "type=\"text/javascript\" src=\"" + src + "\"></script>\n";
        }

        function makeCSS(src, id){
            if (srcMap.hasOwnProperty(src)) {
                return "";
            }
            srcMap[ src ] = true;
            // ^^^ Don't repeat includes
            return "    <link " + (id ? "id=\"" + id + "\" " : "") + "rel=\"stylesheet\" type=\"text/css\" href=\"" + src + "\" />" + "\n";
        }

        function makeIncludes(pattern, id) {
            var html, files, i;
            html = "";
            if (!pattern) {
                return html;
            }
            if (typeof pattern !== "string") {
                i = null;
                try {
                    i = JSON.stringify(pattern, null, "  ");
                }
                catch (e) {
                    i = null;
                }
                grunt.log.writeln("Ignoring Object in file list: " + i);
                return html;
            }
            if (pattern.indexOf("http://") === 0 || pattern.indexOf("https://") === 0) {
                files = [ pattern ];
            }
            else {
                files = grunt.file.expand(pattern);
                if (options.verbose) {
                    grunt.log.writeln("grunt.file.expand: " + pattern + " -> [ " + files.join(", ") + " ]");
                }
            }
            for (i = 0; i < files.length; i++) {
                if (cssRegex.test(files[i])) {
                    html += makeCSS(files[ i ], id ? id + "_" + i : null);
                }
                else {
                    html += makeScript(files[ i ], id ? id + "_" + i : null);
                }
            }
            return html;
        }

        // Merge task-specific and/or target-specific options with these defaults.
        options = this.options({
            jasmineVersion: "1.3",
            configFile: "karma.conf.js",
            outputFile: "spec-runner.html",
            port: 8234,
            title: "Jasmine Spec Runner",
            verbose: true
        });

        grunt.log.writeln("jasmine_html_from_karma_conf");
        if (options.verbose) {
            grunt.log.writeln("Running from " + __dirname);
        }

        loadKarmaConfig();

        html = "<!DOCTYPE>" + "\n" +
            "<html>" + "\n" +
            "  <head>" + "\n" +
            "    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />" + "\n" +

            "    <title>" + options.title + "</title>" + "\n" +

            "    <link rel=\"icon\" href=\"//jasmine.github.io/images/jasmine.ico\" sizes=\"16x16\"/>" + "\n" +
            "    <link rel=\"icon\" href=\"//jasmine.github.io/images/jasmine_32x32.ico\" sizes=\"32x32\"/>" + "\n" +
            makeCSS("//jasmine.github.io/" + options.jasmineVersion + "/lib/jasmine.css") +
            makeScript("//jasmine.github.io/" + options.jasmineVersion + "/lib/jasmine.js") +
            makeScript("//jasmine.github.io/" + options.jasmineVersion + "/lib/jasmine-html.js");

        if (parseInt(options.jasmineVersion, 10) >= 2) {
            html += makeScript("//jasmine.github.io/" + options.jasmineVersion + "/lib/boot.js");
        }

        html += "    <!-- include source and spec files here... -->" + "\n";
        for (i = 0; i < karmaConfig.files.length; i++) {
            html += makeIncludes(karmaConfig.files[ i ]);
        }

        if (parseInt(options.jasmineVersion, 10) < 2) {
            html += "    <script type=\"text/javascript\">" + "\n" +
                "      (function() {" + "\n" +
                "        var jasmineEnv = jasmine.getEnv();" + "\n" +
                "        jasmineEnv.updateInterval = 1000;" + "\n" +

                "        var htmlReporter = new jasmine.HtmlReporter();" + "\n" +

                "        jasmineEnv.addReporter(htmlReporter);" + "\n" +

                "        jasmineEnv.specFilter = function(spec) {" + "\n" +
                "          return htmlReporter.specFilter(spec);" + "\n" +
                "        };" + "\n" +

                "        var currentWindowOnload = window.onload;" + "\n" +

                "        window.onload = function() {" + "\n" +
                "          if (currentWindowOnload) {" + "\n" +
                "            currentWindowOnload();" + "\n" +
                "          }" + "\n" +
                "          execJasmine();" + "\n" +
                "        };" + "\n" +

                "        function execJasmine() {" + "\n" +
                "          jasmineEnv.execute();" + "\n" +
                "        }" + "\n" +

                "      })();" + "\n" +
                "    </script>" + "\n";
        }

        html += "  </head>" + "\n" +
            "  <body>" + "\n" +
            "  </body>" + "\n" +
            "</html>" + "\n";
        // Write the destination file.
        grunt.file.write(options.outputFile, html.toString());

        // Print a success message.
        grunt.log.writeln("File \"" + options.outputFile + "\" created.");

        // connect = require("connect");
        // http = require("http");

        // app = connect()
        //   // .use(connect.favicon('public/favicon.ico'))
        //   // .use(connect.logger('dev'))
        //   .use(connect.static("./"))
        //   // .use(connect.directory('public'))
        //   .use(function(req, res) {
        //     res.end(html);
        //   });

        // http.createServer(app).listen(options.port);

        // if (options.verbose) {
        //   grunt.log.writeln("Server started--it's time to spec some JavaScript! You can run your specs as you develop by visiting this URL in a web browser:\nhttp://localhost:8234");
        // }
    })
};