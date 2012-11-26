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

var History = function(params) {
	var props, p, i, $ul, $li;
	
	params = params || {};
	this._rounds = params.rounds || {};
	this._round = params.round || 0;
	this._count = 0;
	
	props = [];
	for (p in this._rounds) {
		if (this._rounds.hasOwnProperty(p)) {
			try {
				parseInt(p);
				props.push(p);
			}
			catch (e) {}
		}
	}
	props.sort();
	this.$html = props.length ? jQuery("<ul/>") : jQuery("<span/>").html("No history");
	for (p = 0; p < props.length; p++) {
		for (i = 0; i < this._rounds[ props[ p ] ].length; i++) {
			this._renderMsg(this._rounds[ props[ p ] ][ i ], p);
		}
	}
};

History.prototype.add = function(msg, round) {
	round = round ? round : this._round;
	if (!this._rounds.hasOwnProperty(round)) {
		this._rounds[ round ] = [];
	}
	this._rounds[ round ].push(msg);
	this._renderMsg(msg, round);
};

History.prototype._renderMsg = function(msg, round) {
	var $tmp, p, i, $ul, $li;
	if (!this._count) {
		$tmp = jQuery("<ul/>").insertBefore(this.$html);
		this.$html.remove();
		this.$html = $tmp;
	}
	this._count++;
	if (this._round !== round) {
		this._round = round;
		$li = jQuery("<li/>").addClass("round round" + round).html("Round " + round);
		this.$html.append($li);
		$ul = jQuery("<ul/>").appendTo($li);
		$li.on({ click: function() {
			jQuery(this).children("ul").toggle();
		} });
	}
	else {
		$ul = this.$html.children(".round" + round);
	}
	$li = jQuery("<li/>").html(msg);
	$ul.append($li);
};

var Creature = function(params) {
	var i;
	params = params || {};
	this.name = params.name;
	this.image = params.image;
	this.hp = new HP(params.hp);
	this.surges = new Surges(params.surges);
	this.defenses = params.defenses || new Defenses();
	this.attacks = params.attacks || [];
	this.init = params.init || 0;
	this.ap = params.ap || 0;
	this.effects = [];
	this.move = params.move || 6;
	this.attacks = [];
	for (i = 0; params.attacks && i < params.attacks.length; i++) {
		this.attacks.push(new Attack(params.attacks[ i ]));
	}
	this.history = new History(params.history);
};

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
	
	$tr = jQuery("<tr/>").attr("id", this.name);
	if (params.isCurrent) {
		$tr.addClass("current");
	}
	if (this.isBloodied()) {
		$tr.addClass("bloodied");
	}
	params.$table.append($tr);
	
	$td = jQuery("<td/>");
	$tr.append($td);
	image = new Image();
	image.height = 100;
	image.src = this.image;
	$td.append(image);
	$td.append(jQuery("<div/>").html(this.name));
	
	$td = jQuery("<td/>");
	$tr.append($td);
	this._addDefense($td, "ac", this.defenses.ac, "http://aux.iconpedia.net/uploads/20429361841025286885.png");
	this._addDefense($td, "fort", this.defenses.fort, "http://www.gettyicons.com/free-icons/101/sigma-medical/png/256/cardiology_256.png"); // "http://icons.iconarchive.com/icons/dryicons/valentine/128/heart-icon.png");
	this._addDefense($td, "ref", this.defenses.ref, "http://pictogram-free.com/highresolution/l_163.png");
	this._addDefense($td, "will", this.defenses.will, "http://www.iconhot.com/icon/png/medical-icons/256/brain.png");
	
	$td = jQuery("<td/>").addClass("hp").appendTo($tr);
	if (this.hp.temp) {
		this._addHp($td, "http://findicons.com/files/icons/1700/2d/512/clock.png", "Temp HP", "tempHp", this.hp.temp);
	}
	this._addHp($td, "http://icons.iconarchive.com/icons/dryicons/valentine/128/heart-icon.png", "HP", "currentHp", this.hp.current, "totalHp", this.hp.total);
	if (this.surges && this.surges.hasOwnProperty("current")) {
		this._addHp($td, "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Red_Cross_icon.svg/480px-Red_Cross_icon.svg.png", "Healing Surges", "surgesRemaining", this.surges.current, "surgesPerDay", this.surges.perDay);
	}
	
	$td = jQuery("<td/>").addClass("actions");
	$tr.append($td);
	this._addAction($td, "Attack", "http://gamereviewhero.com/images/sword_icon.png", params.attack);
	this._addAction($td, "Heal", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Red_Cross_icon.svg/480px-Red_Cross_icon.svg.png", params.heal);
	
	$td = jQuery("<td/>").addClass("history");
	$tr.append($td);
	$div = jQuery("<div/>").appendTo($td);
	$div.append(this.history.$html);
};

/**
 * @param $parent {jQuery(element)} The parent element
 * @param isCurrent {Boolean} Indicates if it is this Creature's turn in the initiative order
 */
Creature.prototype.createCard = function(params) {
	var $parent, $div, $span, image;
	params = params || {};
	$parent = params.$parent ? jQuery(params.$parent) : jQuery("body");
	this.$panel = jQuery("<div/>").attr("id", this.name).addClass("creaturePanel").appendTo($parent);
	if (params.isCurrent) {
		this.$panel.addClass("current");
	}
	if (this.isBloodied()) {
		this.$panel.addClass("bloodied");
	}
	
	$div = jQuery("<div/>").addClass("column identity").appendTo(this.$panel);
	image = new Image();
	image.height = 100;
	image.src = this.image;
	$div.append(image);
	$div.append(jQuery("<div/>").html(this.name));

	$div = jQuery("<div/>").addClass("column defenses").appendTo(this.$panel);
	this._addDefense($div, "ac", this.defenses.ac, "http://aux.iconpedia.net/uploads/20429361841025286885.png");
	this._addDefense($div, "fort", this.defenses.fort, "http://www.gettyicons.com/free-icons/101/sigma-medical/png/256/cardiology_256.png"); // "http://icons.iconarchive.com/icons/dryicons/valentine/128/heart-icon.png");
	this._addDefense($div, "ref", this.defenses.ref, "http://pictogram-free.com/highresolution/l_163.png");
	this._addDefense($div, "will", this.defenses.will, "http://www.iconhot.com/icon/png/medical-icons/256/brain.png");
	
	$div = jQuery("<div/>").addClass("column hp").appendTo(this.$panel);
	if (this.hp.temp) {
		this._addHp($div, "http://findicons.com/files/icons/1700/2d/512/clock.png", "Temp HP", "tempHp", this.hp.temp);
	}
	this._addHp($div, "http://icons.iconarchive.com/icons/dryicons/valentine/128/heart-icon.png", "HP", "currentHp", this.hp.current, "totalHp", this.hp.total);
	if (this.surges && this.surges.hasOwnProperty("current")) {
		this._addHp($div, "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Red_Cross_icon.svg/480px-Red_Cross_icon.svg.png", "Healing Surges", "surgesRemaining", this.surges.current, "surgesPerDay", this.surges.perDay);
	}
	
	$div = jQuery("<div/>").addClass("fullWidth actions").appendTo(this.$panel);
	this._addAction($div, "Attack", "http://gamereviewhero.com/images/sword_icon.png", params.attack);
	this._addAction($div, "Heal", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Red_Cross_icon.svg/480px-Red_Cross_icon.svg.png", params.heal);
};

Creature.prototype._addDefense = function($parent, className, value, icon) {
	var image = new Image();
	image.height = 20;
	image.className = "icon";
	image.src = icon;
	jQuery("<div/>").addClass(className).attr("title", className.toUpperCase()).html(value).prepend(image).appendTo($parent);
};

Creature.prototype._addHp = function($parent, src, title, className1, value1, className2, value2) {
	var image, $span, $div;
	image = new Image();
	image.height = 20;
	image.className = "icon";
	image.title = title;
	image.src = src;
	$span = jQuery("<span/>").addClass(className1).html(value1);
	$div = jQuery("<div/>").appendTo($parent).append(image).append($span);
	if (typeof(value2) !== "undefined") {
		$span.addClass("numerator");
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

