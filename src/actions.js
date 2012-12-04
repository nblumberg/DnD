var Roll = function(params) {
    this._history = [];
    this.dieCount = 0;
    this.dieSides = 0;
    this.extra = 0;
    this.crits = false;
	if (typeof(params) === "string") {
	    this._parse(params);
	}
	else if (params) {
	    this.dieCount = params.dieCount;
	    this.dieSides = params.dieSides;
	    this.extra = params.extra;
	    this.crits = params.crits;
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

Roll.prototype.breakdown = function(conditional) {
	var h, value, output, i;
	h = this._getLastRoll();
	output = "";
	for (i = 0; i < h.dice.length; i++) {
		output += (output ? " + " : "");
		if (this.crits && (this.isCritical() || this.isFumble())) {
	        output += this.isCritical() ? "CRIT" : "FUMBLE";
		}
		else {
	        output += h.dice[ i ];
		}
	}
	if (this.extra && !(this.crits && (this.isCritical() || this.isFumble()))) {
		output += (output ? " + " : "") + this.extra;
	}
	if (conditional) {
	    output += conditional;
	}
	return "[" + this.toString() + "] " + output;
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

Roll.prototype._anchorHtml = function(conditional) {
    return "" + (this._history[ this._history.length - 1 ].total + (conditional && conditional.total ? conditional.total : 0)) + (conditional && conditional.text ? conditional.text : "");
};

Roll.prototype.anchor = function(conditional) {
    return "<a href=\"javascript:void(0);\" title=\"" + this.breakdown(conditional && conditional.breakdown ? conditional.breakdown : null) + "\">" + this._anchorHtml(conditional) + "</a>";
};




var Damage = function(params) {
    params = params || {};
    this.type = "";
    this.crit = null;
    if (typeof(params) === "string") {
        this._parse(params);
    }
    else {
        this.type = params.type || "";
        this.crit = params.crit ? new Damage(params.crit) : null;
    }
};

Damage.prototype = new Roll({ dieCount: 1, dieSides: 6, extra: 0, crits: false });

Damage.prototype.anchor = function(conditional) {
    conditional = conditional || {};
    conditional = jQuery.extend({ text: "" }, conditional);
    conditional.text += (this.type ? " " + this.type : "") + " damage";
    return Roll.prototype.anchor.call(this, conditional);
};


var SavingThrow = function(params) {
    params = params || {};
    this.effect = params.effect;
};

SavingThrow.prototype = new Roll({ dieCount: 1, dieSides: 20, extra: 0, crits: false });

SavingThrow.prototype._anchorHtml = function(conditional) {
    var success = (this._history[ this._history.length - 1 ].total + (conditional && conditional.total ? conditional.total : 0)) >= 10;
    return (success ? "Saves" : "Fails to save") + " against " + this.effect.toString();
};

SavingThrow.prototype.anchor = function(conditional) {
    conditional = conditional || {};
    conditional = jQuery.extend({ text: "" }, conditional);
    conditional.text += (this.type ? " " + this.type : "") + " damage";
    return Roll.prototype.anchor.call(this, conditional);
};


var Attack = function(params) {
    var i;
	params = params || {};
	this.name = params.name;
	this.type = params.type;
	this.defense = params.defense;
	this.extra = this.toHit = params.toHit;
	this.damage = new Damage(params.damage);
	this.damageType = params.damageType;
	this.crit = new Roll(params.crit);
    this.effects = [];
    for (i = 0; params.effects && i < params.effects.length; i++) {
        this.effects.push(new Effect(params.effects[ i ]));
    }
};

Attack.prototype = new Roll({ dieCount: 1, dieSides: 20, extra: 0, crits: true });

Attack.prototype.toHitModifiers = function(effects) {
    var i, result = { mod: 0, effects: [], breakdown: "" };
    for (i = 0; i < effects.length; i++) {
        switch (effects[ i ].name.toLowerCase()) {
            case "blinded": {
                result.mod -= 5;
                result.effects.push(effects[ i ].name);
                break;
            }
            case "prone": 
            case "restrained": {
                result.mod -= 2;
                result.effects.push(effects[ i ].name);
                break;
            }
        }
    }
    result.text = result.effects.join(" + ");
    return result;
};

Attack.prototype._anchorHtml = function() {
    return this.name + " attack";
};

Attack.prototype.anchor = function(conditional) {
    conditional = conditional || {};
    conditional = jQuery.extend({ breakdown: "", text: "" }, conditional);
    conditional.breakdown += this.isCritical() || this.isFumble() ? "" : " = " + this._getLastRoll().total + " vs. " + this.defense;
    return Roll.prototype.anchor.call(this, conditional);
};

Attack.prototype.raw = Serializable.prototype.raw;
