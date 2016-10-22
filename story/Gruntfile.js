module.exports = function(grunt) {

    "use strict";

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-includes");

    grunt.initConfig({

        //get meta data
        pkg: grunt.file.readJSON("package.json"),

        htmlPath: "html/",
        htmlFiles: "<%= htmlPath %>*.html",

        /***********************
         * DEVELOPER CONVENIENCE
         ***********************/

        // Build the html using grunt-includes
        includes: {
            html: {
                cwd: "html",
                src: [ "index.html" ],
                dest: ".",
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
                tasks: [ "includes:html" ]
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
    grunt.registerTask("html", [ "includes:html", "watch:html" ]);

    // Serve locally
    grunt.registerTask("serve", [ "connect", "html" ]);
};
