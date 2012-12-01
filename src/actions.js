var Roll = function(params) {
    this._history = [];
    this.dieCount = 0;
    this.dieSides = 0;
    this.extra = 0;
	if (typeof(params) === "string") {
	    this._parse(params);
	}
	else if (params) {
	    this.dieCount = params.dieCount;
	    this.dieSides = params.dieSides;
	    this.extra = params.extra;
	}
};

Roll.prototype = new Serializable();

Roll.prototype._parse = function(str) {
    var hasDice, extraRegExp, hasExtra, dRegExp;
    extraRegExp = /[+-]/;
    hasDice = str.indexOf("d") !== -1;
    hasExtra = !hasDice && str.length || extraRegExp.test(str); 
    dRegExp = /^\d+/;
    if (hasDice) {
        this.dieCount = parseInt(str.split("d")[ 0 ]);
        str = str.split("d")[ 1 ];
        this.dieSides = parseInt(hasExtra ? dRegExp.exec(str) : str);
        str = str.substr(("" + this.dieSides).length);
    }
    if (hasExtra) {
        this.extra = parseInt(str);
    }
};

Roll.prototype.roll = function() {
	var value, h, i, die;
	value = 0;
	h = { dice: [] };
	this._history.push(h);
	for (i = 0; i < this.dieCount; i++) {
		die = Math.ceil(Math.random() * this.dieSides);
		h.dice.push(die);
		value += die;
	}
	h.total = value + this.extra;
	return h.total;
};

Roll.prototype._getLastRoll = function() {
	return this._history[ this._history.length - 1 ];
};

Roll.prototype.isCritical = function() {
	var h = this._getLastRoll();
	return h.dice[0] === 20;
};

Roll.prototype.isFumble = function() {
	var h = this._getLastRoll();
	return h.dice[0] === 1;
};

Roll.prototype.breakdown = function() {
	var h, value, output, i;
	h = this._getLastRoll();
	output = "";
	for (i = 0; i < h.dice.length; i++) {
		output += (output ? " + " : "") + h.dice[ i ];
	}
	if (this.extra) {
		output += (output ? " + " : "") + this.extra;
	}
	return output;
};

Roll.prototype.anchor = function(type) {
	return "<a href=\"javascript:void(0);\" title=\"" + this.breakdown() + "\">" + this._history[ this._history.length - 1 ].total + (type ? " " + type : "") + " damage</a>";
};

Roll.prototype.toString = function() {
	return "" + this.dieCount + "d" + this.dieSides + (this.extra ? (this.extra > 0 ? "+" : "-") + this.extra : "");
};

Roll.prototype.raw = function() {
	return this.toString();
};



var Attack = function(params) {
	params = params || {};
	this.name = params.name;
	this.type = params.type;
	this.defense = params.defense;
	this.extra = this.toHit = params.toHit;
	this.damage = new Roll(params.damage);
	this.damageType = params.damageType;
	this.crit = new Roll(params.crit);
};

Attack.prototype = new Roll("1d20");

Attack.prototype.anchor = function() {
	return "<a href=\"javascript:void(0);\" title=\"" + this.breakdown() + " = " + this._getLastRoll().total + " vs. " + this.defense +"\">" + this.name + " attack</a>";
};

Attack.prototype.raw = Serializable.prototype.raw;
