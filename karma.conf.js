// Karma configuration
// Generated on Sat Jun 01 2013 17:43:52 GMT-0400 (EDT)


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;

// base path, that will be used to resolve files and exclude
basePath = "";

// All the Karma's urls get prefixed with the urlRoot. This is helpful when using proxies, as sometimes you might want to proxy a url that is already taken by Karma.
urlRoot = "/";

// list of files / patterns to load in the browser
files = [
	JASMINE,
	JASMINE_ADAPTER,

	// application files to unit test
	"src/main/webapp/static/js/lib/jquery.min.js",
    "src/test/webapp/jasmine/lib/jasmine-jquery.js",
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
];


// list of files to exclude
exclude = [

];


// Hostname to be used when capturing browsers.
hostname = "localhost";

// The port where the webserver will be listening.
port = 9876;

// The port where the server will be listening. This is only used when you are using karma run.
runnerPort = 9100;

// A map of path-proxy pairs.
//proxies =  {
//    "/static": "http://gstatic.com",
//    "/web": "http://localhost:9000"
//};

// enable / disable colors in the output (reporters and logs)
colors = true;

// A list of log appenders to be used. See the documentation for log4js for more information.
loggers = [ { type: "console" } ];

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = [ "Chrome" ]; // , "Firefox", "Safari", "PhantomJS" ];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;

// Karma will report all the tests that are slower than given time limit (in ms). This is disabled by default.
//reportSlowerThan = 0;

//A map of preprocessors to use. See config/preprocessors for more.
//preprocessors = { "**/*.coffee": "coffee" };

//A list of reporters to use.
//possible values: "dots", "progress", "junit", "growl", "coverage"
reporters = [ "progress" ];

// Continuous Integration mode.
// If true, it captures browsers, runs tests and exits with 0 exit code (if all tests passed) or 1 exit code (if any test failed).
singleRun = false;
