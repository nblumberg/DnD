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
                files: [ "<%= htmlFiles %>" ],
                tasks: [ "includes:html" ]
            }
        },

        // serve up docs and fixtures
        // https://github.com/gruntjs/grunt-contrib-connect
        connect: {
            docs: {
                options: {
                    //visit http://localhost:9000 when running
                    port: 9000,
                    keepalive: true,
                    base: "./",
                    hostname: "*"
                }
            },
            fixtures: {
                options: {
                    //visit http://localhost:9001 when running
                    port: 9001,
                    //keepalive: true,
                    base: "./",
                    hostname: "*"
                }
            }
         }

    });

    //default task
    grunt.registerTask("default", []);

    //development-based tasks
    grunt.registerTask("html", [ "watch:html" ]);

    // Serve locally
    grunt.registerTask("serve", [ "connect", "watch" ]);
};
