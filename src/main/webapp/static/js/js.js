/* exported safeConsole, sLog, logFn */
var safeConsole, sLog, logFn;

(function() {
    "use strict";

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

    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== "function") {
                // closest thing possible to the ECMAScript 5
                // internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var aArgs = Array.prototype.slice.call(arguments, 1), 
                fToBind = this, 
                fNOP = function () {},
                fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                    ? this
                    : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        };
    }

    /**
     * Returns an Object supporting the window.console API.
     * Each method maps to a bound instance of window.console[method] if window.console exists, otherwise a no-op so the API is always safe to call
     *
     * @function createConsole
     * @public
     * @static
     *
     * @returns {Object} Implements window.console API
     */
    safeConsole = function() {
        var multi, noOp, console, p, toBind;
        multi = [ "debug", "error", "info", "log", "warn" ];
        noOp = function() {};
        console = null;
        /**
         * Supports the window.console API {@link https://developer.mozilla.org/en-US/docs/Web/API/console}.
         * Each method maps to a bound instance of window.console[method] if window.console exists, otherwise a no-op so the API is always safe to call.
         * Created via {@link DistUI.out.createConsole}
         * @class Console
         * @memberof DistUI.out
         */
        console = {
            /**
             * NOTE: .assert() is only inherently supported by IE so redirect to error() after test
             * @method
             * @memberof DistUI.out.Console
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
             * @memberof DistUI.out.Console
             * @public
             * @instance
             */
            clear: noOp,
            /**
             * @method
             * @memberof DistUI.out.Console
             * @public
             * @instance
             */
            count: noOp,
            /**
             * NOTE: .debug() not supported by IE so redirect to log()
             * @method
             * @memberof DistUI.out.Console
             * @public
             * @instance
             */
            debug: function(m) { console.log(m); },
            /**
             * @method
             * @memberof DistUI.out.Console
             * @public
             * @instance
             */
            dir: noOp,
            /**
             * @method
             * @memberof DistUI.out.Console
             * @public
             * @instance
             */
            dirxml: noOp,
            /**
             * @method
             * @memberof DistUI.out.Console
             * @public
             * @instance
             */
            error: noOp,
            /**
             * @method
             * @memberof DistUI.out.Console
             * @public
             * @instance
             */
            exception: noOp,
            /**
             * @method
             * @memberof DistUI.out.Console
             * @public
             * @instance
             */
            group: noOp,
            /**
             * @method
             * @memberof DistUI.out.Console
             * @public
             * @instance
             */
            groupCollapsed: noOp,
            /**
             * @method
             * @memberof DistUI.out.Console
             * @public
             * @instance
             */
            groupEnd: noOp,
            /**
             * @method
             * @memberof DistUI.out.Console
             * @public
             * @instance
             */
            info: noOp,
            /**
             * @method
             * @memberof DistUI.out.Console
             * @public
             * @instance
             */
            log: noOp,
            /**
             * @method
             * @memberof DistUI.out.Console
             * @public
             * @instance
             */
            profile: noOp,
            /**
             * @method
             * @memberof DistUI.out.Console
             * @public
             * @instance
             */
            profileEnd: noOp,
            /**
             * @method
             * @memberof DistUI.out.Console
             * @public
             * @instance
             */
            table: noOp,
            /**
             * @method
             * @memberof DistUI.out.Console
             * @public
             * @instance
             */
            time: noOp,
            /**
             * @method
             * @memberof DistUI.out.Console
             * @public
             * @instance
             */
            timeEnd: noOp,
            /**
             * @method
             * @memberof DistUI.out.Console
             * @public
             * @instance
             */
            timeStamp: noOp,
            /**
             * @method
             * @memberof DistUI.out.Console
             * @public
             * @instance
             */
            trace: noOp,
            /**
             * @method
             * @memberof DistUI.out.Console
             * @public
             * @instance
             */
            warn: noOp
        };

        p = null;
        for (p in console) {
            if (window && window.console && window.console[ p ]) {
                toBind = window.console[ p ];
                if (typeof(toBind) === "function" && Function.prototype.bind && typeof(toBind.bind) === "function") {
                    // This odd syntax is to satisfy IE which treats some window methods as Objects, not Functions
                    if (multi.indexOf(p) !== -1) {
                        console[ p ] = Function.prototype.bind.call(toBind, window.console); // toBind.bind(window.console, prefix);
                    }
                    else {
                        console[ p ] = Function.prototype.bind.call(toBind, window.console); // toBind.bind(window.console);
                    }
                }
            }
        }

        return console;
    };


    sLog = function(message) {
        jQuery.ajax({
            data: message,
            type: "PUT",
            url: "/"
        });
    };


    logFn = function(clazz, fnName, args) {
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
        sLog(message);
    };

})();

