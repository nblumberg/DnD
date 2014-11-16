/**
 * Created by nblumberg on 11/16/14.
 */

module.exports = function (grunt) {
    "use strict";

    var options;

    /**************
     * LOAD DEPENDENCIES
     *************/

    // loads all grunt tasks from package.json
    require("load-grunt-tasks")(grunt);

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
    options.cssFiles = [
        "lib/jquery.ux.overlay.css",
        "classicChrome.css",
        "galileoChrome.css",
        "galileoChromeIe8.css",
        "sandbox.css",
        "siteChrome.css",
        "timeout.css"
    ];

    // html
    options.htmlPath = options.staticPath + "html/";
    options.htmlFiles = [
        "siteChrome.html",
        "sandbox.html"
    ];

    // js
    options.jsPath = options.staticPath + "js";
    options.jsFiles = "<%= jsPath %>**/**.js";
    options.jsNoMinifyGroups = [
        "jquery",
        "jquery-ui"
    ];
    options.jsStringify = [
            options.genPath + "jquery.js",
            options.genPath + "jquery-ui.js",
            options.genPath + "utils_no_namespace.js",
            options.genPath + "sandbox.js",
            options.genPath + "siteChrome.js",
            options.genPath + "metrics.js",
            options.genPath + "bootstrap.js",
            options.genPath + "trackable.js",
            options.genPath + "member.js",
            options.genPath + "container.js",
            options.genPath + "overlay.js"
    ];
    options.jsGroups = (function() {
        var o = {
            basic: [
                "js_extensions.js",
                "lib/json2.js",
                // vvv DistUI namespace files
                "namespace.js",
                "browser.js",
                "constants.js",
                "overrides.js",
                "console.js",
                "url.js",
                "dom.js",
                "assetLoader.js",
                "i18n.js",
                "i18n_all.js",
                "postmessage.js"
                // ^^^ DistUI namespace files
            ]
        };

        o.grabLatest = o.basic.concat([
            "default_version_latest.js",
            "grab.js",
            options.genPath + "noParse.js"
        ]);

        o.grabDev = o.basic.concat([
            "default_version_dev.js",
            "grab.js",
            options.genPath + "noParse.js"

        ]);

        o.grabJetty = o.basic.concat([
            "default_version_jetty.js",
            "grab.js",
            options.genPath + "noParse.js"
        ]);

        o.jquery = [
            "lib/jquery-1.7.1.min.js"
        ];

        o[ "jquery-ui" ] = [
            "lib/jquery-ui-1.8.17.min.js"
        ];

        o.utils = o.utils_no_namespace = [
            // This group assumes DistUI namespace files are already present in the page
            "utils.js",
            "contract_reader.js",
            "contract_writer.js"
        ];

        o.bootstrap = [
            "bootstrap.js"
        ];

        o.member = [
            "event.js",
            "url_parameters.js",
            "member.js",
            "member_deprecated.js",
            "member_warnBeforeLeaving.js"
        ];

        o.container = [
            "container_member.js",
            "container.js",
            "container_overlay.js",
            "container_deprecated.js"
        ];

        o.sandbox = [
            "sandbox.js"
        ];

        o.siteChrome = [
            "site_chrome.js"
        ];

        o.metrics = [
            "metrics.js"
        ];

        o.trackable = [
            "lib/jquery.cc.trackable.js"
        ];

        o.overlay = [
            "lib/jquery.ux.overlay.js"
        ];

        o.mock = [
            "mock.js"
        ];

        o.ui_dependencies = [
            "ui_dependencies.js"
        ];

        o.refapp = [
            "refapp.js"
        ];

        o.statsd = [
            "statsd.js"
        ];

        o.mixedMode = [
            "mixed_mode.js"
        ];

        o.empty = [
            "empty.js"
        ];

        o.noParse = [
                options.genPath + "noParse.js"
        ];

        o.distuiLatest = o.grabLatest.concat(options.genPath + "noParse.js");

        o.distuiDev = o.grabDev.concat(options.genPath + "noParse.js");

        o.distuiJetty = o.grabJetty.concat(options.genPath + "noParse.js");

        return o;
    })();

    //console.log("options.jsGroups: " + JSON.stringify(options.jsGroups, null, "    "));

    /**************
     * ASSET MGMT
     *************/

        // Clean up generated files
    options.clean = {
        all: [ options.genPath + "*", options.mappingPath + "assets.json", options.mappingPath + "groups.json" ], // everything (other than groups.js) for a clean start
        js: [                           // clean .js only
                options.genPath + "*.js"
        ],
        postBuild: (function() {
            var a, i, p, file;
            a = [];
            for (i = 0; i < options.cssFiles.length; i++) {
                file = options.cssFiles[ i ].split("/").pop();
                a.push(options.genPath + file);
            }
            p = null;
            for (p in options.jsGroups) {
                if (options.jsGroups.hasOwnProperty(p)) {
                    file = p + ".js";
                    a.push(options.genPath + file);
                    file = p + ".min.js";
                    a.push(options.genPath + file);
                    for (i = 0; i < options.jsGroups[ p ].length; i++) {
                        file = options.jsGroups[ p ][ i ].split("/").pop();
                        a.push(options.genPath + file);
                        file = file.split(".").shift() + ".min.js";
                        a.push(options.genPath + file);
                    }
                }
            }
            //console.log("Cleaning:\n" + a.join("\n\t"));
            return a;
        })()
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
    (function() {
        var o, i, subdirectory, file;
        options.cssmin = o = {};
        for (i = 0; i < options.cssFiles.length; i++) {
            file = options.cssFiles[ i ];
            subdirectory = "";
            if (file.indexOf("/") !== -1) {
                subdirectory = file.split("/").shift() + "/";
                file = file.split("/").pop();
            }
            o[ file ] = {
                expand: true,
                cwd: options.cssPath + subdirectory,
                src: [ file ],
                dest: options.genPath
            };
        }

        //console.log("options.cssmin: " + JSON.stringify(options.cssmin, null, "    "));
    })();

    /**************
     * HTML ASSETS
     *************/

    /**************
     * JS ASSETS
     *************/

        // Concat .js for combined, unminified files
    (function() {
        var o, i, path, x;
        options.concat = o = {};
        i = null;
        path = options.jsPath + "/";

        function getFiles(group) {
            var files, i, entry;
            files = [];
            for (i = 0; i < group.length; i++) {
                entry = group[ i ];
                files.push((entry.indexOf(options.staticPath) !== 0 ? path : "") + entry);
            }
            return files;
        }

        for (i in options.jsGroups) {
            if (options.jsGroups.hasOwnProperty(i)) {
                x = {
                    src: getFiles(options.jsGroups[ i ]),
                    dest: options.genPath + i + ".js"
                };
                if (x.src.length) {
                    o[ i ] = x;
                    if (options.jsNoMinifyGroups.indexOf(i) !== -1) {
                        x = {
                            src: getFiles(options.jsGroups[ i ]),
                            dest: options.genPath + i + ".min.js"
                        };
                        o[ i + "Min" ] = x;
                    }
                }
            }
        }

        //console.log("options.concat: " + JSON.stringify(options.concat, null, "    "));
    })();

    // Minify .js and move it to the gen/ directory where some files can be stringified and re-combined by uglify
    (function() {
        var o, i;
        options.uglify = o = {};
        i = null;
        for (i in options.jsGroups) {
            if (options.jsGroups.hasOwnProperty(i) && options.jsNoMinifyGroups.indexOf(i) === -1) {
                o[ i ] = {
                    options: {
                        sourceMap: false // TODO: include source maps?
                    },
                    files: {}
                };
                o[ i ].files[ options.genPath + i + ".min.js" ] = [ options.genPath + i + ".js" ];
            }
        }

        //console.log("options.uglify: " + JSON.stringify(options.uglify, null, "    "));
    })();

    // Stringify .html files, minified .css files, and conditionally-loaded .js and embed as .js in a DistUI module
    // to allow deferred parsing of the .css/.js when DistUI .js determines it is needed
    options.distui_2js_str = {
        noParse : {
            options : {},
            files : {}
        }
    };
    (function() {
        var files, i, file;
        files = [];
        for (i = 0; i < options.jsStringify.length; i++) {
            files.push(options.jsStringify[ i ]);
        }
        for (i = 0; i < options.cssFiles.length; i++) {
            file = options.cssFiles[ i ];
            if (file.indexOf("/") !== -1) {
                file = file.split("/").pop();
            }
            files.push(options.genPath + file);
        }
        for (i = 0; i < options.htmlFiles.length; i++) {
            files.push(options.htmlPath + options.htmlFiles[ i ]);
        }
        options.distui_2js_str.noParse.files[ options.genPath + "noParse.js" ] = files;

        //console.log("options.distui_2js_str: " + JSON.stringify(options.distui_2js_str, null, "    "));
    })();

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
        single: {
            singleRun: true,
            browsers: [ "Chrome", "Firefox", "PhantomJS" ]
        },
        continuous: {
            //background: true,
            autoWatch: false,
            preprocessors: {},
            browsers: [ "PhantomJS" ]
        },
        ci: {
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
                title: "DistUI Jasmine Spec Runner",
                verbose: false
            }
        }
    };

    /**************
     * SERVING
     *************/

    options.connect = {
        tests: {
            options: {
                base: ".",
                debug: false,
                hostname: "localhost",
                keepalive: true,
                //livereload: true,
                // TODO: is it possible to open multiple tabs?
                //                open: [ "https://localhost:8234/spec-runner.html", "https://localhost:8234/coverage/PhantomJS%201.9.7%20(Mac%20OS%20X)/js/index.html" ],
                open: "https://localhost:8234/spec-runner.html",
                port: 8234,
                protocol: "https"
            }
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
            tasks: [ "build"/*, "karma:continuous:run"*/ ] // temporarily disable karma
        },
        tests: {
            files: [ "<%= testFiles %>" ],
            tasks: [ "karma:continuous:run" ]
        },
        dev: {
            files: [ "<%= jsFiles %>", "<%= testFiles %>", "karma.config.js" ],
            tasks: [ "build", "specRunner" ]
        }
    };

    /**************
     * TASKS
     *************/

    grunt.initConfig(options);

    // default mode -> does nothing currently
    grunt.registerTask("default", [ ]);

    // single test mode
    grunt.registerTask("test", [ "karma:single" ]);

    // debug mode
    grunt.registerTask("specRunner", [ "jasmine_html_from_karma_conf:specRunner" ]);
    grunt.registerTask("debug", [ "jasmine_html_from_karma_conf:specRunner", "connect:tests" ]);

    // runs with maven build
    grunt.registerTask("maven-test", [ "karma:ci" ]);

    // output groups.json
    grunt.registerTask("write-groups", "Writes out groups.json", function() {
        var alt, o, p, i, file;
        alt = {};
        o = options.jsGroups;
        for (p in o) {
            if (o.hasOwnProperty(p)) {
                alt[ p ] = [];
                for (i = 0; i < o[ p ].length; i++) {
                    file = o[ p ][ i ];
                    if (file.indexOf(options.staticPath) !== 0) {
                        // If it's not an absolute path add the js path
                        file = options.jsPath + "/" + file;
                    }
                    // Make all group file references relative to the root path of the host
                    file = "/" + file.replace(options.webappPath, "");
                    alt[ p ].push(file);
                }
            }
        }
        grunt.file.write(options.mappingPath + "groups.json", JSON.stringify(alt, null, "    "));
    });

    // Generate unminified and minified, content checksum named .js files
    grunt.registerTask("build", (function() {
        var tasks, p;
        tasks = [ "clean:all", "cssmin", "clean:js", "write-groups" ];
        p = null;
        // concat & uglify (groups that don't include noParse)
        for (p in options.jsGroups) {
            if (options.jsGroups.hasOwnProperty(p) && options.jsGroups[ p ].indexOf(options.genPath + "noParse.js") === -1) {
                tasks.push("concat:" + p);
                if (options.jsNoMinifyGroups.indexOf(p) === -1) {
                    tasks.push("uglify:" + p);
                }
                else {
                    tasks.push("concat:" + p + "Min");
                }
            }
        }
        // create noParse
        tasks.push("distui_2js_str:noParse");
        // concat & uglify (groups that include noParse)
        for (p in options.jsGroups) {
            if (options.jsGroups.hasOwnProperty(p) && options.jsGroups[ p ].indexOf(options.genPath + "noParse.js") !== -1) {
                tasks.push("concat:" + p);
                tasks.push("uglify:" + p);
            }
        }
        tasks.push("hash");
        tasks.push("clean:postBuild");
        return tasks;
    })());

    // continuous dev mode
    grunt.registerTask("dev", [ "build", "specRunner", "watch:dev" ]);

};
