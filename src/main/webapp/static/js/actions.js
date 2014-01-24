var DnD, Serializable, Roll, Recharge, SavingThrow, Damage, Attack, logFn;

(function() {
    "use strict";

    Roll = function(params) {
        this.__log = logFn.bind(this, "Roll");
        this.__log("constructor", arguments);
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
        this.__log("clone", arguments);
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
        this.__log("_parseObject", arguments);
        this.dieCount = obj.dieCount;
        this.dieSides = obj.dieSides;
        this.extra = obj.extra;
        this.crits = obj.crits;
    };

    Roll.prototype.EXTRA_REG_EXP = /[+-]/;
    Roll.prototype.DICE_REG_EXP = /^\d+/;

    Roll.prototype._parseString = function(str) {
        var hasDice, hasExtra;
        this.__log("_parseString", arguments);
        hasDice = str.indexOf("d") !== -1;
        hasExtra = !hasDice && str.length || this.EXTRA_REG_EXP.test(str);
        if (hasDice) {
            this.dieCount = parseInt(str.split("d")[ 0 ], 10);
            str = str.split("d")[ 1 ];
            this.dieSides = parseInt(hasExtra ? this.DICE_REG_EXP.exec(str) : str, 10);
            str = str.substr(("" + this.dieSides).length);
        }
        else {
            this.dieCount = 0;
            this.dieSides = 0;
        }
        if (hasExtra) {
            this.extra = parseInt(str, 10);
        }
    };

    Roll.prototype.roll = function() {
        var value, h, i, die;
        this.__log("roll", arguments);
        value = 0;
        h = { dice: [] };
        this._history.push(h);
        for (i = 0; i < this.dieCount; i++) {
            die = Math.ceil(Math.random() * this.dieSides);
            h.dice.push(die);
            value += die;
        }
        h.total = value + (this.extra || 0);
        return h.total;
    };

    Roll.prototype.max = function() {
        var value, h, i, die;
        this.__log("max", arguments);
        value = 0;
        h = { dice: [] };
        this._history.push(h);
        for (i = 0; i < this.dieCount; i++) {
            die = this.dieSides;
            h.dice.push(die);
            value += die;
        }
        h.isMax = true;
        h.total = value + (this.extra || 0);
        return h.total;
    };

    Roll.prototype.min = function() {
        var value, h, i, die;
        this.__log("min", arguments);
        value = 0;
        h = { dice: [] };
        this._history.push(h);
        for (i = 0; i < this.dieCount; i++) {
            die = 1;
            h.dice.push(die);
            value += die;
        }
        h.isMin = true;
        h.total = value + (this.extra || 0);
        return h.total;
    };

    Roll.prototype.add = function(total) {
        var value, remainder, h, dice, i, die;
        this.__log("add", arguments);
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
        this.__log("getLastRoll", arguments);
        return this._history && this._history.length ? this._history[ this._history.length - 1 ] : { dice: [], total: 0 };
    };

    Roll.prototype.isCritical = function() {
        var h;
        this.__log("isCritical", arguments);
        if (!this.crits || this.dieCount !== 1 || this.dieSides !== 20) {
            return false;
        }
        h = this.getLastRoll();
        return h && h.dice && h.dice.length ? h.dice[0] === 20 : false;
    };

    Roll.prototype.isFumble = function() {
        var h;
        this.__log("isFumble", arguments);
        if (!this.crits || this.dieCount !== 1 || this.dieSides !== 20) {
            return false;
        }
        h = this.getLastRoll();
        return h && h.dice && h.dice.length ? h.dice[0] === 1 : false;
    };

    Roll.prototype.breakdown = function(conditional) {
        var h, value, output, i;
        this.__log("breakdown", arguments);
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
        if ((this.extra || !output) && !(this.crits && (this.isCritical() || this.isFumble()))) {
            if (output) {
                output += this.extra >= 0 ? " + " : " ";
            }
            output += this.extra;
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
        this.__log("_breakdownToString", arguments);
        return this.toString();
    };

    Roll.prototype.toString = function() {
        var d, operand;
        this.__log("toString", arguments);
        d = this.dieCount * this.dieSides ? this.dieCount + "d" + this.dieSides : "";
        operand = this.extra >= 0 ? "+" : "";
        return d + (d && this.extra ? operand : "") + (this.extra || !d ? this.extra : "");
    };

    Roll.prototype._anchorHtml = function(conditional) {
        var h;
        this.__log("_anchorHtml", arguments);
        h = this.getLastRoll();
        return "" + ((h && h.total ? h.total : 0) + (conditional && conditional.total ? conditional.total : 0)) + (conditional && conditional.text ? conditional.text : "");
    };

    Roll.prototype.anchor = function(conditional) {
        this.__log("anchor", arguments);
        return "<a href=\"javascript:void(0);\" title=\"" + this.breakdown(conditional && conditional.breakdown ? conditional.breakdown : null) + "\">" + this._anchorHtml(conditional) + "</a>";
    };


    Recharge = function(params) {
        this.__log = logFn.bind(this, "Recharge");
        this.__log("constructor", arguments);
        this.attack = params.attack;
    };

    Recharge.prototype = new Roll({ dieCount: 1, dieSides: 6, extra: 0, crits: false });

    Recharge.prototype.isRecharged = function() {
        var h;
        this.__log("isRecharged", arguments);
        h = this.getLastRoll();
        return h.total <= this.attack.usage.recharge;
    };

    Recharge.prototype._anchorHtml = function(conditional) {
        this.__log("_anchorHtml", arguments);
        return (this.isRecharged() ? "Recharged " : "Failed to recharge ") + this.attack.name + (conditional && conditional.text ? conditional.text : "");
    };

    Recharge.prototype.anchor = function(conditional) {
        var h;
        this.__log("anchor", arguments);
        h = this.getLastRoll();
        h.breakdown = " &lt;= " + this.attack.usage.recharge;
        return Roll.prototype.anchor.call(this, conditional);
    };

    Recharge.prototype.toString = function() {
        this.__log("toString", arguments);
        return "Recharge";
    };


    SavingThrow = function(params) {
        this.__log = logFn.bind("SavingThrow");
        this.__log("constructor", arguments);
        params = params || {};
        this.effect = params.effect;
    };

    SavingThrow.prototype = new Roll({ dieCount: 1, dieSides: 20, extra: 0, crits: false });

    SavingThrow.prototype._anchorHtml = function(conditional) {
        var success;
        this.__log("_anchorHtml", arguments);
        success = (this.getLastRoll().total + (conditional && conditional.total ? conditional.total : 0)) >= 10;
        return (success ? "Saves" : "Fails to save") + " against " + this.effect.toString();
    };

    SavingThrow.prototype.toString = function() {
        this.__log("toString", arguments);
        return "Saving Throw";
    };


    Damage = function(params, creature) {
        this.__log = logFn.bind(this, "Damage");
        this.__log("constructor", [ params, creature ? creature.name : "undefined" ]);
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
        else if (params.hasOwnProperty("amount")) {
            if (typeof(params.amount) === "string") {
                this._parseDamageString(params.amount, creature);
            }
            else {
                this._parseObject(params.amount, creature);
            }
        }
        else if (Object.keys(params).length) {
            this._parseObject(params, creature);
        }
    };

    Damage.prototype = new Roll({ dieCount: 1, dieSides: 0, extra: 0, crits: false });

    Damage.prototype.clone = function(clone) {
        this.__log("clone", arguments);
        if (!clone) {
            clone = new Damage();
        }
        Roll.prototype.clone.call(this, clone);
        clone.type = this.type;
        clone.crit = this.crit ? this.crit.clone() : null;
        clone.needsWeapon = this.needsWeapon;
        clone.weaponMultiplier = this.weaponMultiplier;
        clone.meleeExtra = this.meleeExtra;
        clone.rangedExtra = this.rangedExtra;
        return clone;
    };

    Damage.prototype._parseObject = function(obj, creature) {
        this.__log("_parseObject", [ obj, creature ? creature.name : "undefined" ]);
        Roll.prototype._parseObject.call(this, obj);
        this.type = obj.type;
        this.crit = obj.crit ? obj.crit.clone() : null;
        this.needsWeapon = obj.needsWeapon;
        this.weaponMultiplier = obj.weaponMultiplier;
        this.meleeExtra = obj.meleeExtra;
        this.rangedExtra = obj.rangedExtra;
    };


    Damage.prototype.WEAPON_ATTRIBUTE_REG_EXP = /(\[W\]|STR|DEX|CON|INT|WIS|CHA)/;
    Damage.prototype.WEAPON_ATTRIBUTE_OR_REG_EXP = /^(\w{3}\/\w{3})$/;
    Damage.prototype.WEAPON_ATTRIBUTE_MAX_REG_EXP = /^(\w{3}\^\w{3})$/;


    /**
     * @param str {String} grammar: E|D|W
     * # = "(+|-)*\d",
     * A = "(+|-|^|/)(STR|DEX|CON|INT|WIS|CHA)",
     * E = (#|A)*
     * D = "#d#E*"
     * W = "#\[W\]E*"
     */
    Damage.prototype._parseDamageString = function(str, creature) {
        var extra, i, value;
        this.__log("_parseDamageString", [ str, creature ? creature.name : "undefined" ]);
        this.extra = 0;
        if (!str) {
            return;
        }
        this.str = str;
        if (!this.WEAPON_ATTRIBUTE_REG_EXP.test(str)) {
            this._parseString(str);
            return;
        }
        if (str.indexOf("[W]") !== -1) {
            this.needsWeapon = true;
            this.weaponMultiplier = parseInt(str.split("[W]")[ 0 ], 10);
            extra = str.split("[W]")[ 1 ];
            this.dieCount = 0;
            this.dieSides = 0;
        }
        else {
            value = str.split("+")[ 0 ];
            if (!value) {
                return;
            }
            if (!this.WEAPON_ATTRIBUTE_REG_EXP.test(value)) {
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
                }
                break;
            case "STR":
            case "DEX":
            case "CON":
            case "INT":
            case "WIS":
            case "CHA": {
                    this.extra += creature.abilities[ extra[ i ] + "mod" ];
                }
                break;
            default: {
                    value = null;
                    try {
                        value = parseInt(extra[ i ], 10);
                    }
                    catch (e) {}
                    if (!isNaN(value)) {
                        this.extra += value;
                    }
                    else {
                        if (this.WEAPON_ATTRIBUTE_OR_REG_EXP.test(extra[ i ])) {
                            this.meleeExtra = creature.abilities.STRmod;
                            this.rangedExtra = creature.abilities.DEXmod;
                        }
                        else if (this.WEAPON_ATTRIBUTE_MAX_REG_EXP.test(extra[ i ])) {
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
        this.__log("rollItem", arguments);
        dice = [];
        total = 0;
        h = { breakdown: "" };
        if (item && item.damage) {
            h.itemStr = item.damage.toString();
        }
        if (item && this.needsWeapon) {
            if (item.enhancement) {
                h.breakdown += (this.weaponMultiplier > 1 ? " + " + this.weaponMultiplier + "x" : " ") + "[+" + item.enhancement + " weapon]";
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
//                dice = dice.concat(item.damage.crit._history[ item.damage.crit._history.length - 1 ].dice);
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
//                dice = dice.concat(this.crit._history[ this.crit._history.length - 1 ].dice);
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
        this.__log("rollCrit", arguments);
        return this.rollItem(item, true);
    };

    Damage.prototype.addItem = function(total, item, isCrit) {
        this.__log("addItem", arguments);
        return this.rollItem(item, isCrit, total);
    };

    Damage.prototype._breakdownToString = function() {
        var str;
        this.__log("_breakdownToString", arguments);
        str = Roll.prototype._breakdownToString.call(this);
        if (this.rollMultiplier && this.rollMultiplier !== 1) {
            str += " * " + this.rollMultiplier;
        }
        return str;
    };

    Damage.prototype.anchor = function(conditional) {
        this.__log("anchor", arguments);
        conditional = conditional || {};
        conditional = jQuery.extend({ text: "" }, conditional);
        conditional.text += (this.type ? " " + this.type : "") + " damage";
        return Roll.prototype.anchor.call(this, conditional);
    };

    Damage.prototype.raw = function() {
        var tmp, raw;
        this.__log("raw [" + this.toString() + "]", arguments);
        tmp = this._history;
        this._history = [];
        raw = Serializable.prototype.raw.call(this);
        raw.amount = Roll.prototype.raw.call(this);
        this._history = tmp;
        return raw;
    };

    Damage.prototype.toString = function() {
        var str, lastRoll, critStr;
        this.__log("toString", arguments);
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
        else if (this.needsWeapon) {
            return "" + this.weaponMultiplier + "[W]" + (this.extra ? " + " + this.extra : "");
        }
        return Roll.prototype.toString.call(this);
    };


    Attack = function(params, creature) {
        var i;
        this.__log = logFn.bind(this, "Attack");
        this.__log("constructor", [ params.name, creature ? creature.name : "undefined" ]);
        params = params || {};
        this.name = params.name;
        this.type = params.type;
        this.usage = {
            frequency: params.usage ? params.usage.frequency : null,
            recharge: params.usage ? params.usage.recharge : -1
        };
        this.used = params.used || false;
        this.defense = params.defense;
        this.toHit = params.toHit;
        this.meleeExtra = 0;
        this.rangedExtra = 0;
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
            this.effects.push(new DnD.Effect(jQuery.extend({}, params.effects[ i ], { noId: true, attacker: creature })));
        }
        this.keywords = [];
        for (i = 0; params.keywords && i < params.keywords.length; i++) {
            this.keywords.push(params.keywords[ i ]);
        }
    };

    Attack.prototype = new Roll({ dieCount: 1, dieSides: 20, extra: 0, crits: true });

    Attack.prototype.USAGE_AT_WILL = "At-Will";
    Attack.prototype.USAGE_ENCOUNTER = "Encounter";
    Attack.prototype.USAGE_DAILY = "Daily";
    Attack.prototype.USAGE_RECHARGE = "Recharge";

    Attack.prototype._toHitFromString = function(str, creature) {
        var i, abilities, mods;
        this.__log("_toHitFromString", [ str, creature ? creature.name : "undefined" ]);

        if (str.toLowerCase() === "automatic") {
            this.extra = 99;
            return;
        }

        this.extra = Math.floor(creature.level / 2);
        i = str.search(/[+\-]/);
        if (i !== -1) {
            this.extra = parseInt(str.substring(i + 1), 10);
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
        else if (str.indexOf("STR/DEX") !== -1) {
            this.meleeExtra = creature.abilities.STRmod;
            this.rangedExtra = creature.abilities.DEXmod;
        }
    };

    Attack.prototype.toHitModifiers = function(effects) {
        var i, result;
        this.__log("toHitModifiers", arguments);
        result = { mod: 0, effects: [], breakdown: "" };
        for (i = 0; i < effects.length; i++) {
            switch (effects[ i ].name.toLowerCase()) {
            case "blinded": {
                    result.mod -= 5;
                    result.effects.push(effects[ i ].name);
                }
                break;
            case "prone":
            case "restrained": {
                    result.mod -= 2;
                    result.effects.push(effects[ i ].name);
                }
                break;
            case "penalty": {
                    if (effects[ i ].type === "attacks") {
                        result.mod -= effects[ i ].amount;
                        result.effects.push(effects[ i ].name + " to " + effects[ i ].type);
                    }
                }
                break;
            }
        }
        result.text = result.effects.join(" + ");
        return result;
    };

    Attack.prototype.rollItem = function(item, forcedTotal, isCrit, isFumble) {
        var total, extra, h;
        this.__log("rollItem", arguments);
        total = 0;
        extra = 0;
        h = { breakdown: "", dice: [] };

        if (item) {
            extra = item.enhancement ? item.enhancement : 0;
            extra += item.proficiency ? item.proficiency : 0;
            extra += this.meleeExtra && item.isMelee ? this.meleeExtra : 0;
            extra += this.rangedExtra && !item.isMelee ? this.rangedExtra : 0;
        }

        if (isCrit) {
            total = Roll.prototype.max.call(this);
        }
        else if (isFumble) {
            total = Roll.prototype.min.call(this);
        }
        else if (forcedTotal) {
            total = h.total = forcedTotal - extra;
            h.dice.push(forcedTotal - extra - this.extra);
            this._history.push(h);
        }
        else {
            total = Roll.prototype.roll.call(this);
        }

        h = this.getLastRoll();
        if (item) {
            if (item.proficiency) {
                h.breakdown += " [+" + item.proficiency + " proficiency]";
            }
            if (item.enhancement) {
                h.breakdown += " [+" + item.enhancement + " weapon]";
            }
            if (this.meleeExtra && item.isMelee) {
                h.breakdown += " [+" + this.meleeExtra + " STR]";
            }
            if (this.rangedExtra && !item.isMelee) {
                h.breakdown += " [+" + this.rangedExtra + " DEX]";
            }
        }
        h.total += extra;
        total += extra;

        h.isCrit = isCrit;
        h.isFumble = isFumble;
        h.manual = forcedTotal > 0;
        if (item) {
            h.item = item;
        }
        return h.total;
    };

    Attack.prototype.addItem = function(item, total, isCrit, isFumble) {
        this.__log("addItem", arguments);
        return this.rollItem(item, total, isCrit, isFumble);
    };

    Attack.prototype._anchorHtml = function() {
        this.__log("_anchorHtml", arguments);
        return this.name + " attack";
    };

    Attack.prototype.anchor = function(conditional) {
        this.__log("anchor", arguments);
        conditional = conditional || {};
        conditional = jQuery.extend({ breakdown: "", text: "" }, conditional);
        conditional.breakdown += this.isCritical() || this.isFumble() ? "" : " = " + this.getLastRoll().total + " vs. " + this.defense;
        return Roll.prototype.anchor.call(this, conditional);
    };

    Attack.prototype._breakdownToString = function() {
        this.__log("_breakdownToString", arguments);
        if (typeof(this.toHit) === "string" && this.toHit.toLowerCase() === "automatic") {
            return "automatic hit";
        }
        return Roll.prototype.toString.call(this);
    };

    Attack.prototype.toString = function() {
        this.__log("toString", arguments);
        return "[Attack \"" + this.name + "\"]";
    };

    Attack.prototype.raw = Serializable.prototype.raw;


    if (!DnD) {
        DnD = {};
    }

    DnD.Roll = Roll;
    DnD.Recharge = Recharge;
    DnD.SavingThrow = SavingThrow;
    DnD.Damage = Damage;
    DnD.Attack = Attack;
})();

