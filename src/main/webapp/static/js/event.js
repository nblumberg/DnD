(function() {
    "use strict";

    DnD.define(
        "EventDispatcher",
        [ "Serializable", "out" ],
        function(Serializable, out) {
            function EventDispatcher() {
            }

            EventDispatcher.id = 1;

            EventDispatcher.prototype = new Serializable(); // for subclasses

            /**
             * Define members in a utility init method
             */
            EventDispatcher.prototype._initEventDispatcher = function() {
                // Store members as "__" variables so Serializable doesn't pick them up
                if (!this.__listeners) {
                    this.__listeners = []; // keep all listeners in a Queue to assure order of execution
                }
                if (!this.__eventTypes) {
                    this.__eventTypes = {};
                }
            };

            EventDispatcher.prototype.getListeners = function() {
                this._initEventDispatcher();
                return this.__listeners;
            };

            EventDispatcher.prototype.getEventTypes = function() {
                this._initEventDispatcher();
                return this.__eventTypes;
            };

            EventDispatcher.prototype.getListenersByType = function(eventType) {
                if (!eventType) {
                    return undefined;
                }
                this._initEventDispatcher();
                if (!this.__eventTypes.hasOwnProperty(eventType)) {
                    this.__eventTypes[ eventType ] = [];
                }
                return this.__eventTypes[ eventType ];
            };

            EventDispatcher.prototype.getCallbackIndices = function(callback) {
                var i, indices = [];
                this._initEventDispatcher();
                for (i = 0; i < this.__listeners.length; i++) {
                    if (this.__listeners[ i ].callback === callback) {
                        indices.push(i);
                    }
                }
                return indices;
            };

            EventDispatcher.prototype.getListenerIndex = function(eventType, callback) {
                var i;
                this._initEventDispatcher();
                for (i = 0; i < this.__listeners.length; i++) {
                    if (this.__listeners[ i ].callback === callback && ((!eventType && !this.__listeners[ i ].type) || this.__listeners[ i ].type === eventType)) {
                        return i;
                    }
                }
                return -1;
            };

            EventDispatcher.prototype.hasListener = function(eventType, callback) {
                return this.getListenerIndex(eventType, callback) !== -1;
            };

            EventDispatcher.prototype.addEventListener = function(eventType, callback) {
                var listenersByType;
                if (this.hasListener(eventType, callback)) {
                    return; // prevent redundant listeners
                }
                if (eventType) {
                    listenersByType = this.getListenersByType(eventType);
                    listenersByType.push(callback);
                }
                this.getListeners().push({ type: eventType, callback: callback });
                out.console.debug(this.toString() + " listeners: " + this.getListeners().length);
            };

            EventDispatcher.prototype.on = function(eventType, callback) {
                return this.addEventListener(eventType, callback);
            };

            /**
             * Removes an event handler callback Function from this EventDispatcher
             *
             * @param eventType {String} If provided, only remove listeners matching callback and eventType, if null remove all listeners matching callback
             * @param callback {Function} The event handler callback Function to remove
             */
            EventDispatcher.prototype.removeEventListener = function(eventType, callback) {
                var removed, indices, i, listener, listeners;
                removed = 0;
                indices = this.getCallbackIndices(callback);
                if (!indices.length) { // nothing to remove
                    return removed;
                }
                if (eventType) {
                    // Remove matches that don't match the eventType (if provided)
                    for (i = 0; i < indices.length; i++) {
                        listener = this.getListeners()[ indices[ i ] ];
                        if (listener.type !== eventType) {
                            indices.splice(i, 1);
                            i--;
                        }
                    }
                }
                // Remove matching listeners
                for (i = 0; i < indices.length; i++) {
                    listener = this.getListeners()[ indices[ i ] - removed ];
                    this.getListeners().splice(indices[ i ] - removed, 1);
                    if (listener.type) {
                        listeners = this.getListenersByType(listener.type);
                        listeners.splice(listeners.indexOf(callback), 1);
                    }
                    removed++;
                }
                return removed;
            };

            EventDispatcher.prototype.off = function(eventType, callback) {
                return this.removeEventListener(eventType, callback);
            };

            EventDispatcher.prototype.dispatchEvent = function(event) {
                var i, listener, dispatched;
                dispatched = 0;
                // Create the event Object
                if (typeof(event) === "string") {
                    event = { type: event };
                }
                if (!event || !event.type) {
                    return dispatched;
                }
                event.id = event.type + EventDispatcher.id++;
                event.target = this;
                event._stopPropagation = false;
                event.stopPropagation = (function() {
                    this._stopPropagation = true;
                }).bind(event);

                // Dispatch the event to handler callbacks
                for (i = 0; !event._stopPropagation && i < this.getListeners().length; i++) {
                    listener = this.getListeners()[ i ];
                    if (!listener.type || listener.type === event.type) {
                        listener.callback(event);
                        dispatched++;
                    }
                }
                return dispatched;
            };

            EventDispatcher.prototype.trigger = function(event) {
                return this.dispatchEvent(event);
            };

            return EventDispatcher;
        },
        true
    )
})();
