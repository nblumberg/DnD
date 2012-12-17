var History = function(params) {
	var i, entry;
	
	params = params || {};
	this._entries = params._entries || [];
	this._round = 0;
	this._count = 0;
	this._includeSubject = params._includeSubject;
	
	this.$html = this._entries.length > 0 ? jQuery("<ul/>") : jQuery("<span/>").html("No history");
	for (i = 0; i < this._entries.length; i++) {
		entry = History.Entry.entries[ this._entries[ i ] ];
		if (!entry) {
			continue;
		}
		entry._addToRound(this._getRound(entry), this._includeSubject);
	}
};

History.central = null;

History.prototype = new Serializable();

History.prototype.add = function(entry) {
	entry.round = entry.round ? entry.round : this._round;
	this._entries.push(entry.id);
	entry._addToRound(this._getRound(entry), this._includeSubject);
};

History.prototype.update = function(entry) {
	var message = entry.message;
	if (this._includeSubject) {
		message = entry.subject.name + " " + message.charAt(0).toLowerCase() + message.substr(1);
	}
	this.$html.find("li.entry" + entry.id + " span").html(message);
};

History.prototype.remove = function(entry) {
	var $entry, $ul, $round, $tmp;
	$entry = this.$html.find("li.entry" + entry.id);
	$ul = $entry.parent();
	$round = $ul.parent();
	$entry.remove();
	// Remove empty rounds as well
	if (!$ul.children().length) {
		$ul.remove();
		$round.remove();
		// Reset empty histories as well
		if (!this.$html.children().length) {
			$tmp = jQuery("<span/>").html("No history");
			$tmp.insertBefore(this.$html);
			this.$html.remove();
			this.$html = $tmp;
		}
	}
};

History.prototype._getRound = function(entry) {
	var $tmp, _self, $ul, $li;
	_self = this;
	if (!this._count) {
		$tmp = jQuery("<ul/>").insertBefore(this.$html);
		this.$html.remove();
		this.$html = $tmp;
		this.$html.delegate(".round", "click", function(event) {
			jQuery(this).children("ul").toggle();
		});
		this.$html.delegate(".entry", "click", function(event) {
			event.stopPropagation();
			_self._editEntry(jQuery(this), _self); 
		});
	}
	this._count++;
	if (this._round !== entry.round) {
		this._round = entry.round;
		$li = jQuery("<li/>").addClass("round round" + entry.round).html("Round " + entry.round).appendTo(this.$html);
		$ul = jQuery("<ul/>").appendTo($li);
	}
	else {
		$ul = this.$html.children(".round" + entry.round).children("ul");
	}
	return $ul;
};

History.prototype._editEntry = function($entry, history) {
	$entry.data("entry")._edit($entry, history);
};

//History.prototype.raw = function() {
//	var raw, prop;
//	raw = {};
//	for each (prop in this) {
//		if (this.hasOwnProperty(prop)) {
//			if (this[ prop ] && this[ prop ].hasOwnProperty("raw")) {
//				raw[ prop ] = this[ prop ].raw();
//			}
//			else {
//				raw[ prop ] = JSON.stringify(this[ prop ], null, "  ");
//			}
//		}
//	}
//    return raw;
//};

History.prototype.toString = function() {
    return "[History]";
};

History.prototype.toJSON = function() {
    return JSON.stringify(this.raw(), null, "  ");
};


History.Editor = function(params) {
	params = params || {};
	this.$parent = params.$parent;
	this.$input = jQuery("<textarea/>").addClass("halfWidth").val(params.message).appendTo(this.$parent);
	this.$save = jQuery("<button/>").attr("title", "Save").html("&#x2713;").appendTo(this.$parent).on({ click: (function() { 
		if (params.save) {
			params.save(this.$input.val());
		} 
	}).bind(this) });
	this.$cancel = jQuery("<button/>").attr("title", "Delete").html("X").appendTo(this.$parent).on({ click: (function() {
		if (params.cancel) {
			params.cancel();
		} 
	}).bind(this) });
};

History.Editor.prototype = new Serializable();

History.Editor.prototype.remove = function() {
	this.$input.remove();
	this.$save.off("click").remove();
	this.$cancel.off("click").remove();
};

History.Editor.prototype.raw = function() {
	return null;
};


History.Entry = function(params) {
	params = params || {};
	this.id = params.id || History.Entry.id++;
	History.Entry.entries[ this.id ] = this;
	if (typeof(params.subject) === "string") {
	    params.subject = parseInt(params.subject);
	}
	if (typeof(params.subject) === "number") {
	    this.subject = Creature.actors[ params.subject ];
	}
	else {
	    this.subject = params.subject;
	}
	this.message = params.message;
	this.round = params.round;
};

History.Entry.prototype = new EventDispatcher();

History.Entry.id = (new Date()).getTime();
History.Entry.entries = {};
History.Entry.init = function(params) {
    var p;
    params = params || {};
    History.Entry.entries = {};
    for (p in params) {
        if (params.hasOwnProperty(p)) {
            new History.Entry(params[ p ]);
        }
    }
};
History.Entry.prototype.toString = function() {
    return "[History Entry]";
};

History.Entry.prototype._addToRound = function($round, includeSubject) {
	var message, $li, $span;
	message = this.message;
	if (includeSubject) {
		message = this.subject.name + " " + message.charAt(0).toLowerCase() + message.substr(1);
	}
	$span = jQuery("<span/>").addClass(includeSubject ? "includeSubject" : "").html(message);
	$li = jQuery("<li/>").addClass("entry entry" + this.id).append($span).appendTo($round).data("entry", this); //.on({ click: this._edit.bind(this, $li) });
};

History.Entry.prototype._edit = function($entry, history) {
	var $span, $input, $save, $delete, i, $ancestor;
	if ($entry.hasClass("edit")) {
		return;
	}
	$entry.addClass("edit");
	$span = $entry.find("span");
	$input = jQuery("<textarea/>").addClass("halfWidth").val(this.message).appendTo($entry);
	$span.remove();
	$save = jQuery("<button/>").attr("title", "Save").html("&#x2713;").appendTo($entry);
	$delete = jQuery("<button/>").attr("title", "Delete").html("X").appendTo($entry);
	$save.on({ click: this._save.bind(this, $entry, $span, $input, $save, $delete, history) });
	$delete.on({ click: this._delete.bind(this, $entry, $span, $input, $save, $delete, history) });
};

History.Entry.prototype._save = function($entry, $span, $input, $save, $delete, history, event) {
	var message;
	event.stopPropagation();

	this.message = $input.val();
	message = this.message;
	if (history._includeSubject) {
		message = this.subject.name + " " + message.charAt(0).toLowerCase() + message.substr(1);
	}
	
	$span.html(message);
	$input.remove();
	$save.remove();
	$delete.remove();
	$entry.append($span);
	$entry.removeClass("edit");
	
	if (history === History.central) {
		this.subject.history.update(this);
	}
	else {
		History.central.update(this);
	}
};

History.Entry.prototype._delete = function($entry, $span, $input, $save, $delete, history, event) {
	var $ul, $round, $history;
	event.stopPropagation();
	
	$ul = $entry.parent();
	$round = $ul.parent();
	$history = $round.parent();
	$entry.remove();
	// Remove empty rounds as well
	if (!$ul.children().length) {
		$ul.remove();
		$round.remove();
		// Reset empty histories as well
		if (!$history.children().length) {
			history.$html = jQuery("<span/>").html("No history");
			history.$html.insertBefore($history);
			$history.remove();
		}
	}
	
	if (history === History.central) {
		this.subject.history.remove(this);
	}
	else {
		History.central.remove(this);
	}
	
	delete History.Entry.entries[ this.id ];
};

History.Entry.prototype.raw = function() {
	var raw;
	raw = Serializable.prototype.raw.call(this);
	raw.subject = raw.subject ? raw.subject.id : null;
    return raw;
};

History.Entry.prototype.toJSON = function() {
    return JSON.stringify(this.raw(), null, "  ");
};