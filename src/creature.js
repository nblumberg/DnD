var Defenses = function(params) {
	params = params || {};
	this.ac = params.ac || 10;
	this.fort = params.fort || 10;
	this.ref = params.ref || 10;
	this.will = params.will || 10;
};

var HP = function(params) {
	params = params || {};
	this.total = params.total || 1;
	this.current = params.current || this.total;
	this.temp = params.temp || 0;
};

var Surges = function(params) {
	params = params || {};
	this.perDay = params.perDay || 0;
	this.current = params.current || this.perDay;
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
        "Attack penalty": { image: "images/symbols/attack_penalty.jpg", color: "white" },
        Blinded: { image: "images/symbols/blinded.png" }, // "http://icons.iconarchive.com/icons/anatom5/people-disability/128/blind-icon.png",
        Dazed: { image: "images/symbols/dazed.jpg" }, // "http://1.bp.blogspot.com/_jJ7QNDTPcRI/TUs0RMuPz6I/AAAAAAAAAjo/YGnw2mI-aMo/s320/dizzy-smiley.jpg",
        Deafened: { image: "images/symbols/deafened.gif" }, // "http://joeclark.org/ear.gif",
        Diseased: { image: "images/symbols/diseased.jpg" }, // "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRnOrSXb8UHvwhgQ-loEdXZvQPTjuBylSfFNiK7Hxyq03IxgUKe",
        Dominated: { image: "images/symbols/dominated.png" }, // "http://fs02.androidpit.info/ali/x90/4186790-1324571166012.png",
        Dying: { image: "images/symbols/dying.png" }, // "http://iconbug.com/data/61/256/170c6197a99434339f465fa8c9fa4018.png",
        Dead: { image: "images/symbols/dead.jpg" }, // "http://t2.gstatic.com/images?q=tbn:ANd9GcTPA7scM15IRChKnwigvYnQUDWNGHLL1cemtAeKxxZKwBDj33MFCxzfyorp",
        Grabbed: { image: "images/symbols/grabbed.jpg" }, // "http://www.filipesabella.com/wp-content/uploads/2010/02/hand_grab.jpg",
        Helpless: { image: "images/symbols/helpless.png" }, // "http://files.softicons.com/download/tv-movie-icons/dexter-icons-by-rich-d/png/128/Tied-Up%20Dexter.png",
        Immobilized: { image: "images/symbols/immobilized.gif" }, // "http://www.hscripts.com/freeimages/icons/traffic/regulatory-signs/no-pedestrian/no-pedestrian1.gif",
        Marked: { image: "images/symbols/marked.png" }, // "http://openclipart.org/image/800px/svg_to_png/30103/Target_icon.png",
        "Ongoing acid": { image: "images/symbols/ongoing_acid.png", color: "#00FF00" }, // "http://en.xn--icne-wqa.com/images/icones/8/0/pictograms-aem-0002-hand-burn-from-chemical.png",
        "Ongoing cold": { image: "images/symbols/ongoing_cold.jpg", color: "#6666FF" }, // "http://www.psdgraphics.com/file/blue-snowflake-icon.jpg",
        "Ongoing damage": { image: "images/symbols/ongoing_damage.jpg", color: "#FFFFFF" }, // "http://www.thelegendofreginaldburks.com/wp-content/uploads/2011/02/blood-spatter.jpg",
        "Ongoing fire": { image: "images/symbols/ongoing_fire.jpg", color: "#555555" }, // "http://bestclipartblog.com/clipart-pics/-fire-clipart-2.jpg",
        "Ongoing lightning": { image: "images/symbols/ongoing_lightning.png", color: "#CCCCFF" }, // "http://www.mricons.com/store/png/2499_3568_128_lightning_power_icon.png",
        "Ongoing necrotic": { image: "images/symbols/ongoing_necrotic.jpg", color: "purple" }, // "http://shell.lava.net/ohol_yaohushua/pentagram.jpg", // "http://www.soulwinners.com.au/images/Goat.jpg?942",
        "Ongoing poison": { image: "images/symbols/ongoing_poison.jpg", color: "#00FF00" }, // "http://ts3.mm.bing.net/th?id=H.4671950275020154&pid=1.7&w=138&h=142&c=7&rs=1",
        "Ongoing psychic": { image: "images/symbols/ongoing_psychic.jpg", color: "cyan" }, // "http://uniteunderfreedom.com/wp-content/uploads/2011/09/Brain-waves.jpg",
        "Ongoing radiant": { image: "images/symbols/ongoing_radiant.jpg", color: "#FFFFFF" }, // "http://us.123rf.com/400wm/400/400/booblgum/booblgum1001/booblgum100100021/6174537-magic-radial-rainbow-light-with-white-stars.jpg",
        Petrified: { image: "images/symbols/petrified.gif" }, // "http://www.mythweb.com/encyc/images/media/medusas_head.gif",
        Prone: { image: "images/symbols/prone.png" }, // "http://lessonpix.com/drawings/2079/100x100/Lying+Down.png",
        Restrained: { image: "images/symbols/restrained.jpg" }, // "http://p2.la-img.com/46/19428/6595678_1_l.jpg", // "http://ts3.mm.bing.net/th?id=H.4552318270046582&pid=1.9", // "http://us.123rf.com/400wm/400/400/robodread/robodread1109/robodread110901972/10664893-hands-tied.jpg",
        Slowed: { image: "images/symbols/slowed.jpg" }, // "http://glimages.graphicleftovers.com/18234/246508/246508_125.jpg",
        Stunned: { image: "images/symbols/stunned.jpg" }, // "http://images.all-free-download.com/images/graphicmedium/zap_74470.jpg",
        Unconscious: { image: "images/symbols/unconscious.gif" }, // "http://1.bp.blogspot.com/_ODwXXwIH70g/S1KHvp1iCHI/AAAAAAAACPo/o3QBUfcCT2M/s400/sm_zs.gif",
        Weakened: { image: "images/symbols/weakened.png" }, // "http://pictogram-free.com/material/003.png"
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


var Weapon = function(params) {
	params = params || {};
	this._init(params);
	this.isMelee = params.isMelee;
	this.proficiency = params.proficiency || 0;
	this.damage = new Damage(params.damage);
};

Weapon.prototype = new Implement();


var Abilities = function(params) {
	var i, ability, abilities = [ "STR", "DEX", "CON", "INT", "WIS", "CHA" ];
	params = params || {};
	for (i = 0; i < abilities.length; i++) {
		ability = abilities[ i ];
		this[ ability ] = params[ ability ] || 10;
		this[ ability + "mod" ] = Math.floor((this[ ability ] - 10) / 2);
	}
};

var Creature = function(params) {
	var i;
	params = params || {};
	this._listeners = {};
	this.name = params.name;
	this.image = params.image;
	this.isPC = params.isPC || false;
	this.level = params.level || false;
	this.abilities = new Abilities(params.abilities);
	this.hp = new HP(params.hp);
	this.surges = new Surges(params.surges);
	this.defenses = params.defenses || new Defenses();
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
	this._addDefense($td, "ac", this.defenses.ac, "http://aux.iconpedia.net/uploads/20429361841025286885.png");
	this._addDefense($td, "fort", this.defenses.fort, "http://www.gettyicons.com/free-icons/101/sigma-medical/png/256/cardiology_256.png"); // "http://icons.iconarchive.com/icons/dryicons/valentine/128/heart-icon.png");
	this._addDefense($td, "ref", this.defenses.ref, "http://pictogram-free.com/highresolution/l_163.png");
	this._addDefense($td, "will", this.defenses.will, "http://www.iconhot.com/icon/png/medical-icons/256/brain.png");
	
	$td = jQuery("<td/>").addClass("hp bordered").appendTo($tr);
	if (this.hp.temp) {
		this._addHp($td, "http://findicons.com/files/icons/1700/2d/512/clock.png", "Temp HP", "tempHp", this.hp.temp);
	}
	this._addHp($td, "http://icons.iconarchive.com/icons/dryicons/valentine/128/heart-icon.png", "HP", "currentHp", this.hp.current, "totalHp", this.hp.total);
	if (this.surges && this.surges.hasOwnProperty("current")) {
		this._addHp($td, "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Red_Cross_icon.svg/480px-Red_Cross_icon.svg.png", "Healing Surges", "surgesRemaining", this.surges.current, "surgesPerDay", this.surges.perDay);
	}
	
	$td = jQuery("<td/>").addClass("actions bordered");
	$tr.append($td);
	this._addAction($td, "Attack", "http://gamereviewhero.com/images/sword_icon.png", params.attack);
	this._addAction($td, "Heal", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Red_Cross_icon.svg/480px-Red_Cross_icon.svg.png", params.heal);
	
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
	var $parent, $div, $span, image, i, $effects;
	params = params || {};
	this.cardSize = params.cardSize || Creature._CARD_SIZE;
	$parent = params.$parent ? jQuery(params.$parent) : jQuery("body");
	this.$panel = jQuery("<div/>").attr("id", this.name + "_panel").addClass("creaturePanel centered bordered " + params.className).appendTo($parent);
	if (params.isCurrent) {
		this.$panel.addClass("current");
	}
	if (this.isBloodied()) {
		this.$panel.addClass("bloodied");
	}
	
	image = new Image();
	image.height = this.cardSize * 100/120;
	image.src = this.image;
	this.$panel.append(image);
	this.$panel.append(jQuery("<div/>").addClass("f2").html(this.name));
	
    $effects = jQuery("<div/>").addClass("effects").appendTo(this.$panel);
    
	for (i = 0; this.effects && i < this.effects.length; i++) {
	    this._addCondition($effects, this.effects[i], this.effects.length);
	}
};

Creature.prototype._addCondition = function($parent, effect, total) {
    var i, $div, image, clickHandler;
    if (effect.children && effect.children.length) {
        for (i = 0; i < effect.children.length; i++) {
            this._addCondition($parent, effect.children[ i ], total);
        }
        return;
    }
    $div = jQuery("<div/>").addClass("condition");
    if (Effect.CONDITIONS[ effect.name ].color) {
        $div.css({ color: Effect.CONDITIONS[ effect.name ].color });
    }
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
    image.title = effect.name;
    image.src = Effect.CONDITIONS[ effect.name ].image;
    $div.append(image);
    if (effect.amount) {
        $div.append(jQuery("<span/>").css({ "line-height": image.height + "px" }).html(effect.amount)); 
    }
    $parent.append($div);
};

Creature.prototype._addDefense = function($parent, className, value, icon) {
	var $div, image, editor;
	$div = jQuery("<div/>").appendTo($parent);
	image = new Image();
	image.height = 20;
	image.className = "icon";
	image.src = icon;
	$div.append(image).addClass(className).attr("title", className.toUpperCase());
	editor = new Editor({ $parent: $div, tagName: "span", html: value, onchange: (function(v) {
		this.defenses[ className ] = parseInt(v);
		this.dispatchEvent("change");
	}).bind(this) });
};

Creature.prototype._addHp = function($parent, src, title, className1, value1, className2, value2) {
	var image, editor, $span, $div;
	$div = jQuery("<div/>").appendTo($parent);
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
	jQuery(image).on({ click: click });
	$parent.append(image);
};


Creature.prototype.getCondition = function(condition) {
    var i;
    for (i = 0; i < this.effects.length; i++) {
        if (this.effects[ i ].name === condition) {
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

Creature.prototype.attack = function(attack, item, targets, combatAdvantage, round, callback) {
    var i, j, targets, toHit, toHitRoll, isCrit, isFumble, toHitCond, def, defCondMod, damage, dmgCond, target, msg, temp;
    toHitRoll = attack.roll() + (item && item.enhancement ? item.enhancement : 0);
    isCrit = attack.isCritical();
    isFumble = attack.isFumble();
    if (!isCrit && !isFumble) {
        toHitCond = attack.toHitModifiers(this.effects);
        if (combatAdvantage) {
            toHitCond.breakdown += " + combat advantage"; 
        }
    }
    
    for (i = 0; i < targets.length; i++) {
        target = targets[ i ];
        
        if (!isFumble && !isCrit) {
            toHit = toHitRoll + toHitCond.mod + (combatAdvantage || target.grantsCombatAdvantage() ? 2 : 0);
            def = target.defenses[ attack.defense.toLowerCase() ];
            defCondMod = target.defenseModifier(attack.isMelee);
        }
        if (!isFumble && (isCrit || toHit >= def + defCondMod)) {
            damage = attack.damage.rollItem(item, isCrit);
            dmgCond = { mod: 0, breakdown: "", effects: [] };
            if (this.hasCondition("weakened")) {
                dmgCond.mod = -1 * Math.ceil(damage / 2);
                dmgCond.breakdown += " [1/2 for weakened]";
                dmgCond.effects.push("weakened");
                damage = Math.floor(damage / 2);
            }
            msg = "Hit by " + this.name + "'s " + attack.anchor(toHitCond) + " for " + attack.damage.anchor(dmgCond);
            msg += target.takeDamage(damage, attack.effects);
        }
        else {
            msg = "Missed by " + this.name + "'s " + attack.anchor(toHitCond);
        }
        if (callback) {
            callback(target, msg);
        }
    }
};

Creature.prototype.takeDamage = function(damage, effects) {
    var temp, msg, i;
    msg = "";
    // TODO: resistance
    if (this.hp.temp) {
        temp = this.hp.temp;
        this.hp.temp = Math.max(temp - damage, 0);
        damage -= Math.max(damage - temp, 0);
        msg += " (" + Math.min(damage, temp) + " absorbed by temporary HP)";
    }
    if (damage > 0 && effects && effects.length) {
        for (i = 0; i < effects.length; i++) {
            this.effects.push(effects[ i ]);
            msg += ", " + effects[ i ].toString();
        }
    }
    this.hp.current -= damage;
    if (this.hp.current < 0 && !this.hasCondition("dying")) {
        this.effects.push({ name: "Dying" });
        msg += "; " + this.name + " falls unconscious and is dying";
    }
    return msg;
};

Creature.prototype.startTurn = function() {
    var i, effect, ongoingEffects = [ "Ongoing acid", "Ongoing cold", "Ongoing damage", "Ongoing fire", "Ongoing lightning", "Ongoing necrotic", "Ongoing poison", "Ongoing psychic", "Ongoing radiant" ];
    for (i = 0; this.effects && this.effects.length && i < ongoingEffects.length; i++) {
        effect = this.getCondition(ongoingEffects[ i ]);
        if (effect !== null) {
            this.takeDamage(effect.damage);
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