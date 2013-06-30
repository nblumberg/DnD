var DnD;

(function() {
	"use strict";
	
	/**
	 * @param params Object
	 * @param params.actor Actor
	 * @param params.$parent {jQuery(element)} The parent element
	 * @param params.isCurrent {Boolean} Indicates if it is this Creature's turn in the initiative order
	 * @param params.className {String} Class(es) to apply to the top-level element 
	 * @param params.cardSize {Number} The height of the card
	 * @param params.showPcHp {Boolean} Display PC HP
	 */
	function ActorCard(params) {
		var editor, i;

		this.params = params || {};
		
		this.actor = params.actor;
		this.subPanel = {};
		this.cardSize = params.cardSize || ActorCard.CARD_SIZE;
		this.$parent = params.$parent ? jQuery(params.$parent) : jQuery("body");
		
		this.$panel = jQuery("<div/>").attr("id", this.actor.name.replace(/\s/g, "_") + "_panel").data("actor", this.actor).addClass("creaturePanel centered bordered " + params.className).appendTo(params.$parent);
		this.$panel.load("/html/partials/actorCard.html", null, this._init.bind(this));
	};
	
	// Public methods
	
	ActorCard.CARD_SIZE = 240;

	/**
	 * Display an ActorCard as being the current turn (or not)
	 */
	ActorCard.prototype.makeCurrent = function(isCurrent) {
		if (!this.$panel) {
			return;
		}
		this.$panel[ isCurrent ? "addClass" : "removeClass" ]("current");
		if (this.damageIndicator) {
			this.damageIndicator.hide();
		}
	};

	/**
	 * Display an ActorCard as being bloodied (or not)
	 */
	ActorCard.prototype.makeBloodied = function(isBloodied) {
		if (!this.$panel) {
			return;
		}
		this.$panel[ isBloodied ? "addClass" : "removeClass" ]("bloodied");
	};

	ActorCard.prototype.refresh = function(isCurrent) {
		this.makeBloodied(this.actor.isBloodied());
		this._renderName();
		this.updateConditions();
	};

	/**
	 * Display all of an Actor's Effects on their ActorCard
	 */
	ActorCard.prototype.updateConditions = function() {
	    var i, effect, j, name, total;
	    // Clear
	    this.subPanel.$effects.children().remove();
	    // Count conditions (including children of "multiple" effects) for sizing
	    total = 0;
	    for (i = 0; this.actor.effects && i < this.actor.effects.length; i++) {
	    	effect = this.actor.effects[ i ];
	        if (typeof(effect) === "string") {
	        	effect = { name: effect };
	        }
	        total += effect.children && effect.children.length ? effect.children.length : 1;
	    }
	    // Render each condition
	    for (i = 0; this.actor.effects && i < this.actor.effects.length; i++) {
	    	this._renderCondition(this.actor.effects[ i ], total);
	    }
	};

	// Private methods
	
	ActorCard.prototype._init = function(responseText, textStatus, jqXHR) {
		this.makeCurrent(this.params.isCurrent);
		if (this.actor.isBloodied()) {
			this.$panel.addClass("bloodied");
		}
		
		this.subPanel.$images = this.$panel.find(".images");
		
		this.subPanel.$portrait = this.$panel.find(".portrait");
		this.subPanel.$portrait.height(this.cardSize * 100/120).attr("src", this.actor.image);
		this.showPcHp = this.params.showPcHp;
		this.subPanel.$name = this.$panel.find(".f2 .name");
		this.subPanel.$hp = this.$panel.find(".f2 .hp");
		this._renderName();
		
	    this.subPanel.$effects = this.$panel.find(".effects");
	    this.updateConditions();
		
	    this.damageIndicator = new ActorCard.DamageIndicator({ actor: this.actor, card: this, $parent: this.subPanel.$effects });
	};

	ActorCard.prototype._renderName = function() {
		this.subPanel.$name.html(this.actor.name);
		if (this.showPcHp && this.actor.isPC) {
			this.subPanel.$hp.html(this.actor.hp.current + (this.actor.hp.temp ? " (" + (this.actor.hp.temp + this.actor.hp.current) + ")" : "") + " / " + this.actor.hp.total);
		}
		else {
			this.subPanel.$hp.html("");
		}
//	    editor = new Editor({ $parent: this.$panel, tagName: "div", _className: "f2", html: this.name, onchange: (function(v) {
//	        this.name = v;
//	        this.dispatchEvent("change");
//	    }).bind(this) });
	};

	/**
	 * Displays an Effect on an ActorCard
	 * 
	 * @param effect Effect The Effect to render
	 * @param total Number The total number of conditions (including child effects), used for sizing
	 */
	ActorCard.prototype._renderCondition = function(effect, total) {
	    var i, $div, image, clickHandler, condition;
		if (effect.children && effect.children.length) {
	        for (i = 0; i < effect.children.length; i++) {
	            this._renderCondition(effect.children[ i ], total);
	        }
	        return;
	    }
	    $div = jQuery("<div/>").addClass("condition");
	    clickHandler = (function($condition, effect, event) {
	        if (event.metaKey) {
	        	$condition.off({ click: clickHandler });
	        	$condition.remove();
	            this.actor.effects.splice(this.actor.effects.indexOf(effect), 1);
	            this.actor.dispatchEvent({ type: "change" });
	        }
	    }).bind(this, $div, effect);
	    $div.on({ click: clickHandler });
	    image = new Image();
	    if (total <= 4) {
	        image.height = this.cardSize / 3;
	    }
	    else if (total <= 9) {
	        image.height = this.cardSize / 4;
	    }
	    else {
	        image.height = this.cardSize / 5.4;
	    }
	    image.className = "icon";
	    condition = Effect.CONDITIONS[ effect.name.toLowerCase() ];
	    if (effect.name.toLowerCase() === "ongoing damage") {
	    	condition = condition[ effect.type ? effect.type.toLowerCase() : "untyped" ];
	        image.title = (condition.type ? "Ongoing " + condition.type + " damage" : "Ongoing damage") + (effect.attacker ? " (" + effect.attacker + ")" : "");
	    }
	    else {
	        image.title = effect.name + (effect.attacker ? " (" + effect.attacker + ")" : "");
	    }
	    if (condition && condition.image) {
	        image.src = condition.image;
	    }
	    else {
	        image.src = "../images/symbols/unknown.png";
	    }
	    $div.append(image);
	    if (effect.amount) {
	        $div.append(jQuery("<span/>").css({ "line-height": image.height + "px", "color": condition && condition.color ? condition.color : "red" }).html(effect.amount));
	    }
	    this.subPanel.$effects.append($div);
	};

	/**
	 * @param params Object
	 * @param params.actor Actor
	 * @param params.card ActorCard
	 * @param params.$parent jQuery(element) The parent element
	 * @param params.damage {Damage | Array}
	 * @param params.isMiss {Boolean}
	 */
	ActorCard.DamageIndicator = function(params) {
	    var height, i, $type, i, dmg, $image, condition, $amount;
	    if (!params) {
	    	return;
	    }
	    this.actor = params.actor;
	    this.card = params.card;
	    this.$parent = params.$parent;
	    // Clear any existing damage indicator
	    this.$parent.find("div.damage").remove();
	    // Create HTML
	    this.$damage = jQuery("<div/>").addClass("damage").hide().appendTo(this.$parent);
	    this.$pow = jQuery("<img/>").attr("src", "../images/symbols/pow.png").attr("height", this.card.subPanel.portrait.height).attr("width", this.card.subPanel.portrait.width).hide().appendTo(this.$damage);
	    this.$miss = jQuery("<img/>").attr("src", "../images/symbols/miss.jpg").attr("height", this.card.subPanel.portrait.height).attr("width", this.card.subPanel.portrait.width).hide().appendTo(this.$damage);
	    this.$attack = jQuery("<div/>").css({ "height": this.card.subPanel.portrait.height, "width": this.card.subPanel.portrait.width }).hide().appendTo(this.$damage);
	    this.$centered = jQuery("<div/>").addClass("centered").appendTo(this.$damage);
	    this.$types = jQuery("<div/>").addClass("types").appendTo(this.$centered);
	};

	/**
	 * @param params.damage {Damage | Array}
	 */
	ActorCard.DamageIndicator.prototype.damage = function(damage) {
	    var height, i, dmg, condition;
	    // Clear any existing damage indicator content
	    this.$types.html("");
	    damage = Object.constructor !== Array ? [ damage ] : damage;
		height = Math.floor(100 / damage.length);
	    for (i = 0; i < damage.length; i++) {
	    	dmg = damage[ i ];
	        if (dmg.type) {
	        	if (Effect.CONDITIONS[ "ongoing damage" ][ dmg.type ] && Effect.CONDITIONS[ "ongoing damage" ][ dmg.type ].image) {
	            	condition = Effect.CONDITIONS[ "ongoing damage" ][ dmg.type ];
	        	}
	        }
	        if (!condition) {
	        	condition = Effect.CONDITIONS[ "ongoing damage" ].untyped;
	        }
	        this.$pow.show();
	        this._renderEvent(height, condition.image, dmg.amount, condition.color);
	    }
	};

	ActorCard.DamageIndicator.prototype.miss = function() {
	    // Clear any existing damage indicator content
	    this.$types.html("");
	    this.$miss.show();
	    this._renderEvent(100, "../images/symbols/miss.png", "Miss", "green");
	};

	ActorCard.DamageIndicator.prototype.attack = function(name) {
	    // Clear any existing damage indicator content
	    this.$types.html("");
	    this.$attack.show();
	    this.$attack.html(name);    
//	    this._renderEvent(100, "../images/symbols/miss.png", "Miss", "green");
	};

	ActorCard.DamageIndicator.prototype.hide = function() {
	    this.$pow.hide();
	    this.$miss.hide();
		this.$damage.hide();
	};

	ActorCard.DamageIndicator.prototype._renderEvent = function(heightPercent, imageSrc, text, color) {
	    var $type, dmg, image, condition, $text;
		$type = jQuery("<div/>").addClass("type").appendTo(this.$types).css({ height: heightPercent + "%" });
	    image = new Image();
	    image.height = $type.height();
	    image.className = "icon";
		image.src = imageSrc;
	    $type.append(image);
	    if (typeof(text) !== "undefined" && text !== null) {
	    	$text = jQuery("<span/>").addClass("amount").css({ "font-size": Math.floor(image.height / 2) + "px", "line-height": image.height + "px", "color": color ? color : "red" }).html(text).appendTo($type);
	    }
	    this.$damage.show();
	    setTimeout(this.hide.bind(this), 30000);
	};

	
	if (!DnD) {
		DnD = {};
	}
	if (!DnD.Display) {
		DnD.Display = {};
	}
	DnD.Display.ActorCard = ActorCard;
	DnD.Display.ActorDamageIndicator = ActorCard.DamageIndicator;
})();
