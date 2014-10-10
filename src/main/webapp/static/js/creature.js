/* global DnD:true, safeConsole, logFn, EventDispatcher */

/* exported Defenses, HP, Surges, Implement, Weapon, Abilities, Creature, Actor */
var Defenses, HP, Surges, Implement, Weapon, Abilities, Creature, Actor;

(function(console) {
    "use strict";

    Defenses = function(params) {
        logFn("Defenses", "constructor", arguments);
        params = params || {};
        this.ac = params.ac || 10;
        this.fort = params.fort || 10;
        this.ref = params.ref || 10;
        this.will = params.will || 10;
        this.resistances = params.resistances || {};
        this.toString = function() { return "[Defenses]"; };
    };


    HP = function(params) {
        logFn("HP", "constructor", arguments);
        params = params || {};
        this.total = params.total || 1;
        this.current = params.current || this.total;
        this.temp = params.temp || 0;
        this.regeneration = params.regeneration || 0;
        this.toString = function() { return "[HP]"; };
    };


    Surges = function(params) {
        logFn("Surges", "constructor", arguments);
        params = params || {};
        this.perDay = params.perDay || 0;
        this.current = params.current || this.perDay;
        this.toString = function() { return "[Surges]"; };
    };


    Implement = function(params) {
        this.__log = logFn.bind(this, "Implement");
        this.__log("constructor", arguments);
        this._init(params);
    };

    Implement.prototype._init = function(params) {
        this.__log("_init", arguments);
        params = params || {};
        this.name = params.name;
        this.enhancement = params.enhancement;
        this.crit = new DnD.Damage(params.crit);
        this.isMelee = false;
        this.type = params.type;
    };

    Implement.prototype.toString = function() {
        this.__log("toString", arguments);
        return "[Implement \"" + this.name + "\"]";
    };


    Weapon = function(params) {
        this.__log = logFn.bind(this, "Weapon");
        params = params || {};
        this._init(params);
        this.isMelee = params.isMelee || false;
        this.proficiency = params.proficiency || 0;
        this.damage = new DnD.Damage(params.damage);
    };

    Weapon.prototype = new Implement();

    Weapon.prototype.toString = function() {
        this.__log("toString", arguments);
        return "[Weapon \"" + this.name + "\"]";
    };



    Abilities = function(params) {
        var i, ability, abilities;
        logFn("Abiltiies", "constructor", arguments);
        abilities = [ "STR", "DEX", "CON", "INT", "WIS", "CHA" ];
        params = params || {};
        for (i = 0; i < abilities.length; i++) {
            ability = abilities[ i ];
            this[ ability ] = params[ ability ] || 10;
            this[ ability + "mod" ] = Math.floor((this[ ability ] - 10) / 2);
        }
        this.toString = function() { return "[Abilities]"; };
    };



    Creature = function(params) {
        this.__log = logFn.bind(this, "Creature");
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
                console.debug("Replacing Creature.creatures[ " + this.name + " ]");
            }
            Creature.creatures[ this.name ] = this;
        }

        // Other properties
        this._init(params);
    };

    Creature.id = (new Date()).getTime();
    Creature.creatures = {};
    Creature.findCreature = function(id, returnIdIfNotFound) { // TODO: throw if not found?
        if (Creature.creatures.hasOwnProperty(id)) {
            return Creature.creatures[ id ];
        }
        return returnIdIfNotFound ? id : null;
    };

    Creature.prototype = new EventDispatcher();

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
            this.attacks.push(new DnD.Attack(params.attacks[ i ], this));
        }
        this.effects = [];
        for (i = 0; params.effects && i < params.effects.length; i++) {
            this.effects.push(new DnD.Effect(jQuery.extend({}, params.effects[ i ], { target: this })));
        }
    };

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

    Creature.prototype._attackBonuses = function(attack, item, target, combatAdvantage) {
        /* jshint unused:false */
        var i, j, attackBonuses, attackBonus, isMatch;
        this.__log("_attackBonuses", arguments);

        attackBonuses = [];

        if (this.attackBonuses) {
            for (i = 0; i < this.attackBonuses.length; i++) {
                attackBonus = this.attackBonuses[ i ];
                // Attack matches defense
                isMatch = true;
                if (attackBonus.defense && attackBonus.defense.toLowerCase() !== attack.defense.toLowerCase()) {
                    isMatch = false;
                }
                if (!isMatch) {
                    continue;
                }
                // Attack matches keywords
                isMatch = true;
                if (attackBonus.keywords && attack.keywords) {
                    for (j = 0; j < attackBonus.keywords; j++) {
                        if (attack.keywords.indexOf(attackBonus.keywords[ j ]) === -1) {
                            isMatch = false;
                            break;
                        }
                    }
                }
                if (!isMatch) {
                    continue;
                }
                // Attack matches attacker status
                isMatch = true;
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
        return "[Creature \"" + this.name + "\"]";
    };


    Actor = function(creature, count, currentState) {
        var i;
        this.__log = logFn.bind(this, "Actor");
        this.__log("constructor", [ creature ? creature.name : "undefined", count, "currentState" ]);

        if (creature instanceof Creature) {
            creature = creature.raw();
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
            console.debug("Replacing Creature.actors[ " + this.name + " ]");
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
                this.effects.push(new DnD.Effect(jQuery.extend({}, currentState.effects[ i ], { target: this })));
            }
        }
    };

    Actor.prototype = new Creature();

    Creature.actors = {};
    Actor.findActor = function(id, returnIdIfNotFound) { // TODO: throw if not found?
        if (Creature.actors.hasOwnProperty(id)) {
            return Creature.actors[ id ];
        }
        return returnIdIfNotFound ? id : null;
    };

    Actor.prototype._init = function(params, currentState) {
        var data;
        this.__log("_init", [ params.name, "currentState" ]);
        Creature.prototype._init.call(this, params);
        data = jQuery.extend(
            { includeSubject: false },
            (currentState ? currentState.history : null) || params.history,
            { _roundTimes: (currentState ? currentState._turnDurations : null ) }
        );
        this.history = new DnD.History(data);
        this._turnTimer = (new Date()).getTime();
    };

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
        return { hits: hits, misses: misses };
    };

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
                attack.addItem(item, manualRolls.attack.roll, manualRolls.attack.isCritical, manualRolls.attack.isFumble);
            }
            else {
                toHit.roll = item ? attack.rollItem(item) : attack.roll(); // TODO: attack.meleeExtra vs. attack.rangdExtra when no item - how to determine isMelee?
            }
            toHit.isCrit = attack.isCritical() && (!manualRolls || !manualRolls.attack || manualRolls.attack.isCritical);
            toHit.isFumble = attack.isFumble() && (!manualRolls || !manualRolls.attack || manualRolls.attack.isFumble);
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
            if (Object.prototype.toString.call(attack.damage) === "[object Array]") {
                for (i = 0; i < attack.damage.length; i++) {
                    attack.damage[ i ].addItem(Math.round(manualRolls.damage / attack.damage.length), item, isCrit);
                }
                if (attack.hasOwnProperty("miss")) {
                    if (attack.miss.halfDamage) {
                        for (i = 0; attack.hasOwnProperty("miss") && i < attack.miss.damage.length; i++) {
                            attack.miss.damage[ i ].addItem(Math.round(manualRolls.damage / attack.damage.length / 2), item, isCrit);
                        }
                    }
                    else {
                        attack.miss.damage.addItem(manualRolls.damage, item, false);
                    }
                }
            }
            else {
                attack.damage.addItem(manualRolls.damage, item, isCrit);
            }
        }
        else {
            if (Object.prototype.toString.call(attack.damage) === "[object Array]") {
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
                    if (Object.prototype.toString.call(attack.miss.damage) === "[object Array]") {
                        attack.miss.damage[0].addItem(damage.amount, item, false);
                    }
                    else {
                        attack.miss.damage.addItem(damage.amount, item, false);
                    }
                }
                else if (attack.miss.hasOwnProperty("damage")) {
                    if (Object.prototype.toString.call(attack.miss.damage) === "[object Array]") {
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

    Actor.prototype._attackTarget = function(attack, item, combatAdvantage, target, toHit, damage) {
        var attackBonuses, i, attackBonus, toHitTarget, targetDamage, tmp, targetDefense, msg, result, entry;
        this.__log("_attackTarget", [ attack.name, item ? item.name : "undefined", combatAdvantage, target.name, toHit, damage ]);

        targetDefense = null;
        result = { hit: false, damage: [] };

        toHitTarget = {
            roll: toHit.roll + (toHit.conditional.mod ? toHit.conditional.mod : 0),
            conditional: jQuery.extend({ mod: 0, breakdown: "" }, toHit.conditional)
        };
        targetDamage = {
            amount: damage.amount,
            effects: attack.effects ? attack.effects.slice(0) : [],
            missAmount: damage.missAmount,
            missEffects: attack.miss && attack.miss.effects ? attack.miss.effects.slice(0) : [],
            conditional: jQuery.extend({ mod: 0, total: 0, breakdown: "" }, damage.conditional)
        };

        attackBonuses = this._attackBonuses(attack, item, target, combatAdvantage);
        function applyBonusDamage(name, damageExpr, isMiss, halfDamage, isManual) {
            var damage, amount;
            damage = new DnD.Damage(typeof damageExpr === "number" ? "" + damageExpr : damageExpr);
            amount = halfDamage ? Math.floor(damage.roll() / 2) : damage.roll();
            if (!isManual) {
                if (isMiss) {
                    targetDamage.missAmount += amount;
                }
                else {
                    targetDamage.amount += amount;
                    targetDamage.conditional.total += amount; // TODO: why is this on hit only?
                }
                targetDamage.conditional.mod += amount;
            }
            targetDamage.conditional.breakdown += (amount >= 0 ? " +" : "") + amount + " (" + name + ")";

        }
        for (i = 0; attackBonuses && i < attackBonuses.length; i++) {
            attackBonus = attackBonuses[ i ];
            if (attackBonus.toHit) {
                if (!damage.isManual) {
                    toHitTarget.roll += attackBonus.toHit;
                    toHitTarget.conditional.mod += attackBonus.toHit;
                }
                toHitTarget.conditional.breakdown += (attackBonus.toHit >= 0 ? " +" : "") + attackBonus.toHit + " (" + attackBonus.name + ")";
            }
            if (attackBonus.damage) {
                applyBonusDamage(attackBonus.name, attackBonus.damage, false, false, damage.isManual);
                if (attack.miss && targetDamage.missAmount) {
                    if (attack.miss.halfDamage) {
                        applyBonusDamage(attackBonus.name, attackBonus.damage, true, true, damage.isManual);
                    }
                    else {
                        applyBonusDamage(attackBonus.name, attackBonus.damage, true, false, damage.isManual);
                    }
                }
            }
            if (attackBonus.effects) {
                targetDamage.effects = targetDamage.effects.concat(attackBonus.effects);
                targetDamage.missEffects = targetDamage.missEffects.concat(attackBonus.effects);
            }
        }

        // Calculate hit (for this target)
        if (!toHit.isAutomaticHit && !toHit.isFumble && !toHit.isCrit) {
            toHitTarget.roll += (combatAdvantage || target.grantsCombatAdvantage() ? 2 : 0);
            targetDefense = target.defenses[ attack.defense.toLowerCase() ] + target.defenseModifier(attack.isMelee);
        }

        // Apply hit or miss damage/effects
        function calcDamage(target, item, damage, effects, conditional) {
            var type, amount;
            type = damage.type || (item ? item.type : undefined); // if item imposes a damage type on untyped damage
            targetDamage.conditional.text = (!damage.type && type ? " " + type : "");
            msg += damage.anchor(conditional);
            amount = damage.getLastRoll().total + (conditional ? conditional.mod : 0);
            tmp = target.takeDamage(this, amount, type, effects);
            msg += tmp.msg;
            result.damage.push({ amount: tmp.damage, type: type });
        }
        if (toHit.isAutomaticHit || toHit.isCrit || toHitTarget.roll >= targetDefense) {
            // Hit
            result.hit = true;
            msg = "Hit by " + this.name + "'s " + attack.anchor(toHitTarget.conditional) + " for ";
            if (Object.prototype.toString.call(attack.damage) === "[object Array]") {
                for (i = 0; i < attack.damage.length; i++) {
                    if (i !== 0) {
                        msg += " and ";
                    }
                    calcDamage.call(this, target, item, attack.damage[ i ], i === attack.damage.length - 1 ? targetDamage.effects : null, i === 0 ? targetDamage.conditional : null, false);
                }
            }
            else {
                calcDamage.call(this, target, item, attack.damage, targetDamage.effects, targetDamage.conditional, false);
            }
        }
        else {
            // Miss
            msg = "Missed by " + this.name + "'s " + attack.anchor(toHit.conditional);
            if (targetDamage.missAmount || attack.hasOwnProperty("miss")) {
                msg += " but takes ";
                if (Object.prototype.toString.call(attack.miss.damage) === "[object Array]") {
                    for (i = 0; i < attack.miss.damage.length; i++) {
                        if (i !== 0) {
                            msg += " and ";
                        }
                        calcDamage.call(this, target, item, attack.miss.damage[ i ], i === attack.miss.damage.length - 1 ? targetDamage.missEffects : null, i === 0 ? targetDamage.conditional : null, true);
                    }
                }
                else {
                    calcDamage.call(this, target, item, attack.miss.damage, targetDamage.missEffects, targetDamage.conditional, true);
                }
                msg += " on a miss";
                // TODO: miss effects without damage
            }
        }
        msg += " (HP " + target.hp.current + ")";

        // Record in target and central Histories
        entry = new DnD.History.Entry({ subject: target, message: msg });
        target.history.add(entry);
        DnD.History.central.add(entry);
        console.info(target.name + " " + msg.charAt(0).toLowerCase() + msg.substr(1));

        return result;
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
        this.__log("takeDamage", [ attacker.name, damage, type, effects ]);
        if (typeof(damage) !== "number") {
            console.error("Creature.takeDamage() received NaN damage value");
            return;
        }
        // ^^^ DEBUGGING
        msg = "";
        function applyVulnerability(type) {
            var temp, i;
            temp = 0;
            if (this.vulnerabilities && this.vulnerabilities[ type ]) {
                temp = this.vulnerabilities[ type ];
            }
            for (i = 0; i < this.effects.length; i++) {
                if (this.effects[ i ].name.toLowerCase() === "vulnerable" && this.effects[ i ].type.toLowerCase() === type.toLowerCase()) {
                    temp = Math.max(temp, this.effects[ i ].amount);
                }
            }
            if (temp) {
                msg += " and " + temp + " " + type + " vulnerability";
                damage += temp;
            }
        }
        function applyResistance(type) {
            var temp, i;
            if (this.resistances) {
                temp = Infinity;
                if (typeof type === "string" && this.resistances.hasOwnProperty(type)) {
                    temp = this.resistances[ type ];
                }
                else if (type.constructor === Array) {
                    // The creature can only resist multi-type damage if it has resistance to all the types
                    // and then only resists an amount equal to the lowest of the matching resistances
                    for (i = 0; i < type.length; i++) {
                        if (this.resistances.hasOwnProperty(type[ i ])) {
                            temp = Math.min(this.resistances[ type[ i ] ], temp);
                        }
                    }
                }
                if (temp !== Infinity) {
                    msg += " (resisted " + Math.min(damage, temp) + ")";
                    damage = Math.max(damage - temp, 0);                    
                }
            }
        }
        if (type) {
            if (typeof type === "object" && type.constructor === Array) {
                for (i = 0; i < type.length; i++) {
                    applyVulnerability.call(this, type[ i ]);
                }
            }
            else {
                applyVulnerability.call(this, type);
            }
            applyResistance.call(this, type);
        }
        if (this.hp.temp) {
            temp = this.hp.temp;
            this.hp.temp = Math.max(temp - damage, 0);
            msg += " (" + Math.min(damage, temp) + " absorbed by temporary HP)";
            damage = Math.max(damage - temp, 0);
        }
        if (effects && effects.length) {
            for (i = 0; i < effects.length; i++) {
                // Only one Marked at a time
                if (effects[ i ].name.toLowerCase() === "marked") {
                    for (j = 0; j < this.effects.length; j++) {
                        if (this.effects[ j ].name.toLowerCase() === "marked") {
                            this.effects[ j ].remove();
                            break;
                        }
                    }
                }
                effect = new DnD.Effect(jQuery.extend({}, effects[ i ].raw(), { target: this, attacker: attacker, round: this.history._round }));
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
            this.effects.push(new DnD.Effect({ name: "Dying", round: this.history._round, target: this }));
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

    Actor.prototype.startTurn = function() {
        var ongoingDamage, handleEffect, handleImposedEffect, i, recharge, regen, tmp, msg;
        this.__log("startTurn", arguments);
        msg = null;

        ongoingDamage = function(effect) {
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
                this.history.add(new DnD.History.Entry({ round: this.history._round, subject: this, message: "Took " + result.damage + " ongoing " + type + " damage" + result.msg }));
            }
        }.bind(this);

        handleEffect = function(effect) {
            var i;
            if (effect.countDown(this.history._round, true, true)) {
                this.history.add(new DnD.History.Entry({ round: this.history._round, subject: this, message: effect.name + " effect expired" }));
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
                effect.target.history.add(new DnD.History.Entry({ round: effect.target.history._round, subject: effect.target, message: effect.name + " effect expired" }));
            }
            if (effect.children && effect.children.length) {
                for (i = 0; i < effect.children.length; i++) {
                    handleImposedEffect(effect.children[ i ]);
                }
            }
        }.bind(this);

        for (i = 0; this.attacks && i < this.attacks.length; i++) {
            if (this.attacks[ i ].used && this.attacks[ i ].usage.frequency === DnD.Attack.prototype.USAGE_RECHARGE && this.attacks[ i ].usage.recharge) {
                recharge = new DnD.Recharge({ attack: this.attacks[ i ], bloodied: this.isBloodied() });
                recharge.roll();
                if (recharge.isRecharged()) {
                    this.attacks[ i ].used = false;
                    this.history.add(new DnD.History.Entry({ round: this.history._round, subject: this, message: recharge.anchor() }));
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
            this.history.add(new DnD.History.Entry({ round: this.history._round, subject: this, message: "Regenerated " + regen + " HP" }));
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
            var i, savingThrow, savingThrowRoll, ae, attacker;
            if (effect.countDown(this.history._round, true, false)) {
                this.history.add(new DnD.History.Entry({ round: this.history._round, subject: this, message: effect.name + " effect expired" }));
            }

            if (effect.saveEnds) {
                savingThrow = new DnD.SavingThrow({ effect: effect });
                if (this.isPC) {
                    pcSavingThrows.push(effect);
                    return;
                }
                savingThrowRoll = savingThrow.roll();
                if (savingThrowRoll >= 10) {
                    effect.remove();
                }
                this.history.add(new DnD.History.Entry({ round: this.history._round, subject: this, message: savingThrow.anchor() }));
                if (effect.afterEffects && effect.afterEffects.length) {
                    for (i = 0; i < effect.afterEffects.length; i++) {
                        attacker = effect.afterEffects[ i ].attacker;
                        ae = new DnD.Effect(jQuery.extend({}, effect.afterEffects[ i ], { target: this, attacker: attacker, round: this.history._round }));
                        if (attacker) {
                            attacker.imposedEffects.push(ae);
                        }
                        this.effects.push(ae);
                        if (ae.hasOwnProperty("duration") && (ae.duration === "startAttackerNext" || ae.duration === "endAttackerNext")) {
                            ae.isNextTurn = false;
                        }
                    }
                }
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
                effect.target.history.add(new DnD.History.Entry({ round: effect.target.history._round, subject: effect.target, message: effect.name + " effect expired" }));
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
            savingThrow = new DnD.SavingThrow({ effect: effect });
            savingThrow.add(20);
            effect.remove();
            msg = savingThrow.anchor();
            this.history.add(new DnD.History.Entry({ round: this.history._round, subject: this, message: msg }));
        }.bind(this);
        fail = function(effect) {
            var savingThrow, msg;
            savingThrow = new DnD.SavingThrow({ effect: effect });
            savingThrow.add(1);
            msg = savingThrow.anchor();
            this.history.add(new DnD.History.Entry({ round: this.history._round, subject: this, message: msg }));
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
        this.tr = new DnD.Display.ActorRow(params);
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
        this.card = new DnD.Display.ActorCard(params);
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


    DnD.Creature = Creature;
    DnD.Creature.Defenses = Defenses;
    DnD.Creature.HP = HP;
    DnD.Creature.Surges = Surges;
    DnD.Creature.Implement = Implement;
    DnD.Creature.Weapon = Weapon;
    DnD.Creature.Abilities = Abilities;
    DnD.Actor = Actor;

})(safeConsole());
