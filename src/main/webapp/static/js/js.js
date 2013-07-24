/**
 * Extends Array to support the method "each"
 * @param fn Function A function of the form function(item, index) that will be called for each item/index in this Array
 */
Array.prototype.each = function(fn) {
	var i, item;
	for (i = 0; i < this.length; i++) {
		item = this[ i ];
		fn(item, i, this);
	}
};

function safeConsole() {
    var noOp, console, p;
    noOp = function() {};
    console = {
        log: noOp,
        debug: noOp,
        info: noOp,
        warn: noOp,
        error: noOp,
        assert: noOp,
        clear: noOp,
        dir: noOp,
        dirxml: noOp,
        trace: noOp,
        group: noOp,
        groupCollapsed: noOp,
        groupEnd: noOp,
        time: noOp,
        timeEnd: noOp,
        timeStamp: noOp,
        profile: noOp,
        profileEnd: noOp,
        count: noOp,
        exception: noOp,
        table: noOp            
    };
    for (p in console) {
        if (window.console && typeof(window.console[ p ]) === "function") {
            console[ p ] = window.console[ p ].bind(window.console);
        }
    }
    return console;
}
