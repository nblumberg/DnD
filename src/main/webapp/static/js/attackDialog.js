var DnD;

(function() {
	function AttackDialog(params) {
		this.attacker = params.attacker;
	    this.$dialog = null;
		this.$body = null;
        this.$weapons = null;
        this.$attacks = null;
        this.$combatAdvantage = null;
        this.$targets = null;
        this.$playerAttackRoll = null;
        this.$playerAttackCrit = null;
        this.$playerDamageRoll = null;
		this.buttons = {
				$attack: null
		};
		
		jQuery(document).ready((function() {
		    this.$dialog = jQuery("#attacksDialog").on("show", this.show.bind(this));
			this.$body = this.$dialog.find(".modal-body");
	        this.$weapons = this.$dialog.find("#weaponSelect");
	        this.$attacks = this.$dialog.find("#attackSelect").on({ change: this._selectAttack.bind(this) });
	        this.$combatAdvantage = this.$dialog.find("#combatAdvantage").data("combatAdvantage", false).on({ click: this._combatAdvantage.bind(this) });
	        this.$targets = this.$dialog.find("#targetSelect").dblclick(this._resolveAttack.bind(this));
	        this.$playerAttackRoll = this.$dialog.find("#playerAttackRoll");
	        this.$playerAttackCrit = this.$dialog.find("#playerAttackCrit");
	        this.$playerDamageRoll = this.$dialog.find("#playerDamageRoll");
			this.buttons.$attack = this.$dialog.find(".attackBtn").on({ click: this._resolveAttack.bind(this) });
		}).bind(this));
	}

	AttackDialog.prototype._combatAdvantage = function() {
        var combatAdvantage = this.src.indexOf("/images/symbols/attack.png") !== -1;
        this.src = combatAdvantage ? "/images/symbols/combat_advantage.png" : "/images/symbols/attack.png";
        jQuery(this).data("combatAdvantage", combatAdvantage);
	};
	
	AttackDialog.prototype._selectAttack = function() {
	    var attack, actor, needsWeapon, needsImplement, items, isMelee, isRanged, i, $option;
	    if (this.$attacks[0].selectedIndex === -1) {
	        this.$weapons.hide();
	        return;
	    }
	    attack = jQuery(this.$attacks[0].options[ this.$attacks[0].selectedIndex ]).data("attack");
	    actor = this.attacker;
	    if (attack.keywords) {
	        needsWeapon = attack.keywords.indexOf("weapon") !== -1;
	        isMelee = needsWeapon && attack.keywords.indexOf("melee") !== -1;
	        isRanged = needsWeapon && attack.keywords.indexOf("ranged") !== -1;
	        needsImplement = attack.keywords.indexOf("implement") !== -1;
	        items = needsWeapon ? actor.weapons: null;
	        if (!items && needsImplement) {
	            items = actor[ "implements" ];
	        }
	    }
	    if (needsWeapon || needsImplement) {
	        this.$weapons.html("");
	        for (i = 0; items && i < items.length; i++) {
	        	if (needsWeapon && (isMelee || isRanged)) {
	                if (!!items[ i ].isMelee !== !!isMelee || !items[ i ].isMelee !== !!isRanged) {
	                    continue;
	                }
	        	}
	            $option = jQuery("<option/>").html(items[ i ].name).data("item", items[ i ]);
	            this.$weapons.append($option);
	        }
//	        this.$weapons.attr("size", items.length);
	        this.$weapons.show();
	    }
	    else {
	        this.$weapons.hide();
	    }
	};
	
	AttackDialog.prototype._resolveAttack = function() {
		var attacker, attack, item, i, targets, combatAdvantage, playerRolls, result;
		if (!this.$dialog.data("init")) {
			return;
		}
		
		if (this.$attacks.val() && this.$targets.val()) {
			this.$dialog.dialog("close");
			attacker = this.attacker;
			attack = jQuery(this.$attacks[0].options[ this.$attacks[0].selectedIndex ]).data("attack");
			if (attack.keywords && (attack.keywords.indexOf("weapon") !== -1 || attack.keywords.indexOf("implement") !== -1)) {
			    item = jQuery(this.$weapons[0].options[ this.$weapons[0].selectedIndex ]).data("item");
			}
			targets = [];
			for (i = 0; i < this.$targets[0].options.length; i++) {
				if (this.$targets[0].options[ i ].selected) {
					targets.push(jQuery(this.$targets[0].options[ i ]).data("target"));
				}
			}
			combatAdvantage = this.$combatAdvantage.data("combatAdvantage");
			if (this.$playerAttackRoll.val() || this.$playerAttackCrit.val() || this.$playerDamageRoll.val()) {
				playerRolls = { attack: { roll: parseInt(this.$playerAttackRoll.val()), isCritical: this.$playerAttackCrit.val() === "crit", isFumble: this.$playerAttackCrit.val() === "fail" }, damage: parseInt(this.$playerDamageRoll.val()) };
			}
			result = attacker.attack(attack, item, targets, combatAdvantage, this.round, this._addHistory.bind(this), playerRolls);
			this._render(false);
			this._messageDisplay({ type: "takeDamage", attacker: attacker.id, attack: attack.name, hits: result.hits, misses: result.misses }, false);
		} 
		else {
			alert("Please select both an attack and 1 or more valid target(s)");
		}
	};
	
	AttackDialog.prototype.show = function(params) {
		if (!params || !params.attacker) {
			return;
		}
		this._populate(attacker, order);
		this.$dialog.modal("show");
	};
	
	
	if (!DnD) {
		DnD = {};
	}
	if (!DnD.Dialog) {
		DnD.Dialog = {};
	}
	DnD.Dialog.Attack = AttackDialog;
})();