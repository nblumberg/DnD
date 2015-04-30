(function() {
    "use strict";

    DnD.define(
        "Display.Dialog.Heal",
        [ "window", "Display.Dialog" ],
        function(w, Dialog) {
            // CONSTRUCTOR & INITIALIZATION METHODS

            function HealDialog(params) {
                this.addHistory = params.addHistory;
                this.callback = params.callback;
                this.$healingDescription = null;
                this.$isTempHp = null;
                this.$healingAmount = null;
                this.$usesHealingSurge = null;
                this.$healingExtra = null;
                this.buttons = {
                    $heal: null
                };
                this._init(params);
            }

            HealDialog.prototype = new Dialog("healDialog", "/html/partials/healDialog.html");

            // OVERRIDDEN METHODS

            HealDialog.prototype.show = function(params) {
                if (!params || !params.patient) {
                    return;
                }
                this.patient = params.patient;
                this.healingSurgeValue = params.healingSurgeValue || Math.floor(this.patient.hp.total / 4);
                // TODO: recenter dialog
                Dialog.prototype.show.call(this);
            };

            HealDialog.prototype._onReady = function() {
                this.$healingDescription = this.$dialog.find("#healingDescription");
                this.$isTempHp = this.$dialog.find("#isTempHp");
                this.$healingAmount = this.$dialog.find("#healingAmount");
                this.$usesHealingSurge = this.$dialog.find("#usesHealingSurge").on({ click: (function() {
                    if (this.$usesHealingSurge[0].checked) {
                        this.$healingAmount.val(this.healingSurgeValue);
                        this.$healingAmount.attr("disabled", "disabled");
                    }
                    else {
                        this.$healingAmount.removeAttr("disabled");
                    }
                }).bind(this) });
                this.$healingExtra = this.$dialog.find("#healingExtra");
                this.buttons.$heal = this.$dialog.find(".healBtn").on({ click: this._resolveHeal.bind(this) });
                this._onOkButtonClick = this._resolveHeal.bind(this);
            };

            HealDialog.prototype._onShow = function() {
                this.$healingAmount.val(this.healingSurgeValue);
                this.$healingExtra.val(0);
            };


            // NON-PUBLIC METHODS

            HealDialog.prototype._resolveHeal = function(actor) {
                var target, amount, msg, method, property, oldValue, newValue;
                if (!this.$healingDescription.val()) {
                    w.alert("Please enter a description of the healing");
                    return;
                }
                this.hide();
                target = this.patient;
                amount = parseInt(this.$healingAmount.val(), 10) + parseInt(this.$healingExtra.val(), 10);
                method = "info";
                if (this.$isTempHp[0].checked) {
                    property = "hp.temp";
                    oldValue = target.hp.temp;
                    target.hp.temp = Math.max(amount, target.hp.temp);
                    newValue = target.hp.temp;
                    target.tr.hpTemp.setValue(newValue);
                    msg = "Gained " + amount + " temporary hit points from " + this.$healingDescription.val();
                }
                else {
                    property = "hp.current";
                    oldValue = target.hp.current;
                    target.hp.current = Math.min(target.hp.current + amount, target.hp.total);
                    newValue = target.hp.current;
                    target.tr.hpCurrent.setValue(newValue);
                    msg = "Healed " + amount + " damage from " + this.$healingDescription.val();
                }
                target.dispatchEvent({ type: "change", property: property, oldValue: oldValue, newValue: newValue });

                if (this.$usesHealingSurge[0].checked) {
                    property = "surges.current";
                    oldValue = target.surges.current;
                    if (!target.surges.current || target.surges.current <= 0) {
                        msg += ", should have used a healing surge but has none remaining";
                        method = "error";
                    }
                    else {
                        target.tr.surgesCurrent.setValue(Math.max(--target.surges.current, 0));
                        msg += ", using a healing surge";
                    }
                    newValue = target.surges.current;
                    target.dispatchEvent({ type: "change", property: property, oldValue: oldValue, newValue: newValue });
                }
                this.addHistory(target, msg, method);
            };

            return HealDialog;
        },
        true
    );

})();