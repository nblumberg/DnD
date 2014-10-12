// namespace.js

/**
 * The base namespace for all DnD objects and methods
 *
 * @module DnD
 * @namespace DnD
 * @author Nathaniel Blumberg
 */

/* exported DnD */

(function(window, jQuery) {
    "use strict";

    /* global DnD:true */

    var DnD, _v, tmp, p;
    DnD = window.DnD;
    _v = {
        prefix: "[" + (window.location.pathname.split("/").pop() || "/") + "]",
        console: null,
        debugging: window.location.search.indexOf("debug=") !== -1 || (typeof(DnD) !== "undefined" && typeof(DnD.state) !== "undefined" && DnD.state.debugging)
    };
    tmp = null;
    p = null;

    function init() {
        var o = {}, d = {};

        // ====================
        // vvv Deferred/Promise
        // ====================
        d.create = function(isDeferred) {
            var _v = {};
            _v.filters = {
                done: [],
                fail: [],
                progress: []
            };
            _v.handlers = {
                always: [],
                done: [],
                fail: [],
                progress: []
            };
            _v.promises = [];
            _v.results = {};
            if (isDeferred) {
                _v.state = "pending";
            }
            return _v;
        };

        d._addHandler = function(_v, type, fn) {
            var i, parentState;
            if (typeof(fn) === "function") {
                _v.handlers[ type ].push(fn);
                // Invoke immediately if we're already rejected/resolved
                parentState = this._parent.state();
                if ((parentState === "rejected" && (type === "fail" || type === "always")) ||
                    (parentState === "resolved" && (type === "done" || type === "always"))) {
                    fn.apply(window, this._parent._getResult(parentState === "rejected" ? "fail" : "done"));
                }
            }
            else if (fn && typeof(fn) === "object" && fn.constructor === Array) {
                for (i = 0; i < fn.length; i++) {
                    this._addHandler(type, fn[ i ]);
                }
            }
            return this;
        };

        d._addFilter = function(_v, type, fn) {
            var i;
            if (typeof(fn) === "function") {
                _v.filters[ type ].push(fn);
            }
            else if (fn && typeof(fn) === "object" && fn.constructor === Array) {
                for (i = 0; i < fn.length; i++) {
                    this._addFilter(type, fn[ i ]);
                }
            }
            return this;
        };

        d._getRawResult = function(_v, type) {
            return _v.results[ type ];
        };

        d._getResult = function(_v, type) {
            var i, result;
            result = this._getRawResult(type);
            // Apply filter functions to the value
            for (i = 0; i < _v.filters[ type ].length; i++) {
                result = _v.filters[ type ][ i ].apply(window, result);
            }
            return result;
        };

        d._invokeHandlerWith = function(_v, type, context, args) {
            var i;
            if (args) {
                _v.results[ type ] = typeof(args) === "object" && args.constructor === Array ? args : [ args ];
            }
            else {
                _v.results[ type ] = [];
            }
            args = this._getResult(type);
            for (i = 0; i < _v.handlers[ type ].length; i++) {
                _v.handlers[ type ][ i ].apply(context, args);
            }
            if (type !== "progress") {
                for (i = 0; i < _v.handlers.always.length; i++) {
                    _v.handlers.always[ i ].apply(context, args);
                }
            }
            for (i = 0; i < _v.promises.length; i++) {
                _v.promises[ i ]._invokeHandlerWith(type, context, args);
            }
        };

        d.promise = function(_v, target) {
            var p = new Promise(this._deferred, this._parent, target);
            _v.promises.push(p);
            return p;
        };

        d.then = function(_v, done, fail, progress) {
            var p = new Promise(this._deferred, this._parent);
            _v.promises.push(p);
            p._addFilter("done", done);
            p._addFilter("fail", fail);
            p._addFilter("progress", progress);
            return p;
        };

        /**
         * Implements a Deferred Object, similar to jQuery's Deferred
         *
         * @class Deferred
         * @memberof DnD
         * @static
         * @private
         */
        function Deferred() {
            this._init();
        }
        o.Deferred = Deferred;

        /**
         * @method _init
         * @instance
         * @private
         * @memberof DnD.Deferred
         */
        Deferred.prototype._init = function() {
            var _v = d.create(true);
            if (typeof(DnD) !== "undefined" && DnD.isTest) {
                this._v = _v;
            }
            this._deferred = this;
            this._parent = this;

            // private methods
            this._addHandler = d._addHandler.bind(this, _v);
            this._addFilter = d._addFilter.bind(this, _v);
            this._getRawResult = d._getRawResult.bind(this, _v);
            this._getResult = d._getResult.bind(this, _v);
            this._invokeHandlerWith = d._invokeHandlerWith.bind(this, _v);

            // Deferred and Promise methods
            /**
             * Add handlers to be called when the Deferred object is either resolved or rejected.
             *
             * The argument can be either a single function or an array of functions.
             * When the Deferred is resolved or rejected, the always callbacks are called.
             * Since deferred.always() returns the Deferred object, other methods of the Deferred object
             * can be chained to this one, including additional .always() methods.
             * When the Deferred is resolved or rejected, callbacks are executed in the order they were added,
             * using the arguments provided to the resolve, reject, resolveWith or rejectWith method calls.
             * For more information, see the documentation for Deferred object.
             *
             * @method always
             * @instance
             * @public
             * @memberof DnD.Deferred
             *
             * @param {Function | Array[Function]}
             * @returns {this}
             */
            this.always = function(fn) {
                return this._addHandler("always", fn);
            };

            /**
             * Add handlers to be called when the Deferred object is resolved.
             *
             * The deferred.done() method accepts either a single function or an array of functions.
             * When the Deferred is resolved, the done callbacks are called.
             * Callbacks are executed in the order they were added.
             * Since deferred.done() returns the deferred object, other methods of the deferred object can be
             * chained to this one, including additional .done() methods.
             * When the Deferred is resolved, done callbacks are executed using the arguments provided to the
             * resolve or resolveWith method call in the order they were added.
             * For more information, see the documentation for Deferred object.
             *
             * @method done
             * @instance
             * @public
             * @memberof DnD.Deferred
             *
             * @param {Function | Array[Function]}
             * @returns {this}
             */
            this.done = function(fn) {
                return this._addHandler("done", fn);
            };

            /**
             * Add handlers to be called when the Deferred object is rejected.
             *
             * The deferred.fail() method accepts either a single function or an array of functions.
             * When the Deferred is rejected, the fail callbacks are called.
             * Callbacks are executed in the order they were added.
             * Since deferred.fail() returns the deferred object, other methods of the deferred object
             * can be chained to this one, including additional deferred.fail() methods.
             * The fail callbacks are executed using the arguments provided to the deferred.reject() or
             * deferred.rejectWith() method call in the order they were added.
             * For more information, see the documentation for Deferred object.
             *
             * @method fail
             * @instance
             * @public
             * @memberof DnD.Deferred
             *
             * @param {Function | Array[Function]}
             * @returns {this}
             */
            this.fail = function(fn) {
                return this._addHandler("fail", fn);
            };

            /**
             * Add handlers to be called when the Deferred object generates progress notifications.
             *
             * The argument can be either a single function or an array of functions.
             * When the Deferred generates progress notifications by calling notify or notifyWith,
             * the progressCallbacks are called.
             * Since deferred.progress() returns the Deferred object, other methods of the Deferred object
             * can be chained to this one.
             * For more information, see the documentation for jQuery.Deferred().
             *
             * @method progress
             * @instance
             * @public
             * @memberof DnD.Deferred
             *
             * @param {Function | Array[Function]}
             * @returns {this}
             */
            this.progress = function(fn) {
                return this._addHandler("progress", fn);
            };

            /**
             * Determine the current state of a Deferred object.
             * @desc
             * The deferred.state() method returns a string representing the current state of the Deferred object.
             * The Deferred object can be in one of three states:
             * <ul>
             * <li><strong>"pending":</strong> The Deferred object is not yet in a completed state (neither "rejected" nor "resolved")</li>
             * <li><strong>"resolved":</strong> The Deferred object is in the resolved state, meaning that either deferred.resolve() or deferred.resolveWith() has been called for the object and the doneCallbacks have been called (or are in the process of being called).</li>
             * <li><strong>"rejected":</strong> The Deferred object is in the rejected state, meaning that either deferred.reject() or deferred.rejectWith() has been called for the object and the failCallbacks have been called (or are in the process of being called).</li>
             * </ul>
             * This method is primarily useful for debugging to determine, for example, whether a Deferred has already been resolved even though you are inside code that intended to reject it.
             *
             * @method state
             * @instance
             * @public
             * @memberof DnD.Deferred
             *
             * @returns {String} "pending" | "resolved" | "rejected"
             */
            this.state = function() {
                return _v.state;
            };

            /**
             * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
             *
             * The deferred.then() method returns a new promise that can filter the status and values of
             * a deferred through a function. The done filter and fail filter functions filter
             * the original deferred's resolved / rejected status and values.
             * The progress filter function filters any calls to the original deferred's notify or notifyWith
             * methods.
             * These filter functions can return a new value to be passed along to the promise's .done() or .fail()
             * callbacks, or they can return another observable object (Deferred, Promise, etc) which will pass
             * its resolved / rejected status and values to the promise's callbacks.
             * If the filter function used is null, or not specified, the promise will be resolved or rejected
             * with the same values as the original.
             * Callbacks are executed in the order they were added.
             * Since deferred.then returns a Promise, other methods of the Promise object can be chained to this one,
             * including additional .then() methods.
             *
             * @method then
             * @instance
             * @public
             * @memberof DnD.Deferred
             *
             * @param
             * @returns {DnD.Promise}
             */
            this.then = d.then.bind(this, _v);


            // Deferred-only methods
            /**
             * Call the progressCallbacks on a Deferred object with the given args.
             *
             * Normally, only the creator of a Deferred should call this method;
             * you can prevent other code from changing the Deferred's state or reporting status by returning a
             * restricted Promise object through deferred.promise().
             * When deferred.notify is called, any progressCallbacks added by deferred.then or deferred.progress
             * are called. Callbacks are executed in the order they were added.
             * Each callback is passed the args from the .notify().
             * For more information, see the documentation for Deferred object.
             *
             * @method notify
             * @instance
             * @public
             * @memberof DnD.Deferred
             *
             * @param args Arbitrary arguments
             * @returns {this}
             */
            this.notify = function() {
                this.notifyWith(window, Array.prototype.slice.call(arguments));
            };

            /**
             * Call the progressCallbacks on a Deferred object with the given context and args.
             *
             * Normally, only the creator of a Deferred should call this method;
             * you can prevent other code from changing the Deferred's state or reporting status by returning a
             * restricted Promise object through deferred.promise().
             * When deferred.notifyWith is called, any progressCallbacks added by deferred.then or deferred.progress
             * are called. Callbacks are executed in the order they were added.
             * Each callback is passed the args from the .notifyWith().
             * For more information, see the documentation for Deferred object.
             *
             * @method notifyWith
             * @instance
             * @public
             * @memberof DnD.Deferred
             *
             * @param context {Object} The context to resolve progress handlers in
             * @param args Arbitrary arguments
             * @returns {this}
             */
            this.notifyWith = function(context, args) {
                this._invokeHandlerWith("progress", context, args);
            };

            /**
             * Return a Deferred's Promise object.
             *
             * The deferred.promise() method allows an asynchronous function to prevent other code from
             * interfering with the progress or status of its internal request.
             * The Promise exposes only the Deferred methods needed to attach additional handlers or determine
             * the state (then, done, fail, always, pipe, progress, and state), but not ones that change the state
             * (resolve, reject, notify, resolveWith, rejectWith, and notifyWith).
             * If target is provided, deferred.promise() will attach the methods onto it and then return this object
             * rather than create a new one.
             * This can be useful to attach the Promise behavior to an object that already exists.
             * If you are creating a Deferred, keep a reference to the Deferred so that it can be resolved or
             * rejected at some point.
             * Return only the Promise object via deferred.promise() so other code can register callbacks or inspect
             * the current state.
             * For more information, see the documentation for Deferred object.
             *
             * @method promise
             * @instance
             * @public
             * @memberof DnD.Deferred
             *
             * @returns {DnD.Promise}
             */
            this.promise = d.promise.bind(this, _v);

            /**
             * Reject a Deferred object and call any failCallbacks with the given args.
             *
             * Normally, only the creator of a Deferred should call this method;
             * you can prevent other code from changing the Deferred's state by returning a restricted Promise
             * object through deferred.promise().
             * When the Deferred is rejected, any failCallbacks added by deferred.then() or deferred.fail() are
             * called.
             * Callbacks are executed in the order they were added.
             * Each callback is passed the args from the deferred.reject() call.
             * Any fail callbacks added after the Deferred enters the rejected state are executed immediately when
             * they are added, using the arguments that were passed to the deferred.reject() call.
             * For more information, see the documentation for Deferred().
             *
             * @method reject
             * @instance
             * @public
             * @memberof DnD.Deferred
             *
             * @param context {Object} The context to resolve fail handlers in
             * @param args Arbitrary arguments
             * @returns {this}
             */
            this.reject = function() {
                this.rejectWith(window, Array.prototype.slice.call(arguments));
            };

            /**
             * Reject a Deferred object and call any failCallbacks with the given context and args.
             *
             * Normally, only the creator of a Deferred should call this method;
             * you can prevent other code from changing the Deferred's state by returning a restricted Promise
             * object through deferred.promise().
             * When the Deferred is rejected, any failCallbacks added by deferred.then() or deferred.fail() are
             * called.
             * Callbacks are executed in the order they were added.
             * Each callback is passed the args from the deferred.reject() call.
             * Any fail callbacks added after the Deferred enters the rejected state are executed immediately when
             * they are added, using the arguments that were passed to the deferred.reject() call.
             * For more information, see the documentation for Deferred().
             *
             * @method rejectWith
             * @instance
             * @public
             * @memberof DnD.Deferred
             *
             * @param context {Object} The context to resolve fail handlers in
             * @param args Arbitrary arguments
             * @returns {this}
             */
            this.rejectWith = function(context, args) {
                _v.state = "rejected";
                this._invokeHandlerWith("fail", context, args);
            };

            /**
             * Resolve a Deferred object and call any doneCallbacks with the given args.
             *
             * When the Deferred is resolved, any done callbacks added by deferred.then() or deferred.done()
             * are called.
             * Callbacks are executed in the order they were added.
             * Each callback is passed the args from the deferred.resolve().
             * Any done callbacks added after the Deferred enters the resolved state are executed immediately
             * when they are added, using the arguments that were passed to the deferred.resolve() call.
             * For more information, see the documentation for Deferred().
             *
             * @method resolve
             * @instance
             * @public
             * @memberof DnD.Deferred
             *
             * @param context {Object} The context to resolve done handlers in
             * @param args Arbitrary arguments
             * @returns {this}
             */
            this.resolve = function() {
                this.resolveWith(window, Array.prototype.slice.call(arguments));
            };

            /**
             * @method resolveWith
             * @instance
             * @public
             * @memberof DnD.Deferred
             *
             * @param context {Object} The context to resolve done handlers in
             * @param args Arbitrary arguments
             * @returns {this}
             */
            this.resolveWith = function(context, args) {
                _v.state = "resolved";
                this._invokeHandlerWith("done", context, args);
            };

        };

        /**
         * Implements a Promise Object, similar to jQuery's Deferred.Promise
         *
         * @class Promise
         * @memberof DnD
         * @static
         * @public
         */
        function Promise(deferred, parent, target) {
            var _v = d.create(false);
            if (!target) {
                target = this;
            }
            if (typeof(DnD) !== "undefined" && DnD.isTest) {
                target._v = _v;
            }

            target._deferred = deferred;
            target._parent = parent;

            // private methods
            target._addHandler = d._addHandler.bind(target, _v);
            target._addFilter = d._addFilter.bind(target, _v);

            this._getRawResult = function(type) {
                return this._parent._getResult(type);
            };
            this._getResult = d._getResult.bind(target, _v);

            target._invokeHandlerWith = d._invokeHandlerWith.bind(target, _v);

            // public methods
            /**
             * Add handlers to be called when the Deferred object is either resolved or rejected.
             *
             * The argument can be either a single function or an array of functions.
             * When the Deferred is resolved or rejected, the always callbacks are called.
             * Since deferred.always() returns the Deferred object, other methods of the Deferred object
             * can be chained to this one, including additional .always() methods.
             * When the Deferred is resolved or rejected, callbacks are executed in the order they were added,
             * using the arguments provided to the resolve, reject, resolveWith or rejectWith method calls.
             * For more information, see the documentation for Deferred object.
             *
             * @method always
             * @instance
             * @public
             * @memberof DnD.Promise
             *
             * @param {Function | Array[Function]}
             * @returns {this}
             */
            target.always = function(fn) {
                return this._addHandler("always", fn);
            };

            /**
             * Add handlers to be called when the Deferred object is resolved.
             *
             * The deferred.done() method accepts either a single function or an array of functions.
             * When the Deferred is resolved, the done callbacks are called.
             * Callbacks are executed in the order they were added.
             * Since deferred.done() returns the deferred object, other methods of the deferred object can be
             * chained to this one, including additional .done() methods.
             * When the Deferred is resolved, done callbacks are executed using the arguments provided to the
             * resolve or resolveWith method call in the order they were added.
             * For more information, see the documentation for Deferred object.
             *
             * @method done
             * @instance
             * @public
             * @memberof DnD.Promise
             *
             * @param {Function | Array[Function]}
             * @returns {this}
             */
            target.done = function(fn) {
                return this._addHandler("done", fn);
            };

            /**
             * Add handlers to be called when the Deferred object is rejected.
             *
             * The deferred.fail() method accepts either a single function or an array of functions.
             * When the Deferred is rejected, the fail callbacks are called.
             * Callbacks are executed in the order they were added.
             * Since deferred.fail() returns the deferred object, other methods of the deferred object
             * can be chained to this one, including additional deferred.fail() methods.
             * The fail callbacks are executed using the arguments provided to the deferred.reject() or
             * deferred.rejectWith() method call in the order they were added.
             * For more information, see the documentation for Deferred object.
             *
             * @method fail
             * @instance
             * @public
             * @memberof DnD.Promise
             *
             * @param {Function | Array[Function]}
             * @returns {this}
             */
            target.fail = function(fn) {
                return this._addHandler("fail", fn);
            };

            /**
             * Add handlers to be called when the Deferred object generates progress notifications.
             *
             * The argument can be either a single function or an array of functions.
             * When the Deferred generates progress notifications by calling notify or notifyWith,
             * the progressCallbacks are called.
             * Since deferred.progress() returns the Deferred object, other methods of the Deferred object
             * can be chained to this one.
             * For more information, see the documentation for jQuery.Deferred().
             *
             * @method progress
             * @instance
             * @public
             * @memberof DnD.Promise
             *
             * @param {Function | Array[Function]}
             * @returns {this}
             */
            target.progress = function(fn) {
                return this._addHandler("progress", fn);
            };

            /**
             * Determine the current state of a Deferred object.
             * @desc
             * The deferred.state() method returns a string representing the current state of the Deferred object.
             * The Deferred object can be in one of three states:
             * <ul>
             * <li><strong>"pending":</strong> The Deferred object is not yet in a completed state (neither "rejected" nor "resolved")</li>
             * <li><strong>"resolved":</strong> The Deferred object is in the resolved state, meaning that either deferred.resolve() or deferred.resolveWith() has been called for the object and the doneCallbacks have been called (or are in the process of being called).</li>
             * <li><strong>"rejected":</strong> The Deferred object is in the rejected state, meaning that either deferred.reject() or deferred.rejectWith() has been called for the object and the failCallbacks have been called (or are in the process of being called).</li>
             * </ul>
             * This method is primarily useful for debugging to determine, for example, whether a Deferred has already been resolved even though you are inside code that intended to reject it.
             *
             * @method state
             * @instance
             * @public
             * @memberof DnD.Promise
             *
             * @returns {String} "pending" | "resolved" | "rejected"
             */
            target.state = function() {
                return this._parent.state();
            };

            /**
             * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
             *
             * The deferred.then() method returns a new promise that can filter the status and values of
             * a deferred through a function. The done filter and fail filter functions filter
             * the original deferred's resolved / rejected status and values.
             * The progress filter function filters any calls to the original deferred's notify or notifyWith
             * methods.
             * These filter functions can return a new value to be passed along to the promise's .done() or .fail()
             * callbacks, or they can return another observable object (Deferred, Promise, etc) which will pass
             * its resolved / rejected status and values to the promise's callbacks.
             * If the filter function used is null, or not specified, the promise will be resolved or rejected
             * with the same values as the original.
             * Callbacks are executed in the order they were added.
             * Since deferred.then returns a Promise, other methods of the Promise object can be chained to this one,
             * including additional  .then() methods.
             *
             * @method then
             * @instance
             * @public
             * @memberof DnD.Promise
             *
             * @param
             * @returns {DnD.Promise}
             */
            target.then = d.then.bind(target, _v);
        }
        o.Deferred.Promise = Promise;


        o.deferred = new Deferred();
        o.deferred.progress.calls = [];
        o.deferred.progress.start = (new Date()).getTime();
        o.deferred.progress.log = function(params) {
            var message = null;
            if (params && (params.message || params.name) && (_v.debugging || params.method === "error" || params.method === "warn")) {
                if (!_v.console && o.modules.out && o.modules.out.instance) { // Use out module once it's initialized
                    _v.console = o.modules.out.instance.createConsole(_v.prefix);
                    _v.console.promise().done(function() {
                        o.deferred.progress.logSkipped();
                    });
                }
                if (!_v.console) {
                    return;
                }
                message = params.message || params.name;
                if (params.time) {
                    message += " @ " + (params.time - o.deferred.progress.start) + " ms";
                }
                if (params.method === "debugFilter") {
                    _v.console.debugFilter(
                        params.debugLevel || _v.console.debugLevel + 1,
                        function(isNoOp) {
                            params.logged = !isNoOp;
                        }
                    )(message);
                }
                else {
                    _v.console[ params.method ](message);
                    params.logged = true;
                }
            }
        };
        o.deferred.progress.logSkipped = function() {
            var i;
            for (i = 0; i < o.deferred.progress.calls.length; i++) {
                if (!o.deferred.progress.calls[ i ].logged) {
                    o.deferred.progress.log(o.deferred.progress.calls[ i ]);
                }
            }
        };
        o.deferred.progress.addEvent = function(params) {
            var state;
            if (params && params.isEvent) {
                if (typeof(DnD) === "undefined") {
                    state = o.state = {};
                }
                else {
                    if (!DnD.state) {
                        DnD.state = {};
                    }
                    state = DnD.state;
                }
                if (!state.preMetricsEvents) {
                    state.preMetricsEvents = [];
                }
                state.preMetricsEvents.push(params);
            }
        };
        o.promise = o.deferred.promise;

        (function() {
            var p = o.promise();

            _v.defaultPromiseHandlers = {
                normalize: function(params, method) {
                    if (!params) {
                        params = {};
                    }
                    else if (typeof(params) === "string") {
                        params = { message: params };
                    }
                    if (!params.method) {
                        params.method = method || "log";
                    }
                    if (params.isEvent && !params.time) {
                        params.time = (new Date()).getTime();
                    }
                    o.deferred.progress.calls.push(params);
                    o.deferred.progress.log(params);
                    o.deferred.progress.addEvent(params);
                    return params;
                },
                progress: function(params) {
                    params = _v.defaultPromiseHandlers.normalize(params);
                },

                fail: function(params) {
                    params = _v.defaultPromiseHandlers.normalize(params, "error");
                }
            };

            p.progress(_v.defaultPromiseHandlers.progress);
            p.fail(_v.defaultPromiseHandlers.fail);
        })();
        // ====================
        // ^^^ Deferred/Promise
        // ====================


        // =====================
        // vvv Module Management
        // =====================
        o.modules = {};

        /**
         * Defines a javascript module
         *
         * @method define
         * @memberof DnD
         * @static
         * @public
         *
         * @param {String} name The name of the module being defined
         * @param {Array} dependencies A list of module dependency names (as provided in their own name parameter to this method)
         * @param {Function} factory A function that, when invoked with instances of all dependencies (provided by their own factories), returns an instance of this module
         * @param {Boolean} [injectIntoNamespace] Whether to create an instance of this module as part of the global DnD namespace once all dependencies are met
         * @returns {Object | Boolean | undefined} The newly defined module, false if insufficient parameters, undefined if a module by that name already exists
         */
        o.define = function(name, dependencies, factory, injectIntoNamespace) {
            var now = new Date();
            if (!dependencies) {
                dependencies = [];
            }

            if (!name || typeof(factory) !== "function") {
                return false;
            }

            if (o.modules.hasOwnProperty(name)) {
                o.deferred.notify({
                    isEvent: true,
                    name: "DnD module " + name + " already defined",
                    method: "warn",
                    debugLevel: 1,
                    time: now.getTime()
                });
                return;
            }
            else {
                o.deferred.notify({
                    isEvent: true,
                    name: "Defining DnD module " + name,
                    method: "debugFilter",
                    debugLevel: 1,
                    time: now.getTime()
                });
            }
            o.modules[ name ] = { name: name, dependencyNames: dependencies, dependencies: dependencies, factory: factory, injectIntoNamespace: !!injectIntoNamespace };
            o.define.checkDependencies();
            return o.modules[ name ];
        };

        /**
         * Checks if all of the given module's dependencies are met, and if so sets up a create method
         * on the module that invokes its factory with all its dependencies. If the module is flagged
         * injectIntoNamespace == true it invokes define.injectIntoNamespace().
         *
         * @method checkDependencies
         * @memberof DnD
         * @static
         * @private
         *
         * @param {String} name The name of the module to check
         * @returns {Boolean} whether the dependencies for the module are fully defined
         */
        o.define.checkDependencies = function(name) {
            var p, module, fullyDefined, i, dependencyName, now;
            p = null;

            if (!name) {
                for (p in o.modules) {
                    if (o.modules.hasOwnProperty(p)) {
                        if (o.define.checkDependencies(p)) {
                            return true;
                        }
                    }
                }
                return true;
            }

            if (!o.modules.hasOwnProperty(name) || o.modules[ name ].create) {
                return false;
            }
            module = o.modules[ name ];
            fullyDefined = true;
            module.dependencies = [];
            for (i = 0; i < module.dependencyNames.length; i++) {
                dependencyName = module.dependencyNames[ i ];
                if (o.modules.hasOwnProperty(dependencyName) && o.modules[ dependencyName ].create) {
                    module.dependencies.push(o.modules[ dependencyName ]);
                }
                else {
                    fullyDefined = false;
                    module.dependencies.push(dependencyName);
                }
            }
            if (fullyDefined) {
                now = new Date();
                o.deferred.notify({
                    isEvent: true,
                    name: "DnD module " + name + " initialized",
                    method: "debugFilter",
                    debugLevel: 1,
                    time: now.getTime()
                });
                module.create = function() {
                    var args, i;
                    args = [];
                    for (i = 0; i < this.dependencies.length; i++) {
                        if (!this.dependencies[ i ].instance) {
                            this.dependencies[ i ].instance = this.dependencies[ i ].create();
                        }
                        args.push(this.dependencies[ i ].instance);
                    }
                    return this.factory.apply(this, args);
                }.bind(module);
                if (module.injectIntoNamespace) {
                    o.define.injectIntoNamespace(module);
                }
                else if (typeof(DnD) === "undefined" || !DnD.isTest) {
                    module.instance = module.create(); // if not injected into the DnD namespace, just run it once in case it's execute-immediately code, unless we're testing
                }
                o.define.checkDependencies();
                return true;
            }
            return false;
        };

        /**
         * Creates an instance of a module with all it's dependencies and sets it as a member of the global DnD namespace.
         *
         * @method injectIntoNamespace
         * @memberof DnD
         * @static
         * @private
         *
         * @param {Object} module An Object describing a module as created by define() and define.checkDependencies()
         * @returns {Boolean} whether the module was injected into the {@link DnD} namespace
         */
        o.define.injectIntoNamespace = function(module) {
            var container, parts, i;
            if (!module || !module.name || !module.create) {
                return false;
            }
            container = o;
            parts = module.name.split(".");
            for (i = 0; i < parts.length; i++) {
                if (i === parts.length - 1) {
                    module.instance = module.create();
                    container[ parts[ i ] ] = module.instance;
                    container[ parts[ i ] ]._init = module.create;
                }
                else {
                    if (!container.hasOwnProperty(parts[ i ])) {
                        container[ parts[ i ] ] = {};
                    }
                    container = container[ parts[ i ] ];
                }
            }
            return true;
        };

        window.setTimeout(function() {
            var p, dependencies, i, error;
            p = error = null;
            for (p in o.modules) {
                if (o.modules.hasOwnProperty(p) && !o.modules[ p ].create) {
                    dependencies = [];
                    for (i = 0; i < o.modules[ p ].dependencies.length; i++) {
                        if (typeof(o.modules[ p ].dependencies[ i ]) === "string") {
                            dependencies.push(o.modules[ p ].dependencies[ i ]);
                        }
                    }
                    if (!error) {
                        error = "The following DnD modules are missing dependencies:\n";
                    }

                    error += "\t" + p + ": [" + dependencies.join(", ") + "]\n";
                }
            }
            if (error) {
                o.deferred.reject(error);
            }
        }, 10000);
        // =====================
        // ^^^ Module Management
        // =====================


        // ========================
        // vvv Utility methods
        // ========================
        /**
         * A method for repetitively checking for the presence of a script Object with an optional timeout
         *
         * @method waitForIt
         * @memberof DnD
         * @static
         * @public
         *
         * @param {Object} params
         * @param {Function} params.test A test that is run to check for the presence of the script Object, should return true when the Object is present
         * @param {Function} params.done A callback to invoke when the script Object is present
         * @param {Function} [params.error] A callback to invoke when the timeout is reached without discovering the script Object
         * @param {Number} [params.interval] The time between checks in milliseconds, defaults to 10
         * @param {Number} [params.timeout] The timeout in milliseconds, defaults to 30,000
         */
        o.waitForIt = function(params) {
            var interval, intervalId, intervalDuration, intervalCount, timeout;
            if (!params || typeof(params.test) !== "function" || typeof(params.done) !== "function") {
                return null;
            }

            intervalCount = 0;
            intervalDuration = params.interval || 10;
            timeout = params.timeout || 30000;

            interval = function() {
                if (!params.test()) {
                    intervalCount += intervalDuration;
                    if (intervalCount >= timeout) {
                        window.clearInterval(intervalId);
                        if (typeof(params.error) === "function") {
                            params.error();
                        }
                    }
                    return;
                }
                window.clearInterval(intervalId);
                params.done();
            };
            intervalId = window.setInterval(interval, intervalDuration);
        };
        // ========================
        // ^^^ Utility methods
        // ========================


        // ========================
        // vvv window
        // ========================
        o.define("window", [], function() { return window; }, false);
        // ========================
        // ^^^ window
        // ========================

        // ========================
        // vvv jQuery
        // ========================
        o.define("jQuery", [], function() { return jQuery; }, false);
        // ========================
        // ^^^ jQuery
        // ========================

        return o;
    }

    if (typeof(window.DnD) === "undefined") {
        window.DnD = init();
    }
    else {
        tmp = init();
        for (p in window.DnD) {
            if (window.DnD.hasOwnProperty(p) && p !== "define" && p !== "modules") {
                tmp[ p ] = window.DnD[ p ];
            }
        }
        window.DnD = tmp;

        if (window.DnD.isTest) {
            window.DnD._v = _v;
        }
    }
    window.DnD._init = init;
})(window, window.jQuery);