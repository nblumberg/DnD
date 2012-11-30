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
			this._renderMsg(this._rounds[ props[ p ] ][ i ], p, i);
		}
	}
};

History.Entry = function(params) {
	params = params || {};
	this.msg = params.msg;
	this.round = params.round;
	this.histories = [];
	this.$htmls = [];
};

History.Entry.prototype._render = function($parent, index) {
	var $li = jQuery("<li/>").append(jQuery("<span/>").html(this.msg));
	$li.on({ click: this._edit.bind(this, $li) });
	this.index = index;
	this.$htmls.push($li);
	$li.data("entry", this);
	$parent.append($li);
};

History.Entry.prototype._edit = function($parent, event) {
	var entry, $span, $input, $save, $delete, i, $ancestor;
	event.stopPropagation();
	if ($parent.hasClass("edit")) {
		return;
	}
	$parent.removeClass("entry").addClass("edit");
	this.$span = $parent.find("span");
	this.$input = jQuery("<textarea/>").addClass("halfWidth").val(this.$span.html()).appendTo($parent);
	this.$span.remove();
	this.$delete = jQuery("<button/>").attr("title", "Delete").html("X").on({ click: this._delete.bind(this) });
	this.$save = jQuery("<button/>").attr("title", "Save").html("&#x2713;").appendTo($parent).on({ click: this._save.bind(this, $parent) });
	$parent.append(this.$delete);
};

History.Entry.prototype._save = function($parent, event) {
	var i, _self;
	_self = this;
	event.stopPropagation();
	this.$input.remove();
	this.$save.remove();
	this.$delete.remove();
	$parent.append(this.$span);
	$parent.removeClass("edit").addClass("entry");
	for (i = 0; i < this.histories.length; i++) {
		this.histories[ i ]._rounds[ this.round ][ this.index ] = this.$input.val();
		this.$htmls[ i ].find("span").each(function() { jQuery(this).html(_self.$input.val()); });
	}
};

History.Entry.prototype._delete = function(event) {
	var i, j, $ul, $round, $history;
	event.stopPropagation();
	for (i = 0; i < this.histories.length; i++) {
		this.histories[ i ]._rounds[ this.round ].splice(this.index, 1);
		$ul = this.$htmls[ i ].parent();
		$round = $ul.parent();
		$history = $round.parent();
		this.$htmls[ i ].remove();
		// Remove empty rounds as well
		if (!$ul.children().length) {
			$ul.remove();
			$round.remove();
			if (!$history.children().length) {
				this.histories[ i ].$html = jQuery("<span/>").html("No history");
				this.histories[ i ].$html.insertBefore($history);
				$history.remove();
			}
		}
	}
	this.$input = null;
	this.$save = null;
	this.$delete = null;
};

History.prototype.add = function(entry) {
	entry.round = entry.round ? entry.round : this._round;
	entry.histories.push(this);
	if (!this._rounds.hasOwnProperty(entry.round)) {
		this._rounds[ entry.round ] = [];
	}
	this._rounds[ entry.round ].push(entry);
	this._renderMsg(entry, this._rounds[ entry.round ].length - 1);
};

History.prototype._renderMsg = function(entry, index) {
	var $tmp, p, i, $ul, $li;
	if (!this._count) {
		$tmp = jQuery("<ul/>").insertBefore(this.$html);
		this.$html.remove();
		this.$html = $tmp;
		this.$html.delegate(".entry", "click", this._createMsgEditor);
	}
	this._count++;
	if (this._round !== entry.round) {
		this._round = entry.round;
		$li = jQuery("<li/>").addClass("round round" + entry.round).html("Round " + entry.round);
		this.$html.append($li);
		$ul = jQuery("<ul/>").appendTo($li);
		$li.on({ click: function() {
			jQuery(this).children("ul").toggle();
		} });
	}
	else {
		$ul = this.$html.children(".round" + entry.round);
	}
	entry._render($ul, index);
};

