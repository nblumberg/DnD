(function() {
    "use strict";

    DnD.define(
        "Display.Dialog.GenericEffect",
        [ "window", "Display.Dialog", "jQuery", "out", "K", "Effect", "Creature", "Actor", "Attack", "Damage" ],
        function(w, Dialog, jQuery, out, K, Effect, Creature, Actor, Attack, Damage) {
            // CONSTRUCTOR & INITIALIZATION METHODS

            function GenericEffectDialog(params) {
                this.$name = null;
                this.$defense = null;
                this.$attackBonus = null;
                this.$damageDice = null;
                this.$damageDie = null;
                this.$damageBonus = null;
                this.$damageType = null;
                this.$effects = null;
                this.$newEffect = null;
                this.$newEffectAmount = null;
                this.$newEffectDuration = null;
                this.$addEffect = null;
                this.$keywords = null;
                this.$damage = null;
                this.$keywordsParsed = null;
                this.$combatAdvantage = null;
                this.$targets = null;
                this.$playerAttackRoll = null;
                this.$playerAttackCrit = null;
                this.$playerDamageRoll = null;
                this.buttons = {
                    $cause: null
                };
                this.actor = { name: "The DM", imposedEffects: [] };
                this.actor.attack = Actor.prototype.attack.bind(this.actor);
                this.actor.__log = Actor.prototype.__log.bind(this.actor);
                this.actor._attackToHit = Actor.prototype._attackToHit.bind(this.actor);
                this.actor._attackDamage = Actor.prototype._attackDamage.bind(this.actor);
                this.actor._attackTarget = Actor.prototype._attackTarget.bind(this.actor);
                this.actor.hasCondition = function() { return false; };
                this.actor._attackBonuses = function() { return []; };
                this.callback = params.callback;
                this.damage = "0";
                this.effects = [];
                this.keywords = [];
                this.targets = [];
                this.combatAdvantage = false;

                this._init(params);
            }

            GenericEffectDialog.prototype = new Dialog("genericEffectDialog", "/html/partials/GenericEffectDialog.html");

            GenericEffectDialog.prototype._onReady = function() {
                var i, j;

                this.$name = this.$dialog.find("#name").on({
                    "keyup": this._nameChange.bind(this),
                    "change": this._nameChange.bind(this)
                });
                this.$defense = this.$dialog.find("#defense").on("change", this._attackChange.bind(this));
                this.$attackBonus = this.$dialog.find("#attackBonus").on({
                    "keyup": this._attackChange.bind(this),
                    "change": this._attackChange.bind(this)
                });
                this.$damageDice = this.$dialog.find("#damageDice").on({
                    "keyup": this._damageChange.bind(this),
                    "change": this._damageChange.bind(this)
                });
                this.$damageDie = this.$dialog.find("#damageDie").on({
                    "keyup": this._damageChange.bind(this),
                    "change": this._damageChange.bind(this)
                });
                this.$damageBonus = this.$dialog.find("#damageBonus").on({
                    "keyup": this._damageChange.bind(this),
                    "change": this._damageChange.bind(this)
                });
                this.$damageType = this.$dialog.find("#damageType").on({
                    "keyup": this._damageChange.bind(this),
                    "change": this._damageChange.bind(this)
                });
                this.$effects = this.$dialog.find("#effects");
                this.$newEffect = this.$dialog.find("#newEffect");
                this.$newEffectAmount = this.$dialog.find("#newEffectAmount");
                for (i in Effect.CONDITIONS) {
                    if (Effect.CONDITIONS.hasOwnProperty(i)) {
                        if (Effect.CONDITIONS[ i ].hasOwnProperty("image")) {
                            jQuery("<option/>").html(i).data("effect", { name: i }).appendTo(this.$newEffect);
                        }
                        else {
                            for (j in Effect.CONDITIONS[ i ]) {
                                if (Effect.CONDITIONS[ i ].hasOwnProperty(j) && j !== "image") {
                                    jQuery("<option/>").html(i + " (" + j + ")").data("effect", { name: i, type: j }).appendTo(this.$newEffect);
                                }
                            }
                        }
                    }
                }
                this.$newEffectDuration = this.$dialog.find("#newEffectDuration");
                this.$addEffect = this.$dialog.find("#addEffect").on("click", this._addEffect.bind(this));
                this.$keywords = this.$dialog.find("#keywords").on({
                    "keyup": this._keywordsChange.bind(this),
                    "change": this._keywordsChange.bind(this)
                });

                this.$damage = this.$dialog.find(".column2 .damage");
                this.$keywordsParsed = this.$dialog.find(".column2 .keywordsParsed");
                this.$combatAdvantage = this.$dialog.find("#combatAdvantage").data("combatAdvantage", false).on({ click: function() {
                    this.combatAdvantage = !this.combatAdvantage;
                    this._combatAdvantageChange();
                }.bind(this) });
                this.$targets = this.$dialog.find("#targetSelect").on({ dblclick: this._resolveEffect.bind(this), change: this._targetsChange.bind(this) });
                this.$playerAttackRoll = this.$dialog.find("#playerAttackRoll").on({ change: this._attackChange.bind(this), keyup: this._attackChange.bind(this) });
                this.$playerAttackCrit = this.$dialog.find("#playerAttackCrit").on({ change: this._attackChange.bind(this) });
                this.$playerDamageRoll = this.$dialog.find("#playerDamageRoll");
                this.buttons.$cause = this.$dialog.find(".causeBtn").on({ click: this._resolveEffect.bind(this) });
                this._onOkButtonClick = this._resolveEffect.bind(this);
            };

            // OVERRIDDEN METHODS

            GenericEffectDialog.prototype.show = function(params) {
                var i, target;

                this.effects = [];
                this.$effects.children().remove();
                this.combatAdvantage = !!params.combatAdvantage;
                this._combatAdvantageChange();
                this.$targets.children().remove();
                for (i in Creature.actors) {
                    if (Creature.actors.hasOwnProperty(i)) {
                        target = Creature.actors[ i ];
                        jQuery("<option/>").html(target.name).data("target", target).appendTo(this.$targets);
                    }
                }
                this.$playerAttackRoll.val("");
                this.$playerAttackCrit.val("");
                this.$playerDamageRoll.val("");

                Dialog.prototype.show.call(this);
            };


            // NON-PUBLIC METHODS

            GenericEffectDialog.prototype._addEffect = function() {
                var o, duration, amount, $effect, $remove;
                o = jQuery.extend({}, jQuery(this.$newEffect[ 0 ].options[ this.$newEffect[ 0 ].selectedIndex ]).data("effect"));
                duration = this.$newEffectDuration.val();
                if (duration === "saveEnds") {
                    o.saveEnds = true;
                }
                else if (duration) {
                    o.duration = this.$newEffectDuration.val();
                }
                amount = parseInt(this.$newEffectAmount.val(), 10);
                if (amount) {
                    o.amount = amount;
                }
                this.effects.push(o);
                $effect = jQuery("<div><strong>" + o.name + "</strong>" + (o.type ? " (" + o.type + ")" : "") + (o.amount ? " " + o.amount : "") + (o.duration ? " " + o.duration : "") + "</div>");
                $remove = jQuery("<button class=\"removeEffect btn btn-default\" style=\"margin-left: 1rem;\"><i class=\"icon-minus icon-white\">-</i></button>").on("click", function() {
                    this.effects.splice(this.effects.indexOf(o), 1);
                    $effect.remove();
                }.bind(this)).appendTo($effect);
                this.$effects.append($effect);
            };


            GenericEffectDialog.prototype._resolveEffect = function() {
                var attack, playerRolls, result;
                attack = new Attack({
                    name: this.$name.val().trim(),
                    toHit: this.$defense.val() === "automatic" ? "automatic" : parseInt(this.$attackBonus.val(), 10),
                    defense: this.$defense.val() === "automatic" ? "ac" : this.$defense.val(),
                    damage: this.damage,
                    effects: this.effects,
                    keywords: this.keywords
                });
                playerRolls = null;
                if (attack.name && attack.defense && attack.toHit && attack.damage && this.targets.length) {
                    this.hide();
                    if (this.$playerAttackRoll.val() || this.$playerAttackCrit.val() || this.$playerDamageRoll.val()) {
                        playerRolls = { attack: { roll: parseInt(this.$playerAttackRoll.val(), 10), isCritical: this.$playerAttackCrit.val() === "crit", isFumble: this.$playerAttackCrit.val() === "fail" }, damage: parseInt(this.$playerDamageRoll.val(), 10) };
                    }
                    result = this.actor.attack(attack, null, this.targets, this.combatAdvantage, playerRolls);
                    this.callback({ type: "takeDamage", attacker: this.actor.id, attack: attack.name, hits: result.hits, misses: result.misses });
                }
                else {
                    w.alert("Please select both an attack and 1 or more valid target(s)");
                }
            };

            GenericEffectDialog.prototype._notifyTargets = function() {
                var name, i, targets = [];
                name = this.$name.val();
                if (!this.name || !this.targets || !this.targets.length) {
                    return;
                }
                for (i = 0; i < this.targets.length; i++) {
                    targets.push({ id: this.targets[ i ].id, name: this.targets[ i ].name });
                }
                this.callback({ type: "attack", attack: name, targets: targets });
            };


            // Data binding methods
            GenericEffectDialog.prototype._nameChange = function() {
                this._notifyTargets();
            };

            GenericEffectDialog.prototype._attackChange = function() {
                var $controlGroup, defense, toHit, i, hit, miss;
                $controlGroup = this.$playerAttackRoll.parent();
                $controlGroup.removeClass("has-error");
                $controlGroup.removeClass("has-success");
                $controlGroup.removeClass("has-warning");
                defense = this.$defense.val();
                if (defense === "automatic") {
                    $controlGroup.addClass("has-success");
                }
                else if (this.$playerAttackCrit.val() === "crit") {
                    $controlGroup.addClass("has-success");
                }
                else if (this.$playerAttackCrit.val() === "fail") {
                    $controlGroup.addClass("has-error");
                }
                else if (defense && this.targets.length) {
                    toHit = parseInt(this.$playerAttackRoll.val() || "0", 10) + parseInt(this.$attackBonus.val() || "0", 10) + (this.combatAdvantage ? 2 : 0);
                    hit = false;
                    miss = false;
                    for (i = 0; i < this.targets.length; i++) {
                        if (toHit >= this.targets[ i ].defenses[ defense.toLowerCase() ]) {
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

            GenericEffectDialog.prototype._damageChange = function() {
                var tmp, dice, die, damageStr;
                tmp = this.$damageDice.val().trim();
                if (tmp && !isNaN(parseInt(tmp, 10))) {
                    dice = tmp;
                }
                tmp = this.$damageDie.val().trim();
                if (tmp && !isNaN(parseInt(tmp, 10))) {
                    die = tmp;
                }
                damageStr = dice && die ? dice + "d" + die : "";
                tmp = this.$damageBonus.val().trim();
                if (tmp && !isNaN(parseInt(tmp, 10))) {
                    damageStr += (damageStr ? "+" : "") + tmp;
                }
                damageStr = damageStr || "0";
                this.damage = {
                    amount: damageStr
                };
                tmp = this.$damageType.val().trim();
                this.damage.type = tmp ? tmp : undefined;
                this.$damage.html(new Damage(this.damage).toString());
                this._keywordsChange();
            };

            GenericEffectDialog.prototype._keywordsChange = function() {
                var tmp;
                function map(value) {
                    return typeof value === "string" ? value.trim() : "";
                }
                this.keywords = this.$keywords.val().trim().split(",").map(map) || [];
                tmp = this.$damageType.val().trim();
                if (tmp) {
                    this.keywords = this.keywords.concat(tmp.split(",").map(map));
                }
                this.$keywordsParsed.html(this.keywords.join(", "));
            };

            GenericEffectDialog.prototype._combatAdvantageChange = function() {
                this.$combatAdvantage.attr("src", this.combatAdvantage ? "/images/symbols/combat_advantage.png" : "/images/symbols/attack.png").data("combatAdvantage", this.combatAdvantage);
            };

            GenericEffectDialog.prototype._targetsChange = function() {
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

            return GenericEffectDialog;
        },
        true
    );

})();