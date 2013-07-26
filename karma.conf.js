// Karma configuration
// Generated on Sat Jun 01 2013 17:43:52 GMT-0400 (EDT)


// base path, that will be used to resolve files and exclude
basePath = '';


// list of files / patterns to load in the browser
files = [
	JASMINE,
	JASMINE_ADAPTER,

	// application files to unit test
	'src/main/webapp/static/js/lib/jquery.min.js',
	'src/main/webapp/static/js/js.js',
	'src/main/webapp/static/js/serializable.js',
	'src/main/webapp/static/js/actions.js',
	'src/main/webapp/static/js/editor.js',
	'src/main/webapp/static/js/event.js',
	'src/main/webapp/static/js/creature.js',
	'src/main/webapp/static/js/data.js',
	'src/main/webapp/static/js/monsters.js',
    'src/main/webapp/static/js/party.js',
    'src/main/webapp/static/js/history.js',
	
	// test specs to run
    'src/test/webapp/jasmine/spec/testUtilities.js',
    'src/test/webapp/jasmine/spec/creatureTestUtilities.js',
	'src/test/webapp/jasmine/spec/jsTest.js',
	'src/test/webapp/jasmine/spec/actionsTest.js',
	'src/test/webapp/jasmine/spec/dataTest.js',
	'src/test/webapp/jasmine/spec/editorTest.js',
	'src/test/webapp/jasmine/spec/eventTest.js',
	'src/test/webapp/jasmine/spec/serializableTest.js',
	'src/test/webapp/jasmine/spec/monstersTest.js',
    'src/test/webapp/jasmine/spec/partyTest.js',
    'src/test/webapp/jasmine/spec/historyTest.js'
];


// list of files to exclude
exclude = [
  
];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];


// web server port
port = 9876;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
