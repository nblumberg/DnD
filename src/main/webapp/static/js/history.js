var DnD;

(function(jQuery) {
    "use strict";
    
    if (!DnD) {
        DnD = {};
    }
    
    // HISTORY
    // CONSTRUCTOR

    /**
     * @param params {Object}
     * @param [params._entries] {Array} Array of History.Entry
     * @param [params._includeSubject] {Boolean} Whether to print the subject of each Entry
     * @param [params._round] {Number} The current round, defaults to 1 
     * @param [params._roundTimes] {Object} A map of Actor.id to Array of Number (milliseconds) 
     * @param [params.$parent] {jQuery selection} The element to add this History's HTML to
     */
    function History(params) {
        params = params || {};
        this.params = params;
        this._entries = params._entries || [];
        this._round = params._round || 1; // the current round
        this._count = 0;
        this._roundTimes = params._roundTimes || {}; // the duration of each round
        this._includeSubject = !!params._includeSubject;
        
        if (params.$parent) {
            this.addToPage(params.$parent);
        }
    }

    History.prototype = new Serializable();

    
    // STATIC MEMBERS
    
    if (!History._eventHandlersInitialized) {
        jQuery(document).on("click", "button.expandCollapseAll", function(event) {
            var $button, history, $ul, expand;
            $button = jQuery(this);
            history = $button.closest(".history").data("history");
            $ul = history.$html.find("ul.entries");
            expand = $ul.css("display") === "none";
            if (expand) {
                $ul.show();
                $button.html("Collapse all");
            }
            else {
                $ul.hide();
                $button.html("Expand all");
            }
        }).on("click", "li.round", function(event) {
            jQuery(this).children("ul").toggle();
        }).on("click", "li.entry", function(event) {
            var $entry, history;
            event.stopPropagation();
            $entry = jQuery(this);
            history = $entry.closest(".history").data("history");
            history._editEntry($entry, history);
        });
        History._eventHandlersInitialized = true;
    }
    History.central = null;
    History._areTemplatesReady = function() {
        return History.$history && History.$round && History.$entry;
    };
    History._waitingOnTemplates = [];
    (function() {
        var templateReady, $history, $round, $entry;
        
        templateReady = function() {
            var i;
            if (History._areTemplatesReady()) {
                for (i = 0; i < History._waitingOnTemplates.length; i++) {
                    History.prototype._create.call(History._waitingOnTemplates[ i ]);
                }
                History._waitingOnTemplates = [];
            }
        };
        
        $history = jQuery("<div/>");
        $history.load("/html/partials/history.html", null, function(responseText, textStatus, jqXHR) {
            History.$history = $history.find("div.history");
            templateReady();
        });
        $round = jQuery("<div/>");
        $round.load("/html/partials/historyRound.html", null, function(responseText, textStatus, jqXHR) {
            History.$round = $round.find("li.round");
            templateReady();
        });
        $entry = jQuery("<div/>");
        $entry.load("/html/partials/historyEntry.html", null, function(responseText, textStatus, jqXHR) {
            History.$entry = $entry.find("li.entry");
            templateReady();
        });
    })();

    
    // OVERRIDDEN METHODS
    
    History.prototype.toString = function() {
        return "[History]";
    };

    History.prototype.toJSON = function() {
        return JSON.stringify(this.raw(), null, "  ");
    };

    
    // PUBLIC METHODS
    
    History.prototype.addToPage = function($parent) {
        if (!$parent || !$parent.length) {
            return;
        }
        this.$parent = $parent;
        if (History._areTemplatesReady()) {
            this._create();
        }
        else {
            History._waitingOnTemplates.push(this);
        }
    };
    
    History.prototype.add = function(entry) {
        if (!entry || typeof(entry) !== "object" || !(entry instanceof History.Entry)) {
            return;
        }
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
        if (!entry || typeof(entry) !== "object" || !(entry instanceof History.Entry)) {
            return;
        }
        entry._render(this.$html.find("li.entry" + entry.id), this._includeSubject);
    };

    /**
     * Removes an entry from this History instance
     * 
     * @param entry {History.Entry} The History.Entry to remove
     */
    History.prototype.remove = function(entry) {
        var $entry, $ul, $round, $tmp;
        if (!entry || typeof(entry) !== "object" || !(entry instanceof History.Entry)) {
            return;
        }
        $entry = this.$html.find("li.entry" + entry.id);
        $ul = $entry.parent();
        $round = $ul.parent();
        $entry.remove();
        // Remove empty rounds as well
        if (!$ul.children().length) {
            $ul.remove();
            $ul = $round.parent();
            $round.remove();
            // Reset empty histories as well
            if (!$ul.children().length) {
                this._noHistory();
            }
        }
    };

    History.prototype.clear = function() {
        var i;
        for (i = 0; i < this._entries.length; i++) {
            this.remove(History.Entry.entries[ this._entries[ i ] ]);
        }
        this._entries = [];
        this._round = 1;
        this._count = 0;
    };

    History.prototype.setRoundTime = function(milliseconds, round) {
        var $ul, $span, minutes, seconds;
        if (!round) {
            round = this._round;
        }
        this._roundTimes[ round ] = milliseconds;
        if (!this._count) {
            return false;
        }
        $ul = this._getRound(round, true);
        $span = $ul.parent().children(".time");
        if (!$span.length) {
            return false;
        }
        this._setRoundTime($span, milliseconds);
        return true;
    };
    
    
    // PRIVATE METHODS

    History.prototype._create = function() {
        var i, entry;
        this.$html = this._entries.length > 0 ? this._createHtml() : this._noHistory();
        for (i = 0; i < this._entries.length; i++) {
            entry = History.Entry.entries[ this._entries[ i ] ];
            if (!entry) {
                continue;
            }
            entry._addToRound(this._getRound(entry, true), this._includeSubject);
        }
    };
    
    History.prototype._createHtml = function() {
        var $html = History.$history.clone();
        if (this.$html) {
            $html.insertBefore(this.$html);
            this.$html.remove();
        }
        else {
            $html.appendTo(this.$parent);
        }
        this.$html = $html;
        this.$html.data("history", this);
        return this.$html;
    };
    
    History.prototype._noHistory = function() {
        var $html = jQuery("<span/>").html("No history");
        if (this.$html) {
            $html.insertBefore(this.$html);
            this.$html.remove();
        }
        else {
            $html.appendTo(this.$parent);
        }
        this.$html = $html;
        this.$html.data("history", this);
        return this.$html;
    };
    
    History.prototype._getRound = function(round, create) {
        var $tmp, $ul, $li;
        if (!this._count) {
            if (create) {
                this._createHtml();
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
                $li = History.$round.clone();
                $li.addClass("round" + this._round).data("history", this).appendTo(this.$html);
                $li.find(".roundLabel .round").html(this._round);
                if (this._roundTimes.hasOwnProperty(round)) {
                    this._setRoundTime($li.find(".time"), this._roundTimes[ round ]);
                }
                $ul = $li.find(".entries").addClass("round" + this._round);
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
            if (!Creature.actors.hasOwnProperty(params.subject)) {
                try { window.console.warn("Failed to find subject " + params.subject + " in Creature.actors for History.Entry " + this.id); } finally {}
            }
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
        var history, $li, $save, $delete;
        history = $round.closest(".history").data("history");
        if (includeSubject && typeof(this.subject) === "number") {
            // Creature.actors wasn't initialized at creation time, resolve subject id now
            this.subject = Creature.actors[ this.subject ] ? Creature.actors[ this.subject ] : this.subject;
        }
        $li = History.$entry.clone();
        $li.addClass("entry" + this.id).data("entry", this).appendTo($round);
        this._render($li, includeSubject);
        $save = $li.find(".save");
        $delete = $li.find(".delete");
        $save.on({ click: this._save.bind(this, $li, $span, $li.find("textarea"), $save, $delete, history) });
        $delete.on({ click: this._delete.bind(this, $li, $span, $li.find("textarea"), $save, $delete, history) });
    };

    History.Entry.prototype._render = function($li, includeSubject) {
        var message, $span, $save, $delete;
        message = this.message;
        if (includeSubject && this.subject) {
            $li.addClass(includeSubject ? "includeSubject" : "");
            $span = $li.find(".subject").html(this.subject.name);
            $span = $li.find(".message").html(message.charAt(0).toLowerCase() + message.substr(1));
        }
        else {
            $span = $li.find(".message").html(message);
        }
    };
    
    History.Entry.prototype._edit = function($entry, history) {
        var $span, $input, $save, $delete, i, $ancestor;
        if ($entry.hasClass("edit")) {
            return;
        }
        $entry.addClass("edit");
        $input = j$entry.find("textarea").val(this.message);
        $save = jQuery("<button/>").attr("title", "Save").html("&#x2713;").appendTo($entry);
        $delete = jQuery("<button/>").attr("title", "Delete").html("X").appendTo($entry);
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
                this._noHistory();
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
