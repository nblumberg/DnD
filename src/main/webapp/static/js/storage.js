(function() {
    "use strict";

    /* global jQuery, DnD:true */

    var local, ajax;

    local = {
        read: function(name, callback) {
            if (window.localStorage || window.localStorage.getItem(name)) {
                try {
                    callback(JSON.parse(window.localStorage.getItem(name)));
                    return;
                }
                finally {}
                callback(null);
            }
        },
        write: function(name, data) {
            try {
                window.localStorage.setItem(name, data);
            }
            catch (e) {
                window.localStorage.clear();
                window.localStorage.setItem(name, data);
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

    if (typeof(DnD) === "undefined") {
        DnD = {};
    }

    DnD.Storage = function() {
        this.cache = {};
    };

    DnD.Storage.prototype.read = function(name, callback) {
        if (!name || typeof(callback) !== "function") {
            return;
        }
        ajax.read(name, callback);
    };

    DnD.Storage.prototype.write = function(name, data) {
        if (!name || this.cache[ name ] === data) { // don't bother saving if it hasn't changed
            return;
        }
        ajax.write(name, data);
    };

})();