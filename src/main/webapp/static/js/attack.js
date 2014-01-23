/* global define, logFn */
/* exported DnD.Attack */
(function() {
    "use strict";

    define({
        name: "Attack",
        dependencyNames: [ "Roll", "Effect", "Damage", "Serializable", "jQuery" ],
        factory: function(Roll, Effect, Damage, Serializable, jQuery) {
            function Attack(params, creature) {
                this.__log = logFn.bind(this, "Attack");
                this.init(params, creature);
            }

            Attack.prototype = new Roll();

            Attack.prototype.USAGE_AT_WILL = "At-Will";
            Attack.prototype.USAGE_ENCOUNTER = "Encounter";
            Attack.prototype.USAGE_DAILY = "Daily";
            Attack.prototype.USAGE_RECHARGE = "Recharge";
            Attack.prototype.USAGES = [
                Attack.prototype.USAGE_AT_WILL,
                Attack.prototype.USAGE_ENCOUNTER,
                Attack.prototype.USAGE_DAILY,
                Attack.prototype.USAGE_RECHARGE
            ];

            Attack.prototype.init = function(params, creature) {
                var i;
                if (!params) {
                    return;
                }
                params = params || {};
                this.proxyObj = params.proxyObj || {};
                this.proxyObj.name = params.name || "";
                this.proxyObj.type = params.type || ""; // TODO: what is attack "type"?
                this.proxyObj.usage = {
                    frequency: (params.usage ? params.usage.frequency : null) || Attack.prototype.USAGE_AT_WILL,
                    recharge: (params.usage ? params.usage.recharge : null) || -1
                };
                this.proxyObj.used = params.used || false;
                if (params.defense) {
                    this.proxyObj.defense = params.defense;
                }
                else if (creature) {
                    this.proxyObj.defense = creature.defenses.AC;
                }
                else {
                    this.proxyObj.defense = "AC";
                }
                this.proxyObj.toHit = params.toHit || 0;
                if (typeof(this.proxyObj.toHit) === "string") {
                    // If it's not a straight up numeric value
                    this._toHitFromString(this.proxyObj.toHit, creature);
                }
                else {
                    this.extra = this.proxyObj.toHit;
                }
                this.proxyObj.halfDamage = params.halfDamage || false;

                if (!params.proxyObj) {
                    this.proxy({ object: this.proxyObj });
                }
                Roll.prototype.init.call(this, { proxyObj: this.proxyObj, dieCount: 1, dieSides: 20, extra: this.extra, crits: true });

                this.__log = logFn.bind(this, "Attack");
                this.__log("constructor", [ params.name, creature ? creature.name : "undefined" ]);

                if (params.damage && typeof(params.damage) === "object" && params.damage.constructor === Array) {
                    this.damage = [];
                    for (i = 0; i < params.damage.length; i++) {
                        this.damage.push(new Damage(params.damage[ i ], creature));
                    }
                }
                else {
                    this.damage = new Damage(params.damage, creature);
                }

                if (params.miss) {
                    this.miss = new Attack(params.miss, creature);
                    if (params.miss.halfDamage) {
                        if (this.damage && typeof(this.damage) === "object" && this.damage.constructor === Array) {
                            this.miss.damage = [];
                            for (i = 0; i < this.damage.length; i++) {
                                this.miss.damage.push(new Damage(this.damage[ i ].raw(), creature));
                                this.miss.damage[ i ].set("rollMultiplier", 0.5);
                            }
                        }
                        else {
                            this.miss.damage = new Damage(this.damage.raw(), creature);
                            this.miss.damage.set("rollMultiplier", 0.5);
                        }
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
            };

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
            };

            Attack.prototype.toHitModifiers = function(effects) {
                var result, i, toHit;
                this.__log("toHitModifiers", arguments);
                result = { mod: 0, effects: [], breakdown: "" };
                for (i = 0; i < effects.length; i++) {
                    toHit = effects[ i ].toHitModifier();
                    if (toHit) {
                        result.mod += toHit;
                        result.effects.push(effects[ i ].name);
                    }
                }
                result.text = result.effects.join(" + ");
                return result;
            };

            Attack.prototype.rollItem = function(item) {
                var h, total, enhancement;
                this.__log("rollItem", arguments);
                total = Roll.prototype.roll.call(this);
                enhancement = item ? item.get("enhancement") : 0;
                if (enhancement) {
                    h = this.getLastRoll();
                    h.breakdown = " [+" + enhancement + " weapon]";
                    h.total += enhancement;
                    total += enhancement;
                }
                return total;
            };

            Attack.prototype._anchorHtml = function() {
                this.__log("_anchorHtml", arguments);
                return this.get("name") + " attack";
            };

            Attack.prototype.anchor = function(conditional) {
                this.__log("anchor", arguments);
                conditional = conditional || {};
                conditional = jQuery.extend({ breakdown: "", text: "" }, conditional);
                conditional.breakdown += this.isCritical() || this.isFumble() ? "" : " = " + this.getLastRoll().total + " vs. " + this.get("defense");
                return Roll.prototype.anchor.call(this, conditional);
            };

            Attack.prototype._breakdownToString = function() {
                var toHit;
                this.__log("_breakdownToString", arguments);
                toHit = this.get("toHit");
                if (typeof(toHit) === "string" && toHit.toLowerCase() === "automatic") {
                    return "automatic hit";
                }
                return Roll.prototype.toString.call(this);
            };

            Attack.prototype.toString = function() {
                this.__log("toString", arguments);
                return "[Attack \"" + this.get("name") + "\"]";
            };

            Attack.prototype.raw = Serializable.prototype.raw;


            return Attack;
        },
        includeInNamespace: true,
        namespace: "DnD"
    });


})();