/**
 * Created by nblumberg on 10/12/14.
 */

(function () {
    "use strict";

    DnD.define(
        "Attack",
        [ "Roll", "Damage", "Effect", "Serializable", "out" ],
        function(Roll, Damage, Effect, Serializable, out) {
            function Attack(params, creature) {
                this._init(params, creature);
            }

            Attack.prototype = new Roll({ dieCount: 1, dieSides: 20, extra: 0, crits: true });

            Attack.prototype._init = function(params, creature) {
                var i;
                Roll.prototype._init.call(this, params);
                this.__log = out.logFn.bind(this, "Attack");
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
                if (typeof params.damage === "object" && params.damage.constructor === Array) {
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
                    this.effects.push(new Effect(jQuery.extend({}, params.effects[ i ], { noId: true, attacker: creature })));
                }
                this.keywords = [];
                for (i = 0; params.keywords && i < params.keywords.length; i++) {
                    this.keywords.push(params.keywords[ i ]);
                }
                if (this.keywords.indexOf("melee") !== -1 && this.keywords.indexOf("ranged") === -1) {
                    this.isMelee = true;
                }
                this.description = params.description || "";
                this.description = this.description.replace(/images\/bullet.gif/g, "../images/bullet.gif");
                this.prepared = params.prepared;

                // TODO: break out into separate Buff class
                this.healing = params.healing;
            };

            Attack.prototype.USAGE_AT_WILL = "At-Will";
            Attack.prototype.USAGE_ENCOUNTER = "Encounter";
            Attack.prototype.USAGE_DAILY = "Daily";
            Attack.prototype.USAGE_RECHARGE = "Recharge";
            Attack.prototype.USAGE_RECHARGE_BLOODIED = "bloodied";

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

            /**
             *
             * @param effects
             * @returns {{mod: number, effects: Array, breakdown: string}}
             */
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
                    h.breakdown = h.breakdown || "";
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

            Attack.prototype.hasKeyword = function(keyword) {
                this.__log("hasKeyword", arguments);
                return this.keywords && this.keywords.indexOf(keyword) !== -1;
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


            return Attack;
        },
        true
    );

})();