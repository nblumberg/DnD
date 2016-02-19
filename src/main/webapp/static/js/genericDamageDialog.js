/* global DnD:true */

(function(jQuery) {
    "use strict";

    var NO_URL = "javascript";
    NO_URL += ":void(0);";

    if (!DnD) {
        DnD = {};
    }
    if (!DnD.Dialog) {
        DnD.Dialog = {};
    }


    // CONSTRUCTOR & INITIALIZATION METHODS

    function GenericDamageDialog(params) {
        this.$damageDescription = null;
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
        this.actors = params.actors;
        this.combatAdvantage = false;

        this._init(params);
    }

    GenericDamageDialog.prototype = new DnD.Dialog("genericDamageDialog", "/html/partials/GenericDamageDialog.html");

    GenericDamageDialog.prototype._onReady = function() {
        var _self = this;
        this.$damageDescription = this.$dialog.find("#damageDescription");
        this.$damage = this.$dialog.find(".column2 .damage");
        this.$keywords = this.$dialog.find(".column2 .keywords");
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

    GenericDamageDialog.prototype.show = function(params) {
        var i, target;
        this.combatAdvantage = !!params.combatAdvantage;
        this._combatAdvantageChange();
        this.$targets.children().remove();
        for (i = 0; i < this.actors.length; i++) {
            target = this.actors[ i ];
            jQuery("<option/>").html(target.name).data("target", target).appendTo(this.$targets);
        }
        this.$playerAttackRoll.val("");
        this.$playerAttackCrit.val("");
        this.$playerDamageRoll.val("");

        DnD.Dialog.prototype.show.call(this);
    };


    // PRIVATE METHODS

    GenericDamageDialog.prototype._resolveAttack = function() {
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
            if (this.attack.usage.frequency && this.attack.usage.frequency !== DnD.Attack.prototype.USAGE_AT_WILL) {
                this.attack.used = true;
            }
            this.callback({ type: "takeDamage", attacker: this.attacker.id, attack: this.attack.name, hits: result.hits, misses: result.misses });
        }
        else {
            window.alert("Please select both an attack and 1 or more valid target(s)");
        }
    };

    GenericDamageDialog.prototype._notifyTargets = function() {
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
    GenericDamageDialog.prototype._stringifyDamage = function() {
        var d, w, plus;
        d = this.attack ? this.attack.damage.toString() : "";
        w = this.weapon && this.weapon.damage ? this.weapon.damage.toString() : "W";
        plus = this.weapon ? this.weapon.enhancement : "";
        this.$damage.html((plus ? "" + plus + " + " : "") + d.replace("[W]", "[" + w + "]"));
    };

    GenericDamageDialog.prototype._combatAdvantageChange = function() {
        this.$combatAdvantage.attr("src", this.combatAdvantage ? "/images/symbols/combat_advantage.png" : "/images/symbols/attack.png").data("combatAdvantage", this.combatAdvantage);
    };

    GenericDamageDialog.prototype._targetsChange = function() {
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

    GenericDamageDialog.prototype._playerAttackChange = function() {
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
                if (toHit >= this.targets[ i ].defenses[ this.attack.defense.toLowerCase() ]) {
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


    DnD.Dialog.GenericDamage = GenericDamageDialog;
})(window.jQuery);