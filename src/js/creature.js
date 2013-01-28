var Defenses = function(params) {
	params = params || {};
	this.ac = params.ac || 10;
	this.fort = params.fort || 10;
	this.ref = params.ref || 10;
	this.will = params.will || 10;
	this.resistances = params.resistances || {};
	this.toString = function() { "[Defenses]"; };
};

var HP = function(params) {
	params = params || {};
	this.total = params.total || 1;
	this.current = params.current || this.total;
	this.temp = params.temp || 0;
	this.regeneration = params.regeneration || 0;
    this.toString = function() { "[HP]"; };
};

var Surges = function(params) {
	params = params || {};
	this.perDay = params.perDay || 0;
	this.current = params.current || this.perDay;
    this.toString = function() { "[Surges]"; };
};



var Effect = function(params) {
    var i;
    params = params || {};
    this.name = typeof(params) === "string" ? params : params.name;
    this.amount = params.amount || 0;
    this.duration = params.duration || -1;
    this.saveEnds = params.saveEnds || false;
    this.children = [];
    for (i = 0; params.children && i < params.children.length; i++) {
        this.children.push(new Effect(params.children[ i ]));
    }
};

Effect.prototype = new Serializable();

Effect.prototype.toString = function() {
    var name, i;
    name = this.name;
    if (this.children && this.children.length) {
        name += " [";
        for (i = 0; i < this.children.length; i++) {
            name += (i ? ", " : "") + this.children[ i ].name;
        }
        name += " ]";
    }
    return name;
};

Effect.CONDITIONS = {
        "attack penalty": { image: "images/symbols/attack_penalty.jpg", color: "white" },
        blinded: { image: "images/symbols/blinded.png" }, // "http://icons.iconarchive.com/icons/anatom5/people-disability/128/blind-icon.png",
        dazed: { image: "images/symbols/dazed.jpg" }, // "http://1.bp.blogspot.com/_jJ7QNDTPcRI/TUs0RMuPz6I/AAAAAAAAAjo/YGnw2mI-aMo/s320/dizzy-smiley.jpg",
        deafened: { image: "images/symbols/deafened.gif" }, // "http://joeclark.org/ear.gif",
        diseased: { image: "images/symbols/diseased.jpg" }, // "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRnOrSXb8UHvwhgQ-loEdXZvQPTjuBylSfFNiK7Hxyq03IxgUKe",
        dominated: { image: "images/symbols/dominated.png" }, // "http://fs02.androidpit.info/ali/x90/4186790-1324571166012.png",
        dying: { image: "images/symbols/dying.png" }, // "http://iconbug.com/data/61/256/170c6197a99434339f465fa8c9fa4018.png",
        dead: { image: "images/symbols/dead.jpg" }, // "http://t2.gstatic.com/images?q=tbn:ANd9GcTPA7scM15IRChKnwigvYnQUDWNGHLL1cemtAeKxxZKwBDj33MFCxzfyorp",
        grabbed: { image: "images/symbols/grabbed.jpg" }, // "http://www.filipesabella.com/wp-content/uploads/2010/02/hand_grab.jpg",
        helpless: { image: "images/symbols/helpless.png" }, // "http://files.softicons.com/download/tv-movie-icons/dexter-icons-by-rich-d/png/128/Tied-Up%20Dexter.png",
        immobilized: { image: "images/symbols/immobilized.gif" }, // "http://www.hscripts.com/freeimages/icons/traffic/regulatory-signs/no-pedestrian/no-pedestrian1.gif",
        marked: { image: "images/symbols/marked.png" }, // "http://openclipart.org/image/800px/svg_to_png/30103/Target_icon.png",
        "ongoing damage": {
            untyped: { image: "images/symbols/ongoing_damage.jpg", color: "#FF0000" }, // "http://www.thelegendofreginaldburks.com/wp-content/uploads/2011/02/blood-spatter.jpg",
            acid: { image: "images/symbols/ongoing_acid.png", color: "#00FF00" }, // "http://en.xn--icne-wqa.com/images/icones/8/0/pictograms-aem-0002-hand-burn-from-chemical.png",
            cold: { image: "images/symbols/ongoing_cold.jpg", color: "#6666FF" }, // "http://www.psdgraphics.com/file/blue-snowflake-icon.jpg",
            fire: { image: "images/symbols/ongoing_fire.jpg", color: "#FF0000" }, // "http://bestclipartblog.com/clipart-pics/-fire-clipart-2.jpg",
            lightning: { image: "images/symbols/ongoing_lightning.png", color: "#CCCCFF" }, // "http://www.mricons.com/store/png/2499_3568_128_lightning_power_icon.png",
            necrotic: { image: "images/symbols/ongoing_necrotic.jpg", color: "purple" }, // "http://shell.lava.net/ohol_yaohushua/pentagram.jpg", // "http://www.soulwinners.com.au/images/Goat.jpg?942",
            poison: { image: "images/symbols/ongoing_poison.jpg", color: "#00FF00" }, // "http://ts3.mm.bing.net/th?id=H.4671950275020154&pid=1.7&w=138&h=142&c=7&rs=1",
            psychic: { image: "images/symbols/ongoing_psychic.jpg", color: "cyan" }, // "http://uniteunderfreedom.com/wp-content/uploads/2011/09/Brain-waves.jpg",
            radiant: { image: "images/symbols/ongoing_radiant.jpg", color: "#FFFFFF" } // "http://us.123rf.com/400wm/400/400/booblgum/booblgum1001/booblgum100100021/6174537-magic-radial-rainbow-light-with-white-stars.jpg",
        },
        petrified: { image: "images/symbols/petrified.gif" }, // "http://www.mythweb.com/encyc/images/media/medusas_head.gif",
        prone: { image: "images/symbols/prone.png" }, // "http://lessonpix.com/drawings/2079/100x100/Lying+Down.png",
        restrained: { image: "images/symbols/restrained.jpg" }, // "http://p2.la-img.com/46/19428/6595678_1_l.jpg", // "http://ts3.mm.bing.net/th?id=H.4552318270046582&pid=1.9", // "http://us.123rf.com/400wm/400/400/robodread/robodread1109/robodread110901972/10664893-hands-tied.jpg",
        slowed: { image: "images/symbols/slowed.jpg" }, // "http://glimages.graphicleftovers.com/18234/246508/246508_125.jpg",
        stunned: { image: "images/symbols/stunned.jpg" }, // "http://images.all-free-download.com/images/graphicmedium/zap_74470.jpg",
        unconscious: { image: "images/symbols/unconscious.gif" }, // "http://1.bp.blogspot.com/_ODwXXwIH70g/S1KHvp1iCHI/AAAAAAAACPo/o3QBUfcCT2M/s400/sm_zs.gif",
        weakened: { image: "images/symbols/weakened.png" }, // "http://pictogram-free.com/material/003.png"
        "will penalty": { image: "images/symbols/will.png", color: "purple" }
};



var Implement = function(params) {
	this._init(params);
};

Implement.prototype._init = function(params) {
	params = params || {};
	this.name = params.name;
	this.enhancement = params.enhancement;
	this.crit = new Damage(params.crit);
};

Implement.prototype.toString = function() {
    return "[Implement \"" + this.name + "\"]";
};

    
var Weapon = function(params) {
	params = params || {};
	this._init(params);
	this.isMelee = params.isMelee;
	this.proficiency = params.proficiency || 0;
	this.damage = new Damage(params.damage);
};

Weapon.prototype = new Implement();

Weapon.prototype.toString = function() {
    return "[Weapon \"" + this.name + "\"]";
};
    


var Abilities = function(params) {
	var i, ability, abilities = [ "STR", "DEX", "CON", "INT", "WIS", "CHA" ];
	params = params || {};
	for (i = 0; i < abilities.length; i++) {
		ability = abilities[ i ];
		this[ ability ] = params[ ability ] || 10;
		this[ ability + "mod" ] = Math.floor((this[ ability ] - 10) / 2);
	}
    this.toString = function() { "[Abilities]"; };
};



var Creature = function(params, isActor) {
	var i;
	params = params || {};
	this.id = params.id || Creature.id++;
	this.name = params.name;
    if (isActor) {
    	if (!Creature.actors) {
    		Creature.actors = {};
    	}
    	if (console && console.debug && Creature.actors[ this.name ]) {
    		console.debug("Replacing Creature.actors[ " + this.name + " ]");
    	}
        Creature.actors[ this.id ] = this;
    }
    else {
    	if (!Creature.creatures) {
    		Creature.creatures = {};
    	}
    	if (console && console.debug && Creature.creatures[ this.name ]) {
    		console.debug("Replacing Creature.creatures[ " + this.name + " ]");
    	}
        Creature.creatures[ this.name ] = this;
    }
	this._listeners = {};
	this.image = params.image;
	this.isPC = params.isPC || false;
	this.level = params.level || false;
	this.abilities = new Abilities(params.abilities);
	this.hp = new HP(params.hp);
	this.surges = new Surges(params.surges);
	this.defenses = params.defenses || new Defenses();
	this.attackBonuses = params.attackBonuses || [];
	this.attacks = params.attacks || [];
	this.init = params.init || 0;
	this.ap = params.ap || 0;
	this.effects = [];
	this.move = params.move || 6;
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
		this.attacks.push(new Attack(params.attacks[ i ], this));
	}
    this.effects = [];
    for (i = 0; params.effects && i < params.effects.length; i++) {
        this.effects.push(new Effect(params.effects[ i ]));
    }
	this.history = new History(params.history || { includeSubject: false });
};

Creature.id = (new Date()).getTime();
Creature.actors = {};
Creature.creatures = {};

Creature.prototype = new EventDispatcher();

Creature.prototype.isBloodied = function() {
	return this.hp.current <= Math.floor(this.hp.total / 2);
};

/**
 * @param $table {jQuery("<table/>")} The parent table element
 * @param isCurrent {Boolean} Indicates if it is this Creature's turn in the initiative order
 * @param attack {Function} The click handler for the attack action
 * @param heal {Function} The click handler for the heal action
 */
Creature.prototype.createTr = function(params) {
	var $tr, $td, image, $div;
	params = params || {};
	
	$tr = jQuery("<tr/>").attr("id", this.name + "_row").data("actor", this);
	if (params.isCurrent) {
		$tr.addClass("current");
	}
	if (this.isBloodied()) {
		$tr.addClass("bloodied");
	}
	params.$table.append($tr);
	
	$td = jQuery("<td/>").addClass("bordered centered");
	$tr.append($td);
	this.createCard({ $parent: $td, isCurrent: params.isCurrent, cardSize: 120 });
	this.$panel.attr("draggable", "true").addClass("grab").on({ 
//        dragstart: (function(event) {
//            event.dataTransfer.setData("actor", this);
//            this.$panel.addClass("grabbing");
//        }).bind(this),
//        dragover: (function(event) {
//            var actor = event.dataTransfer.getData("actor");
//            if (actor && actor !== this) {
//                event.preventDefault();
//                this.$panel.addClass("droppable");
//            }
//        }).bind(this),
//        drop: (function(event) {
//            var actor = event.dataTransfer.getData("actor");
//            if (actor && actor !== this) {
//                event.preventDefault();
//                this.dispatchEvent({ type: "reorder", move: actor, before: this });
//            }
//            this.$panel.removeClass("grabbing");
//        }).bind(this)
	});
	
	$td = jQuery("<td/>").addClass("bordered");
	$tr.append($td);
	this._addDefense($td, "ac", this.defenses.ac, "images/symbols/ac.png"); // "http://aux.iconpedia.net/uploads/20429361841025286885.png"
	this._addDefense($td, "fort", this.defenses.fort, "images/symbols/fort.png"); // "http://www.gettyicons.com/free-icons/101/sigma-medical/png/256/cardiology_256.png"); // "http://icons.iconarchive.com/icons/dryicons/valentine/128/heart-icon.png");
	this._addDefense($td, "ref", this.defenses.ref, "images/symbols/ref.png"); // "http://pictogram-free.com/highresolution/l_163.png");
	this._addDefense($td, "will", this.defenses.will, "images/symbols/will.png"); // "http://www.iconhot.com/icon/png/medical-icons/256/brain.png");
	
	$td = jQuery("<td/>").addClass("hp bordered").appendTo($tr);
	if (this.hp.temp) {
		this._addHp($td, "images/symbols/temp_hp.png", "Temp HP", "tempHp", this.hp.temp);
	}
	this._addHp($td, "images/symbols/hp.png", "HP", "currentHp", this.hp.current, "totalHp", this.hp.total);
	if (this.surges && this.surges.hasOwnProperty("current")) {
		this._addHp($td, "images/symbols/surge.png", "Healing Surges", "surgesRemaining", this.surges.current, "surgesPerDay", this.surges.perDay);
	}
	
	$td = jQuery("<td/>").addClass("actions bordered");
	$tr.append($td);
	this._addAction($td, "Attack", "images/symbols/attack.png", params.attack);
	this._addAction($td, "Heal", "images/symbols/heal.png", params.heal);
	this._addAction($td, "Exit", "images/symbols/exit.jpg", params.exit);
	this._addAction($td, "Rename", "images/symbols/rename.png", params.rename);
	
	$td = jQuery("<td/>").addClass("history bordered");
	$tr.append($td);
	$div = jQuery("<div/>").appendTo($td);
	$div.append(this.history.$html);
};

Creature._CARD_SIZE = 240;

/**
 * @param $parent {jQuery(element)} The parent element
 * @param isCurrent {Boolean} Indicates if it is this Creature's turn in the initiative order
 * @param className {String} Class(es) to apply to the top-level element 
 */
Creature.prototype.createCard = function(params) {
	var $parent, $div, editor, i;
	params = params || {};
	this.subPanel = {};
	this.cardSize = params.cardSize || Creature._CARD_SIZE;
	$parent = params.$parent ? jQuery(params.$parent) : jQuery("body");
	this.$panel = jQuery("<div/>").attr("id", this.name.replace(/\s/g, "_") + "_panel").addClass("creaturePanel centered bordered " + params.className).appendTo($parent);
	this.makeCurrent(params.isCurrent);
	if (this.isBloodied()) {
		this.$panel.addClass("bloodied");
	}
	
	this.subPanel.$images = jQuery("<div/>").addClass("images").appendTo(this.$panel);
	
	this.subPanel.portrait = new Image();
	this.subPanel.portrait.className = "handle";
	this.subPanel.portrait.height = this.cardSize * 100/120;
	this.subPanel.portrait.src = this.image;
	this.subPanel.$images.append(this.subPanel.portrait);
	this.subPanel.$name = jQuery("<div/>").addClass("name f2").html(this.name);
	this.$panel.append(this.subPanel.$name);
	if (params.showPcHp && this.isPC) {
		this.subPanel.$hp = jQuery("<span/>").addClass("hp").html(this.hp.current + (this.hp.temp ? " (" + (this.hp.temp + this.hp.current) + ")" : "") + " / " + this.hp.total);
		this.subPanel.$name.append(this.subPanel.$hp);
	}
//    editor = new Editor({ $parent: this.$panel, tagName: "div", _className: "f2", html: this.name, onchange: (function(v) {
//        this.name = v;
//        this.dispatchEvent("change");
//    }).bind(this) });
	
    this.subPanel.$effects = jQuery("<div/>").addClass("effects").appendTo(this.subPanel.$images);
    
	for (i = 0; this.effects && i < this.effects.length; i++) {
	    this._addCondition(this.subPanel.$effects, this.effects[i], this.effects.length);
	}
};

Creature.prototype.refreshCard = function(isCurrent) {
	if (!this.$panel) {
		this.createCard();
		return;
	}
	if (typeof(isCurrent) !== "undefined") {
		this.makeCurrent(isCurrent);
	}
	this.$panel[ this.isBloodied() ? "addClass" : "removeClass" ]("bloodied");
	this.subPanel.$name.html(this.name);
	this.subPanel.$hp.html(this.hp.current + (this.hp.temp ? " (" + (this.hp.temp + this.hp.current) + ")" : "") + " / " + this.hp.total);
    this.subPanel.$effects.children().remove();
	for (i = 0; this.effects && i < this.effects.length; i++) {
	    this._addCondition(this.subPanel.$effects, this.effects[i], this.effects.length);
	}
};

Creature.prototype.makeCurrent = function(isCurrent) {
	if (!this.$panel) {
		return;
	}
	this.$panel[ isCurrent ? "addClass" : "removeClass" ]("current");
}

Creature.prototype._addCondition = function($parent, effect, total) {
    var name, i, $div, image, clickHandler, condition;
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
    if (effect.children && effect.children.length) {
        for (i = 0; i < effect.children.length; i++) {
            this._addCondition($parent, effect.children[ i ], total);
        }
        return;
    }
    $div = jQuery("<div/>").addClass("condition");
    clickHandler = (function($this, event) {
        if (event.metaKey) {
            $this.off({ click: clickHandler });
            $this.remove();
            this.effects.splice(this.effects.indexOf(effect), 1);
            this.dispatchEvent({ type: "change" });
        }
    }).bind(this, $div);
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
    condition = Effect.CONDITIONS[ name ];
    if (name === "ongoing damage") {
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
        image.src = "images/symbols/unknown.png";
    }
    $div.append(image);
    if (effect.amount) {
        $div.append(jQuery("<span/>").css({ "line-height": image.height + "px", "color": condition && condition.color ? condition.color : "red" }).html(effect.amount));
    }
    $parent.append($div);
};

Creature.prototype.addDamageIndicator = function(damage) {
    var height, $damage, $centered, $types, $type, i, dmg, image, condition, $amount;
    if (!damage) {
    	return;
    }
    if (Object.prototype.toString.call(damage) !== "[object Array]") {
    	damage = [ damage ];
    }
    this.subPanel.$effects.find("div.damage").remove();
    $damage = jQuery("<div/>").addClass("damage").appendTo(this.subPanel.$effects);
    $centered = jQuery("<div/>").addClass("centered").appendTo($damage);
    $types = jQuery("<div/>").addClass("types").appendTo($centered);
	height = Math.floor(100 / damage.length);
    for (i = 0; i < damage.length; i++) {
    	dmg = damage[ i ];
    	$type = jQuery("<div/>").addClass("type").appendTo($types).css({ height: height + "%" });
        image = new Image();
        image.height = $type.height();
        image.className = "icon";
        if (dmg.type) {
        	if (Effect.CONDITIONS[ "ongoing damage" ][ dmg.type ] && Effect.CONDITIONS[ "ongoing damage" ][ dmg.type ].image) {
            	condition = Effect.CONDITIONS[ "ongoing damage" ][ dmg.type ];
        	}
        }
        if (!condition) {
        	condition = Effect.CONDITIONS[ "ongoing damage" ].untyped;
        }
    	image.src = condition.image;
        $type.append(image);
        if (dmg.amount) {
        	$amount = jQuery("<span/>").addClass("amount").css({ "font-size": Math.floor(image.height / 2) + "px", "line-height": image.height + "px", "color": condition && condition.color ? condition.color : "red" }).html(dmg.amount).appendTo($type);
        }
    }
//    setTimeout(function() {
//    	$damage.remove();
//    }, 30000);
};

Creature.prototype._addDefense = function($parent, className, value, icon) {
	var $div, image, editor;
	$div = jQuery("<div/>").addClass("nowrap").appendTo($parent);
	image = new Image();
	image.height = 20;
	image.className = "icon";
	image.src = icon;
	$div.append(image).addClass(className).attr("title", className.toUpperCase());
	editor = new Editor({ $parent: $div, tagName: "span", html: value, onchange: (function(v) {
		var old, entry;
		old = this.defenses[ className ];
		this.defenses[ className ] = parseInt(v);
		entry = new History.Entry({ 
			subject: this, 
			message: "Manually changed " + className.toUpperCase() + " from " + old + " to " + this.defenses[ className ], 
			round: this.history._round // TODO: make History.Entry inherit the round from the History instance 
		});
		this.history.add();
		this.dispatchEvent("change");
	}).bind(this) });
};

Creature.prototype._addHp = function($parent, src, title, className1, value1, className2, value2) {
	var image, editor, $span, $div;
	$div = jQuery("<div/>").addClass("nowrap").appendTo($parent);
	image = new Image();
	image.height = 20;
	image.className = "icon";
	image.title = title;
	image.src = src;
	$div.append(image);
	editor = new Editor({ $parent: $div, tagName: "span", html: value1, onchange: (function(v) {
		switch (className1) {
    		case "currentHp": {
    			this.hp.current = parseInt(v);
    			break;
    		}
    		case "tempHp": {
    			this.hp.temp = parseInt(v);
    			break;
    		}
    		case "surgesRemaining": {
    			this.surges.current = parseInt(v);
    			break;
    		}
		}
		this.dispatchEvent("change");
	}).bind(this) });
	editor.$html.addClass(className1);
	if (typeof(value2) !== "undefined") {
		editor.$html.addClass("numerator");
		jQuery("<span/>").addClass(className2).html(value2).appendTo($div);
	}
};

Creature.prototype._addAction = function($parent, title, src, click) {
	var image = new Image();
	image.height = 30;
	image.title = title;
	image.src = src;
	jQuery(image).css("display", "block").on({ click: click });
	$parent.append(image);
};


Creature.prototype.getCondition = function(condition) {
    var i;
    condition = condition ? condition.toLowerCase() : "";
    for (i = 0; condition && i < this.effects.length; i++) {
        if (this.effects[ i ].name.toLowerCase() === condition) {
            return this.effects[ i ];
        }
    }
    return null;
};

Creature.prototype.hasCondition = function(condition) {
    return this.getCondition(condition) !== null;
};

Creature.prototype.grantsCombatAdvantage = function(isMelee) {
    var i;
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
            case "prone": {
                return isMelee;
            }
        }
    }
    return false;
};

Creature.prototype.defenseModifier = function(isMelee) {
    var i, mod = 0;
    for (i = 0; i < this.effects.length; i++) {
        switch (this.effects[ i ].name.toLowerCase()) {
            case "unconscious":
            {
                mod -= 5;
                break;
            }
            case "prone": {
                mod += isMelee ? 0 : 2;
                break;
            }
        }
    }
    return mod;
};

Creature.prototype.attack = function(attack, item, targets, combatAdvantage, round, callback, manualRolls) {
    var toHit, damage, i, result, hits;
    hits = [];
    toHit = this._attackToHit(attack, item, combatAdvantage, manualRolls);
    damage = this._attackDamage(attack, item, toHit.isCrit, manualRolls);
    for (i = 0; i < targets.length; i++) {
        result = this._attackTarget(attack, item, combatAdvantage, targets[ i ], toHit, damage, round, callback);
        if (result.hit) {
        	result.target = targets[ i ].raw();
        	hits.push(result);
        }
    }
    return hits;
};

Creature.prototype._attackBonuses = function(attack, item, target, combatAdvantage) {
	var i, j, attackBonuses, attackBonus, isMatch;
	
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

Creature.prototype._attackToHit = function(attack, item, combatAdvantage, manualRolls) {
    var toHit, i, attackBonus;
    toHit = {
    	    isAutomaticHit: typeof(attack.toHit) === "string" && attack.toHit.toLowerCase() === "automatic",
    		isCrit: false,
    		isFumble: false,
    		conditional: { mod: 0 }
    };
    
    if (!toHit.isAutomaticHit) {
        if (manualRolls && manualRolls.attack && (manualRolls.attack.roll || manualRolls.attack.isCritical || manualRolls.attack.isFumble)) {
            toHit.roll = manualRolls.attack.roll;
            if (manualRolls.attack.isCritical) {
                attack.add(20 + attack.extra);
            }
            else if (manualRolls.attack.isFumble) {
                attack.add(1 + attack.extra);
            }
            else {
                attack.add(manualRolls.attack.roll - (item && item.enhancement ? item.enhancement : 0));
            }
        }
        else {
            toHit.roll = item ? attack.rollItem(item) : attack.roll();
        }
        toHit.isCrit = attack.isCritical();
        toHit.isFumble = attack.isFumble();
        if (!toHit.isCrit && !toHit.isFumble) {
            toHit.conditional = attack.toHitModifiers(this.effects);
            if (combatAdvantage) {
                toHit.conditional.breakdown += " + combat advantage"; 
            }
        }
    }
    
    return toHit;
};

Creature.prototype._attackDamage = function(attack, item, isCrit, manualRolls) {
	var damage, i, j, temp; 
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
    if (item && item.enhancement) {
    	if (attack.weaponMultiplier && attack.weaponMultiplier > 1) {
            damage.conditional.breakdown += " + " + attack.weaponMultiplier + "x[+" + item.enhancement + " weapon]";
    	}
    	else {
            damage.conditional.breakdown += " [+" + item.enhancement + " weapon]";
    	}
    }
    if (this.hasCondition("weakened")) {
        damage.conditional.mod = -1 * Math.ceil(damage.amount / 2);
        damage.conditional.breakdown += " [1/2 for weakened]";
        damage.conditional.effects.push("weakened");
        damage.amount = Math.floor(damage.amount / 2);
        damage.missAmount = Math.floor(damage.missAmount / 2);
    }
    
    return damage;
};

Creature.prototype._attackTarget = function(attack, item, combatAdvantage, target, toHit, damage, round, callback) {
	var attackBonuses, i, toHitTarget, targetDamage, tmp, targetDefense, msg, result;
	
	result = { hit: false, damage: [] };

	toHitTarget = { 
		roll: toHit.roll + (toHit.conditional.mod ? toHit.conditional.mod : 0),
		conditional: jQuery.extend({ mod: 0, breakdown: "" }, toHit.conditional)
	};
	targetDamage = { 
		amount: damage.amount, 
		missAmount: damage.missAmount,
		conditional: jQuery.extend({ mod: 0, total: 0, breakdown: "" }, damage.conditional)
	};
	
	if (!damage.isManual) {
	    attackBonuses = this._attackBonuses(attack, item, target, combatAdvantage);
	    for (i = 0; attackBonuses && i < attackBonuses.length; i++) {
	    	attackBonus = attackBonuses[ i ];
	    	if (attackBonus.toHit) {
	    		toHitTarget.roll += attackBonus.toHit; 
	    		toHitTarget.conditional.mod += attackBonus.toHit;
	    		toHitTarget.conditional.breakdown += (attackBonus.toHit >= 0 ? " +" : "") + attackBonus.toHit + " (" + attackBonus.name + ")";
	    	}
	    	if (attackBonus.damage) {
	    		targetDamage.amount += attackBonus.damage;
	    		targetDamage.conditional.mod += attackBonus.damage;
	    		targetDamage.conditional.total += attackBonus.damage;
	    		targetDamage.conditional.breakdown += (attackBonus.damage >= 0 ? " +" : "") + attackBonus.damage + " (" + attackBonus.name + ")";
	    		if (attack.miss && targetDamage.missAmount) {
	        		if (attack.miss.halfDamage) {
	        			tmp = Math.floor(attackBonus.damage / 2);
	            		targetDamage.missAmount += tmp;
	            		targetDamage.conditional.mod += tmp;
	            		targetDamage.conditional.breakdown += (tmp >= 0 ? " +" : "") + tmp + " (" + attackBonus.name + ")";
	        		}
	        		else {
	        			targetDamage.missAmount += attackBonus.damage;
	            		targetDamage.conditional.breakdown += (attackBonus.damage >= 0 ? " +" : "") + attackBonus.damage + " (" + attackBonus.name + ")";
	        		}
	    		}
	    	}
	    }
	}

    // Calculate hit (for this target)
    if (!toHit.isAutomaticHit && !toHit.isFumble && !toHit.isCrit) {
    	toHitTarget.roll += (combatAdvantage || target.grantsCombatAdvantage() ? 2 : 0);
    	targetDefense = target.defenses[ attack.defense.toLowerCase() ] + target.defenseModifier(attack.isMelee);
    }
    
    // Apply hit or miss damage/effects
    if (toHit.isAutomaticHit || toHit.isCrit || toHitTarget.roll >= targetDefense) {
    	// Hit
    	result.hit = true;
        msg = "Hit by " + this.name + "'s " + attack.anchor(toHitTarget.conditional) + " for ";
		if (Object.prototype.toString.call(attack.damage) === "[object Array]") {
			for (i = 0; i < attack.damage.length; i++) {
                msg += (i > 0 && i < attack.damage.length - 1 ? ", " : "") + (i > 0 && i === attack.damage.length - 1 ? " and " : "") + attack.damage[ i ].anchor(targetDamage.conditional);
                tmp = target.takeDamage(this, attack.damage[ i ].getLastRoll().total + (i === 0 ? targetDamage.conditional.mod : 0), attack.damage[ i ].type, i === 0 ? attack.effects : null);
                msg += tmp.msg;
            	result.damage.push({ amount: tmp.damage, type: attack.damage[ i ].type });
			}
		}
		else {
            msg += attack.damage.anchor(targetDamage.conditional);
            tmp = target.takeDamage(this, targetDamage.amount, attack.damage.type, attack.effects);
            msg += tmp.msg;
        	result.damage.push({ amount: tmp.damage, type: attack.damage.type });
		}
    }
    else {
    	// Miss
        msg = "Missed by " + this.name + "'s " + attack.anchor(toHit.conditional);
        if (targetDamage.missAmount) {
        	msg += " but takes ";
    		if (Object.prototype.toString.call(attack.miss.damage) === "[object Array]") {
    			for (i = 0; i < attack.miss.damage.length; i++) {
                    msg += (i > 0 && i < attack.miss.damage.length - 1 ? ", " : "") + (i > 0 && i === attack.miss.damage.length - 1 ? " and " : "") + attack.miss.damage[ j ].anchor(targetDamage.conditional);
    			}
    		}
    		else {
                msg += attack.miss.damage.anchor(targetDamage.conditional);
    		}
        	msg += " on a miss";
        }
        if (targetDamage.missAmount || attack.hasOwnProperty("miss")) {
    		if (Object.prototype.toString.call(attack.miss.damage) === "[object Array]") {
    			for (i = 0; i < attack.miss.damage.length; i++) {
                	tmp = target.takeDamage(this, attack.miss.damage[ i ].getLastRoll().total + (i === 0 ? targetDamage.conditional.mod : 0), attack.miss.damage[ i ].type, i === 0 ? attack.miss.effects : null);
                	msg += tmp.msg;
                	result.damage.push({ amount: tmp.damage, type: attack.miss.damage[ i ].type });
    			}
    		}
    		else {
            	tmp = target.takeDamage(this, attack.miss.damage.getLastRoll() + targetDamage.conditional.mod, attack.miss.damage.type, attack.miss.effects);
            	msg += tmp.msg;
            	result.damage.push({ amount: tmp.damage, type: attack.miss.damage.type });
    		}
        }
    }
    if (callback) {
        callback(target, msg);
    }
    return result;
};

Creature.prototype.takeDamage = function(attacker, damage, type, effects) {
    var temp, msg, i, result;
    msg = "";
    if (type && this.defenses.resistances && this.defenses.resistances.hasOwnProperty(type)) {
    	temp = this.defenses.resistances[ type ];
        msg += " (resisted " + Math.min(damage, temp) + ")";
    	damage = Math.max(damage - temp, 0);
    }
    if (this.hp.temp) {
        temp = this.hp.temp;
        this.hp.temp = Math.max(temp - damage, 0);
        msg += " (" + Math.min(damage, temp) + " absorbed by temporary HP)";
        damage = Math.max(damage - temp, 0);
    }
    if (damage > 0 && effects && effects.length) {
        for (i = 0; i < effects.length; i++) {
            if (effects[ i ].name.toLowerCase() === "marked") {
                effects[ i ].attacker = attacker ? attacker.name : "ongoing damage";
            }
            this.effects.push(effects[ i ]);
            msg += ", " + effects[ i ].toString();
        }
    }
    this.hp.current -= damage;
    if (this.hp.current < 0 && !this.hasCondition("dying")) {
        this.effects.push({ name: "Dying" });
        msg += "; " + this.name + " falls unconscious and is dying";
    }
//    this.addDamageIndicator(damage, type);
//    this.dispatchEvent({ type: "takeDamage", damage: { amount: damage, type: type } });
    result = {
    		msg: msg,
    		damage: damage,
    		type: type
    };

    return result;
};

Creature.prototype.startTurn = function() {
    var regen, i, effect, ongoingEffects = [ "Ongoing acid", "Ongoing cold", "Ongoing damage", "Ongoing fire", "Ongoing lightning", "Ongoing necrotic", "Ongoing poison", "Ongoing psychic", "Ongoing radiant" ];
    if (this.hp.regeneration && this.hp.current < this.hp.total) {
    	regen = Math.min(this.hp.regeneration, this.hp.total - this.hp.current);
    	this.hp.current += regen;
        this.history.add(new History.Entry({ round: this.history._round, subject: this, message: "Regenerated " + regen + " HP" }));
    }
    for (i = 0; this.effects && i < this.effects.length; i++) {
    	effect = this.effects[ i ];
        if (effect.name.toLowerCase() === "ongoing damage") {
            this.takeDamage(null, effect.amount, effect.type, null);
        }
    }
};

Creature.prototype.endTurn = function() {
    var i, j, savingThrow, savingThrowRoll, msg;
    for (i = 0; i < this.effects.length; i++) {
        effect = this.effects[ i ];
        if (effect !== null && effect.saveEnds) {
            savingThrow = new SavingThrow({ effect: effect });
            savingThrowRoll = savingThrow.roll();
            if (savingThrowRoll >= 10) {
                this.effects.splice(i, 1);
                i--;
            }
            msg = savingThrow.anchor();
            this.history.add(new History.Entry({ round: this.history._round, subject: this, message: msg }));
        }
    }
    return msg;
};

Creature.prototype.toActor = function(count) {
    var actor = new Creature(this.raw(), true);
    actor.type = actor.name;
    if (!actor.isPC) {
        actor.name = actor.name + (count ? " #" + count : "");
    }
    return actor;
};

Creature.prototype.toString = function() {
    return "[Creature \"" + this.name + "\"]";
};
