var DnD;

(function() {
	"use strict";
	
	if (!DnD) {
		DnD = {};
	}
	if (!DnD.Dialog) {
		DnD.Dialog = {};
	}
	
	
	// CONSTRUCTOR & INITIALIZATION METHODS
	
	function AttackDialog(params) {
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
		this.callback = params.callback;
		this.attacker = params.attacker;
		this.attack = null;
		this.targets = [];
		this.combatAdvantage = false;
		
		this._init(params);
	}
	
	AttackDialog.prototype = new DnD.Dialog("attacksDialog", "/html/partials/attackDialog.html");
	
	AttackDialog.prototype._onReady = function() {
        this.$weapons = this.$dialog.find("#weaponSelect");
        this.$attacks = this.$dialog.find("#attackSelect").on({ change: this._attackChange.bind(this) });
        this.$combatAdvantage = this.$dialog.find("#combatAdvantage").data("combatAdvantage", false).on({ click: (function() { 
        	this.combatAdvantage = !this.combatAdvantage;
        	this._combatAdvantageChange();
        }).bind(this) });
        this.$targets = this.$dialog.find("#targetSelect").on({ dblclick: this._resolveAttack.bind(this), change: this._targetsChange.bind(this) });
        this.$playerAttackRoll = this.$dialog.find("#playerAttackRoll").on({ change: this._playerAttackChange.bind(this), keyup: this._playerAttackChange.bind(this) });
        this.$playerAttackCrit = this.$dialog.find("#playerAttackCrit").on({ change: this._playerAttackChange.bind(this) });
        this.$playerDamageRoll = this.$dialog.find("#playerDamageRoll");
		this.buttons.$attack = this.$dialog.find(".attackBtn").on({ click: this._resolveAttack.bind(this) });
	};
	
	// OVERRIDDEN METHODS
	
	AttackDialog.prototype.show = function(params) {
		var i, attack, target;
		if (!params || !params.attacker || !params.actors) {
			try { window.console.warn("AttackDialog.show() invoked without sufficient parameters"); } finally {}
			return;
		}

		this.attacker = params.attacker;
		this.$weapons.children().remove();
        this.$attacks.children().remove();
        for (i = 0; i < this.attacker.attacks.length; i++) {
        	attack = this.attacker.attacks[ i ];
        	jQuery("<option/>").html(attack.name).data("attack", attack).appendTo(this.$attacks);
        }
    	this.$attacks.attr("size", Math.min(Math.max(this.attacker.attacks.length, 2), 10));
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
        this.$playerAttackRoll.val("");
        this.$playerAttackCrit.val("");
        this.$playerDamageRoll.val("");
		this._attackChange();
		
		DnD.Dialog.prototype.show.call(this)
	};

	
	// PRIVATE METHODS
	
	AttackDialog.prototype._resolveAttack = function() {
		var item, playerRolls, result;
		if (this.attack && this.targets.length) {
			this.$dialog.modal("hide");
			if (this.attack.keywords && (this.attack.keywords.indexOf("weapon") !== -1 || this.attack.keywords.indexOf("implement") !== -1)) {
			    item = jQuery(this.$weapons[0].options[ this.$weapons[0].selectedIndex ]).data("item");
			}
			if (this.$playerAttackRoll.val() || this.$playerAttackCrit.val() || this.$playerDamageRoll.val()) {
				playerRolls = { attack: { roll: parseInt(this.$playerAttackRoll.val()), isCritical: this.$playerAttackCrit.val() === "crit", isFumble: this.$playerAttackCrit.val() === "fail" }, damage: parseInt(this.$playerDamageRoll.val()) };
			}
			result = this.attacker.attack(this.attack, item, this.targets, this.combatAdvantage, playerRolls);
			this.callback({ type: "takeDamage", attacker: this.attacker.id, attack: this.attack.name, hits: result.hits, misses: result.misses });
		} 
		else {
			alert("Please select both an attack and 1 or more valid target(s)");
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
	AttackDialog.prototype._attackChange = function() {
	    var needsWeapon, needsImplement, items, isMelee, isRanged, i, $option;
	    if (this.$attacks[0].selectedIndex === -1) {
	    	this.attack = null;
	        this.$weapons.hide();
	        return;
	    }
	    this.attack = jQuery(this.$attacks[0].options[ this.$attacks[0].selectedIndex ]).data("attack");
	    if (this.attack.keywords) {
	        needsWeapon = this.attack.keywords.indexOf("weapon") !== -1;
	        isMelee = needsWeapon && this.attack.keywords.indexOf("melee") !== -1;
	        isRanged = needsWeapon && this.attack.keywords.indexOf("ranged") !== -1;
	        needsImplement = this.attack.keywords.indexOf("implement") !== -1;
	        items = needsWeapon ? this.attacker.weapons: null;
	        if (!items && needsImplement) {
	            items = this.attacker[ "implements" ];
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
	        this.$weapons.show();
	    }
	    else {
	        this.$weapons.hide();
	    }
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
		$controlGroup.removeClass("error");
		$controlGroup.removeClass("success");
		$controlGroup.removeClass("warning");
		if (this.$playerAttackCrit.val() === "crit") {
			$controlGroup.addClass("success");
		}
		else if (this.$playerAttackCrit.val() === "fail") {
			$controlGroup.addClass("error");
		}
		else if (this.attack && this.targets.length) {
			toHit = parseInt(this.$playerAttackRoll.val());
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
				$controlGroup.addClass("warning");
			}
			else if (hit) {
				$controlGroup.addClass("success");
			}
			else {
				$controlGroup.addClass("error");
			}
		}
		this._notifyTargets();
	};
	

	DnD.Dialog.Attack = AttackDialog;
})();