// Karma configuration
// Generated on Wed Jun 05 2013 09:43:21 GMT-0400 (EDT)

/* global module, process */

module.exports = function(config) {
    "use strict";

    var options, libFiles, fixtures, coverageFiles, specFiles, i;
    options = {
        // base path, that will be used to resolve files and exclude
        basePath: "",

        frameworks: [ "jasmine", "commonjs" ],


        // list of files to exclude
        exclude: [],

        // use dots reporter, as travis terminal does not support escaping sequences
        // possible values: "dots", "progress"
        // CLI --reporters progress
        reporters: [
            "progress", "junit", "coverage"
        ],

        junitReporter: {
            // will be resolved to basePath (in the same way as files/exclude patterns)
            outputFile: "test-results.xml"
        },

        // optionally, configure the reporter
        coverageReporter: {
            type: "html",
            dir: "coverage/"
        },

        // web server port
        // CLI --port 9876
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        // CLI --colors --no-colors
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        // CLI --log-level debug
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        // CLI --auto-watch --no-auto-watch
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        // CLI --browsers Chrome,Firefox,Safari
        browsers: [
            process.env.TRAVIS ? "Firefox" : "Chrome"
        ],

        // If browser does not capture in given timeout [ms], kill it
        // CLI --capture-timeout 5000
        captureTimeout: 20000,

        // Auto run tests on start (when browsers are captured) and exit
        // CLI --single-run --no-single-run
        singleRun: false,

        // report which specs are slower than 500ms
        // CLI --report-slower-than 500
        reportSlowerThan: 500,

        plugins: [
            "karma-jasmine",
            "karma-chrome-launcher",
            "karma-firefox-launcher",
            "karma-junit-reporter",
            "karma-commonjs",
            "karma-coverage"
        ]
    };

    // list of files / patterns to load in the browser
    files: [
        "src/main/webapp/static/js/js.js",
        "src/main/webapp/static/js/serializable.js",
        "src/main/webapp/static/js/event.js",
        "src/main/webapp/static/js/effect.js",
        "src/main/webapp/static/js/actions.js",
        "src/main/webapp/static/js/editor.js",
        "src/main/webapp/static/js/creature.js",
        "src/main/webapp/static/js/data.js",
        "src/main/webapp/static/js/monsters.js",
        "src/main/webapp/static/js/party.js",
        "src/main/webapp/static/js/history.js",

        // fixtures
        {
            pattern: "src/main/webapp/static/html/partials/**/*.html",
            watched: true,
            included: false,
            served: true
        },
        {
            pattern: "src/test/webapp/jasmine/spec/javascripts/fixtures/**/*.html",
            watched: true,
            included: false,
            served: true
        },

        // test specs to run
        "src/test/webapp/jasmine/spec/testUtilities.js",
        "src/test/webapp/jasmine/spec/creatureTestUtilities.js",
        "src/test/webapp/jasmine/spec/jsTest.js",
        "src/test/webapp/jasmine/spec/serializableTest.js",
        "src/test/webapp/jasmine/spec/eventTest.js",
        "src/test/webapp/jasmine/spec/effectTest.js",
        "src/test/webapp/jasmine/spec/actionsTest.js",
        "src/test/webapp/jasmine/spec/editorTest.js",
        "src/test/webapp/jasmine/spec/dataTest.js",
        "src/test/webapp/jasmine/spec/monstersTest.js",
        "src/test/webapp/jasmine/spec/partyTest.js",
        "src/test/webapp/jasmine/spec/historyTest.js"
    ],

    // application/lib dependencies
    libFiles = [
        "src/main/webapp/static/js/lib/jquery.min.js",
        "src/test/webapp/jasmine/lib/jasmine-jquery.js"
    ];

    fixtures = [
        {
            pattern: "src/main/webapp/static/html/partials/**/*.html",
            watched: true,
            included: false,
            served: true
        },
        {
            pattern: "src/test/webapp/jasmine/spec/javascripts/fixtures/**/*.html",
            watched: true,
            included: false,
            served: true
        }
    ];

    coverageFiles = [
        "src/main/webapp/static/js/js.js",
        "src/main/webapp/static/js/serializable.js",
        "src/main/webapp/static/js/event.js",
        "src/main/webapp/static/js/effect.js",
        "src/main/webapp/static/js/actions.js",
        "src/main/webapp/static/js/editor.js",
        "src/main/webapp/static/js/creature.js",
        "src/main/webapp/static/js/data.js",
        "src/main/webapp/static/js/monsters.js",
        "src/main/webapp/static/js/party.js",
        "src/main/webapp/static/js/history.js"
    ];

    // test specs to run
    specFiles = [
        "src/test/webapp/jasmine/spec/testUtilities.js",
        "src/test/webapp/jasmine/spec/creatureTestUtilities.js",
        "src/test/webapp/jasmine/spec/jsTest.js",
        "src/test/webapp/jasmine/spec/serializableTest.js",
        "src/test/webapp/jasmine/spec/eventTest.js",
        "src/test/webapp/jasmine/spec/effectTest.js",
        "src/test/webapp/jasmine/spec/actionsTest.js",
        "src/test/webapp/jasmine/spec/editorTest.js",
        "src/test/webapp/jasmine/spec/dataTest.js",
        "src/test/webapp/jasmine/spec/monstersTest.js",
        "src/test/webapp/jasmine/spec/partyTest.js",
        "src/test/webapp/jasmine/spec/historyTest.js"
    ];

    // list of files / patterns to load in the browser
    options.files = libFiles.concat(fixtures).concat(coverageFiles).concat(specFiles);

    /**
     * Coverage Report instructions from:
     * https://github.com/karma-runner/karma-coverage
     */
    // source files, that you wanna generate coverage for
    // do not include tests or libraries
    // (these files will be instrumented by Istanbul)
    options.preprocessors = {};
    for (i = 0; i < coverageFiles.length; i++) {
        options.preprocessors[ coverageFiles[ i ] ] = "coverage";
    }

    config.set(options);
};
