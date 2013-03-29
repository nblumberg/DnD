var Serializable = function() {};

Serializable.prototype.rawObj = function(obj) {
	var p, r;
    if (typeof(obj) === "undefined" || obj === null || jQuery.isFunction(obj)) {
        return null;
    }
    else if (obj && obj.raw) {
		return obj.raw();
	}
	else if (jQuery.isArray(obj)) {
	    return this.rawArray(obj);
	}
	else {
	    r = null;
	    // Has complex properties with .raw()?
	    for (p in obj) {
	        if (obj.hasOwnProperty(p) && obj[ p ].raw) {
	            r = {};
	            break;
	        }
	    }
	    if (r) {
	        for (p in obj) {
	            if (obj.hasOwnProperty(p) && p.indexOf("$") !== 0 && p.indexOf("$") !== 1) {
	                r[ p ] = this.rawObj(obj[ p ]);
	            }
	        }
	        return r;
	    }
	    return obj;
	}
};

Serializable.prototype.rawArray = function(array) {
	var i, raw, obj;
	raw = [];
	if (!array) {
		return null; // "raw FAILED";
	}
	for (i = 0; i < array.length; i++) {
	    obj = array[ i ];
	    if (obj.name === "Lechonero") { // TODO: remove
	        var x = 1;
	    }
	    raw.push(this.rawObj(obj));
	}
	return raw;
};

Serializable.prototype.raw = function() {
	var raw, prop, obj;
	raw = {};
	for (prop in this) {
		if (this.hasOwnProperty(prop)) {
			obj = this[ prop ];
			if (prop === "history") {
			    var x = 1;
			}
			if (prop.indexOf("$") === 0 || prop.indexOf("$") === 1 || jQuery.isFunction(obj)) {
				continue;
			}
			else if (jQuery.isArray(obj)) {
				raw[ prop ] = this.rawArray(obj);
			}
			else {
				raw[ prop ] = this.rawObj(obj);
			}
		}
	}
    return raw;
};

Serializable.prototype.toJSON = function() {
    return JSON.stringify(this.raw(), null, "  ");
};

var Console = {
	_isAvailable: function(method) {
		return window.console && window.console[ method ];
	},
	log: function(method) {
		return this._isAvailable(method) ? window.console[ method ] : function(msg) {}; 
	}
};