/* global define */
/* exported DnD.Serializable */
(function() {
    "use strict";

    define({
        name: "Serializable",
        dependencyNames: [ "Proxy", "jQuery" ],
        factory: function(Proxy, jQuery) {
            function Serializable() {

            }

            Serializable.prototype = new Proxy();

            Serializable.prototype.rawObj = function(obj, nodes) {
                if (!nodes) {
                    nodes = [];
                }
                if (typeof(obj) === "undefined" || obj === null || typeof(obj) === "function" || nodes.indexOf(obj) !== -1) { // skip undefined, null, Function, or circular references
                    return null;
                }
                else if (typeof(obj) === "object") {
                    if (typeof(obj.raw) === "function") {
                        return obj.raw(nodes);
                    }
                    else if (obj.constructor === Array) {
                        return this.rawArray(obj, nodes);
                    }
                    else {
                        return Serializable.prototype.raw.call(obj, nodes);
                    }
                }
                else {
                    return obj; // obj is a String or raw data type
                }
            };

            Serializable.prototype.rawArray = function(array, nodes) {
                var i, r;
                if (!nodes) {
                    nodes = [];
                }
                r = [];
                if (!array || typeof(array) !== "object" || array.constructor !== Array || nodes.indexOf(array) !== -1) { // TODO: don't stop nesting equivalent Arrays or multiple instances of [ 1, 2, 3 ] can't occur
                    return null;
                }
                if (array !== []) {
                    nodes.push(array); // don't filter out empty Arrays
                }
                for (i = 0; i < array.length; i++) {
                    r.push(this.rawObj(array[ i ], nodes));
                }
                nodes.pop();
                return r;
            };

            Serializable.prototype._isSerializable = function(name, obj) {
                return typeof(obj) !== "function" && !(obj instanceof HTMLElement) && !(obj instanceof jQuery) && name.indexOf("$") !== 0 && name.indexOf("$") !== 1 && name.indexOf("__") !== 0;
            };

            Serializable.prototype.raw = function(nodes) {
                var obj, r, p, serializer;
                obj = this;
                if (typeof(this.getValues) === "function" && this.getValues() !== this) {
                    obj = this.getValues();
                }
                if (!nodes) {
                    nodes = [];
                }
                if (nodes.indexOf(obj) !== -1) { // skip circular references
                    return null;
                }
                nodes.push(obj);
                r = {};
                p = null;
                serializer = null;
                for (p in obj) {
                    if (obj.hasOwnProperty(p) && Serializable.prototype._isSerializable(p, obj[ p ])) {
                        if (obj[ p ] === null) {
                            r[ p ] = null;
                        }
                        else if (typeof(obj[ p ]) === "object" && obj[ p ].raw && typeof(obj[ p ].raw) === "function") { // has complex properties with .raw()
                            r[ p ] = obj[ p ].raw(nodes);
                        }
                        else if (typeof(obj[ p ]) === "object" && obj[ p ].constructor === Array) {
                            if (!serializer) {
                                serializer = new Serializable();
                            }
                            r[ p ] = serializer.rawArray(obj[ p ], nodes);
                        }
                        else {
                            if (!serializer) {
                                serializer = new Serializable();
                            }
                            r[ p ] = serializer.rawObj(obj[ p ], nodes);
                        }
                    }
                }
                nodes.pop();
                return r;
            };

            Serializable.prototype.toJSON = function() {
                return JSON.stringify(this.raw(), null, "  ");
            };

            return Serializable;
        },
        includeInNamespace: true,
        namespace: "DnD"
    });

})();

