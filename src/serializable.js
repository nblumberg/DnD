var Serializable = function() {};

Serializable.prototype.rawObj = function(obj) {
	var p, r;
	if (obj && obj.raw) {
		return obj.raw();
	}
	else {
		if (obj !== null) {
			return this.rawMap(obj);
		}
	}
	return obj;
};

Serializable.prototype.rawArray = function(obj) {
	var i, raw = [];
	if (!obj) {
		return "raw FAILED";
	}
	for (i = 0; i < obj.length; i++) {
		raw.push(this.rawObj(obj[ i ]));
	}
	return raw;
};

Serializable.prototype.rawMap = function(obj) {
	var p, r = null;
	if (!obj) {
		return "raw FAILED";
	}
	for (p in obj) {
		if (obj.hasOwnProperty(p) && obj[ p ].raw) {
			r = {};
			break;
		}
	}
	if (r) {
		for (p in obj) {
			if (obj.hasOwnProperty(p)) {
				r[ p ] = obj[ p ] && obj[ p ].raw ? obj[ p ].raw() : obj[ p ];
			}
		}
		return r;
	}
	return obj;
};

Serializable.prototype.raw = function() {
	var raw, prop, obj;
	raw = {};
	for (prop in this) {
		if (this.hasOwnProperty(prop)) {
			obj = this[ prop ];
			if (prop.indexOf("$") === 0 || prop.indexOf("$") === 1) {
				continue;
			}
			else if (jQuery.isArray(obj)) {
				raw[ prop ] = this.rawArray(obj);
			}
			else {
				if (!this.rawObj) {
					console.info(this.toString());
				}
				raw[ prop ] = this.rawObj(obj);
			}
		}
	}
    return raw;
};

Serializable.prototype.toJSON = function() {
    return JSON.stringify(this.raw(), null, "  ");
};