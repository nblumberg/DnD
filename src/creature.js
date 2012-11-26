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

