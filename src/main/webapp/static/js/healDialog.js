var DnD;

(function() {
	function HealDialog(params) {
	    this.$dialog = null;
		this.$body = null;
        this.$healingDescription = null;
        this.$isTempHp = null;
        this.$healingAmount = null;
        this.$usesHealingSurge = null;
        this.$healingExtra = null;
		this.buttons = {
				$heal: null
		};
		
		jQuery(document).ready((function() {
		    this.$dialog = jQuery("#healDialog").on("show", this.show.bind(this));
			this.$body = this.$dialog.find(".modal-body");
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
	        this.$dialog.data("init", true);
		}).bind(this));
	}

	HealDialog.prototype._resolveHeal = function(actor) {
		var target, amount, msg, method;
		if (!this.$dialog.data("init") || !this.$healingDescription) {
			return;
		}
		if (!this.$healingDescription.val()) {
			alert("Please enter a description of the healing");
			return;
		}
		this.$dialog.modal("hide");
		target = this.patient;
		amount = parseInt(this.$healingAmount.val()) + parseInt(this.$healingExtra.val());
		method = "info";
		if (this.$isTempHp[0].checked) {
			target.hp.temp = Math.max(amount, target.hp.temp);
			msg = "Gained " + amount + " temporary hit points from " + this.$healingDescription.val();
		}
		else {
			target.hp.current = Math.min(target.hp.current + amount, target.hp.total);
			msg = "Healed " + amount + " damage from " + this.$healingDescription.val();
		}
		if (this.$usesHealingSurge[0].checked) {
			if (target.surges.current <= 0) {
				msg += ", should have used a healing surge but has none remaining";
				method = "error";
			}
			else {
				target.surges.current = Math.max(--target.surges.current, 0);
				msg += ", using a healing surge";
			}
		}
		this._addHistory(target, msg, method);
	};

	HealDialog.prototype.show = function(params) {
		if (!params || !params.patient) {
			return;
		}
		this.patient = params.patient;
		this.healingSurgeValue = params.healingSurgeValue || Math.floor(this.patient.hp.total / 4);
		this.$healingAmount.val(this.healingSurgeValue);
		this.$healingExtra.val(0);
		// TODO: recenter dialog
		this.$dialog.modal("show");
	};
	
	
	if (!DnD) {
		DnD = {};
	}
	if (!DnD.Dialog) {
		DnD.Dialog = {};
	}
	DnD.Dialog.Heal = HealDialog;
})();