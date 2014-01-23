/* global logFn, define, EventDispatcher */
/* exported DnD.Actor */
(function() {
    "use strict";

    define({
        name: "Actor",
        dependencyNames: [ "Creature", "Effect", "History", "Attack", "Roll.Recharge", "Roll.SavingThrow", "Display.ActorCard", "Display.ActorRow", "state", "jQuery", "console" ],
        factory: function(Creature, Effect, History, Attack, Recharge, SavingThrow, ActorCard, ActorRow, state, jQuery, console) {

            function Actor(creature, count, currentState, storage) {
                this.__log = logFn.bind(this, "Actor");
                this.__log("constructor", [ creature ? creature.name : "undefined", count, "currentState" ]);
                this.init(creature, count, currentState, storage);
            }

            Actor.prototype = new Creature();

            Actor.prototype.init = function(params, count, currentState, storage) {
                var i, data;
                if (!params) {
                    return;
                }
                params = params || {};
                this.__log("init", [ params.name, "currentState" ]);

                this.proxyObj = params.proxyObj || {};

                if (params instanceof Creature) {
                    params = params.raw();
                    params.id = 0;
                }

                // Basic properties
                this.proxyObj.id = (currentState ? currentState.id : null) || params.id || Creature.id++;
                this.proxyObj.type = params.name;
                this.proxyObj.name = params.name + (!params.isPC && count ? " #" + count : "");

                // Store in singleton
                if (state.findActor(this.proxyObj.id)) {
                    console.debug("Replacing Actor [ " + this.proxyObj.name + " ]");
                }
                state.actors[ this.proxyObj.id ] = this;

                this.proxyObj._turnTimer = (new Date()).getTime();
                this.proxyObj._turnDurations = {};
                if (!params.proxyObj) {
                    this.proxy({ object: this.proxyObj });
                }

                Creature.prototype.init.call(this, jQuery.extend({ proxyObj: this.proxyObj }, params));

                data = jQuery.extend(
                    { includeSubject: false },
                    (currentState ? currentState.history : null) || params.history,
                    { _roundTimes: (currentState ? currentState._turnDurations : null ) }
                );
                this.history = new History(data);

                this.__storage = storage;
                if (this.__storage) {
                    this.__storage.read(this.get("name"), function(data) {
                        // Update new Actor with current state from raw data
                        this.set(function(o) {
                            o.name = data.name || this.proxyObj.name;
                            o.ap = typeof(data.ap) === "number" ? data.ap : o.ap;
                        });
                        this.hp.set(function(o) {
                            o.current = data.hp.current;
                            o.temp = data.hp.temp;
                        });
                        this.surges.set("current", data.surges.current);

                        for (i = 0; i < this.attacks.length; i++) {
                            if (data.attacks && data.attacks[ this.attacks[ i ].get("name") ] && data.attacks[ this.attacks[ i ].get("name") ].used) {
                                this.attacks[ i ].set("used", true);
                            }
                        }
                        this.effects = [];
                        for (i = 0; data.effects && i < data.effects.length; i++) {
                            this.effects.push(new Effect(jQuery.extend({}, data.effects[ i ], { target: this })));
                        }
                    }.bind(this));
                }

                this._save();
            };

            Actor.prototype.toString = function() {
                this.__log("toString", arguments);
                return "[Actor \"" + this.get("name") + "\"]";
            };

            // TODO: where is this used?
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
                if ((name === "dying" || name === "dead") && this.hp.get("current") >= 0) {
                    if (this.effects.indexOf(effect) !== -1) {
                        this.effects.splice(this.effects.indexOf(effect), 1);
                        this.dispatchEvent({ type: "removedEffect", effect: effect });
                    }
                }
                else {
                    this.dispatchEvent({ type: "addedEffect", effect: effect });
                    if (this.card) {
                        this.card.updateConditions(); // TODO: have ActorCard addEventListener
                    }
                }
            };

            Actor.prototype.attack = function(attack, item, targets, combatAdvantage, manualRolls) {
                var toHit, damage, i, result, hits, misses;
                this.__log("attack", [ attack.get("name"), item ? item.get("name") : "undefined", targets.length, combatAdvantage, manualRolls ]);
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
                return { hits: hits, misses: misses };
            };

            Actor.prototype._attackToHit = function(attack, item, combatAdvantage, manualRolls) {
                var toHit;
                this.__log("attackToHit", [ attack.get("name"), item ? item.get("name") : "undefined", combatAdvantage, manualRolls ]);
                toHit = {
                    isAutomaticHit: typeof(attack.get("toHit")) === "string" && attack.get("toHit").toLowerCase() === "automatic",
                    isCrit: false,
                    isFumble: false,
                    conditional: { mod: 0 }
                };

                if (!toHit.isAutomaticHit) {
                    if (manualRolls && manualRolls.attack && (manualRolls.attack.roll || manualRolls.attack.isCritical || manualRolls.attack.isFumble)) {
                        toHit.roll = manualRolls.attack.roll;
                        if (manualRolls.attack.isCritical) {
                            attack.add(20 + attack.get("extra"));
                        }
                        else if (manualRolls.attack.isFumble) {
                            attack.add(1 + attack.get("extra"));
                        }
                        else {
                            attack.add(manualRolls.attack.roll - (item && item.get("enhancement") ? item.get("enhancement") : 0));
                        }
                    }
                    else {
                        toHit.roll = item ? attack.rollItem(item) : attack.roll();
                    }
                    toHit.isCrit = attack.isCritical();
                    toHit.isFumble = attack.isFumble();
                    if (!toHit.isCrit && !toHit.isFumble) {
                        toHit.conditional = attack.toHitModifiers(this.effects);
                        if (combatAdvantage) {
                            toHit.conditional.breakdown += " + combat advantage";
                        }
                    }
                }

                return toHit;
            };

            Actor.prototype._attackDamage = function(attack, item, isCrit, manualRolls) {
                var damage, i, temp;
                this.__log("_attackDamage", [ attack.get("name"), item ? item.get("name") : "undefined", isCrit, manualRolls ]);
                damage = {
                    amount: 0,
                    missAmount: 0,
                    conditional: { mod: 0, effects: [], breakdown: "" },
                    isManual: false
                };

                if (manualRolls && manualRolls.damage) {
                    damage.amount = manualRolls.damage;
                    damage.isManual = true;
                    if (jQuery.isArray(attack.damage)) {
                        for (i = 0; i < attack.damage.length; i++) {
                            attack.damage[ i ].addItem(Math.round(manualRolls.damage / attack.damage.length), item, isCrit);
                        }
                        // vvv TODO: what the hell was I trying to do here? Should this be elsewhere?
//                        if (attack.hasOwnProperty("miss")) {
//                            if (attack.miss.halfDamage) {
//                                for (i = 0; attack.hasOwnProperty("miss") && i < attack.miss.damage.length; i++) {
//                                    attack.miss.damage[ i ].addItem(Math.round(manualRolls.damage / attack.damage.length / 2), item, isCrit);
//                                }
//                            }
//                            else {
//                                attack.miss.damage.addItem(manualRolls.damage, item, false);
//                            }
//                        }
                        // ^^^ TODO: what the hell was I trying to do here? Should this be elsewhere?
                    }
                    else {
                        attack.damage.addItem(manualRolls.damage, item, isCrit);
                    }
                }
                else {
                    if (jQuery.isArray(attack.damage)) {
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
                            damage.missAmount = Math.floor(damage.amount / 2);
                            if (jQuery.isArray(attack.miss.damage)) {
                                attack.miss.damage[0].addItem(damage.amount, item, false);
                            }
                            else {
                                attack.miss.damage.addItem(damage.amount, item, false);
                            }
                        }
                        else if (attack.miss.hasOwnProperty("damage")) {
                            if (jQuery.isArray(attack.miss.damage)) {
                                for (i = 0; i < attack.damage.length; i++) {
                                    damage.missAmount += attack.miss.damage[ i ].rollItem(item, false);
                                }
                            }
                            else {
                                damage.missAmount = attack.miss.damage.rollItem(item, false);
                            }
                        }
                    }
                }
//                if (item && item.enhancement) {
//                    if (attack.get("weaponMultiplier") && attack.get("weaponMultiplier") > 1) {
//                        damage.conditional.breakdown += " + " + attack.attack.get("weaponMultiplier") + "x[+" + item.get("enhancement") + " weapon]";
//                    }
//                    else {
//                        damage.conditional.breakdown += " [+" + item.get("enhancement") + " weapon]";
//                    }
//                }
                if (this.hasCondition("weakened")) {
                    damage.conditional.mod = -1 * Math.ceil(damage.amount / 2);
                    damage.conditional.breakdown += " [1/2 for weakened]";
                    damage.conditional.effects.push("weakened");
                    damage.amount = Math.floor(damage.amount / 2);
                    damage.missAmount = Math.floor(damage.missAmount / 2);
                }

                return damage;
            };

            Actor.prototype._attackTarget = function(attack, item, combatAdvantage, target, toHit, damage) {
                var attackBonuses, i, attackBonus, toHitTarget, targetDamage, tmp, targetDefense, msg, result, entry;
                this.__log("_attackTarget", [ attack.get("name"), item ? item.get("name") : "undefined", combatAdvantage, target.get("name"), toHit, damage ]);

                targetDefense = null;
                result = { hit: false, damage: [] };

                toHitTarget = {
                    roll: toHit.roll + (toHit.conditional.mod ? toHit.conditional.mod : 0),
                    conditional: jQuery.extend({ mod: 0, breakdown: "" }, toHit.conditional)
                };
                targetDamage = {
                    amount: damage.amount,
                    missAmount: damage.missAmount,
                    conditional: jQuery.extend({ mod: 0, total: 0, breakdown: "" }, damage.conditional)
                };

                if (!damage.isManual) {
                    attackBonuses = this._attackBonuses(attack, item, target, combatAdvantage);
                    for (i = 0; attackBonuses && i < attackBonuses.length; i++) {
                        attackBonus = attackBonuses[ i ];
                        if (attackBonus.toHit) {
                            toHitTarget.roll += attackBonus.toHit;
                            toHitTarget.conditional.mod += attackBonus.toHit;
                            toHitTarget.conditional.breakdown += (attackBonus.toHit >= 0 ? " +" : "") + attackBonus.toHit + " (" + attackBonus.name + ")";
                        }
                        if (attackBonus.damage) {
                            targetDamage.amount += attackBonus.damage;
                            targetDamage.conditional.mod += attackBonus.damage;
                            targetDamage.conditional.total += attackBonus.damage;
                            targetDamage.conditional.breakdown += (attackBonus.damage >= 0 ? " +" : "") + attackBonus.damage + " (" + attackBonus.name + ")";
                            if (attack.miss && targetDamage.missAmount) {
                                if (attack.miss.halfDamage) {
                                    tmp = Math.floor(attackBonus.damage / 2);
                                    targetDamage.missAmount += tmp;
                                    targetDamage.conditional.mod += tmp;
                                    targetDamage.conditional.breakdown += (tmp >= 0 ? " +" : "") + tmp + " (" + attackBonus.name + ")";
                                }
                                else {
                                    targetDamage.missAmount += attackBonus.damage;
                                    targetDamage.conditional.breakdown += (attackBonus.damage >= 0 ? " +" : "") + attackBonus.damage + " (" + attackBonus.name + ")";
                                }
                            }
                        }
                    }
                }

                // Calculate hit (for this target)
                if (!toHit.isAutomaticHit && !toHit.isFumble && !toHit.isCrit) {
                    toHitTarget.roll += (combatAdvantage || target.grantsCombatAdvantage() ? 2 : 0);
                    targetDefense = target.defenses.get(attack.defense.toLowerCase()) + target.defenseModifier(attack.defense.toLowerCase(), attack.isMelee);
                }

                // Apply hit or miss damage/effects
                if (toHit.isAutomaticHit || toHit.isCrit || toHitTarget.roll >= targetDefense) {
                    // Hit
                    result.hit = true;
                    msg = "Hit by " + this.get("name")+ "'s " + attack.anchor(toHitTarget.conditional) + " for ";
                    if (jQuery.isArray(attack.damage)) {
                        for (i = 0; i < attack.damage.length; i++) {
                            msg += (i > 0 && i < attack.damage.length - 1 ? ", " : "") + (i > 0 && i === attack.damage.length - 1 ? " and " : "") + attack.damage[ i ].anchor(targetDamage.conditional);
                            tmp = target.takeDamage(this, attack.damage[ i ].getLastRoll().total + (i === 0 ? targetDamage.conditional.mod : 0), attack.damage[ i ].type, i === 0 ? attack.effects : null);
                            msg += tmp.msg;
                            result.damage.push({ amount: tmp.damage, type: attack.damage[ i ].type });
                        }
                    }
                    else {
                        msg += attack.damage.anchor(targetDamage.conditional);
                        tmp = target.takeDamage(this, targetDamage.amount, attack.damage.type, attack.effects);
                        msg += tmp.msg;
                        result.damage.push({ amount: tmp.damage, type: attack.damage.type });
                    }
                }
                else {
                    // Miss
                    msg = "Missed by " + this.name + "'s " + attack.anchor(toHit.conditional);
                    if (targetDamage.missAmount) {
                        msg += " but takes ";
                        if (jQuery.isArray(attack.miss.damage)) {
                            for (i = 0; i < attack.miss.damage.length; i++) {
                                msg += (i > 0 && i < attack.miss.damage.length - 1 ? ", " : "") + (i > 0 && i === attack.miss.damage.length - 1 ? " and " : "") + attack.miss.damage[ i ].anchor(targetDamage.conditional);
                            }
                        }
                        else {
                            msg += attack.miss.damage.anchor(targetDamage.conditional);
                        }
                        msg += " on a miss";
                    }
                    if (targetDamage.missAmount || attack.hasOwnProperty("miss")) {
                        if (jQuery.isArray(attack.miss.damage)) {
                            for (i = 0; i < attack.miss.damage.length; i++) {
                                tmp = target.takeDamage(this, attack.miss.damage[ i ].getLastRoll().total + (i === 0 ? targetDamage.conditional.mod : 0), attack.miss.damage[ i ].type, i === 0 ? attack.miss.effects : null);
                                msg += tmp.msg;
                                result.damage.push({ amount: tmp.damage, type: attack.miss.damage[ i ].type });
                            }
                        }
                        else {
                            tmp = target.takeDamage(this, attack.miss.damage.getLastRoll().total + targetDamage.conditional.mod, attack.miss.damage.type, attack.miss.effects);
                            msg += tmp.msg;
                            result.damage.push({ amount: tmp.damage, type: attack.miss.damage.type });
                        }
                    }
                }

                // Record in target and central Histories
                entry = new History.Entry({ subject: target, message: msg });
                target.history.add(entry);
                History.central.add(entry);
                console.info(target.name + " " + msg.charAt(0).toLowerCase() + msg.substr(1));

                return result;
            };

            /**
             * @param attacker Actor
             * @param damage Number
             * @param type String
             * @param effects Array of Effect
             */
            Actor.prototype.takeDamage = function(attacker, damage, type, effects) {
                var temp, msg, i, result, effect;
                // vvv DEBUGGING
                this.__log("takeDamage", [ attacker.name, damage, type, effects ]);
                if (typeof(damage) !== "number") {
                    console.error("Creature.takeDamage() received NaN damage value");
                    return;
                }
                // ^^^ DEBUGGING
                msg = "";
                if (type && this.defenses.resistances && this.defenses.resistances.hasOwnProperty(type)) { // TODO: handle multi-type and multiple resistances
                    temp = this.defenses.resistances[ type ];
                    msg += " (resisted " + Math.min(damage, temp) + ")";
                    damage = Math.max(damage - temp, 0);
                }
                if (this.hp.temp) {
                    temp = this.hp.temp;
                    this.hp.temp = Math.max(temp - damage, 0);
                    msg += " (" + Math.min(damage, temp) + " absorbed by temporary HP)";
                    damage = Math.max(damage - temp, 0);
                }
                if (effects && effects.length) {
                    for (i = 0; i < effects.length; i++) {
                        effect = new Effect(jQuery.extend({}, effects[ i ].raw(), { target: this, attacker: attacker, round: this.history._round }));
                        attacker.imposedEffects.push(effect);
                        this.effects.push(effect);
                        if (effect.hasOwnProperty("duration") && (effect.duration === "startAttackerNext" || effect.duration === "endAttackerNext")) {
                            effect.isNextTurn = false;
                        }
                        msg += ", " + effect.toString();
                    }
                }
                this.hp.current -= damage;
                if (this.hp.current < 0 && !this.hasCondition("dying")) {
                    this.effects.push(new Effect({ name: "Dying", round: this.history._round, target: this }));
                    msg += "; " + this.name + " falls unconscious and is dying";
                }
//                this.addDamageIndicator(damage, type);
//                this.dispatchEvent({ type: "takeDamage", damage: { amount: damage, type: type } });
                result = {
                    msg: msg,
                    damage: damage,
                    type: type
                };

                return result;
            };

            Actor.prototype.startTurn = function() {
                var ongoingDamage, handleEffect, handleImposedEffect, i, recharge, regen, tmp, msg;
                this.__log("startTurn", arguments);
                msg = null;

                ongoingDamage = function(effect) {
                    if (effect.name.toLowerCase() === "ongoing damage") {
                        this.takeDamage(effect.attacker, effect.amount, effect.type, null);
                        this.history.add(new History.Entry({ round: this.history._round, subject: this, message: "Took " + effect.amount + " ongoing " + (effect.type ? effect.type : "") + " damage" }));
                    }
                }.bind(this);

                handleEffect = function(effect) {
                    var i;
                    if (effect.countDown(this.history._round, true, true)) {
                        this.history.add(new History.Entry({ round: this.history._round, subject: this, message: effect.name + " effect expired" }));
                    }

                    ongoingDamage(effect);
                    if (effect.children && effect.children.length) {
                        for (i = 0; i < effect.children.length; i++) {
                            handleEffect(effect.children[ i ]);
                        }
                    }
                }.bind(this);

                handleImposedEffect = function(effect) {
                    var i;
                    if (effect.countDown(this.history._round, false, true)) {
                        effect.target.history.add(new History.Entry({ round: effect.target.history._round, subject: effect.target, message: effect.name + " effect expired" }));
                    }
                    if (effect.children && effect.children.length) {
                        for (i = 0; i < effect.children.length; i++) {
                            handleImposedEffect(effect.children[ i ]);
                        }
                    }
                }.bind(this);

                for (i = 0; this.attacks && i < this.attacks.length; i++) {
                    if (this.attacks[ i ].used && this.attacks[ i ].usage.frequency === Attack.prototype.USAGE_RECHARGE && this.attacks[ i ].usage.recharge) {
                        recharge = new Recharge({ attack: this.attacks[ i ] });
                        recharge.roll();
                        if (recharge.isRecharged()) {
                            this.attacks[ i ].used = false;
                            this.history.add(new History.Entry({ round: this.history._round, subject: this, message: recharge.anchor() }));
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
                    this.history.add(new History.Entry({ round: this.history._round, subject: this, message: "Regenerated " + regen + " HP" }));
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
                    var i, savingThrow, savingThrowRoll;
                    if (effect.countDown(this.history._round, true, false)) {
                        this.history.add(new History.Entry({ round: this.history._round, subject: this, message: effect.name + " effect expired" }));
                    }

                    if (effect.saveEnds) {
                        savingThrow = new SavingThrow({ effect: effect });
                        if (this.isPC) {
                            pcSavingThrows.push(effect);
                            return;
                        }
                        savingThrowRoll = savingThrow.roll();
                        if (savingThrowRoll >= 10) {
                            effect.remove();
                        }
                        this.history.add(new History.Entry({ round: this.history._round, subject: this, message: savingThrow.anchor() }));
                    }

                    if (effect.children && effect.children.length) {
                        for (i = 0; i < effect.children.length; i++) {
                            handleEffect(effect.children[ i ]);
                        }
                    }
                }.bind(this);

                handleImposedEffect = function(effect) {
                    var i;
                    if (effect.countDown(this.history._round, false, false)) {
                        effect.target.history.add(new History.Entry({ round: effect.target.history._round, subject: effect.target, message: effect.name + " effect expired" }));
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
                    effect.remove();
                    msg = savingThrow.anchor();
                    this.history.add(new History.Entry({ round: this.history._round, subject: this, message: msg }));
                }.bind(this);
                fail = function(effect) {
                    var savingThrow, msg;
                    savingThrow = new SavingThrow({ effect: effect });
                    savingThrow.add(1);
                    msg = savingThrow.anchor();
                    this.history.add(new History.Entry({ round: this.history._round, subject: this, message: msg }));
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


            /**
             * @param $table jQuery("<table/>") The parent table element
             * @param isCurrent {Boolean} Indicates if it is this Creature's turn in the initiative order
             * @param order {Object} The click handlers for the move initiative order actions
             * @param order.up {Function} The click handler for the move initiative order up action
             * @param order.down {Function} The click handler for the move initiative order down action
             * @param attack {Function} The click handler for the attack action
             * @param heal {Function} The click handler for the heal action
             */
            Actor.prototype.createTr = function(params) {
                this.__log("createTr", arguments);
                params = params || {};
                params.actor = this;
                params.history = this.history;
                this.tr = new ActorRow(params);
            };

            /**
             * @param params Object
             * @param params.$parent {jQuery(element)} The parent element
             * @param params.isCurrent {Boolean} Indicates if it is this Creature's turn in the initiative order
             * @param params.className {String} Class(es) to apply to the top-level element
             * @param params.cardSize {Number} The height of the card
             * @param params.showPcHp {Boolean} Display PC HP
             */
            Actor.prototype.createCard = function(params) {
                this.__log("createCard", arguments);
                params = params || {};
                params.actor = this;
                this.card = new ActorCard(params);
                return this.card;
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

            Actor.prototype._save = function() {
                var data = this.raw();
                if (data === this.__lastData) {
                    return;
                }
                this.__storage.write(this.name, data);
                this.__lastData = data;
            };


            return Actor;
        },
        includeInNamespace: true,
        namespace: "DnD"
    });

})();