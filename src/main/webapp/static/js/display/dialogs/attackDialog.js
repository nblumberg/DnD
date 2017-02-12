(function() {
    "use strict";

    DnD.define(
        "Display.Dialog.Attack",
        [ "window", "Display.Dialog", "jQuery", "out", "K", "Attack", "Implement", "Weapon" ],
        function(w, Dialog, jQuery, out, K, Attack, Implement, Weapon) {
            // CONSTRUCTOR & INITIALIZATION METHODS

            function AttackDialog(params) {
                this.$weapons = null;
                this.$attacks = null;
                this.$toHitBonus = null;
                this.$defense = null;
                this.$damage = null;
                this.$keywords = null;
                this.$description = null;
                this.$attacks = null;
                this.$combatAdvantage = null;
                this.$targets = null;
                this.$playerAttackRoll = null;
                this.$playerAttackCrit = null;
                this.$playerDamageRoll = null;
                this.buttons = {
                    $attack: null
                };
                this.callback = params.callback;
                this.attacker = params.attacker;
                this.attack = null;
                this.weapon = null;
                this.targets = [];
                this.combatAdvantage = false;

                this._init(params);
            }

            AttackDialog.prototype = new Dialog("attacksDialog", "/html/partials/attackDialog.html");

            AttackDialog.prototype._onReady = function() {
                var _self = this;
                this.$weapons = this.$dialog.find("#weaponSelect").on("change", this._weaponChange.bind(this));
                this.$attacks = this.$dialog.find("#attackSelect").on("click", "a", function() {
                    var $a = jQuery(this);
                    _self._attackChange($a);
                });
                this.$toHitBonus = this.$dialog.find(".column2 .toHit .bonus");
                this.$defense = this.$dialog.find(".column2 .toHit .defense");
                this.$damage = this.$dialog.find(".column2 .damage");
                this.$keywords = this.$dialog.find(".column2 .keywords");
                this.$description = this.$dialog.find(".column2 .description");
                this.$combatAdvantage = this.$dialog.find("#combatAdvantage").data("combatAdvantage", false).on({ click: function() {
                    this.combatAdvantage = !this.combatAdvantage;
                    this._combatAdvantageChange();
                }.bind(this) });
                this.$targets = this.$dialog.find("#targetSelect").on({ dblclick: this._resolveAttack.bind(this), change: this._targetsChange.bind(this) });
                this.$playerAttackRoll = this.$dialog.find("#playerAttackRoll").on({ change: this._playerAttackChange.bind(this), keyup: this._playerAttackChange.bind(this) });
                this.$playerAttackCrit = this.$dialog.find("#playerAttackCrit").on({ change: this._playerAttackChange.bind(this) });
                this.$playerDamageRoll = this.$dialog.find("#playerDamageRoll");
                this.buttons.$attack = this.$dialog.find(".attackBtn").on({ click: this._resolveAttack.bind(this) });
                this._onOkButtonClick = this._resolveAttack.bind(this);
            };

            // OVERRIDDEN METHODS

            AttackDialog.prototype.show = function(params) {
                var i, attack, target;
                if (!params || !params.attacker || !params.actors) {
                    try { out.console.warn("AttackDialog.show() invoked without sufficient parameters"); } finally {}
                    return;
                }

                this.attacker = params.attacker;
                this.$weapons.children().remove();
                this.$attacks.children().remove();
                for (i = 0; i < this.attacker.attacks.length; i++) {
                    attack = this.attacker.attacks[ i ];
                    if (attack.prepared === false) {
                        continue;
                    }
                    jQuery("<a/>").addClass("list-group-item" + (attack.usage.frequency ? " " + attack.usage.frequency.toLowerCase() : "") + (attack.used ? " used" : "")).attr("href", K.NO_URL).html(attack.name).data("attack", attack).appendTo(this.$attacks);
                }
                this.combatAdvantage = !!params.combatAdvantage;
                this._combatAdvantageChange();
                this.$targets.children().remove();
                for (i = 0; i < params.actors.length; i++) {
                    target = params.actors[ i ];
                    if (target.id === this.attacker.id) {
                        continue;
                    }
                    jQuery("<option/>").html(target.name).data("target", target).appendTo(this.$targets);
                }
                this.targets = [];
                this.$playerAttackRoll.val("");
                this.$playerAttackCrit.val("");
                this.$playerDamageRoll.val("");
                this._attackChange();

                Dialog.prototype.show.call(this);
            };


            // NON-PUBLIC METHODS

            AttackDialog.prototype._resolveAttack = function() {
                var item, playerRolls, result;
                item = null;
                playerRolls = null;
                if (this.attack && this.targets.length) {
                    this.hide();
                    if (this.attack.keywords && (this.attack.keywords.indexOf("weapon") !== -1 || this.attack.keywords.indexOf("implement") !== -1)) {
                        item = jQuery(this.$weapons[0].options[ this.$weapons[0].selectedIndex ]).data("item");
                    }
                    if (this.$playerAttackRoll.val() || this.$playerAttackCrit.val() || this.$playerDamageRoll.val()) {
                        playerRolls = { attack: { roll: parseInt(this.$playerAttackRoll.val(), 10), isCritical: this.$playerAttackCrit.val() === "crit", isFumble: this.$playerAttackCrit.val() === "fail" }, damage: parseInt(this.$playerDamageRoll.val(), 10) };
                    }
                    result = this.attacker.attack(this.attack, item, this.targets, this.combatAdvantage, playerRolls);
                    if (this.attack.usage.frequency && this.attack.usage.frequency !== Attack.prototype.USAGE_AT_WILL) {
                        this.attack.used = true;
                    }
                    this.callback({ type: "takeDamage", attacker: this.attacker.id, attack: this.attack.name, hits: result.hits, misses: result.misses });
                }
                else {
                    w.alert("Please select both an attack and 1 or more valid target(s)");
                }
            };

            AttackDialog.prototype._notifyTargets = function() {
                var i, targets = [];
                if (!this.attack || !this.targets || !this.targets.length) {
                    return;
                }
                for (i = 0; i < this.targets.length; i++) {
                    targets.push({ id: this.targets[ i ].id, name: this.targets[ i ].name });
                }
                this.callback({ type: "attack", attacker: this.attacker.id, attack: this.attacker.name + "'s " + this.attack.name, targets: targets });
            };


            // Data binding methods
            AttackDialog.prototype._stringifyDamage = function() {
                var d, w, proficiency, enhancement;
                d = this.attack ? this.attack.damage.toString() : "";
                w = this.weapon && this.weapon.damage ? this.weapon.damage.toString() : "W";
                proficiency = enhancement = 0;
                if (this.weapon) {
                    proficiency = this.weapon.proficiency || 0;
                    enhancement = this.weapon.enhancement || 0;
                }
                if (typeof this.attack.toHit === "number") {
                    this.$toHitBonus.html(this.attack.toHit + proficiency + enhancement);
                }
                else if (typeof this.attack.toHit === "string") {
                    if (this.attack.toHit === "automatic") {
                        this.$toHitBonus.html("automatic");
                    }
                    else {
                        this.$toHitBonus.html(this.attacker.abilities[ this.attack.toHit + "mod" ] + Math.floor(this.attacker.level / 2) + proficiency + enhancement);
                    }
                }
                this.$defense.html(this.attack.defense);
                this.$damage.html((enhancement ? "" + enhancement + " + " : "") + d.replace("[W]", "[" + w + "]"));
            };

            AttackDialog.prototype._attackChange = function($a) {
                var str, needsWeapon, needsImplement, items, isMelee, isRanged, i, $option;
                needsWeapon = needsImplement = false;
                isMelee = isRanged = items = null;
                this.weapon = null;
                if (!$a) {
                    this.attack = null;
                    this.$weapons.hide();
                    return;
                }
                this.$attacks.find("a").removeClass("active");
                this.attack = $a.addClass("active").data("attack");

                if (this.attack.keywords && this.attack.keywords.length) {
                    str = "";
                    for (i = 0; i < this.attack.keywords.length; i++) {
                        str += (str ? ", " : "") + this.attack.keywords[ i ];
                    }
                    this.$keywords.html(str);

                    needsWeapon = this.attack.keywords.indexOf("weapon") !== -1;
                    isMelee = needsWeapon && this.attack.keywords.indexOf("melee") !== -1;
                    isRanged = needsWeapon && this.attack.keywords.indexOf("ranged") !== -1;
                    needsImplement = this.attack.keywords.indexOf("implement") !== -1;
                    if (needsWeapon) {
                        items = this.attacker.weapons;
                    }
                    if (needsImplement) {
                        items = this.attacker[ "implements" ];
                    }
                }
                this.$description.html("");
                if (this.attack.description) {
                    this.$description.html(this.attack.description);
                }
                if (needsWeapon || needsImplement) {
                    this.$weapons.html("");
                    for (i = 0; items && i < items.length; i++) {
                        if (needsWeapon && (isMelee === true || isRanged === true)) {
                            if (!(items[ i ] instanceof Weapon) || (isMelee && !items[ i ].isMelee) || (isRanged && items[ i ].isMelee === true)) { // TODO: if ((items[ i ].isMelee && !isMelee) || (!items[ i ].isMelee && !isRanged)) {
                                continue;
                            }
                        }
                        else if (needsImplement && !(items[ i ] instanceof Implement)) {
                            continue;
                        }
                        $option = jQuery("<option/>").html(items[ i ].name).data("item", items[ i ]);
                        this.$weapons.append($option);
                    }
                    this.$weapons.show();
                    this._weaponChange();
                }
                else {
                    this.$weapons.hide();
                }
                this._stringifyDamage();
                this._notifyTargets();
            };

            AttackDialog.prototype._weaponChange = function() {
                this.weapon = jQuery(this.$weapons[ 0 ].options[ this.$weapons[ 0 ].selectedIndex ]).data("item");
                this._stringifyDamage();
            };

            AttackDialog.prototype._combatAdvantageChange = function() {
                this.$combatAdvantage.attr("src", this.combatAdvantage ? "/images/symbols/combat_advantage.png" : "/images/symbols/attack.png").data("combatAdvantage", this.combatAdvantage);
            };

            AttackDialog.prototype._targetsChange = function() {
                var i;
                this.targets = [];
                for (i = 0; i < this.$targets[0].options.length; i++) {
                    if (this.$targets[0].options[ i ].selected) {
                        this.targets.push(jQuery(this.$targets[0].options[ i ]).data("target"));
                    }
                }
                this._notifyTargets();
                return this.targets;
            };

            AttackDialog.prototype._playerAttackChange = function() {
                var $controlGroup, toHit, i, hit, miss;
                $controlGroup = this.$playerAttackRoll.parent();
                $controlGroup.removeClass("has-error");
                $controlGroup.removeClass("has-success");
                $controlGroup.removeClass("has-warning");
                if (this.$playerAttackCrit.val() === "crit") {
                    $controlGroup.addClass("has-success");
                }
                else if (this.$playerAttackCrit.val() === "fail") {
                    $controlGroup.addClass("has-error");
                }
                else if (this.attack && this.targets.length) {
                    toHit = parseInt(this.$playerAttackRoll.val(), 10);
                    hit = false;
                    miss = false;
                    for (i = 0; i < this.targets.length; i++) {
                        if (toHit >= this.targets[ i ].getDefense(this.attack.defense, this.attack.isMelee)) {
                            hit = true;
                        }
                        else {
                            miss = true;
                        }
                    }
                    if (hit && miss) {
                        $controlGroup.addClass("has-warning");
                    }
                    else if (hit) {
                        $controlGroup.addClass("has-success");
                    }
                    else {
                        $controlGroup.addClass("has-error");
                    }
                }
                this._notifyTargets();
            };

            return AttackDialog;
        },
        true
    );

})();