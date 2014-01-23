/* global define */
/* exported DnD.Proxy */
(function() {
    "use strict";

    define({
        name: "Proxy",
        factory: function() {
            function Proxy() {}

            /**
             * @param {Object} params
             * @param {Boolean} [params.isWrapper] Whether proxied members are stored on this or a separate, wrapped Object
             * @param {Boolean} [params.object] An Object to proxy
             * @param {Object} params.getters
             * @param {Function} params.getters[ x ] A getter to invoke for a given property of the form function(obj, property) {}
             * @param {Object} params.setters
             * @param {Function} params.setters[ x ] A setter to invoke for a given property of the form function(obj, property, value) {}
             * @param {Array} params.listeners An Array of Functions of the form function(obj, property, oldValue, newValue) {} called whenever a setter is invoked that changes a value
             */
            Proxy.prototype.proxy = function(params) {
                var proxiedObj, getters, listeners, setters, i;
                proxiedObj = this;
                if (params) {
                    if (params.object) {
                        proxiedObj = params.object;
                    }
                    else if (params.isWrapper) {
                        proxiedObj = {};
                    }
                }
                getters = params && params.getters ? params.getters : {};
                listeners = [];
                setters = params && params.setters ? params.setters : {};

                this.addGetter = function(property, getter) {
                    if (typeof(getter) === "function") {
                        getters[ property ] = getter;
                    }
                };

                this.addListener = function(listener) {
                    if (typeof(listener) === "function") {
                        listeners.push(listener);
                    }
                };

                this.addSetter = function(property, setter) {
                    if (typeof(setter) === "function") {
                        setters[ property ] = setter;
                    }
                };

                this.get = function(property) {
                    var value;
                    if (getters[ property ]) {
                        value = getters[ property ](proxiedObj, property);
                    }
                    else {
                        value = proxiedObj[ property ];
                    }
                    return value;
                };

                this.getObject = function() {
                    return proxiedObj;
                };

                this.getValues = function() {
                    var members, obj, p;
                    members = this.getObject();
                    obj = {};
                    p = null;
                    for (p in members) {
                        if (members.hasOwnProperty(p)) {
                            obj[ p ] = this.get(p);
                        }
                    }
                    for (p in getters) {
                        if (getters.hasOwnProperty(p)) {
                            obj[ p ] = this.get(p);
                        }
                    }
                    return obj;
                };

                this.removeGetter = function(property) {
                    if (getters.hasOwnProperty(property)) {
                        delete getters[ property ];
                    }
                };

                this.removeListener = function(listener) {
                    var i = listeners.indexOf(listener);
                    if (i !== -1) {
                        listeners.splice(i, 1);
                    }
                };

                this.removeSetter = function(property) {
                    if (setters.hasOwnProperty(property)) {
                        delete setters[ property ];
                    }
                };

                this.set = function(property, value, force) {
                    var i, oldValue, newValue;
                    if (typeof(property) === "function") {
                        return this.setMultiple(property);
                    }
                    oldValue = this.get(property);
                    if (setters[ property ]) {
                        setters[ property ](proxiedObj, property, value);
                    }
                    else {
                        proxiedObj[ property ] = value;
                    }
                    newValue = this.get(property);
                    if (oldValue !== newValue || force) {
                        for (i = 0; i < listeners.length; i++) {
                            listeners[ i ](proxiedObj, property, oldValue, newValue);
                        }
                    }
                }.bind(this);

                this.setMultiple = function(fn) {
                    var before, after, p, forceChanged;
                    if (typeof(fn) === "function") {
                        before = this.getValues();
                        after = this.getValues();
                        forceChanged = fn(after) || [];
                        p = null;
                        for (p in after) {
                            if (after.hasOwnProperty(p) && (after[ p ] !== before[ p ] || forceChanged.indexOf(p) !== -1)) {
                                this.set(p, after[ p ], true);
                            }
                        }
                    }
                };


                for (i = 0; params && params.listeners && i < params.listeners.length; i++) {
                    this.addListener(params.listeners[ i ]);
                }
            };

            return Proxy;
        },
        includeInNamespace: true,
        namespace: "DnD"
    });

})();
