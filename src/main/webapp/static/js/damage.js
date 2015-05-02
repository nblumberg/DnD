/**
 * Created by nblumberg on 10/12/14.
 */

(function () {
    "use strict";

    DnD.define(
        "Damage",
        [ "Roll", "out", "jQuery", "Serializable" ],
        function(Roll, out, jQuery, Serializable) {

            function Damage(params, creature) {
                this._init(params, creature);
            }

            Damage.prototype = new Roll({ dieCount: 1, dieSides: 0, extra: 0, crits: false });

            Damage.prototype._init = function(params, creature) {
                this.__log = out.logFn.bind(this, "Damage");
                this.__log("constructor", [ params, creature ? creature.name : "undefined" ]);
                this._history = [];
                params = params || {};
                this.type = params.type || "";
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
                this.crit = obj.crit ? jQuery.extend(true, {}, obj.crit) : null;
                this.needsWeapon = obj.needsWeapon;
                this.weaponMultiplier = obj.weaponMultiplier;
                this.meleeExtra = obj.meleeExtra;
                this.rangedExtra = obj.rangedExtra;
            };


            Damage.prototype.ATTRIBUTE_REG_EXP = /^(STR|DEX|CON|INT|WIS|CHA)$/;
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
                this.__log("_parseDamageString", [ str, creature ? creature.name : "undefined" ]);
                Roll.prototype._parseString.call(this, str, creature);
            };

            Damage.prototype._parseOperand = function(operand, creature) {
                if (operand.indexOf("[W]") !== -1) {
                    this.needsWeapon = true;
                    this.weaponMultiplier = window.parseInt(operand.split("[W]")[ 0 ], 10);
                    this.dieCount = 0;
                    this.dieSides = 0;
                    return 0;
                }
                else if (this.ATTRIBUTE_REG_EXP.test(operand)) {
                    return creature.abilities[ operand + "mod" ];
                }
                else if (this.WEAPON_ATTRIBUTE_OR_REG_EXP.test(operand)) {
                    this.meleeExtra = creature.abilities.STRmod;
                    this.rangedExtra = creature.abilities.DEXmod;
                    return 0;
                }
                else if (this.WEAPON_ATTRIBUTE_MAX_REG_EXP.test(operand)) {
                    return window.Math.max(creature.abilities[ operand.split("^")[ 0 ] + "mod" ], creature.abilities[ operand.split("^")[ 1 ] + "mod" ]);
                }
                else {
                    return Roll.prototype._parseOperand.call(this, operand);
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

            return Damage;
        },
        true
    );

})();