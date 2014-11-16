(function() {
    "use strict";

    DnD.define(
        "Creature",
        [ "out", "EventDispatcher", "Abilities", "Defenses", "HP", "Surges", "Implement", "Weapon", "Attack", "Effect" ],
        function(out, EventDispatcher, Abilities, Defenses, HP, Surges, Implement, Weapon, Attack, Effect) {
            function Creature(params) {
                this.__log = out.logFn.bind(this, "Creature");
                params = params || {};
                this.__log("constructor", params.name);

                // Basic properties
                this.id = params.id || Creature.id++;
                this.name = params.name;

                // Store in singleton
                if (!Creature.creatures) {
                    Creature.creatures = {};
                }
                if (params && params.name) {
                    if (Creature.creatures.hasOwnProperty(this.name)) {
                        out.console.debug("Replacing Creature.creatures[ " + this.name + " ]");
                    }
                    Creature.creatures[ this.name ] = this;
                }

                // Other properties
                this._init(params);
            };

            Creature.prototype = new EventDispatcher();


            // STATIC MEMBERS

            Creature.id = (new Date()).getTime();
            Creature.creatures = {};
            Creature.findCreature = function(id, returnIdIfNotFound) { // TODO: throw if not found?
                if (Creature.creatures.hasOwnProperty(id)) {
                    return Creature.creatures[ id ];
                }
                return returnIdIfNotFound ? id : null;
            };


            // NON-PUBLIC METHODS

            Creature.prototype._init = function(params) {
                var i;
                this.__log("_init", arguments);
                params = params || {};
                this.image = params.image;
                this.isPC = params.isPC || false;
                this.level = params.level || false;
                this.abilities = new Abilities(params.abilities);
                this.hp = new HP(params.hp);
                this.surges = new Surges(params.surges);
                this.defenses = params.defenses || new Defenses();
                this.immunities = params.immunities || [];
                this.resistances = params.resistances || {};
                this.vulnerabilities = params.vulnerabilities || {};
                this.insubstantial = params.insubstantial || false;
                this.attackBonuses = params.attackBonuses || [];
                this.attacks = params.attacks || [];
                this.init = params.init || 0;
                this.ap = params.ap || (this.isPC ? 1 : 0);
                this.effects = [];
                this.imposedEffects = [];
                this.move = params.move || 6;
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
            };

            Creature.prototype._attackBonuses = function(attack, item, target, combatAdvantage) {
                var i, attackBonuses, attackBonus;
                this.__log("_attackBonuses", arguments);

                attackBonuses = [];

                function matchesDefense(attackBonus) {
                    if (attackBonus.defense && attackBonus.defense.toLowerCase() !== attack.defense.toLowerCase()) {
                        return false;
                    }
                    return true;
                }
                function matchesVulnerability(attackBonus) {
                    var isMatch, i;
                    isMatch = true;
                    if (attackBonus.vulnerable) {
                        isMatch = false;
                        if (target.vulnerabilities.hasOwnProperty(attackBonus.vulnerable.toLowerCase())) {
                            isMatch = true;
                        }
                        else {
                            for (i = 0; i < target.effects.length; i++) {
                                if (target.effects[ i ].name.toLowerCase() === "vulnerable" && target.effects[ i ].type.toLowerCase() === attackBonus.vulnerable.toLowerCase()) {
                                    isMatch = true;
                                    break;
                                }
                            }
                        }
                    }
                    return isMatch;
                }
                function matchesKeywords(attackBonus) {
                    var keywords, i;
                    keywords = [];
                    if (attack.keywords) {
                        keywords = keywords.concat(attack.keywords);
                    }
                    if (item && item.keywords) {
                        keywords = keywords.concat(item.keywords);
                    }
                    if (attackBonus.keywords) {
                        for (i = 0; i < attackBonus.keywords; i++) {
                            if (keywords.indexOf(attackBonus.keywords[ i ]) === -1) {
                                return false;
                            }
                        }
                    }
                    return true;
                }
                function matchesAttackerStatus(attackBonus) {
                    if (attackBonus.status) {
                        if (attackBonus.status.indexOf("bloodied") !== -1 && !this.isBloodied()) {
                            return false;
                        }
                    }
                    return true;
                }
                function matchesFoeStatus(attackBonus) {
                    if (attackBonus.foeStatus) {
                        if (attackBonus.foeStatus.indexOf("combat advantage") !== -1 && !combatAdvantage) {
                            return false;
                        }
                        if (attackBonus.foeStatus.indexOf("bloodied") !== -1 && (!target || !target.isBloodied())) {
                            return false;
                        }
                    }
                    return true;
                }
                if (this.attackBonuses) {
                    for (i = 0; i < this.attackBonuses.length; i++) {
                        attackBonus = this.attackBonuses[ i ];
                        if (!matchesDefense(attackBonus)) {
                            continue;
                        }
                        if (!matchesVulnerability(attackBonus)) {
                            continue;
                        }
                        if (!matchesKeywords(attackBonus)) {
                            continue;
                        }
                        if (!matchesAttackerStatus.call(this, attackBonus)) {
                            continue;
                        }
                        if (!matchesFoeStatus(attackBonus)) {
                            continue;
                        }
                        attackBonuses.push(attackBonus);
                    }
                }

                return attackBonuses;
            };


            // PUBLIC METHODS

            Creature.prototype.isBloodied = function() {
                this.__log("isBloodied", arguments);
                return this.hp.current <= Math.floor(this.hp.total / 2);
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
                    switch (this.effects[ i ].name.toLowerCase()) {
                        case "blinded":
                        case "dazed":
                        case "dominated":
                        case "dying":
                        case "helpless":
                        case "petrified":
                        case "restrained":
                        case "stunned":
                        case "surprised":
                        case "unconscious": {
                            return true;
                        }
                            break;
                        case "prone": {
                            return isMelee;
                        }
                            break;
                    }
                }
                return false;
            };

            Creature.prototype.defenseModifier = function(isMelee) {
                var i, mod = 0;
                this.__log("defenseModifier", arguments);
                for (i = 0; i < this.effects.length; i++) {
                    switch (this.effects[ i ].name.toLowerCase()) {
                        case "unconscious": {
                            mod -= 5;
                        }
                            break;
                        case "prone": {
                            mod += isMelee ? 0 : 2;
                        }
                            break;
                    }
                }
                return mod;
            };

            Creature.prototype.toString = function() {
                this.__log("toString", arguments);
                return "[Creature \"" + this.name + "\"]";
            };


            return Creature;
        },
        true
    );

})();
