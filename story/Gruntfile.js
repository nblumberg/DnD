module.exports = function(grunt) {

    "use strict";

    // loads all grunt tasks from package.json
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        //get meta data
        pkg: grunt.file.readJSON("package.json"),

        htmlPath: "html/",
        htmlFiles: "<%= htmlPath %>*.html",

        /***********************
         * DEVELOPER CONVENIENCE
         ***********************/

        concat: (function concatConfig() {
            var config = {};
            grunt.file.recurse("html/", function concatConfigEachFile(abspath, rootdir, subdir, filename) {
                var noExt, ext;
                noExt = filename.split(".").shift();
                ext = filename.split(".").pop();
                if (!noExt || noExt === "prefix" || noExt === "suffix" || ext !== "html") {
                    return;
                }
                config[ noExt ] = {
                    src: [ "dist/prefix.html", abspath, "html/suffix.html" ],
                    dest: "dist/" + filename
                };
            });
            grunt.log.writeln(JSON.stringify(config, null, "  "));
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

    });

    //default task
    grunt.registerTask("default", []);

    //development-based tasks
    grunt.registerTask("build", [ "includes:html", "concat" ]);
    grunt.registerTask("html", [ "build", "watch:html" ]);

    // Serve locally
    grunt.registerTask("serve", [ "connect", "html" ]);
};
