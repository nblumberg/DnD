// console.js

/**
 * @module out
 * @main DnD
 * @author Nathaniel Blumberg
 */

/* exported DnD.out */

(function(JSON) {
    "use strict";

    /* global DnD:true, DnD.utils */

    /**
     * Namespace of DnD window.console Objects and methods
     * @namespace out
     * @memberof DnD
     * @example
     * DnD.out
     * @requires grab
     */

    DnD.define(
        "out",
        [ "window", "K", "jQuery" ],


        /**
         * Initializes the DnD.out instance
         * @method _init
         * @memberof! DnD.out
         * @static
         * @private
         */
        function(w, d_K, jQuery) {
            var o, p;
            o = {};


            /**
             * A direct reference to window.console for subsequent bind expressions
             * @member real
             * @memberof DnD.out
             * @public
             * @static
             * @type window.console
             * @default window.console
             */
            o.real = window.console;


            /**
             * A String to prefix to all console messages
             * Only used for console instances created with createConsole() after this member is set.
             * @member prefix
             * @memberof DnD.out
             * @public
             * @static
             * @type String
             * @default ""
             */
            o.prefix = "";


            /**
             * Returns an {@link DnD.out.Console} supporting the window.console API.
             * Each method maps to a bound instance of window.console[method] if window.console exists, otherwise a no-op so the API is always safe to call
             *
             * @method createConsole
             * @memberof DnD.out
             * @public
             * @static
             *
             * @param {String} [prefix] A prefix to apply to every message sent to this console instance, defaults to DnD.out.prefix
             * @param {Object} [console] The Object to use in place of the generated console instance, used by jasmine tests
             * @returns {DnD.out.Console} Implements window.console API
             */
            o.createConsole = function(prefix, console) {
                var multi, p, toBind;
                if (!console) {
                    prefix = prefix || o.prefix;
                    multi = [ "debug", "error", "info", "log", "warn" ];
                    /**
                     * Supports the window.console API {@link https://developer.mozilla.org/en-US/docs/Web/API/console}.
                     * Each method maps to a bound instance of window.console[method] if window.console exists, otherwise a no-op so the API is always safe to call.
                     * Created via {@link DnD.out.createConsole}
                     * @class Console
                     * @memberof DnD.out
                     */
                    console = {
                        /**
                         * NOTE: .assert() is only inherently supported by IE so redirect to error() after test
                         * @method
                         * @memberof DnD.out.Console
                         * @public
                         * @instance
                         */
                        assert: function(t, m) {
                            if (!t) {
                                console.error(m);
                            }
                        },
                        /**
                         * @method
                         * @memberof DnD.out.Console
                         * @public
                         * @instance
                         */
                        clear: d_K.NO_OP,
                        /**
                         * @method
                         * @memberof DnD.out.Console
                         * @public
                         * @instance
                         */
                        count: d_K.NO_OP,
                        /**
                         * NOTE: .debug() not supported by IE so redirect to log()
                         * @method
                         * @memberof DnD.out.Console
                         * @public
                         * @instance
                         */
                        debug: function(m) { console.log(m); },
                        /**
                         * @method
                         * @memberof DnD.out.Console
                         * @public
                         * @instance
                         */
                        dir: d_K.NO_OP,
                        /**
                         * @method
                         * @memberof DnD.out.Console
                         * @public
                         * @instance
                         */
                        dirxml: d_K.NO_OP,
                        /**
                         * @method
                         * @memberof DnD.out.Console
                         * @public
                         * @instance
                         */
                        error: d_K.NO_OP,
                        /**
                         * @method
                         * @memberof DnD.out.Console
                         * @public
                         * @instance
                         */
                        exception: d_K.NO_OP,
                        /**
                         * @method
                         * @memberof DnD.out.Console
                         * @public
                         * @instance
                         */
                        group: d_K.NO_OP,
                        /**
                         * @method
                         * @memberof DnD.out.Console
                         * @public
                         * @instance
                         */
                        groupCollapsed: d_K.NO_OP,
                        /**
                         * @method
                         * @memberof DnD.out.Console
                         * @public
                         * @instance
                         */
                        groupEnd: d_K.NO_OP,
                        /**
                         * @method
                         * @memberof DnD.out.Console
                         * @public
                         * @instance
                         */
                        info: d_K.NO_OP,
                        /**
                         * @method
                         * @memberof DnD.out.Console
                         * @public
                         * @instance
                         */
                        log: d_K.NO_OP,
                        /**
                         * @method
                         * @memberof DnD.out.Console
                         * @public
                         * @instance
                         */
                        profile: d_K.NO_OP,
                        /**
                         * @method
                         * @memberof DnD.out.Console
                         * @public
                         * @instance
                         */
                        profileEnd: d_K.NO_OP,
                        /**
                         * @method
                         * @memberof DnD.out.Console
                         * @public
                         * @instance
                         */
                        table: d_K.NO_OP,
                        /**
                         * @method
                         * @memberof DnD.out.Console
                         * @public
                         * @instance
                         */
                        time: d_K.NO_OP,
                        /**
                         * @method
                         * @memberof DnD.out.Console
                         * @public
                         * @instance
                         */
                        timeEnd: d_K.NO_OP,
                        /**
                         * @method
                         * @memberof DnD.out.Console
                         * @public
                         * @instance
                         */
                        timeStamp: d_K.NO_OP,
                        /**
                         * @method
                         * @memberof DnD.out.Console
                         * @public
                         * @instance
                         */
                        trace: d_K.NO_OP,
                        /**
                         * @method
                         * @memberof DnD.out.Console
                         * @public
                         * @instance
                         */
                        warn: d_K.NO_OP
                    };

                    p = null;
                    for (p in console) {
                        if (window && window.console && window.console[ p ]) {
                            toBind = window.console[ p ];
                            if (typeof(toBind) === "function" && Function.prototype.bind && typeof(toBind.bind) === "function") {
                                // This odd syntax is to satisfy IE which treats some window methods as Objects, not Functions
                                if (multi.indexOf(p) !== -1) {
                                    console[ p ] = Function.prototype.bind.call(toBind, window.console, prefix); // toBind.bind(window.console, prefix);
                                }
                                else {
                                    console[ p ] = Function.prototype.bind.call(toBind, window.console); // toBind.bind(window.console);
                                }
                            }
                        }
                    }

                    console._prefix = prefix;
                }


                /**
                 * Whether to output debug messages
                 * @member debugEnabled
                 * @memberof DnD.out.Console
                 * @public
                 * @instance
                 * @type Boolean
                 * @default false
                 */
                console.debugEnabled = false;


                /**
                 * The default level below which debug messages are logged
                 * @member debugLevel
                 * @memberof DnD.out.Console
                 * @public
                 * @instance
                 * @type Number
                 * @default d_K.DEBUG_LEVEL.DEFAULT
                 */
                console.debugLevel = d_K.DEBUG_LEVEL.DEFAULT;

                console._deferred = new DnD.Deferred();
                console.promise = console._deferred.promise;

                /**
                 * Checks DnD contract ("debug") for debugging state/level,
                 * parsing symbolic/named levels as their numeric constants,
                 * sets debugEnabled and debugLevel on its Console instance
                 *
                 * In window.top: check URL parameter, if no debug then we're done
                 * Not in window.top:
                 *  1. check URL parameter, if debug then we're done
                 *  2a. check DnD.state if it exists, if debug then we're done
                 *  2b. wait for DnD.state, then repeat 22a
                 *
                 * @method _parseDebugLevel
                 * @memberof DnD.out.Console
                 * @instance
                 * @private
                 *
                 * @see debugEnabled, debugLevel
                 */
                console._parseDebugLevel = function() {
                    var debug, waitForIt;
                    debug = false;
                    debug = w.location.search.indexOf("debug=");
                    debug = debug !== -1 ? w.location.search.substr(debug + 9) : null;
                    if (debug && debug.indexOf("&") !== -1) {
                        debug = debug.substring(0, debug.indexOf("&"));
                    }
                    console.debugEnabled = !!debug && debug !== "false";
                    if (!isNaN(parseInt(debug, 10))) {
                        console.debugLevel = parseInt(debug, 10);
                    }
                    else {
                        switch (debug ? debug.toLowerCase() : "") {
                            case "embed": {
                                console.debugLevel = d_K.DEBUG_LEVEL.EMBED;
                            }
                                break;
                            case "bootstrap": {
                                console.debugLevel = d_K.DEBUG_LEVEL.BOOTSTRAP;
                            }
                                break;
                            case "member": {
                                console.debugLevel = d_K.DEBUG_LEVEL.MEMBER;
                            }
                                break;
                            case "container": {
                                console.debugLevel = d_K.DEBUG_LEVEL.CONTAINER;
                            }
                                break;
                            case "postmessage": {
                                console.debugLevel = d_K.DEBUG_LEVEL.POSTMESSAGE;
                            }
                                break;
                        }
                    }
                    if (w.self === w.top) {
                        console._deferred.done(console);
                    }
                };
                console._parseDebugLevel();

                /**
                 * Returns a bound instance of window.console.debug() if window.console exists (defaults to window.console.log if debug isn't supported but console exists),
                 * debugging is enabled, and the passed debug level is permitted by the current debugging level;
                 * otherwise returns a no-op Function that is still safe to call.
                 * Prepends consolePrefix to message.
                 *
                 * @method debugFilter
                 * @memberof DnD.out.Console
                 * @instance
                 * @public
                 *
                 * @param {Number} [level] The debug level of this message, usually a DnD constant (e.g. DnD.DEBUG_MEMBER), defaults to DnD.DEBUG_LEVEL_DEFAULT
                 * @param {Function} [callback] A callback of the form function(isNoOp) {}, used primarily for jasmine tests
                 * @returns {Function} Returns a bound instance of window.console.debug that prefixes consolePrefix to any message passed to it or a no op Function
                 *
                 * @see debugEnabled, debugLevel
                 */
                console.debugFilter = function(level, callback) {
                    if (!console.debugEnabled) {
                        if (typeof(callback) === "function") {
                            callback(true);
                        }
                        return d_K.NO_OP;
                    }
                    if (typeof(level) === "undefined") {
                        level = d_K.DEBUG_LEVEL.DEFAULT;
                    }
                    if (level > console.debugLevel) {
                        if (typeof(callback) === "function") {
                            callback(true);
                        }
                        return d_K.NO_OP;
                    }

                    if (typeof(callback) === "function") {
                        callback(false);
                    }
                    // This odd syntax is to satisfy IE which treats some window methods as Objects, not Functions
                    return Function.prototype.bind.call(console.debug, window.console); // this._console.log.bind(window.console);
                };


                return console;
            };


            /**
             * An object supporting the window.console API that is always present and safe to call.
             * If the real window.console exists, it delegates its calls to window.console and preserves caller line numbers.
             * @member console
             * @memberof DnD.out
             * @public
             * @static
             * @type DnD.out.Console
             * @default DnD.out.Console
             */
            o.console = o.createConsole();


            // Hoist all console methods up to the parent
            for (p in o.console) {
                if (o.console.hasOwnProperty(p) && typeof(o.console[ p ]) === "function") {
                    o[ p ] = o.console[ p ];
                }
            }


            /**
             * Serializes a javascript Object (or any subtype or basic type) to String, with optional formatting; but only in-depth if debugging is enabled. If debugging is disabled, Objects serialize to "[object]", Arrays to "[array]". Functions always serialize to "[function]". Typically used for debug output to window.console
             *
             * @method objectToString
             * @memberof DnD.out
             * @public
             * @static
             *
             * @param {Object} object The Object to serialize
             * @param {Boolean} [propPerLine] Indicates whether object should be serialized to a single line or if each property/index should be serialized to a new line
             * @param {String} [indent] A string to prepend to each new line (typically whitespace used to indent nested properties)
             * @returns {String} The serialized form of object
             *
             * @see debugEnabled
             */
            o.objectToString = function(object, propPerLine, indent) {
                var type, tmp, i, firstProp, oldIndent, prop, output;
                output = null;
                if (typeof(indent) === "undefined") {
                    indent = "";
                }
                if (object === null) {
                    output = "null";
                }
                else {
                    type = typeof(object); // jQuery.type(object);
                    if (type === "object" && object.constructor === Array) {
                        type = "array";
                    }
                    switch (type) {
                        case "undefined": {
                            output = type;
                        }
                            break;
                        case "boolean":
                        case "date":
                        case "number": {
                            output = "" + object;
                        }
                            break;
                        case "string": {
                            output = "\"" + object + "\"";
                        }
                            break;
                        case "array": {
                            if (!o.console.debugEnabled) {
                                output = "[array]";
                                break;
                            }
                            tmp = "[";
                            for (i = 0; i < object.length; i++) {
                                tmp += (i ? "," : "") + " " + o.objectToString(object[ i ], propPerLine, propPerLine ? indent : "");
                            }
                            tmp += (object.length ? " " : "") + "]";
                            output = tmp;
                        }
                            break;
                        case "object": {
                            if (!o.console.debugEnabled) {
                                output = "[object]";
                                break;
                            }
                            tmp = "{";
                            firstProp = true;
                            oldIndent = indent;
                            indent += "\t";
                            for (prop in object) {
                                if (object.hasOwnProperty(prop)) {
                                    tmp += (firstProp ? " " : ", ") + (propPerLine ? "\n" + indent : "") + prop + ": " + o.objectToString(object[ prop ], propPerLine, indent);
                                    firstProp = false;
                                }
                            }
                            tmp += (propPerLine ? "\n" + oldIndent : (firstProp ? "" : " ")) + "}";
                            output = tmp;
                        }
                            break;
                        case "function": {
                            output = "[function]";
                        }
                            break;
                        default: {
                            output = "[object]";
                        }
                            break;
                    }
                }
                return output;
            };

            o.sLog = function(message) {
                jQuery.ajax({
                    data: message,
                    type: "PUT",
                    url: "/"
                });
            };


            o.logFn = function(clazz, fnName, args) {
                return;
                var message, i, str;
                message = clazz + (clazz ? "." : "") + fnName + "(";
                for (i = 0; args && i < args.length; i++) {
                    if (args[ i ] && typeof(args[ i ]) === "object") {
                        str = args[ i ].toString();
                    }
                    if (!str || str === "[object Object]") {
                        try {
                            str = JSON.stringify(args[ i ]);
                        }
                        catch(e) {
                            str = "stringify error";
                        }
                    }
                    message += (i ? ", " : "") + str;
                }
                message += ")";
                o.sLog(message);
            };


            return o;
        },

        true // assign to namespace as DnD.out
    );

})(window.JSON);