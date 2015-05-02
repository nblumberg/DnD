(function() {
    "use strict";

    DnD.define(
        "Display.Dialog.Buff",
        [ "window", "Display.Dialog", "jQuery", "out", "K", "Attack", "Implement", "Weapon" ],
        function(w, Dialog, jQuery, out, K, Attack, Implement, Weapon) {
            // CONSTRUCTOR & INITIALIZATION METHODS

            function BuffDialog(params) {
                this.$buffs = null;
                this.$healingAmount = null;
                this.$keywords = null;
                this.$description = null;
                this.$buffs = null;
                this.$targets = null;
                this.$playerHealRoll = null;
                this.buttons = {
                    $use: null
                };
                this.callback = params.callback;
                this.caster = params.attacker;
                this.buff = null;
                this.weapon = null;
                this.targets = [];

                this._init(params);
            }

            BuffDialog.prototype = new Dialog("buffsDialog", "/html/partials/BuffDialog.html");

            BuffDialog.prototype._onReady = function() {
                var _self = this;
                this.$buffs = this.$dialog.find("#buffSelect").on("click", "a", function() {
                    var $a = jQuery(this);
                    _self._buffChange($a);
                });
                this.$healingAmount = this.$dialog.find(".column2 .healing");
                this.$keywords = this.$dialog.find(".column2 .keywords");
                this.$description = this.$dialog.find(".column2 .description");
                this.$targets = this.$dialog.find("#targetSelect").on({ dblclick: this._resolveBuff.bind(this), change: this._targetsChange.bind(this) });
                this.$playerHealRoll = this.$dialog.find("#playerHealRoll");
                this.buttons.$use = this.$dialog.find(".useBtn").on({ click: this._resolveBuff.bind(this) });
                this._onOkButtonClick = this._resolveBuff.bind(this);
            };

            // OVERRIDDEN METHODS

            BuffDialog.prototype.show = function(params) {
                var i, buff, target;
                if (!params || !params.attacker || !params.actors) {
                    try { out.console.warn("BuffDialog.show() invoked without sufficient parameters"); } finally {}
                    return;
                }

                this.caster = params.attacker;
                this.$buffs.children().remove();
                for (i = 0; i < this.caster.buffs.length; i++) {
                    buff = this.caster.buffs[ i ];
                    if (buff.prepared === false) {
                        continue;
                    }
                    jQuery("<a/>").addClass("list-group-item" + (buff.usage.frequency ? " " + buff.usage.frequency.toLowerCase() : "") + (buff.used ? " used" : "")).attr("href", K.NO_URL).html(buff.name).data("buff", buff).appendTo(this.$buffs);
                }
                this.$targets.children().remove();
                for (i = 0; i < params.actors.length; i++) {
                    target = params.actors[ i ];
                    jQuery("<option/>").html(target.name).data("target", target).appendTo(this.$targets);
                }
                this.targets = [];
                this.$playerHealRoll.val("");
                this._buffChange();

                Dialog.prototype.show.call(this);
            };


            // NON-PUBLIC METHODS

            BuffDialog.prototype._resolveBuff = function() {
                var playerRolls, result;
                playerRolls = null;
                if (this.buff && this.targets.length) {
                    this.hide();
                    result = this.caster.buff(this.buff, this.targets, parseInt(this.$playerHealRoll.val(), 10));
                    if (this.buff.usage.frequency && this.buff.usage.frequency !== Attack.prototype.USAGE_AT_WILL) {
                        this.buff.used = true;
                    }
                    this.callback({ type: "takeDamage", attacker: this.caster.id, attack: this.buff.name, hits: [], misses: [] });
                }
                else {
                    w.alert("Please select both a power and 1 or more valid target(s)");
                }
            };

            BuffDialog.prototype._notifyTargets = function() {
                var i, targets = [];
                if (!this.buff || !this.targets || !this.targets.length) {
                    return;
                }
                for (i = 0; i < this.targets.length; i++) {
                    targets.push({ id: this.targets[ i ].id, name: this.targets[ i ].name });
                }
                this.callback({ type: "attack", attacker: this.caster.id, attack: this.caster.name + "'s " + this.buff.name, targets: targets });
            };


            // Data binding methods
            BuffDialog.prototype._stringifyHealing = function() {
                this.$healingAmount.html(this.buff && this.buff.healing ? this.buff.healing.amount : "");
            };

            BuffDialog.prototype._buffChange = function($a) {
                var str, items, isMelee, isRanged, i, $option;
                if (!$a) {
                    this.buff = null;
                    return;
                }
                this.$buffs.find("a").removeClass("active");
                this.buff = $a.addClass("active").data("buff");

                if (this.buff.keywords && this.buff.keywords.length) {
                    str = "";
                    for (i = 0; i < this.buff.keywords.length; i++) {
                        str += (str ? ", " : "") + this.buff.keywords[ i ];
                    }
                    this.$keywords.html(str);
                }
                this.$description.html("");
                if (this.buff.description) {
                    this.$description.html(this.buff.description);
                }
                this._stringifyHealing();
                this._notifyTargets();
            };

            BuffDialog.prototype._targetsChange = function() {
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

            BuffDialog.prototype._playerBuffChange = function() {
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
                else if (this.buff && this.targets.length) {
                    toHit = parseInt(this.$playerAttackRoll.val(), 10);
                    hit = false;
                    miss = false;
                    for (i = 0; i < this.targets.length; i++) {
                        if (toHit >= this.targets[ i ].defenses[ this.buff.defense.toLowerCase() ]) {
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

            return BuffDialog;
        },
        true
    );

})();