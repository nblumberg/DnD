var DnD;

(function(jQuery) {
    "use strict";
    
    if (!DnD) {
        DnD = {};
    }
    
    // HISTORY
    // CONSTRUCTOR
    
    function History(params) {
        var i, entry;
        
        if (!History.initialized) {
            jQuery(document).on("click", "li.round", function(event) {
                jQuery(this).children("ul").toggle();
            }).on("click", "li.entry", function(event) {
                var $entry, history;
                event.stopPropagation();
                $entry = jQuery(this);
                history = $entry.closest(".history").data("history");
                history._editEntry($entry, history);
            });
            History.initialized = true;
        }
        
        params = params || {};
        this._entries = params._entries || [];
        this._round = 0; // the current round
        this._count = 0;
        this._roundTimes = {}; // the duration of each round
        this._includeSubject = params._includeSubject;
        
        this.$html = this._entries.length > 0 ? jQuery("<ul/>") : jQuery("<span/>").html("No history");
        for (i = 0; i < this._entries.length; i++) {
            entry = History.Entry.entries[ this._entries[ i ] ];
            if (!entry) {
                continue;
            }
            entry._addToRound(this._getRound(entry, true), this._includeSubject);
        }
    }

    History.prototype = new Serializable();

    
    // STATIC MEMBERS
    
    History.initialized = false;
    History.central = null;

    
    // OVERRIDDEN METHODS
    
    History.prototype.toString = function() {
        return "[History]";
    };

    History.prototype.toJSON = function() {
        return JSON.stringify(this.raw(), null, "  ");
    };

    
    // PUBLIC METHODS
    
    History.prototype.add = function(entry) {
        entry.round = entry.round ? entry.round : this._round;
        if (this._entries.indexOf(entry.id) !== -1) {
            return;
        }
        this._entries.push(entry.id);
        entry._addToRound(this._getRound(entry, true), this._includeSubject);
        if (this !== History.central) {
            History.central.add(entry);
        }
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
        if (!entry) {
            return;
        }
        entry = typeof(entry) === "object" ? entry : { id: entry };
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

    History.prototype.clear = function() {
        var i;
        for (i = 0; i < this._entries.length; i++) {
            this.remove(History.Entry.entries[ this._entries[ i ] ]);
        }
        this._entries = [];
        this._round = 0;
        this._count = 0;
    };

    History.prototype.setRoundTime = function(milliseconds, round) {
        var $ul, $span, minutes, seconds;
        this._roundTimes[ round ] = milliseconds;
        if (!this._count) {
            return false;
        }
        if (!round) {
            round = this._round;
        }
        $ul = this._getRound(round, true);
        $span = $ul.parent().children(".time");
        if (!$span.length) {
            return false;
        }
        this._setRoundTime($span, milliseconds);
    };
    
    
    // PRIVATE METHODS

    History.prototype._getRound = function(round, create) {
        var $tmp, $ul, $li;
        if (!this._count) {
            if (create) {
                $tmp = jQuery("<ul/>").addClass("history").insertBefore(this.$html);
                $tmp.data("history", this);
                this.$html.remove();
                this.$html = $tmp;
            }
            else {
                return null;
            }
        }
        round = typeof(round) === "number" ? round : round.round;
        $ul = this.$html.children(".round" + round).children("ul");
        if (!$ul.length) {
            if (create) {
                this._count++;
                this._round = round;
                $li = jQuery("<li/>").addClass("round round" + this._round).data("history", this).appendTo(this.$html);
                $tmp = jQuery("<span/>").addClass("round").html("Round " + this._round).appendTo($li);
                $tmp = jQuery("<span/>").addClass("time").appendTo($li);
                if (this._roundTimes.hasOwnProperty(round)) {
                    this._setRoundTime($tmp, this._roundTimes[ round ]);
                }
                $ul = jQuery("<ul/>").addClass("entries round round" + this._round).appendTo($li);
            }
            else {
                $ul = null;
            }
        }
        return $ul;
    };

    History.prototype._setRoundTime = function($time, milliseconds) {
        var seconds = Math.floor(milliseconds / 1000), minutes = Math.floor(seconds / 60);
        minutes = ("" + minutes).length < 2 ? "0" + minutes : minutes;
        seconds = seconds % 60;
        seconds = ("" + seconds.length) < 2 ? "0" + seconds : seconds;
        $time.html(minutes + ":" + seconds);
    };

    History.prototype._editEntry = function($entry, history) {
        $entry.data("entry")._edit($entry, history);
    };

    //History.prototype.raw = function() {
//        var raw, prop;
//        raw = {};
//        for each (prop in this) {
//            if (this.hasOwnProperty(prop)) {
//                if (this[ prop ] && this[ prop ].hasOwnProperty("raw")) {
//                    raw[ prop ] = this[ prop ].raw();
//                }
//                else {
//                    raw[ prop ] = JSON.stringify(this[ prop ], null, "  ");
//                }
//            }
//        }
//        return raw;
    //};

    
    
    // HISTORY.EDITOR
    // CONSTRUCTOR

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

    
    // OVERRIDDEN METHODS
    
    History.Editor.prototype.raw = function() {
        return null;
    };


    // PUBLIC METHODS
    
    History.Editor.prototype.remove = function() {
        this.$input.remove();
        this.$save.off("click").remove();
        this.$cancel.off("click").remove();
    };


    // HISTORY.ENTRY
    // CONSTRUCTOR
    
    History.Entry = function(params) {
        params = params || {};
        this.id = params.id || History.Entry.id++;
        History.Entry.entries[ this.id ] = this;
        if (typeof(params.subject) === "string") {
            params.subject = parseInt(params.subject, 10);
        }
        if (typeof(params.subject) === "number") {
            // Creature.actors may not be initialized yet, if not, preserve subject id for resolving at need
            this.subject = Creature.actors[ params.subject ] ? Creature.actors[ params.subject ] : params.subject;
        }
        else {
            this.subject = params.subject;
        }
        this.message = params.message;
        this.round = params.round;
    };

    History.Entry.prototype = new EventDispatcher();
    
    
    // STATIC MEMBERS

    History.Entry.id = (new Date()).getTime();
    History.Entry.entries = {};
    
    
    // OVERRIDDEN METHODS
    
    History.Entry.prototype.toString = function() {
        return "[History Entry]";
    };

    History.Entry.prototype.raw = function() {
        var raw;
        raw = Serializable.prototype.raw.call(this);
        raw.subject = this.subject ? this.subject.id : null;
        return raw;
    };

    History.Entry.prototype.toJSON = function() {
        return JSON.stringify(this.raw(), null, "  ");
    };


    // PUBLIC METHODS
    
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
    
    
    // PRIVATE METHODS
    
    History.Entry.prototype._addToRound = function($round, includeSubject) {
        var message, $li, $span;
        message = this.message;
        if (includeSubject) {
            if (typeof(this.subject) === "number") {
                // Creature.actors wasn't initialized at creation time, resolve subject id now
                this.subject = Creature.actors[ this.subject ] ? Creature.actors[ this.subject ] : this.subject;
            }
            if (this.subject) {
                message = this.subject.name + " " + message.charAt(0).toLowerCase() + message.substr(1);
            }
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

    
    DnD.History = History;
})(window.jQuery);
