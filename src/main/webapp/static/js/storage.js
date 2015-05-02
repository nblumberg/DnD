(function(window) {
    "use strict";

    /* global jQuery, DnD:true */

    DnD.define(
        "Storage",
        [ "window", "jQuery" ],
        function(w, jQuery) {
            function Storage() {
                this.cache = {};
            };

            var local, ajax;

            local = {
                read: function(name, callback) {
                    if (w.localStorage || w.localStorage.getItem(name)) {
                        try {
                            callback(JSON.parse(w.localStorage.getItem(name)));
                            return;
                        }
                        finally {}
                        callback(null);
                    }
                },
                write: function(name, data) {
                    try {
                        w.localStorage.setItem(name, data);
                    }
                    catch (e) {
                        w.localStorage.clear();
                        w.localStorage.setItem(name, data);
                    }
                }
            };

            ajax = {
                read: function(name, callback) {
                    jQuery.ajax({
                        error: function() {
                            callback(null);
                        },
                        success: function(data) {
                            callback(data);
                        },
                        type: "GET",
                        url: "/" + name + ".json"
                    });
                },
                write: function(name, data) {
                    jQuery.ajax({
                        contentType: "application/json; charset=UTF-8",
                        data: data,
                        type: "POST",
                        url: "/" + name
                    });
                }
            };

            Storage.prototype.read = function(name, callback) {
                if (!name || typeof(callback) !== "function") {
                    return;
                }
                ajax.read(name, callback);
            };

            Storage.prototype.write = function(name, data) {
                if (!name || this.cache[ name ] === data) { // don't bother saving if it hasn't changed
                    return;
                }
                ajax.write(name, data);
            };

            return Storage;
        },
        true
    );

})(window);