/* global module, require */
module.exports = function(grunt) {
    "use strict";

    var options, BASE_URL;
    BASE_URL = /BASE\//g;

    // loads all grunt tasks from package.json
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    function isValidHtmlContent(filename) {
        var noExt, ext;
        if (!filename) {
            return false;
        }
        noExt = filename.split(".").shift();
        ext = filename.split(".").pop();
        return noExt && noExt !== "prefix" && noExt !== "suffix" && ext === "html";
    }

    options = {

        //get meta data
        pkg: grunt.file.readJSON("package.json"),

        htmlPath: "html/",
        htmlFiles: "<%= htmlPath %>**/*.html",

        /***********************
         * DEVELOPER CONVENIENCE
         ***********************/

        clean: {
            dist: [ "dist/**/*.html" ]
        },

        concat: (function concatConfig() {
            var config = {};
            function concatConfigEachFile(abspath, rootdir, subdir, filename) {
                var noExt;
                //grunt.log.writeln("concatConfigEachFile(" + abspath + ", " + rootdir + ", " + subdir + ", " + filename + ")");
                if (!isValidHtmlContent(filename)) {
                    return;
                }
                noExt = filename.split(".").shift();
                if (subdir) {
                    subdir = subdir + "/";
                }
                else {
                    subdir = "";
                }
                config[ noExt ] = {
                    src: [ "dist/prefix.html", abspath, "html/suffix.html" ],
                    dest: "dist/" + subdir + filename
                };
            }
            grunt.file.recurse("html/", concatConfigEachFile);
            //grunt.file.recurse("html/characters/", concatConfigEachFile.bind(null, "characters/"));
            //grunt.log.writeln(JSON.stringify(config, null, "  "));
            return config;
        })(),

        // Build the html using grunt-includes
        includes: {
            html: {
                cwd: "html",
                src: [ "prefix.html" ],
                dest: "dist/",
                options: {
                    flatten: true,
                    includePath: "html",
                    includeRegexp: /^(\s*)include\s+\"(.+)"\s*$/,
                    banner: "<!-- Site built using grunt includes! -->\n"
                }
            }
        },

        // watch files and do stuff
        watch: {
            html: {
                options: {
                    interrupt: false,
                    debounceDelay: 250,
                    reload: false,
                    livereload: 9001
                },
                files: [ "<%= htmlFiles %>" ],
                tasks: [ "build" ]
            }
        },

        // serve up docs and fixtures
        // https://github.com/gruntjs/grunt-contrib-connect
        connect: {
            server: {
                options: {
                    port: 9000,
                    protocol: "http",
                    hostname: "localhost",
                    base: "./",
                    keepalive: false,
                    livereload: 9001,
                    open: "http://localhost:9000"
                }
            }
         }

    };

    grunt.initConfig(options);

    //default task
    grunt.registerTask("default", []);

    grunt.registerTask("generateCharacterList", function () {
        var content = "var PEOPLE = [\n";
        function generateCharacterList(abspath, rootdir, subdir, filename) {
            var noExt;
            // grunt.log.writeln("generateCharacterList(" + abspath + ", " + rootdir + ", " + subdir + ", " + filename + ")");
            if (!isValidHtmlContent(filename)) {
                return;
            }
            noExt = filename.split(".").shift();
            content += "    \"" + noExt  + "\",\n";
        }
        grunt.file.recurse("html/characters/", generateCharacterList);
        content = content.substring(0, content.length - 2) + "\n];";
        grunt.file.write("dist/characters.js", content);
    });

    grunt.registerTask("generateGroupList", function () {
        var content = "var GROUPS = [\n";
        function generateGroupList(abspath, rootdir, subdir, filename) {
            var noExt;
            // grunt.log.writeln("generateGroupList(" + abspath + ", " + rootdir + ", " + subdir + ", " + filename + ")");
            if (!isValidHtmlContent(filename)) {
                return;
            }
            noExt = filename.split(".").shift();
            content += "    \"" + noExt  + "\",\n";
        }
        grunt.file.recurse("html/groups/", generateGroupList);
        content = content.substring(0, content.length - 2) + "\n];";
        grunt.file.write("dist/groups.js", content);
    });

    grunt.registerTask("generatePlaceList", function () {
        var content = "var PLACES = [\n";
        function generatePlaceList(abspath, rootdir, subdir, filename) {
            var noExt;
            // grunt.log.writeln("generatePlaceList(" + abspath + ", " + rootdir + ", " + subdir + ", " + filename + ")");
            if (!isValidHtmlContent(filename)) {
                return;
            }
            noExt = filename.split(".").shift();
            content += "    \"" + noExt  + "\",\n";
        }
        grunt.file.recurse("html/places/", generatePlaceList);
        content = content.substring(0, content.length - 2) + "\n];";
        grunt.file.write("dist/places.js", content);
    });

    grunt.registerTask("setBaseUrl", function () {
        function setBaseUrl(abspath, rootdir, subdir, filename) {
            var content, path, n;
            if (!isValidHtmlContent(filename)) {
                return;
            }
            path = "../";
            if (subdir) {
                subdir.split("/").forEach(function subdirRelativePath() {
                    path += "../";
                });
            }
            content = grunt.file.read(abspath).replace(BASE_URL, path);
            grunt.file.write(abspath, content);
        }
        grunt.file.recurse("dist/", setBaseUrl);
    });

    grunt.registerTask("scrapeCharacters", function () {
        var html, classIndex, id, startIndex, idIndex, endIndex, content;
        html = grunt.file.read("./html/characters.html");
        classIndex = html.indexOf("\"bio\"");
        while (classIndex !== -1) {
            startIndex = html.lastIndexOf("<div", classIndex);
            idIndex = html.lastIndexOf("id=\"", classIndex) + 4;
            id = html.substring(idIndex, html.indexOf("\"", idIndex));
            classIndex = html.indexOf("\"bio\"", classIndex + 1);
            endIndex = html.length - 8;
            if (classIndex !== -1) {
                endIndex = html.lastIndexOf("</div>", classIndex) + "</div>".length + 1;
            }
            content = html.substring(startIndex, endIndex).replace("../", "BASE/");
            grunt.file.write("./html/characters/" + id + ".html", content);
            grunt.log.writeln(id + ": " + startIndex + ", " + endIndex);
        }
    });

    grunt.registerTask("scrapePlaces", function () {
        var html, classIndex, id, startIndex, idIndex, endIndex, content;
        html = grunt.file.read("./html/places.html");
        classIndex = html.indexOf("\"guide\"");
        while (classIndex !== -1) {
            startIndex = html.lastIndexOf("<article", classIndex);
            idIndex = html.lastIndexOf("id=\"", classIndex) + 4;
            id = html.substring(idIndex, html.indexOf("\"", idIndex));
            classIndex = html.indexOf("\"guide\"", classIndex + 1);
            endIndex = html.length - 8;
            if (classIndex !== -1) {
                endIndex = html.lastIndexOf("</article>", classIndex) + "</article>".length + 1;
            }
            content = html.substring(startIndex, endIndex).replace("../", "BASE/");
            grunt.file.write("./html/places/" + id + ".html", content);
            grunt.log.writeln(id + ": " + startIndex + ", " + endIndex);
        }
    });

    //development-based tasks
    grunt.registerTask("build", [ "clean", "generateCharacterList", "generateGroupList", "generatePlaceList", "includes:html", "concat", "setBaseUrl" ]);
    grunt.registerTask("html", [ "build", "watch:html" ]);

    // Serve locally
    grunt.registerTask("serve", [ "connect", "html" ]);
};
