/**
 * Created by nblumberg on 10/12/14.
 */

(function () {
    "use strict";

    DnD.define(
        "Actor",
        [ "out", "Creature", "Effect", "History", "History.Entry", "Attack", "Damage", "Recharge", "SavingThrow" ],
        function(out, Creature, Effect, History, HistoryEntry, Attack, Damage, Recharge, SavingThrow) {
            function isArray(x) {
                return x && typeof x === "object" && x.constructor === Array;
            }

            function Actor(creature, count, currentState) {
                var i;
                this.__log = out.logFn.bind(this, "Actor");
                this.__log("constructor", [ creature ? creature.name : "undefined", count, "currentState" ]);

                if (creature instanceof Creature) {
                    creature = jQuery.extend({}, creature); // creature.raw();
                    creature.id = 0;
                }

                // Basic properties
                this.id = (currentState ? currentState.id : null) || creature.id || Creature.id++;
                this.type = creature.name;
                this.name = creature.name + (!creature.isPC && count ? " #" + count : "");

                // Store in singleton
                if (!Creature.actors) {
                    Creature.actors = {};
                }
                if (Creature.actors.hasOwnProperty(this.id)) {
                    out.console.debug("Replacing Creature.actors[ " + this.name + " ]");
                }
                Creature.actors[ this.id ] = this;

                this.history = null;
                this._turnTimer = null;
                this._turnDurations = {};

                this._init(creature, currentState);

                if (currentState) {
                    // Update new Actor with current state from raw data
                    this.name = currentState.name;
                    this.ap = typeof(currentState.ap) === "number" ? currentState.ap : this.ap;
                    this.hp.current = currentState.hp.current;
                    this.hp.temp = currentState.hp.temp;
                    this.surges.current = currentState.surges.current;
                    this.ap = currentState.ap;
                    for (i = 0; i < this.attacks.length; i++) {
                        if (currentState.attacks && currentState.attacks[ this.attacks[ i ].name ] && currentState.attacks[ this.attacks[ i ].name ].used) {
                            this.attacks[ i ].used = true;
                        }
                    }
                    this.effects = [];
                    for (i = 0; currentState.effects && i < currentState.effects.length; i++) {
                        this.effects.push(new Effect(jQuery.extend({}, currentState.effects[ i ], { target: this })));
                    }
                    this.imposedEffects = [];
                }
            }

            Actor.prototype = new Creature();

            Actor.prototype._init = function(params, currentState) {
                var data;
                this.__log("_init", [ params.name, "currentState" ]);
                Creature.prototype._init.call(this, params);
                data = jQuery.extend(
                    { includeSubject: false },
                        (currentState ? currentState.history : null) || params.history,
                    { _roundTimes: (currentState ? currentState._turnDurations : null ) }
                );
                this.history = new History(data);
                this._turnTimer = (new Date()).getTime();
            };


            // STATIC METHODS

            Creature.actors = {};
            Actor.findActor = function(id, returnIdIfNotFound) { // TODO: throw if not found?
                if (Creature.actors.hasOwnProperty(id)) {
                    return Creature.actors[ id ];
                }
                return returnIdIfNotFound ? id : null;
            };


            // PUBLIC METHODS

            Actor.prototype.toString = function() {
                this.__log("toString", arguments);
                return "[Actor \"" + this.name + "\"]";
            };

            Actor.prototype.addCondition = function(effect) {
                var name;
                this.__log("addCondition", arguments);
                if (typeof(effect) === "string") {
                    effect = { name: effect };
                }
                if (effect && effect.name) {
                    effect.name = effect.name.substring(0, 1).toUpperCase() + effect.name.substr(1);
                }
                name = effect.name.toLowerCase();
                if ((name === "dying" || name === "dead") && this.hp.current >= 0) {
                    this.effects.splice(this.effects.indexOf(effect), 1);
                    return;
                }
                if (this.card) {
                    this.card.updateConditions();
                }
            };

            Actor.prototype.attack = function(attack, item, targets, combatAdvantage, manualRolls) {
                var toHit, damage, i, result, hits, misses;
                this.__log("attack", [ attack.name, item ? item.name : "undefined", targets.length, combatAdvantage, manualRolls ]);
                hits = [];
                misses = [];
                toHit = this._attackToHit(attack, item, combatAdvantage, manualRolls);
                damage = this._attackDamage(attack, item, toHit.isCrit, manualRolls);
                for (i = 0; i < targets.length; i++) {
                    result = this._attackTarget(attack, item, combatAdvantage, targets[ i ], toHit, damage);
                    result.target = targets[ i ].raw();
                    if (result.hit) {
                        hits.push(result);
                    }
                    else {
                        misses.push(result);
                    }
                }
                if (attack.keywords.indexOf("invigorating") !== -1) {
                    this.heal(this.abilities.CONmod, true, false, "Invigorating power", this);
                }
                return { hits: hits, misses: misses };
            };

            Actor.prototype.buff = function(buff, targets, manualRoll) {
                var i, j, msg, damage;
                this.__log("buff", [ buff.name, targets.length, manualRoll ]);
                for (i = 0; i < targets.length; i++) {
                    msg = "Affected by " + this.name + "'s " + buff.name + " power";
                    if (buff.effects && buff.effects.length) {
                        msg += ", gains ";
                        for (j = 0; j < buff.effects.length; j++) {
                            msg += (j ? ", " : "") + targets[ i ].addEffect(buff.effects[ j ], this).toString();
                        }
                    }

                    // TODO: healing, tmp HP, coming back from dying
                    if (buff.healing) {
                        damage = new Damage(buff.healing.amount.replace("HS", Math.floor(targets[ i ].hp.total / 4)), this);
                        targets[ i ].heal(
                            manualRoll ? manualRoll + damage.extra : damage.roll(),
                            buff.healing.isTempHP,
                            buff.healing.usesHealingSurge,
                            buff.name,
                            this
                        );
                    }

                    targets[ i ].history.add(new HistoryEntry({ round: this.history._round, subject: targets[ i ], message: msg }));
                }
            };

            /**
             * @param amount {Number}
             * @param isTempHp {Boolean}
             * @param usesHealingSurge {Boolean}
             * @param description {String}
             * @param healer {Actor}
             * @returns {Object} Object of the form { msg: String, damage: Number, type: String or Array of String }
             */
            Actor.prototype.heal = function(amount, isTempHp, usesHealingSurge, description, healer) {
                var msg, property, oldValue, newValue;
                if (isTempHp) {
                    property = "hp.temp";
                    oldValue = this.hp.temp;
                    this.hp.temp = Math.max(amount, this.hp.temp);
                    newValue = this.hp.temp;
                    msg = "Gained " + amount + " temporary hit points";
                }
                else {
                    property = "hp.current";
                    oldValue = this.hp.current;
                    this.hp.current = Math.min(this.hp.current + amount, this.hp.total);
                    newValue = this.hp.current;
                    msg = "Healed " + amount + " damage";
                }
                msg += " from " + (healer ? healer.name + "'s " : "") + description + (healer ? " power" : "");
                this.dispatchEvent({ type: "change", property: property, oldValue: oldValue, newValue: newValue });

                if (usesHealingSurge) {
                    property = "surges.current";
                    oldValue = this.surges.current;
                    if (!this.surges.current || this.surges.current <= 0) {
                        msg += ", should have used a healing surge but has none remaining";
                    }
                    else {
                        this.surges.current = Math.max(--this.surges.current, 0);
                        msg += ", using a healing surge";
                    }
                    newValue = this.surges.current;
                    this.dispatchEvent({ type: "change", property: property, oldValue: oldValue, newValue: newValue });
                }
                this.history.add(new HistoryEntry({ round: this.history._round, subject: this, message: msg }));
            };

            /**
             * @param attacker {Actor}
             * @param damage {Number}
             * @param type {String or Array of String}
             * @param effects {Array of Effect}
             * @returns {Object} Object of the form { msg: String, damage: Number, type: String or Array of String }
             */
            Actor.prototype.takeDamage = function(attacker, damage, type, effects) {
                var temp, msg, i, j, result, effect;
                // vvv DEBUGGING
                this.__log("takeDamage", [ attacker ? attacker.name : null, damage, type, effects ]);
                if (typeof(damage) !== "number") {
                    out.console.error("Creature.takeDamage() received NaN damage value");
                    return {
                        msg: "Creature.takeDamage() received NaN damage value",
                        damage: 0,
                        type: undefined
                    };
                }
                // ^^^ DEBUGGING
                msg = "";
                function applyVulnerability(type) {
                    var temp, i, effect;
                    temp = 0;
                    if (this.vulnerabilities && this.vulnerabilities[ type ]) {
                        temp = this.vulnerabilities[ type ];
                    }
                    for (i = 0; i < this.effects.length; i++) {
                        effect = this.effects[ i ];
                        if (effect.name.toLowerCase() === "vulnerable" && typeof effect.type === "string" && effect.type.toLowerCase() === type.toLowerCase()) {
                            temp = Math.max(temp, this.effects[ i ].amount);
                        }
                    }
                    if (temp) {
                        msg += " and " + temp + " " + type + " vulnerability";
                        damage += temp;
                    }
                }
                function applyResistance(type) {
                    var getResistance, temp, temp2, i;
                    getResistance = function(type) {
                        var temp, i, effect;
                        temp = 0;
                        if (typeof type !== "string") {
                            return temp;
                        }
                        if (this.resistances && this.resistances.hasOwnProperty(type)) {
                            temp = this.resistances[ type ] || 0;
                        }
                        for (i = 0; i < this.effects.length; i++) {
                            effect = this.effects[ i ];
                            if (effect.name.toLowerCase() === "resistance" && typeof effect.type === "string" && effect.type.toLowerCase() === type.toLowerCase() && effect.amount > temp) {
                                temp = effect.amount;
                            }
                        }
                        return temp;
                    }.bind(this);

                    temp = Infinity;
                    if (typeof type === "string") {
                        temp = getResistance(type) || Infinity;
                    }
                    else if (isArray(type)) {
                        // The creature can only resist multi-type damage if it has resistance to all the types
                        // and then only resists an amount equal to the lowest of the matching resistances
                        for (i = 0; i < type.length; i++) {
                            temp2 = getResistance(type[ i ]);
                            if (temp2) {
                                temp = Math.min(temp, temp2);
                            }
                            else {
                                temp = Infinity;
                                break;
                            }
                        }
                    }
                    temp2 = getResistance("all");
                    if (temp2 && (temp === Infinity || temp2 > temp)) {
                        temp = temp2;
                    }
                    temp2 = getResistance("insubstantial");
                    if (temp2) {
                        if (temp !== Infinity) {
                            temp += Math.floor(Math.max(damage - temp, 0) / 2);
                        }
                        else {
                            temp = Math.floor(damage / 2);
                        }
                    }
                    if (temp !== Infinity) {
                        msg += " (resisted " + Math.min(damage, temp) + ")";
                        damage = Math.max(damage - temp, 0);
                    }
                }
                if (type) {
                    if (isArray(type)) {
                        for (i = 0; i < type.length; i++) {
                            applyVulnerability.call(this, type[ i ]);
                        }
                    }
                    else {
                        applyVulnerability.call(this, type);
                    }
                }
                applyResistance.call(this, type);
                if (this.hp.temp) {
                    temp = this.hp.temp;
                    this.hp.temp = Math.max(temp - damage, 0);
                    msg += " (" + Math.min(damage, temp) + " absorbed by temporary HP)";
                    damage = Math.max(damage - temp, 0);
                }
                if (effects && effects.length) {
                    for (i = 0; i < effects.length; i++) {
                        msg += ", " + this.addEffect(effects[ i ], attacker).toString();
                    }
                }
                this.hp.current -= damage;
                if (this.hp.current < 0 && !this.hasCondition("dying")) {
                    this.addEffect(new Effect({ name: "Dying", round: this.history._round, target: this }));
                    msg += "; " + this.name + " falls unconscious and is dying";
                }
                //        this.addDamageIndicator(damage, type);
                //        this.dispatchEvent({ type: "takeDamage", damage: { amount: damage, type: type } });
                result = {
                    msg: msg,
                    damage: damage,
                    type: type
                };

                return result;
            };

            /**
             * Adds an Effect to the Actor
             * @param effect {Effect} The Effect to add
             * @param [attacker] {Actor} The Actor imposing the Effect
             * @returns {Effect} The added Effect
             */
            Actor.prototype.addEffect = function(effect, attacker) {
                var i;
                // Only one Marked at a time
                if (effect.name.toLowerCase() === "marked") {
                    for (i = 0; i < this.effects.length; i++) {
                        if (this.effects[ i ].name.toLowerCase() === "marked") {
                            this.effects[ i ].remove();
                            break;
                        }
                    }
                }
                if (typeof effect.call === "function") {
                    effect = effect.call(this, attacker, this.history._round);
                    if (!effect) {
                        return null;
                    }
                }
                else {
                    effect = new Effect(jQuery.extend({}, effect.raw ? effect.raw() : effect, { target: this, attacker: attacker, round: this.history._round }));
                }
                if (attacker && attacker.imposedEffects) {
                    attacker.imposedEffects.push(effect);
                }
                this.effects.push(effect);
                if (effect.hasOwnProperty("duration") && (effect.duration === "startAttackerNext" || effect.duration === "endAttackerNext")) {
                    effect.isNextTurn = false;
                }
                return effect;
            };

            Actor.prototype.startTurn = function() {
                var ongoingDamage, isLesserOngoingDamage, firstAmongEquals, handleEffect, handleImposedEffect, i, j, recharge, regen, tmp, msg;
                this.__log("startTurn", arguments);
                msg = null;

                ongoingDamage = function actor_startTurn_ongoingDamage(effect) {
                    var result, type;
                    if (effect.name.toLowerCase() === "ongoing damage") {
                        result = this.takeDamage(effect.attacker, effect.amount, effect.type, null);
                        type = "";
                        if (result.type) {
                            if (typeof result.type === "string") {
                                type = result.type;
                            }
                            else if (result.type.constructor === Array) {
                                type = result.type.join(" and ");
                            }
                        }
                        this.history.add(new HistoryEntry({ round: this.history._round, subject: this, message: "Took " + result.damage + " ongoing " + type + " damage" + result.msg }));
                    }
                }.bind(this);

                // Only take the greatest ongoing damage of multiple ongoing damages of the same type
                firstAmongEquals = {};
                isLesserOngoingDamage = function actor_startTurn_isLesserOngoingDamage(effect, index, array) {
                    var j, effect2, typeStr;
                    function equivalentTypes(types1, types2) {
                        if (!types1 && !types2) {
                            return true;
                        }
                        else if (types1 && !types2 || !types1 && types2) {
                            return false;
                        }
                        else {
                            if (typeof types1 === "string" && typeof types2 === "string") {
                                return types1.toLowerCase() === types2.toLowerCase();
                            }
                            else if (types1.constructor === Array && types2.constructor === Array) {
                                return jQuery(types1).not(types2).length === 0 && jQuery(types2).not(types1).length === 0;
                            }
                        }
                        return false;
                    }
                    if (effect.name.toLowerCase() !== "ongoing damage") {
                        return false; // this isn't an ongoing damage Effect
                    }
                    typeStr = typeof effect.type !== "string" ? effect.type.join(",") : effect.type;
                    for (j = 0; array && j < array.length; j++) {
                        effect2 = array[ j ];
                        if (j === index) {
                            continue; // skip comparing the Effect to itself
                        }
                        if (effect2.name.toLowerCase() == "multiple") { // check against multiple Effects for nested ongoing damage Effects
                            if (isLesserOngoingDamage(effect, -1, effect2.children)) {
                                return true;
                            }
                        }
                        if (effect2.name.toLowerCase() !== "ongoing damage" || !equivalentTypes(effect.type, effect2.type)) { // the other effect isn't ongoing damage or the same damage type
                            continue;
                        }
                        if (effect.amount === effect2.amount) {
                            if (!firstAmongEquals[ typeStr ]) {
                                firstAmongEquals[ typeStr ] = effect; // only have the first ongoing damage of equal type and amount take effect
                            }
                            else {
                                return true;
                            }
                        }
                        else if (effect.amount < effect2.amount) {
                            return true;
                        }
                    }
                    return false;
                }.bind(this);

                handleEffect = function(effect) {
                    var result, i;
                    result = effect.countDown(this.history._round, true, true);
                    if (result) {
                        this.history.add(new HistoryEntry({ round: this.history._round, subject: this, message: effect.name + " effect expired" + (typeof result === "string" ? result : "") }));
                    }

                    // Only take the greatest ongoing damage of multiple ongoing damages of the same type
                    if (isLesserOngoingDamage(effect, this.effects.indexOf(effect), this.effects)) {
                        return;
                    }
                    ongoingDamage(effect);

                    if (effect.children && effect.children.length) {
                        for (i = 0; i < effect.children.length; i++) {
                            handleEffect(effect.children[ i ]);
                        }
                    }
                }.bind(this);

                handleImposedEffect = function(effect) {
                    var result, i;
                    result = effect.countDown(this.history._round, false, true);
                    if (result) {
                        effect.target.history.add(new HistoryEntry({ round: effect.target.history._round, subject: effect.target, message: effect.name + " effect expired" + (typeof result === "string" ? result : "") }));
                    }
                    if (effect.children && effect.children.length) {
                        for (i = 0; i < effect.children.length; i++) {
                            handleImposedEffect(effect.children[ i ]);
                        }
                    }
                }.bind(this);

                for (i = 0; this.attacks && i < this.attacks.length; i++) {
                    if (this.attacks[ i ].used && this.attacks[ i ].usage.frequency === Attack.prototype.USAGE_RECHARGE && this.attacks[ i ].usage.recharge) {
                        recharge = new Recharge({ attack: this.attacks[ i ], bloodied: this.isBloodied() });
                        recharge.roll();
                        if (recharge.isRecharged()) {
                            this.attacks[ i ].used = false;
                            this.history.add(new HistoryEntry({ round: this.history._round, subject: this, message: recharge.anchor() }));
                        }
                    }
                }
                for (i = 0; this.effects && i < this.effects.length; i++) {
                    tmp = handleEffect(this.effects[ i ]);
                    msg = msg ? msg : tmp;
                }
                for (i = 0; this.imposedEffects && i < this.imposedEffects.length; i++) {
                    tmp = handleImposedEffect(this.imposedEffects[ i ]);
                    msg = msg ? msg : tmp;
                }

                // Regenerate after taking ongoing damage
                if (this.hp.regeneration && this.hp.current < this.hp.total) {
                    regen = Math.min(this.hp.regeneration, this.hp.total - this.hp.current);
                    this.hp.current += regen;
                    this.history.add(new HistoryEntry({ round: this.history._round, subject: this, message: "Regenerated " + regen + " HP" }));
                }

                this._turnTimer = (new Date()).getTime();
                return msg;
            };

            Actor.prototype.endTurn = function() {
                var handleEffect, handleImposedEffect, i, msg, tmp, pcSavingThrows = [], save, fail;
                this.__log("endTurn", arguments);
                msg = null;

                if (this._turnTimer) {
                    this._turnDurations[ this.history._round ] = (new Date()).getTime() - this._turnTimer;
                    this._turnTimer = null;
                    this.history.setRoundTime(this._turnDurations[ this.history._round ], this.history._round);
                }

                handleEffect = function(effect) {
                    var result, i, savingThrow, savingThrowRoll, msg, ae, attacker;
                    result = effect.countDown(this.history._round, true, false);
                    if (result) {
                        this.history.add(new HistoryEntry({ round: this.history._round, subject: this, message: effect.name + " effect expired" + (typeof result === "string" ? result : "") }));
                    }

                    if (effect.saveEnds) {
                        savingThrow = new SavingThrow({ effect: effect });
                        if (this.isPC) {
                            pcSavingThrows.push(effect);
                            return;
                        }
                        savingThrowRoll = savingThrow.roll();
                        msg = savingThrow.anchor();
                        if (savingThrowRoll >= 10) {
                            msg += effect.remove();
                        }
                        this.history.add(new HistoryEntry({ round: this.history._round, subject: this, message: msg }));
                    }

                    if (effect.children && effect.children.length) {
                        for (i = 0; i < effect.children.length; i++) {
                            handleEffect(effect.children[ i ]);
                        }
                    }
                }.bind(this);

                handleImposedEffect = function(effect) {
                    var i, result;
                    result = effect.countDown(this.history._round, false, false);
                    if (result) {
                        effect.target.history.add(new HistoryEntry({ round: effect.target.history._round, subject: effect.target, message: effect.name + " effect expired" + (typeof result === "string" ? result : "") }));
                    }
                    if (effect.children && effect.children.length) {
                        for (i = 0; i < effect.children.length; i++) {
                            handleImposedEffect(effect.children[ i ]);
                        }
                    }
                }.bind(this);

                for (i = 0; this.effects && i < this.effects.length; i++) {
                    tmp = handleEffect(this.effects[ i ]);
                    msg = msg ? msg : tmp;
                }
                for (i = 0; this.imposedEffects && i < this.imposedEffects.length; i++) {
                    handleImposedEffect(this.imposedEffects[ i ]);
                }

                save = function(effect) {
                    var savingThrow, msg;
                    savingThrow = new SavingThrow({ effect: effect });
                    savingThrow.add(20);
                    msg = savingThrow.anchor();
                    msg += effect.remove();
                    this.history.add(new HistoryEntry({ round: this.history._round, subject: this, message: msg }));
                }.bind(this);
                fail = function(effect) {
                    var savingThrow, msg;
                    savingThrow = new SavingThrow({ effect: effect });
                    savingThrow.add(1);
                    msg = savingThrow.anchor();
                    this.history.add(new HistoryEntry({ round: this.history._round, subject: this, message: msg }));
                }.bind(this);

                for (i = 0; pcSavingThrows && i < pcSavingThrows.length; i++) {
                    if (window.confirm("Did " + this.name + " save against " + pcSavingThrows[ i ].toString() + "?")) {
                        save(pcSavingThrows[ i ]);
                    }
                    else {
                        fail(pcSavingThrows[ i ]);
                    }
                }

                return msg;
            };

            Actor.prototype.raw = function() {
                var data, i, attack;
                this.__log("raw", arguments);
                data = {
                    id: this.id,
                    type: this.type,
                    name: this.name,
                    hp: { current: this.hp.current, temp: this.hp.temp },
                    defenses: { ac: this.defenses.ac, fort: this.defenses.fort, ref: this.defenses.ref, will: this.defenses.will },
                    surges: { current: this.surges.current },
                    ap: this.ap,
                    attacks: {},
                    effects: this.rawArray(this.effects),
                    imposedEffects: this.rawArray(this.imposedEffects),
                    history: this.history.raw(),
                    _turnTimer: this._turnTimer,
                    _turnDurations: this._turnDurations
                };
                for (i = 0; i < this.attacks.length; i++) {
                    attack = this.attacks[ i ];
                    data.attacks[ attack.name ] = { used: attack.used };
                }
                return data;
            };


            // NON-PUBLIC METHODS

            /**
             * Determines the final to hit value for an attack
             * @param attack {Attack}
             * @param item {Item}
             * @param combatAdvantage {Boolean}
             * @param [manualRolls {Object}]
             * @returns {{roll: number, isAutomaticHit: boolean, isCrit: boolean, isFumble: boolean, conditional: {mod: number, effects: Array, breakdown: string}}}
             * @private
             */
            Actor.prototype._attackToHit = function(attack, item, combatAdvantage, manualRolls) {
                var toHit;
                this.__log("attackToHit", [ attack.name, item ? item.name : "undefined", combatAdvantage, manualRolls ]);
                toHit = {
                    isAutomaticHit: typeof(attack.toHit) === "string" && attack.toHit.toLowerCase() === "automatic",
                    isCrit: false,
                    isFumble: false,
                    conditional: { mod: 0 }
                };

                if (!toHit.isAutomaticHit) {
                    if (manualRolls && manualRolls.attack && (manualRolls.attack.roll || manualRolls.attack.isCritical || manualRolls.attack.isFumble)) {
                        toHit.roll = manualRolls.attack.roll;
                        toHit.isManual = true;
                        attack.addItem(item, manualRolls.attack.roll, manualRolls.attack.isCritical, manualRolls.attack.isFumble);
                    }
                    else {
                        toHit.roll = item ? attack.rollItem(item) : attack.roll(); // TODO: attack.meleeExtra vs. attack.rangdExtra when no item - how to determine isMelee?
                        toHit.isManual = false;
                    }
                    toHit.isCrit = attack.isCritical() || (manualRolls && manualRolls.attack ? manualRolls.attack.isCritical : false);
                    toHit.isFumble = attack.isFumble() || (manualRolls && manualRolls.attack ? manualRolls.attack.isFumble : false);
                    if (!toHit.isCrit && !toHit.isFumble) {
                        toHit.conditional = attack.toHitModifiers(this.effects);
                        if (combatAdvantage) {
                            toHit.conditional.breakdown += " + combat advantage";
                        }
                    }
                }

                return toHit;
            };

            /**
             * Determines the final damage value(s) for an attack before they are applied to a particular target
             * @param attack {Attack}
             * @param item {Item}
             * @param isCrit {Boolean}
             * @param [manualRolls {Object}]
             * @returns {{amount: number, missAmount: number, conditional: {mod: number, effects: Array, breakdown: string}, isManual: boolean}}
             * @private
             */
            Actor.prototype._attackDamage = function(attack, item, isCrit, manualRolls) {
                var damage, i, temp;
                this.__log("_attackDamage", [ attack.name, item ? item.name : "undefined", isCrit, manualRolls ]);
                damage = {
                    amount: 0,
                    missAmount: 0,
                    conditional: { mod: 0, effects: [], breakdown: "" },
                    isManual: false
                };

                if (manualRolls && manualRolls.damage) {
                    damage.amount = manualRolls.damage;
                    damage.isManual = true;
                    if (isArray(attack.damage)) {
                        for (i = 0; i < attack.damage.length; i++) {
                            attack.damage[ i ].addItem(Math.round(manualRolls.damage / attack.damage.length), item, isCrit);
                        }
                    }
                    else {
                        attack.damage.addItem(manualRolls.damage, item, isCrit);
                    }
                    if (attack.hasOwnProperty("miss")) {
                        if (attack.miss.halfDamage) {
                            damage.missAmount = Math.round(manualRolls.damage / 2);
                        }
                        else if (attack.miss.hasOwnProperty("damage")) {
                            if (isArray(attack.miss.damage)) {
                                for (i = 0; i < attack.miss.damage.length; i++) {
                                    damage.missAmount += Math.round(manualRolls.damage / attack.miss.damage.length);
                                    attack.miss.damage[ i ].addItem(Math.round(manualRolls.damage / attack.miss.damage.length), item, false);
                                }
                            }
                            else {
                                damage.missAmount = manualRolls.damage;
                                attack.miss.damage.addItem(manualRolls.damage, item, false);
                            }
                        }
                    }
                }
                else {
                    if (isArray(attack.damage)) {
                        for (i = 0; i < attack.damage.length; i++) {
                            temp = attack.damage[ i ];
                            damage.amount += temp.rollItem(item, isCrit);
                        }
                    }
                    else {
                        damage.amount = attack.damage.rollItem(item, isCrit);
                    }
                    if (attack.hasOwnProperty("miss")) {
                        if (attack.miss.halfDamage) {
                            temp = jQuery.extend({}, attack.damage._history[ attack.damage._history.length - 1 ] );
                            temp.total = Math.floor(temp.total / 2);
                            attack.miss.damage._history.push(temp);
                            damage.missAmount = temp.total;
                        }
                        else if (attack.miss.hasOwnProperty("damage")) {
                            if (isArray(attack.miss.damage)) {
                                for (i = 0; i < attack.miss.damage.length; i++) {
                                    damage.missAmount += attack.miss.damage[ i ].rollItem(item, false);
                                }
                            }
                            else {
                                damage.missAmount = attack.miss.damage.rollItem(item, false);
                            }
                        }
                    }
                }
                //        if (item && item.enhancement) {
                //            if (attack.weaponMultiplier && attack.weaponMultiplier > 1) {
                //                damage.conditional.breakdown += " + " + attack.weaponMultiplier + "x[+" + item.enhancement + " weapon]";
                //            }
                //            else {
                //                damage.conditional.breakdown += " [+" + item.enhancement + " weapon]";
                //            }
                //        }
                if (this.hasCondition("weakened")) {
                    damage.conditional.mod = -1 * Math.ceil(damage.amount / 2);
                    damage.conditional.breakdown += " [1/2 for weakened]";
                    damage.conditional.effects.push("weakened");
                    damage.amount = Math.floor(damage.amount / 2);
                    damage.missAmount = Math.floor(damage.missAmount / 2);
                }

                return damage;
            };

            /**
             * Applies an attack to a particular target
             * @param attack {Attack}
             * @param item {Item}
             * @param combatAdvantage {Boolean}
             * @param target {Actor}
             * @param toHit {Object} {{roll: number, isAutomaticHit: boolean, isCrit: boolean, isFumble: boolean, conditional: {mod: number, effects: Array, breakdown: string}}} See _attackToHit
             * @param damage {Object} {{amount: number, missAmount: number, conditional: {mod: number, effects: Array, breakdown: string}, isManual: boolean}} See _attackDamage
             * @returns {{hit: boolean, damage: Array}}
             * @private
             */
            Actor.prototype._attackTarget = function(attack, item, combatAdvantage, target, toHit, damage) {
                var toHitTarget, targetDamage, i, targetDefense, msg, attackerMsg, result, entry;

                function concatMsg(suffix) {
                    msg += suffix;
                    attackerMsg += suffix;
                }

                this.__log("_attackTarget", [ attack.name, item ? item.name : "undefined", combatAdvantage, target.name, toHit, damage ]);

                targetDefense = null;
                result = { hit: false, damage: [] };
                toHitTarget = {
                    roll: toHit.roll + (toHit.conditional.mod ? toHit.conditional.mod : 0),
                    isManual: toHit.isManual,
                    conditional: jQuery.extend({ mod: 0, breakdown: "" }, toHit.conditional)
                };
                targetDamage = {
                    amount: damage.amount,
                    effects: (function actor_attackTarget_targetDamage_effects() {
                        var effects = [];
                        if (attack.effects) {
                            effects = attack.effects.slice(0);
                        }
                        if (item && item.effects) {
                            effects = effects.concat(item.effects);
                        }
                        return effects;
                    })(),
                    missAmount: damage.missAmount,
                    missEffects: attack.miss && attack.miss.effects ? attack.miss.effects.slice(0) : [],
                    conditional: jQuery.extend({ mod: 0, total: 0, breakdown: "" }, damage.conditional)
                };

                this._applyAttackBonuses(attack, damage, item, target, combatAdvantage, toHitTarget, targetDamage);

                // Calculate hit (for this target)
                if (!toHit.isAutomaticHit && !toHit.isFumble && !toHit.isCrit) {
                    toHitTarget.roll += (combatAdvantage || target.grantsCombatAdvantage() ? 2 : 0);
                    targetDefense = target.getDefense(attack.defense.toLowerCase(), attack.isMelee);
                }

                if (!toHit.isFumble && (toHit.isAutomaticHit || toHit.isCrit || toHitTarget.roll >= targetDefense)) {
                    // Hit
                    result.hit = true;
                    (function actor_attackTarget_hitAnchor() {
                        var anchor = attack.anchor(toHitTarget.conditional);
                        msg = "Hit by " + this.name + "'s " + anchor + " for ";
                        attackerMsg = "Hit " + target.name + " with " + anchor + " for ";
                    }.bind(this))();
                    if (isArray(attack.damage)) {
                        for (i = 0; i < attack.damage.length; i++) {
                            if (i !== 0) {
                                msg += " and ";
                            }
                            concatMsg(this._applyDamageAndEffects(target, item, attack.damage[ i ], i === attack.damage.length - 1 ? targetDamage.effects : null, targetDamage.conditional, i === 0, result));
                        }
                    }
                    else {
                        concatMsg(this._applyDamageAndEffects(target, item, attack.damage, targetDamage.effects, targetDamage.conditional, true, result));
                    }
                }
                else {
                    // Miss
                    (function actor_attackTarget_missAnchor() {
                        var anchor = attack.anchor(toHit.conditional);
                        msg = "Missed by " + this.name + "'s " + anchor;
                        attackerMsg = "Missed " + target.name + " with " + anchor + " for ";
                    }.bind(this))();
                    if (targetDamage.missAmount || attack.hasOwnProperty("miss")) {
                        msg += " but takes ";
                        attackerMsg += " but does ";
                        if (isArray(attack.miss.damage)) {
                            for (i = 0; i < attack.miss.damage.length; i++) {
                                if (i !== 0) {
                                    concatMsg(" and ");
                                }
                                concatMsg(this._applyDamageAndEffects(target, item, attack.miss.damage[ i ], i === attack.miss.damage.length - 1 ? targetDamage.missEffects : null, targetDamage.conditional, i === 0, result));
                            }
                        }
                        else {
                            concatMsg(this._applyDamageAndEffects(target, item, attack.miss.damage, targetDamage.missEffects, targetDamage.conditional, true, result));
                        }
                        concatMsg(" on a miss");
                        // TODO: miss effects without damage
                    }
                }
                concatMsg(" (HP " + target.hp.current + ")");

                // Record in target and central Histories
                entry = new HistoryEntry({ subject: target, message: msg });
                target.history.add(entry);
                History.central.add(entry);
                entry = new HistoryEntry({ subject: this, message: attackerMsg, localOnly: true });
                this.history.add(entry);
                out.console.info(target.name + " " + msg.charAt(0).toLowerCase() + msg.substr(1));

                return result;
            };


            /**
             * Helper method for _attackTarget() that modifies its internal data structures according to any attack bonuses that apply to the attack
             * @param attack {Attack} The Attack being made against target
             * @param damage {Object} The Damage being made against target
             * @param item {Implement} The Implement/Weapon used to make attack against target
             * @param target {Actor} The Actor being targeted by attack
             * @param combatAdvantage {Boolean} Whether the attacker has combat advantage against target
             * @param toHitTarget {{roll: number, conditional: { mod: number, breakdown: string }}}
             * @param targetDamage {{amount: number,effects: Array, missAmount: number, missEffects: Array, conditional: { mod: number, total: number, breakdown: string }}}
             * @private
             */
            Actor.prototype._applyAttackBonuses = function(attack, damage, item, target, combatAdvantage, toHitTarget, targetDamage) {
                var attackBonuses, i, attackBonus, amount;

                attackBonuses = this._attackBonuses(attack, item, target, combatAdvantage);
                for (i = 0; attackBonuses && i < attackBonuses.length; i++) {
                    attackBonus = attackBonuses[ i ];
                    if (attackBonus.toHit) {
                        if (!toHitTarget.isManual) {
                            amount = (new Damage(typeof attackBonus.toHit === "number" ? "" + attackBonus.toHit : attackBonus.toHit, this)).roll();
                            toHitTarget.roll += amount;
                            toHitTarget.conditional.mod += amount;
                        }
                        toHitTarget.conditional.breakdown += (attackBonus.toHit >= 0 ? " +" + attackBonus.toHit + " (" + attackBonus.name + ")" : "");
                    }
                    if (attackBonus.damage) {
                        amount = (new Damage(typeof attackBonus.damage === "number" ? "" + attackBonus.damage : attackBonus.damage, this)).roll();
                        if (!damage.isManual) {
                            targetDamage.amount += amount;
                            targetDamage.conditional.total += amount; // TODO: why is this on hit only?
                            targetDamage.conditional.mod += amount;
                        }
                        targetDamage.conditional.breakdown += (amount >= 0 ? " +" + amount + " (" + attackBonus.name + ")" : "");
                        if (!damage.isManual && attack.miss && targetDamage.missAmount) { // TODO: remove targetDamage.missAmount from this line?
                            if (attack.miss.halfDamage) {
                                targetDamage.missAmount += Math.floor(amount / 2);
                            }
                            else {
                                targetDamage.missAmount += amount;
                            }
                        }
                    }
                    if (attackBonus.effects) {
                        targetDamage.effects = targetDamage.effects.concat(attackBonus.effects);
                    }
                    if (attackBonus.miss && attackBonus.miss.effects) {
                        targetDamage.missEffects = targetDamage.missEffects.concat(attackBonus.miss.effects);
                    }
                    if (attackBonus.tempHp) {
                        amount = new Damage(typeof attackBonus.tempHp === "number" ? "" + attackBonus.tempHp : attackBonus.tempHp, this).roll();
                        if (attack.keywords.indexOf("invigorating") !== -1) {
                            amount += Math.max(this.abilities.CONmod, 0);
                        }
                        this.heal(Math.max(amount, 0), true, false, attackBonus.name, this);
                    }
                }
            };

            /**
             * Applies hit or miss damage and effects of an attack to a target
             * @param target {Actor} The Actor being attacked
             * @param item {Implement} The Implement/Weapon being used for the Attack
             * @param damage {Damage} The Damage of the Attack being applied
             * @param effects
             * @param conditional
             * @param passOnConditional
             * @param result {{damage: Array}}
             * @returns string The modified attack message
             * @private
             */
            Actor.prototype._applyDamageAndEffects = function(target, item, damage, effects, conditional, passOnConditional, result) {
                var type, amount, msg, tmp;
                type = damage.type || (item ? item.type : undefined); // if item imposes a damage type on untyped damage
                conditional.text = (!damage.type && type ? " " + type : "");
                msg = "";
                msg += damage.anchor(passOnConditional ? conditional : undefined);
                amount = damage.getLastRoll().total + (passOnConditional ? conditional.mod : 0);
                tmp = target.takeDamage(this, amount, type, effects);
                msg += tmp.msg;
                result.damage.push({ amount: tmp.damage, type: type });
                return msg;
            };


            return Actor;
        },
        true
    );

})();