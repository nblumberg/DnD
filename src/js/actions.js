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
    h.isMax = true;
    h.total = value + this.extra;
    return h.total;
};

Roll.prototype.add = function(total) {
    var value, remainder, h, dice, i, die;
    value = Math.floor((total - this.extra) / this.dieCount);
    remainder = (total - this.extra) % this.dieCount;
    dice = [];
    for (i = 0; i < this.dieCount; i++) {
        die = Math.floor(value) + (i === this.dieCount - 1 && remainder ? remainder : 0);
        dice.push(die);
    }
    h = { total: total, dice: dice, manual: true };
    this._history.push(h);
};

Roll.prototype.getLastRoll = function() {
	return this._history && this._history.length ? this._history[ this._history.length - 1 ] : { dice: [], total: 0 };
};

Roll.prototype.isCritical = function() {
	var h = this.getLastRoll();
	return h && h.dice && h.dice.length ? h.dice[0] === 20 : false;
};

Roll.prototype.isFumble = function() {
	var h = this.getLastRoll();
	return h && h.dice && h.dice.length ? h.dice[0] === 1 : false;
};

Roll.prototype.breakdown = function(conditional) {
	var h, value, output, i;
	h = this.getLastRoll();
	output = "";
    if (this.crits && (this.isCritical() || this.isFumble())) {
        output += this.isCritical() ? "CRIT" : "FUMBLE";
    }
    else {
    	for (i = 0; h && h.dice && i < h.dice.length; i++) {
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
	return "[" + this._breakdownToString() + "] " + output;
};

Roll.prototype._breakdownToString = function() {
	return this.toString();
};

Roll.prototype.toString = function() {
	return "" + this.dieCount + "d" + this.dieSides + (this.extra ? (this.extra > 0 ? "+" : "-") + this.extra : "");
};

Roll.prototype.raw = function() {
	return this.toString();
};

Roll.prototype._anchorHtml = function(conditional) {
	var h = this.getLastRoll();
    return "" + ((h && h.total ? h.total : 0) + (conditional && conditional.total ? conditional.total : 0)) + (conditional && conditional.text ? conditional.text : "");
};

Roll.prototype.anchor = function(conditional) {
    return "<a href=\"javascript:void(0);\" title=\"" + this.breakdown(conditional && conditional.breakdown ? conditional.breakdown : null) + "\">" + this._anchorHtml(conditional) + "</a>";
};




var Damage = function(params, creature) {
	this._history = [];
    params = params || {};
    this.type = "";
    this.crit = null;
    this.needsWeapon = false;
    this.weaponMultiplier = 0;
    this.meleeExtra = 0;
    this.rangedExtra = 0;
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

Damage.prototype.rollItem = function(item, isCrit, forcedTotal) {
    var dice, i, total, h, forcedDie, forcedRemainder;
    dice = [];
    total = 0;
    h = { breakdown: "" };
    if (item && item.damage) {
        h.itemStr = item.damage.toString();
    }
    if (item && this.needsWeapon) {
        if (item.enhancement) {
            h.breakdown += " + " + this.weaponMultiplier + "x[+" + item.enhancement + " weapon]";
        }
        if (forcedTotal) {
        	if (!isCrit) {
        		total = forcedTotal - (item.enhancement ? this.weaponMultiplier * item.enhancement : 0) - this.extra;
            	forcedDie = Math.floor(total / this.weaponMultiplier);
            	forcedRemainder = total % this.weaponMultiplier;
        	}
    		total = forcedTotal - this.extra; // cancelled out below
        }
        for (i = 0; i < this.weaponMultiplier; i++) {
        	if (forcedTotal) {
        		if (isCrit) {
        			item.damage.max();
        		}
        		else {
            		item.damage.add(forcedDie + (i === this.weaponMultiplier - 1 ? forcedRemainder : 0));
        		}
        	}
        	else {
                total += item.damage[ isCrit ? "max" : "roll" ]() + (item.enhancement ? item.enhancement : 0);
        	}
            dice = dice.concat(item.damage._history[ item.damage._history.length - 1 ].dice);
        }
        total += this.extra;
    }
    else {
    	if (forcedTotal) {
    		total = forcedTotal;
            this.add(forcedTotal - (item && item.enhancement ? item.enhancement : 0) - this.extra);
    	}
    	else {
            total += this[ isCrit ? "max" : "roll" ]() + (item && item.enhancement ? item.enhancement : 0);
    	}
        h = this._history.pop();
        dice = h.dice;
    }
    if (isCrit) {
        if (item && item.damage && item.damage.crit) {
        	if (forcedTotal) {
        		item.damage.crit.add(forcedTotal - item.damage.getLastRoll().total - (item.enhancement ? this.weaponMultiplier * item.enhancement : 0) - this.extra);
        	}
        	else {
                total += item.damage.crit.roll();
        	}
            h.critStr = item.damage.crit.toString();
        	h.critDice = [].concat(item.damage.crit._history[ item.damage.crit._history.length - 1 ].dice);
//            dice = dice.concat(item.damage.crit._history[ item.damage.crit._history.length - 1 ].dice);
        }
        else if (this.crit) {
        	if (forcedTotal) {
        		this.crit.add(forcedTotal - h.total - (item.enhancement ? item.enhancement : 0));
        	}
        	else {
                total += this.crit.roll();
        	}
            h.critStr = this.crit.toString();
        	h.critDice = [].concat(this.crit._history[ this.crit._history.length - 1 ].dice);
//            dice = dice.concat(this.crit._history[ this.crit._history.length - 1 ].dice);
        }
    }
    h.total = Math.floor(total * (this.rollMultiplier || 1));
    h.dice = dice;
    h.isCrit = isCrit;
    h.manual = forcedTotal > 0;
    if (item) {
        h.item = item;
    }
    this._history.push(h);
    return h.total;
};

Damage.prototype.rollCrit = function(item) {
    return this.rollItem(item, true);
};

Damage.prototype.addItem = function(total, item, isCrit) {
	return this.rollItem(item, isCrit, total);
};

Damage.prototype._breakdownToString = function() {
	var str = Roll.prototype._breakdownToString.call(this);
    if (this.rollMultiplier && this.rollMultiplier != 1) {
    	str += " * " + this.rollMultiplier;
    }
	return str;
};

Damage.prototype.anchor = function(conditional) {
    conditional = conditional || {};
    conditional = jQuery.extend({ text: "" }, conditional);
    conditional.text += (this.type ? " " + this.type : "") + " damage";
    return Roll.prototype.anchor.call(this, conditional);
};

Damage.prototype.raw = function() {
	var tmp, raw;
	tmp = this._history;
	this._history = [];
	raw = Serializable.prototype.raw.call(this);
	raw.amount = Roll.prototype.raw.call(this);
	this._history = tmp;
	return raw;
};

Damage.prototype.toString = function() {
	var str, lastRoll, critStr;
	str = "";
	lastRoll = this.getLastRoll();
	critStr = lastRoll && lastRoll.critStr ? lastRoll.critStr : null;
	critStr = critStr === null && this.crit ? this.crit.toString() : null;
    if (this.str) {
        if (this.str.indexOf("[W]") !== -1 && lastRoll && lastRoll.itemStr) {
            str = this.str.replace("[W]", "[" + lastRoll.itemStr +  "]");
        }
        else {
        	str = this.str;
        }
        if (lastRoll && lastRoll.isCrit && critStr) {
        	if (str.indexOf("+") !== -1) {
        		str = str.replace("+", "+" + critStr + "+");
        	}
        	else {
                str += "+" + critStr;
        	}
        }
        return str;
    }
    return Roll.prototype.toString.call(this);
};





var SavingThrow = function(params) {
    params = params || {};
    this.effect = params.effect;
};

SavingThrow.prototype = new Roll({ dieCount: 1, dieSides: 20, extra: 0, crits: false });

SavingThrow.prototype._anchorHtml = function(conditional) {
    var success = (this.getLastRoll().total + (conditional && conditional.total ? conditional.total : 0)) >= 10;
    return (success ? "Saves" : "Fails to save") + " against " + this.effect.toString();
};

SavingThrow.prototype.anchor = function(conditional) {
    conditional = conditional || {};
    conditional = jQuery.extend({ text: "" }, conditional);
    conditional.text += (this.type ? " " + this.type : "") + " damage";
    return Roll.prototype.anchor.call(this, conditional);
};

SavingThrow.prototype.toString = function() {
    return "[Saving Throw]";
};


var Attack = function(params, creature) {
    var i;
	params = params || {};
	this.name = params.name;
	this.type = params.type;
	this.defense = params.defense;
	this.toHit = params.toHit;
	if (typeof(this.toHit) === "string") {
		// If it's not a straight up numeric value
		this._toHitFromString(this.toHit, creature);
	}
	else {
		this.extra = this.toHit;
	}
	if (Object.prototype.toString.call(params.damage) === "[object Array]") {
		this.damage = [];
		for (i = 0; i < params.damage.length; i++) {
			this.damage.push(new Damage(params.damage[ i ], creature));
		}
	}
	else {
		this.damage = new Damage(params.damage, creature);
	}
	this.halfDamage = params.halfDamage;
	if (params.miss) {
		this.miss = new Attack(params.miss, creature);
		if (params.miss.halfDamage) {
			this.miss.damage = new Damage(this.damage.raw(), creature);
			this.miss.damage.rollMultiplier = 0.5;
		}
	}
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

Attack.prototype._toHitFromString = function(str, creature) {
    var i, abilities, mods;
    
    if (str.toLowerCase() === "automatic") {
    	this.extra = 99;
    	return;
    }
    
	this.extra = Math.floor(creature.level / 2);
	i = str.search(/[+\-]/);
	if (i !== -1) {
		this.extra = parseInt(str.substring(i + 1));
		str = str.substring(0, i);
	}

	if (creature.abilities.hasOwnProperty(str)) {
		// If it's an ability modifier + 1/2 level
		this.extra += creature.abilities[ this.toHit + "mod" ];
	}
	else if (str.indexOf("^") !== -1) {
		// If it's the highest ability modifier from a set
		abilities = str.split("^");
		mods = [];
		for (i = 0; i < abilities.length; i++) {
			mods.push(creature.abilities[ abilities[ i ] + "mod" ]);
		}
		mods.sort();
		this.extra += mods.pop();
	}
};

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

Attack.prototype.rollItem = function(item) {
	var h, total = Roll.prototype.roll.call(this);
	if (item && item.enhancement) {
		h = this.getLastRoll();
		h.breakdown = " + " + item.enhancement + " (enhancement)";
		h.total += item.enhancement;
		total += item.enhancement;
	}
	return total;
};

Attack.prototype._anchorHtml = function() {
    return this.name + " attack";
};

Attack.prototype.anchor = function(conditional) {
    conditional = conditional || {};
    conditional = jQuery.extend({ breakdown: "", text: "" }, conditional);
    conditional.breakdown += this.isCritical() || this.isFumble() ? "" : " = " + this.getLastRoll().total + " vs. " + this.defense;
    return Roll.prototype.anchor.call(this, conditional);
};

Attack.prototype._breakdownToString = function() {
    if (typeof(this.toHit) === "string" && this.toHit.toLowerCase() === "automatic") {
        return "automatic hit";
    }
	return Roll.prototype.toString.call(this);
};

Attack.prototype.toString = function() {
    return "[Attack \"" + this.name + "\"]";
};

Attack.prototype.raw = Serializable.prototype.raw;
