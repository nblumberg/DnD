var Roll = function(params) {
    this._history = [];
    this.dieCount = 0;
    this.dieSides = 0;
    this.extra = 0;
    this.crits = false;
	if (typeof(params) === "string") {
	    this._parseString(params);
	}
	else if (params) {
		this._parseObject(params);
	}
};

Roll.prototype = new Serializable();

Roll.prototype.clone = function(clone) {
    if (!clone) {
        clone = new Roll();
    }
    clone.dieCount = this.dieCount;
    clone.dieSides = this.dieSides;
    clone.extra = this.extra;
    clone.crits = this.crits;
    return clone;
};

Roll.prototype._parseObject = function(obj) {
    this.dieCount = obj.dieCount;
    this.dieSides = obj.dieSides;
    this.extra = obj.extra;
    this.crits = obj.crits;
};

Roll.prototype._parseString = function(str) {
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

Roll.prototype.max = function() {
    var value, h, i, die;
    value = 0;
    h = { dice: [] };
    this._history.push(h);
    for (i = 0; i < this.dieCount; i++) {
        die = this.dieSides;
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
    if (this.crits && (this.isCritical() || this.isFumble())) {
        output += this.isCritical() ? "CRIT" : "FUMBLE";
    }
    else {
    	for (i = 0; i < h.dice.length; i++) {
    		output += (output ? " + " : "");
            output += h.dice[ i ];
    	}
    }
	if (this.extra && !(this.crits && (this.isCritical() || this.isFumble()))) {
		output += (output ? " + " : "") + this.extra;
	}
	if (h.breakdown) {
	    output += h.breakdown;
	}
	if (conditional) {
	    output += conditional;
	}
	return "[" + this.toString() + "] " + output;
};

Roll.prototype.anchor = function(type) {
	return "<a href=\"javascript:void(0);\" title=\"" + this.breakdown() + "\">" + this._getLastRoll().total + (type ? " " + type : "") + " damage</a>";
};

Roll.prototype.toString = function() {
	return "" + this.dieCount + "d" + this.dieSides + (this.extra ? (this.extra > 0 ? "+" : "-") + this.extra : "");
};

Roll.prototype.raw = function() {
	return this.toString();
};

Roll.prototype._anchorHtml = function(conditional) {
    return "" + (this._getLastRoll().total + (conditional && conditional.total ? conditional.total : 0)) + (conditional && conditional.text ? conditional.text : "");
};

Roll.prototype.anchor = function(conditional) {
    return "<a href=\"javascript:void(0);\" title=\"" + this.breakdown(conditional && conditional.breakdown ? conditional.breakdown : null) + "\">" + this._anchorHtml(conditional) + "</a>";
};




var Damage = function(params, creature) {
    params = params || {};
    this.type = "";
    this.crit = null;
    this.needsWeapon = false;
    this.weaponMultiplier = 0;
    this.meleeExta = 0;
    this.rangedExta = 0;
    if (typeof(params) === "string") {
        this._parseDamageString(params, creature);
    }
    else {
        if (typeof(params.amount) === "string") {
            this._parseDamageString(params.amount, creature);
        }
        else if (params.amount) {
            this._parseObject(params.amount);
        }
        this.type = params.type || "";
        this.crit = params.crit ? new Damage(params.crit) : null;
    }
};

Damage.prototype = new Roll({ dieCount: 1, dieSides: 0, extra: 0, crits: false });

Damage.prototype.clone = function(clone) {
    if (!clone) {
        clone = new Damage();
    }
    Roll.prototype.clone.call(this, clone);
    clone.type = this.type;
    clone.crit = this.crit.clone();
    clone.needsWeapon = this.needsWeapon;
    clone.weaponMultiplier = this.weaponMultiplier;
    clone.meleeExtra = this.meleeExtra;
    clone.rangedExtra = this.rangedExtra;
    return clone;
};

/**
 * @param str {String} grammar: 
 * # = "(+|-)*\d", 
 * A = "(+|-)(STR|DEX|CON|INT|WIS|CHA)",
 * D = "#d#(#|A)*" 
 */
Damage.prototype._parseDamageString = function(str, creature) {
	var extra, i, value, regeExW_A, regExOr, regExMax;
	if (!str) {
		return;
	}
	this.str = str;
	regeExW_A = /(\[W\]|STR|DEX|CON|INT|WIS|CHA)/;
	if (!regeExW_A.test(str)) {
		this._parseString(str);
		return;
	}
	if (str.indexOf("[W]") !== -1) {
	    this.needsWeapon = true;
	    this.weaponMultiplier = parseInt(str.split("[W]")[ 0 ]);
	    extra = str.split("[W]")[ 1 ];
	}
	else {
	    value = str.split("+")[ 0 ];
	    if (!value) {
	        return;
	    }
	    if (!regeExW_A.test(value)) {
	        this._parseString(value);
	        extra = str.substr(str.indexOf("+") + 1);
	    }
	    else {
	        extra = value;
	    }
	}
    if (!extra) {
        return;
    }
    extra = extra.split("+");
	for (i = 0; extra && i < extra.length; i++) {
	    switch (extra[ i ]) {
            case "": {
                break;
            }
	        case "STR":
	        case "DEX":
	        case "CON":
	        case "INT":
	        case "WIS":
	        case "CHA": {
	            this.extra += creature.abilities[ extra[ i ] + "mod" ];
	            break;
	        }
	        default: {
	            try {
	                value = parseInt(extra[ i ]);
	            }
	            catch (e) {}
	            if (!isNaN(value)) {
	                this.extra += value;
	            }
	            else {
                    regExOr = /^(\w{3}\/\w{3})$/;
                    regExMax = /^(\w{3}\^\w{3})$/;
	                if (regExOr.test(extra[ i ])) {
                        this.meleeExtra = creature.abilities[ "STRmod" ];
                        this.rangedExtra = creature.abilities[ "DEXmod" ];
	                }
	                else if (regExMax.test(extra[ i ])) {
	                    this.extra += Math.max(creature.abilities[ extra[ i ].split("^")[ 0 ] + "mod" ], creature.abilities[ extra[ i ].split("^")[ 1 ] + "mod" ]);
	                }
	            }
	            break;
	        }
	    }
	}
};

Damage.prototype.rollItem = function(item, isCrit) {
    var dice, i, total, h;
    dice = [];
    total = this.extra;
    h = { breakdown: "" };
    if (item && item.damage) {
        h.itemStr = item.damage.toString();
    }
    if (item && this.needsWeapon) {
        if (item.enhancement) {
            h.breakdown += " + " + this.weaponMultiplier + "x[+" + item.enhancement + " weapon]";
        }
        for (i = 0; i < this.weaponMultiplier; i++) {
            total += item.damage[ isCrit ? "max" : "roll" ]() + (item.enhancement ? item.enhancement : 0);
            dice = dice.concat(item.damage._history[ item.damage._history.length - 1 ].dice);
        }
    }
    else {
        total += this[ isCrit ? "max" : "roll" ]() + (item && item.enhancement ? item.enhancement : 0);
    }
    if (isCrit) {
        if (item && item.crit) {
            total += item.crit.roll();
            dice = dice.concat(item.crit._history[ item.crit._history.length - 1 ].dice);
        }
        else if (this.crit) {
            total += this.crit.roll();
            dice = dice.concat(this.crit._history[ this.crit._history.length - 1 ].dice);
        }
    }
    h.total = total;
    h.dice = dice;
    this._history.push(h);
    return total;
};

Damage.prototype.rollCrit = function(item) {
    return this.rollItem(item, true);
};

Damage.prototype.anchor = function(conditional) {
    conditional = conditional || {};
    conditional = jQuery.extend({ text: "" }, conditional);
    conditional.text += (this.type ? " " + this.type : "") + " damage";
    return Roll.prototype.anchor.call(this, conditional);
};

Damage.prototype.toString = function() {
    if (this.str) {
        if (this.str.indexOf("[W]") !== -1 && this._getLastRoll() && this._getLastRoll().itemStr) {
            return this.str.replace("[W]", "[" + this._getLastRoll().itemStr +  "]");
        }
        return this.str;
    }
    return Roll.prototype.toString.call(this);
};





var SavingThrow = function(params) {
    params = params || {};
    this.effect = params.effect;
};

SavingThrow.prototype = new Roll({ dieCount: 1, dieSides: 20, extra: 0, crits: false });

SavingThrow.prototype._anchorHtml = function(conditional) {
    var success = (this._getLastRoll().total + (conditional && conditional.total ? conditional.total : 0)) >= 10;
    return (success ? "Saves" : "Fails to save") + " against " + this.effect.toString();
};

SavingThrow.prototype.anchor = function(conditional) {
    conditional = conditional || {};
    conditional = jQuery.extend({ text: "" }, conditional);
    conditional.text += (this.type ? " " + this.type : "") + " damage";
    return Roll.prototype.anchor.call(this, conditional);
};


var Attack = function(params, creature) {
    var i;
	params = params || {};
	this.name = params.name;
	this.type = params.type;
	this.defense = params.defense;
	this.extra = this.toHit = params.toHit;
	this.damage = new Damage(params.damage, creature);
    this.effects = [];
    for (i = 0; params.effects && i < params.effects.length; i++) {
        this.effects.push(new Effect(params.effects[ i ]));
    }
    this.keywords = [];
    for (i = 0; params.keywords && i < params.keywords.length; i++) {
        this.keywords.push(params.keywords[ i ]);
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
