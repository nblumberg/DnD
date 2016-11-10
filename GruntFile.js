/**
 * Created by nblumberg on 11/16/14.
 */

module.exports = function gruntFile(grunt) {
    "use strict";

    var options;

    /**************
     * LOAD DEPENDENCIES
     *************/

    // loads all grunt tasks from package.json
    require("load-grunt-tasks")(grunt);

    require("./grunt-jasmine-html-from-karma-conf.js")(grunt);

    // uncomment to time each grunt tasks
    require("time-grunt")(grunt);

    options = {};
    // pulls in meta data used by some plugins
    options.pkg = grunt.file.readJSON("package.json");

    /**************
     * PATHS, FILES
     *************/

    options.webappPath = "src/main/webapp/";
    options.staticPath = options.webappPath + "static/";
    options.genPath = options.staticPath + "gen/";
    options.mappingPath = options.webappPath + "gen/";

    // test
    options.testPath = "src/test/webapp/jasmine/spec";
    options.testFiles = "<%= testPath %>/*.js";

    // css
    options.cssPath = options.staticPath + "css/";
    options.cssFiles = options.cssPath + "**.css";

    // html
    options.htmlPath = options.staticPath + "html/";
    options.htmlFiles = options.htmlPath + "**.html";

    // js
    options.jsPath = options.staticPath + "js";
    options.jsFiles = [
        options.jsPath + "lib/jquery.js",
        options.jsPath + "lib/jquery-ui.js",
        options.jsPath + "lib/bootstrap.min.js",
        options.jsPath + "js.js",
        options.jsPath + "dnd.js",
        options.jsPath + "*.js"
    ];
    options.jsNoMinifyGroups = [];
    options.jsGroups = (function() {
        var o = {
            basic: options.jsFiles
        };

        o.admin = o.basic.concat([
            options.jsPath + "admin/admin.js",
        ]);

        o.listener = o.basic.concat([
            options.jsPath + "listener/listener.js",
        ]);

        return o;
    })();

    //console.log("options.jsGroups: " + JSON.stringify(options.jsGroups, null, "    "));

    /**************
     * ASSET MGMT
     *************/

    // Clean up generated files
    options.clean = {
        all: [ options.genPath + "*", options.mappingPath + "*", "monsters_forIncludeSource.scss" ], // everything (other than groups.js) for a clean start
        build: [ "monsters_forIncludeSource.scss" ]
    };

    // Make the .js file name unique to the content so it can be permanently cached by the browser
    options.hash = {
        options: {
            mapping: options.mappingPath + "assets.json", // mapping file so your server can serve the right files
            srcBasePath: options.genPath, // the base Path you want to remove from the `key` string in the mapping file
            destBasePath: options.genPath, // the base Path you want to remove from the `value` string in the mapping file
            flatten: true, // Set to true if you don't want to keep folder structure in the `key` value in the mapping file
            hashLength: 8, // hash length, the max value depends on your hash function
            hashFunction: function(source, encoding) { // default is md5
                return require("crypto").createHash("sha1").update(source, encoding).digest("hex");
            }
        },
        files: {
            src: [ options.genPath + "*" ],  // all your files that needs a hash appended to them
            dest: options.genPath //where the new files will be created
        }
    };

    /**************
     * CSS ASSETS
     *************/

    // Minify .css and move it to the gen/ directory where it can be stringified by distui_2js_str
//    (function() {
//        var o, i, subdirectory, file;
//        options.cssmin = o = {};
//        for (i = 0; i < options.cssFiles.length; i++) {
//            file = options.cssFiles[ i ];
//            subdirectory = "";
//            if (file.indexOf("/") !== -1) {
//                subdirectory = file.split("/").shift() + "/";
//                file = file.split("/").pop();
//            }
//            o[ file ] = {
//                expand: true,
//                cwd: options.cssPath + subdirectory,
//                src: [ file ],
//                dest: options.genPath
//            };
//        }
//
//        //console.log("options.cssmin: " + JSON.stringify(options.cssmin, null, "    "));
//    })();

    /**************
     * HTML ASSETS
     *************/

    options.includeSource = {
        options: {
            templates: {
                html: {
                    js: "<script src=\"{filePath}\"></script>",
                    css: "<link rel=\"stylesheet\" type=\"text/css\" href=\"{filePath}\" />"
                },
                scss: {
                    js: "\"creatures.monsters.{filePath}\","
                }
            }
        },
        html: {
            options: {
                basePath: "src/main/webapp/static/",
                baseUrl: "../",
            },
            files: {
                "src/main/webapp/static/html/initiative_admin.html": "src/main/webapp/static/html/initiative_admin.tp.html",
                "src/main/webapp/static/html/initiative.html": "src/main/webapp/static/html/initiative.tp.html"
            }
        },
        js: {
            options: {
                basePath: "src/main/webapp/static/js/creatures/",
                baseUrl: "",
            },
            files: {
                "src/main/webapp/static/js/creatures/monsters_fromIncludeSource.scss": "monsters_forIncludeSource.scss"
            }
        }
    };

    /**************
     * JS ASSETS
     *************/

    options.rename = {
        setUpIncludeSource: {
            src: "src/main/webapp/static/js/creatures/monsters.js", dest: "monsters_forIncludeSource.scss"
        },
        tearDownIncludeSource: {
            src: "src/main/webapp/static/js/creatures/monsters_fromIncludeSource.scss", dest: "src/main/webapp/static/js/creatures/monsters.js"
        }
    };

    // Concat .js for combined, unminified files
//    (function() {
//        var o, i, path, x;
//        options.concat = o = {};
//        i = null;
//        path = options.jsPath + "/";
//
//        function getFiles(group) {
//            var files, i, entry;
//            files = [];
//            for (i = 0; i < group.length; i++) {
//                entry = group[ i ];
//                files.push((entry.indexOf(options.staticPath) !== 0 ? path : "") + entry);
//            }
//            return files;
//        }
//
//        for (i in options.jsGroups) {
//            if (options.jsGroups.hasOwnProperty(i)) {
//                x = {
//                    src: getFiles(options.jsGroups[ i ]),
//                    dest: options.genPath + i + ".js"
//                };
//                if (x.src.length) {
//                    o[ i ] = x;
//                    if (options.jsNoMinifyGroups.indexOf(i) !== -1) {
//                        x = {
//                            src: getFiles(options.jsGroups[ i ]),
//                            dest: options.genPath + i + ".min.js"
//                        };
//                        o[ i + "Min" ] = x;
//                    }
//                }
//            }
//        }
//
//        //console.log("options.concat: " + JSON.stringify(options.concat, null, "    "));
//    })();
//
//    // Minify .js and move it to the gen/ directory where some files can be stringified and re-combined by uglify
//    (function() {
//        var o, i;
//        options.uglify = o = {};
//        i = null;
//        for (i in options.jsGroups) {
//            if (options.jsGroups.hasOwnProperty(i) && options.jsNoMinifyGroups.indexOf(i) === -1) {
//                o[ i ] = {
//                    options: {
//                        sourceMap: false // TODO: include source maps?
//                    },
//                    files: {}
//                };
//                o[ i ].files[ options.genPath + i + ".min.js" ] = [ options.genPath + i + ".js" ];
//            }
//        }
//
//        //console.log("options.uglify: " + JSON.stringify(options.uglify, null, "    "));
//    })();

    /**************
     * TESTING
     *************/

    // run unit tests
    options.karma = {
        options: {
            configFile: "karma.conf.js"
        },
        debug: {
            singleRun: false,
            browsers: [ "Chrome" ]
        },
        crossbrowser: {
            singleRun: true,
            browsers: [ "Chrome", "Firefox", "PhantomJS" ]
        },
        continuous: {
            //background: true,
            autoWatch: false,
            preprocessors: {},
            browsers: [ "PhantomJS" ]
        },
        single: {
            singleRun: true,
            autoWatch: false,
            browsers: [ "PhantomJS" ]
        }
    };

    // host unit tests for debugging
    // Stringify .html files, minified .css files, and conditionally-loaded .js and embed as .js in a DistUI module
    // to allow deferred parsing of the .css/.js when DistUI .js determines it is needed
    options.jasmine_html_from_karma_conf = {
        specRunner: {
            options : {
                jasmineVersion: "1.3",
                outputFile: "spec-runner.html",
                port: 8234,
                title: "DnD Jasmine Spec Runner",
                verbose: false
            }
        }
    };

    /**************
     * SERVING
     *************/

    options.execute = {
        server: {
            options: {
                // overide code cwd (defaults to "." for project main)
                cwd: "."
            },
            src: [ "src/main/webapp/server.js" ]
        }
    };

    options.liveReloadPort = 35729;
    options.connect = {
        tests: {
            options: {
                base: ".",
                debug: false,
                hostname: "localhost",
                keepalive: false,
                livereload: options.liveReloadPort,
                // TODO: is it possible to open multiple tabs?
                //                open: [ "http://localhost:8234/spec-runner.html", "http://localhost:8234/coverage/PhantomJS%201.9.7%20(Mac%20OS%20X)/js/index.html" ],
                //open: "http://localhost:8234/spec-runner.html",
                port: 8234,
                protocol: "http"
            }
        }
    };

    options.open = {
        coverage: {
            path: "http://localhost:8234/coverage/PhantomJS%201.9.7%20(Mac%20OS%20X)/js/index.html"
        },
        specRunner: {
            path: "http://localhost:8234/spec-runner.html"
        },
        admin: {
            path: "http://localhost:7005/html/initiative_admin.html"
        }
    };

    /**************
     * BUILDING
     *************/

    /**************
     * UTILITIES
     *************/

    // watch files and run tasks on change
    options.watch = {
        js: {
            files: [ "<%= jsFiles %>" ],
            tasks: [ "build", "karma:continuous:run" ]
        },
        tests: {
            files: [ "<%= testFiles %>" ],
            tasks: [ "karma:continuous:run" ]
        },
        dev: {
            files: [ "GruntFile.js", "karma.config.js", "<%= jsFiles %>", "<%= testFiles %>" ],
            tasks: [ "build", "specRunner" ]
        },
        specRunner: {
            options: {
                livereload: options.liveReloadPort,
                spawn: false,
                reload: true
            },
            files: [ "GruntFile.js", "karma.config.js", "<%= jsFiles %>", "<%= testFiles %>" ]
        }
    };

    /**************
     * TASKS
     *************/

    grunt.loadNpmTasks("grunt-include-source");

    grunt.initConfig(options);

    // default mode -> does nothing currently
    grunt.registerTask("default", [ ]);

    // single test mode
    grunt.registerTask("test", [ "karma:single" ]);
    grunt.registerTask("devTest", [ "karma:single" ]);

    // debug mode
    grunt.registerTask("specRunner", [ "jasmine_html_from_karma_conf:specRunner" ]);
    grunt.registerTask("debug", [ "includeSource", "specRunner", "connect:tests", "open", "watch:specRunner" ]);
//    grunt.registerTask("debug", "start web server for jasmine tests in browser", function() {
//        grunt.task.run("specRunner");
//
//        grunt.event.once("connect.tests.listening", function(host, port) {
//            var specRunnerUrl = "http://" + host + ":" + port + "/spec-runner.html";
//            grunt.log.writeln("Jasmine specs available at: " + specRunnerUrl);
//            require("open")(specRunnerUrl);
//        });
//
//        grunt.task.run("connect:tests:keepalive");
//    });

    // Generate unminified and minified, content checksum named .js files
    function makeGroup(path, file, dependencyPrefix) {
        var filePath, files, dependencies, i, fileContent, openTag, closeTag;
        filePath = path + file;
        // Find all the individual files and form a string of all filenames minus ".js" quoted one-per-line with a trailing comma
        files = grunt.file.expand([ path + "*.js", "!" + filePath ]);
        dependencies = "";
        for (i = 0; i < files.length; i++) {
            if (files[ i ].indexOf("_base") !== -1) {
                files[ i ] = "base." + files[ i ].replace("_base", "");
            }
            dependencies += "\n            \"" + dependencyPrefix + files[ i ].replace(path, "").replace(".js", "") + "\",";
        }
        // Read in the target .js file and replace everything between the replacement tags
        fileContent = grunt.file.read(filePath);
        openTag = "// start dependencies";
        closeTag = "            // end dependencies";
        i = fileContent.indexOf(openTag) + openTag.length;
        fileContent = fileContent.substring(0, i) + dependencies + "\n" + fileContent.substring(fileContent.indexOf(closeTag));
        grunt.file.write(filePath, fileContent);
        //console.log(filePath + ":\n", fileContent);
    }

    grunt.registerTask("html", function html() {
        var content, path, files, i;

        function IIFE(DnD) {
            "use strict";
            DnD.define("html", [], function() {
                var o = {};
                // REPLACE

                return o;
            }, false);
        }

        content = "";
        path = "src/main/webapp/static/html/partials/";
        files = grunt.file.expand(path + "*.html");
        for (i = 0; i < files.length; i++) {
            content += "\n                o[ \"" + files[ i ].replace(path, "").replace(".html", "") + "\" ] = \"" + grunt.file.read(files[ i ]).replace(/\n/g, "\\n").replace(/"/g, "\\\"") + "\";";
        }
        path = "src/main/webapp/static/html/descriptions/";
        files = grunt.file.expand(path + "*.html");
        for (i = 0; i < files.length; i++) {
            content += "\n                o[ \"" + files[ i ].replace(path, "").replace(".html", "") + "\" ] = \"" + grunt.file.read(files[ i ]).replace(/\n/g, "\\n").replace(/"/g, "\\\"") + "\";";
        }
        content = "(" + IIFE.toString().replace("// REPLACE", content) + ")(window.DnD);";
        grunt.file.write("src/main/webapp/static/js/html.js", content);
    });

    grunt.registerTask("makeParty", makeGroup.bind(this, "src/main/webapp/static/js/party/", "party.js", ""));
    grunt.registerTask("makeMonsters", makeGroup.bind(this, "src/main/webapp/static/js/creatures/", "monsters.js", "creatures.monsters."));

    //grunt.registerTask("build", [ "rename:setUpIncludeSource", "includeSource:js", "rename:tearDownIncludeSource", "includeSource:html", "clean:build" ]);
    grunt.registerTask("build", [ "html", "makeParty", "makeMonsters", "includeSource:html" ]);

    // continuous dev mode
    grunt.registerTask("dev", [ "build", "specRunner", "watch:dev" ]);

    grunt.registerTask("launch", [ "build", "open:admin", "execute:server" ]);

};
