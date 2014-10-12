(function() {
    "use strict";

    DnD.define(
        "Serializable",
        [],
        function() {
            function Serializable() {}

            Serializable.prototype.rawObj = function(obj, nodes) {
                var p, r;
                if (!nodes) {
                    nodes = [];
                }
                if (typeof(obj) === "undefined" || obj === null || typeof(obj) === "function" || nodes.indexOf(obj) !== -1) { // skip undefined, null, Function, or circular references
                    return null;
                }
                else if (typeof(obj) === "object") {
                    if (obj.raw) {
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
                var r, p, serializer;
                if (!nodes) {
                    nodes = [];
                }
                if (nodes.indexOf(this) !== -1) { // skip circular references
                    return null;
                }
                nodes.push(this);
                r = {};
                for (p in this) {
                    if (this.hasOwnProperty(p) && Serializable.prototype._isSerializable(p, this[ p ])) {
                        if (this[ p ] === null) {
                            r[ p ] = null;
                        }
                        else if (typeof(this[ p ]) === "object" && this[ p ].raw && typeof(this[ p ].raw) === "function") { // has complex properties with .raw()
                            r[ p ] = this[ p ].raw(nodes);
                        }
                        else if (typeof(this[ p ]) === "object" && this[ p ].constructor === Array) {
                            if (!serializer) {
                                serializer = new Serializable();
                            }
                            r[ p ] = serializer.rawArray(this[ p ], nodes);
                        }
                        else {
                            if (!serializer) {
                                serializer = new Serializable();
                            }
                            r[ p ] = serializer.rawObj(this[ p ], nodes);
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
        false
    );

})();

