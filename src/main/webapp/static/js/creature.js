/* global logFn, define, EventDispatcher */
/* exported Defenses, HP, Surges, Implement, Weapon, Abilities, Creature, Actor */
(function() {
    "use strict";

    define({
        name: "Creature",
        dependencyNames: [ "Proxy", "Damage", "Attack", "Effect", "EventDispatcher", "jQuery", "console" ],
        factory: function(Proxy, Damage, Attack, Effect, EventDispatcher, jQuery, console) {

            function Defenses(params) {
                logFn("Defenses", "constructor", arguments);
                params = params || {};
                this.proxyObj = params.proxyObj || {};
                this.proxyObj.ac = params.ac || 10;
                this.proxyObj.fort = params.fort || 10;
                this.proxyObj.ref = params.ref || 10;
                this.proxyObj.will = params.will || 10;
                this.proxyObj.resistances = params.resistances || {};
                if (!params.proxyObj) {
                    if (!params.proxyObj) {
                        this.proxy({ object: this.proxyObj });
                    }
                }

                this.toString = function() { return "[Defenses]"; };
            }

            Defenses.prototype = new Proxy();

            Defenses.prototype.AC = "AC";
            Defenses.prototype.FORT = "Fort";
            Defenses.prototype.REF = "Ref";
            Defenses.prototype.WILL = "Will";


            function HP(params) {
                logFn("HP", "constructor", arguments);
                params = params || {};
                this.proxyObj = params.proxyObj || {};
                this.proxyObj.total = params.total || 1;
                this.proxyObj.current = params.current || this.proxyObj.total;
                this.proxyObj.temp = params.temp || 0;
                this.proxyObj.regneration = params.regeneration || 0;
                if (!params.proxyObj) {
                    this.proxy({ object: this.proxyObj });
                }
                this.toString = function() { return "[HP]"; };
            }

            HP.prototype = new Proxy();

            HP.prototype.isBloodied = function() {
                this.__log("isBloodied", arguments);
                return this.get("current") <= Math.floor(this.get("total") / 2);
            };



            function Surges(params) {
                logFn("Surges", "constructor", arguments);
                params = params || {};
                this.proxyObj = params.proxyObj || {};
                this.proxyObj.perDay = params.perDay || 0;
                this.proxyObj.current = params.current || this.proxyObj.perDay;
                if (!params.proxyObj) {
                    if (!params.proxyObj) {
                        this.proxy({ object: this.proxyObj });
                    }
                }
                this.toString = function() { return "[Surges]"; };
            }

            Surges.prototype = new Proxy();



            function Implement(params) {
                this.__log = logFn.bind(this, "Implement");
                this.__log("constructor", arguments);
                this.init(params);
            }

            Implement.prototype = new Proxy();

            Implement.prototype.init = function(params) {
                if (!params) {
                    return;
                }
                this.__log("init", arguments);
                params = params || {};
                this.proxyObj = params.proxyObj || {};
                this.proxyObj.name = params.name || "Unknown implement";
                this.proxyObj.enhancement = params.enhancement || 0;
                if (!params.proxyObj) {
                    if (!params.proxyObj) {
                        this.proxy({ object: this.proxyObj });
                    }
                }
                this.crit = new Damage(params.crit);
            };

            Implement.prototype.toString = function() {
                this.__log("toString", arguments);
                return "[Implement \"" + this.name + "\"]";
            };



            function Weapon(params) {
                this.__log = logFn.bind(this, "Weapon");
                this.init(params);
            }

            Weapon.prototype = new Implement();

            Weapon.prototype.init = function(params) {
                if (!params) {
                    return;
                }
                this.__log("init", arguments);
                params = params || {};
                this.proxyObj = params.proxyObj || {};
                this.proxyObj.name = params.name || "Unknown weapon";
                this.proficiency = params.proficiency || 0;
                this.proxyObj.isMelee = params.isMelee || false;
                if (!params.proxyObj) {
                    this.proxy({ object: this.proxyObj });
                }
                Implement.prototype.init.call(this, { proxyObj: this.proxyObj, name: this.proxyObj.name, enhancement: params.enhancement, isMelee: params.isMelee, crit: params.crit });
                this.damage = new Damage(params.damage);
            };

            Weapon.prototype.toString = function() {
                this.__log("toString", arguments);
                return "[Weapon \"" + this.name + "\"]";
            };



            function Abilities(params) {
                var i, ability, abilities;
                logFn("Abiltiies", "constructor", arguments);
                abilities = [ "STR", "DEX", "CON", "INT", "WIS", "CHA" ];
                params = params || {};
                this.proxyObj = params.proxyObj || {};
                this.proxyObj.name = params.name || "Unknown implement";
                this.proxyObj.enhancement = params.enhancement || 0;
                if (!params.proxyObj) {
                    this.proxy({ object: this.proxyObj });
                }

                params = params || {};
                for (i = 0; i < abilities.length; i++) {
                    ability = abilities[ i ];
                    this[ ability ] = params[ ability ] || 10;
                    this[ ability + "mod" ] = Math.floor((this[ ability ] - 10) / 2);
                }
                this.toString = function() { return "[Abilities]"; };
            }

            Abilities.prototype = new Proxy();

            Abilities.prototype.STR = "STR";
            Abilities.prototype.DEX = "DEX";
            Abilities.prototype.CON = "CON";
            Abilities.prototype.INT = "INT";
            Abilities.prototype.WIS = "WIS";
            Abilities.prototype.CHA = "CHA";
            Abilities.prototype.ALL = [
                Abilities.prototype.STR,
                Abilities.prototype.DEX,
                Abilities.prototype.CON,
                Abilities.prototype.INT,
                Abilities.prototype.WIS,
                Abilities.prototype.CHA
            ];



            function Creature(params) {
                this.__log = logFn.bind(this, "Creature");
                this.__log("constructor", params ? params.name : undefined);

                // Other properties
                this.init(params);
            }

            Creature.prototype = new EventDispatcher();

            Creature.id = (new Date()).getTime();
            Creature.creatures = {};
            Creature.findCreature = function(id, returnIdIfNotFound) { // TODO: throw if not found?
                if (Creature.creatures.hasOwnProperty(id)) {
                    return Creature.creatures[ id ];
                }
                return returnIdIfNotFound ? id : null;
            };

            Creature.prototype.init = function(params) {
                var i;
                if (!params) {
                    return;
                }

                this.__log("init", arguments);

                params = params || {};
                this.proxyObj = params.proxyObj || {};

                // Basic properties
                this.proxyObj.id = params.id || Creature.id++;
                this.proxyObj.name = params.name || "Unknown creature";

                // Store in singleton
                if (!Creature.creatures) {
                    Creature.creatures = {};
                }
                if (params && params.name) {
                    if (Creature.creatures.hasOwnProperty(this.proxyObj.name)) {
                        console.debug("Replacing Creature.creatures[ " + this.proxyObj.name + " ]");
                    }
                    Creature.creatures[ this.proxyObj.name ] = this;
                }

                this.proxyObj.image = params.image;
                this.proxyObj.isPC = params.isPC || false;
                this.proxyObj.level = params.level || false;
                this.immunities = params.immunities || [];
                this.proxyObj.resistances = params.resistances || {};
                this.proxyObj.vulnerabilities = params.vulnerabilities || {};
                this.proxyObj.insubstantial = params.insubstantial || false;
                this.proxyObj.attackBonuses = params.attackBonuses || [];
                this.proxyObj.init = params.init || 0;
                this.proxyObj.ap = params.ap || (this.isPC ? 1 : 0);
                this.proxyObj.move = params.move || 6;
                if (!params.proxyObj) {
                    this.proxy({
                        object: this.proxyObj,
                        listeners: [ function(obj, property, oldValue, newValue) {

                        } ]
                    });
                }

                this.abilities = new Abilities(params.abilities);
                this.abilities.addListener(this._complexPropertyChanged.bind(this, "abilities."));
                this.hp = new HP(params.hp);
                this.hp.addListener(this._complexPropertyChanged.bind(this, "hp."));
                this.surges = new Surges(params.surges);
                this.surges.addListener(this._complexPropertyChanged.bind(this, "surges."));
                this.defenses = new Defenses(params.defenses);
                this.defenses.addListener(this._complexPropertyChanged.bind(this, "defenses."));

                /* jshint sub:false */
                this[ "implements" ] = [];
                for (i = 0; params[ "implements" ] && i < params[ "implements" ].length; i++) {
                    this[ "implements" ].push(new Implement(params[ "implements" ][ i ]));
                }
                this.weapons = [];
                for (i = 0; params.weapons && i < params.weapons.length; i++) {
                    this.weapons.push(new Weapon(params.weapons[ i ]));
                }
                this.attacks = [];
                for (i = 0; params.attacks && i < params.attacks.length; i++) {
                    this.attacks.push(new Attack(params.attacks[ i ], this));
                }
                this.effects = [];
                for (i = 0; params.effects && i < params.effects.length; i++) {
                    this.effects.push(new Effect(jQuery.extend({}, params.effects[ i ], { target: this })));
                }
                this.imposedEffects = [];
            };

            Creature.prototype._complexPropertyChanged = function(prefix, obj, property, oldValue, newValue) {
                this.dispatchEvent({ type: "changed", property: prefix + property, oldValue: oldValue, newValue: newValue, obj: obj });
            };

            Creature.prototype.isBloodied = function() {
                return this.hp.isBloodied();
            };

            Creature.prototype.getCondition = function(condition) {
                var i;
                this.__log("getCondition", arguments);
                condition = condition ? condition.toLowerCase() : "";
                for (i = 0; condition && i < this.effects.length; i++) {
                    if (this.effects[ i ].name.toLowerCase() === condition) {
                        return this.effects[ i ];
                    }
                }
                return null;
            };

            Creature.prototype.hasCondition = function(condition) {
                this.__log("hasCondition", arguments);
                return this.getCondition(condition) !== null;
            };

            Creature.prototype.grantsCombatAdvantage = function(isMelee) {
                var i;
                this.__log("grantsCombatAdvantage", arguments);
                for (i = 0; i < this.effects.length; i++) {
                    if (this.effects[ i ].grantsCombatAdvantage(isMelee)) {
                        return true;
                    }
                }
                return false;
            };

            Creature.prototype.defenseModifier = function(defense, isMelee) {
                var bonus, penalty, i, value;
                this.__log("defenseModifier", arguments);
                bonus = penalty = 0;
                for (i = 0; i < this.effects.length; i++) {
                    value = this.effects[ i ].defenseModifier(defense, isMelee);
                    if (value > bonus) {
                        bonus = value;
                    }
                    else if (value < penalty) {
                        penalty = value;
                    }
                }
                return bonus + penalty;
            };

            Creature.prototype._attackBonuses = function(attack, item, target, combatAdvantage) {
                /* jshint unused:false */
                var i, j, attackBonuses, attackBonus, isMatch;
                this.__log("_attackBonuses", arguments);

                attackBonuses = [];

                if (this.attackBonuses) {
                    for (i = 0; i < this.attackBonuses.length; i++) {
                        attackBonus = this.attackBonuses[ i ];
                        isMatch = true;
                        // Attack matches defense
                        if (attackBonus.defense && attackBonus.defense.toLowerCase() !== attack.defense.toLowerCase()) {
                            isMatch = false;
                        }
                        if (!isMatch) {
                            continue;
                        }
                        // Attack matches keywords
                        if (attackBonus.keywords && attackBonus.keywords.length) {
                            if (attack.keywords && attack.keywords.length >= attackBonus.keywords.length) {
                                for (j = 0; j < attackBonus.keywords; j++) {
                                    if (attack.keywords.indexOf(attackBonus.keywords[ j ]) === -1) {
                                        isMatch = false;
                                        break;
                                    }
                                }
                            }
                            else {
                                isMatch = false;
                            }
                        }
                        if (!isMatch) {
                            continue;
                        }
                        // Attack matches attacker status
                        if (attackBonus.status) {
                            if (attackBonus.status.indexOf("bloodied") !== -1 && !this.isBloodied()) {
                                isMatch = false;
                            }
                        }
                        if (!isMatch) {
                            continue;
                        }
                        // Attack matches target status
                        if (attackBonus.foeStatus) {
                            if (attackBonus.foeStatus.indexOf("combat advantage") !== -1 && !combatAdvantage) {
                                isMatch = false;
                            }
                            if (attackBonus.foeStatus.indexOf("bloodied") !== -1 && (!target || !target.isBloodied())) {
                                isMatch = false;
                            }
                        }
                        if (!isMatch) {
                            continue;
                        }
                        attackBonuses.push(attackBonus);
                    }
                }

                return attackBonuses;
            };

            Creature.prototype.toString = function() {
                this.__log("toString", arguments);
                return "[Creature \"" + this.get("name") + "\"]";
            };


            Creature.Defenses = Defenses;
            Creature.HP = HP;
            Creature.Surges = Surges;
            Creature.Implement = Implement;
            Creature.Weapon = Weapon;
            Creature.Abilities = Abilities;

            return Creature;
        },
        includeInNamespace: true,
        namespace: "DnD"
    });

})();
