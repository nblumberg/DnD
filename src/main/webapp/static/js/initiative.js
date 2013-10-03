var DnD, safeConsole;

(function(jQuery, console) {
    "use strict";
    
    if (!DnD) {
        DnD = {};
    }
    
    // CONSTRUCTOR & INITIALIZATION METHODS
    
    /** 
     * @param {Array[Actor]} params.order
     * @param {String} params.target
     */
    function Initiative(params) {
        window.name = "admin";
        
        this._current = null;
        this.actors = [];
        this.order = [];
        this.history = null;
        this.round = 1;
        this._roundTimer = null;
        this._current = null;
        this._$target = null; 
        this.$parent = null;
        this.$display = null;
        this.$menuBar = null;
        this.$round = null;
        this.$previousButton = null;
        this.$nextButton = null;
        this.$displayButton = null;
        this.$fileInput = null;
        this.$import = null;
        this.$export = null;
        this.$clearAll = null;
        this.$clearCreatures = null;
        this.$clearMonsters = null;
        this.$clearHistory = null;
        this.creatureDialog = null;
        this.imageDialog = null;
        this.initiativeDialog = null; 
        this.attackDialog = null;
        this.healDialog = null;
        this.$freeFormHistorySubject = null;
        this.freeFormHistory = null;
        this.display = null;
        this.$table = null;
        this.$importDialog = null;
        this.$exportDialog = null;
        
        this._init(params);
    }

    Initiative.prototype = new EventDispatcher();

    Initiative.prototype._init = function(params) {
        var p, i, j, actor, creature, count;

        if (!params) {
            params = {};
            if (window.localStorage || window.localStorage.getItem("initiative")) {
                try {
                    params = JSON.parse(window.localStorage.getItem("initiative"));
                }
                finally {}
            }
            if (params) {
                console.info("Loaded from localStorage");
            }
            params.creatures = jQuery.extend({}, loadParty(), loadMonsters());
        }
        params = jQuery.extend({
            historyEntries: {},
            creatures: {},
            actors: [],
            history: { _includeSubject: true },
            order: []
        }, params);
        
        if (!params.historyEntries && params.history) {
            params.history = { _includeSubject: true };
        }
        else if (params.historyEntries && !params.history) {
            params.historyEntries = {};
            params.history = { _includeSubject: true };
        }
        
        if (params.historyEntries) {
            DnD.History.Entry.init(params.historyEntries); // NOTE: must come before this.actors is initialized because Creature.history references it
        }
        
        // Create Creatures from raw data
        if (params.creatures) {
            for (p in params.creatures) {
                if (params.creatures.hasOwnProperty(p)) {
                    new Creature(params.creatures[ p ]);
                }
            }
        }

        // Create Actors from Creatures
        if (params.actors && params.actors.length) {
            for (i = 0; i < params.actors.length; i++) {
                actor = params.actors[ i ];
                creature = typeof(actor) === "string" ? actor : actor.type;
                creature = Creature.creatures[ creature ];
                actor = this._addActor(creature, params.actors, actor);
            }
        }
        
        if (!this.actors) {
            this.actors = [];
        }
        
        // Link up imposed effects with actual effects
        for (i = 0; i < this.actors.length; i++) {
            actor = this.actors[ i ];
            for (j = 0; params.actors[ i ].imposedEffects && j < params.actors[ i ].imposedEffects.length && DnD.Effect.effects.hasOwnProperty(params.actors[ i ].imposedEffects[ j ].id); j++) {
                actor.imposedEffects.push(DnD.Effect.effects[ params.actors[ i ].imposedEffects[ j ].id ]);
            }
        }
        
        if (params.order) {
            this.order = params.order;
        }
        if (!this.order || !this.order.length) {
            this._randomInitiative();
        }

        if (params.history) {
            this.history = new DnD.History(params.history); // NOTE: must come after this.actors is initialized because of _includeSubject
            DnD.History.central = this.history;
        }

        this.round = Math.max(params.round, 1) || 1;
        this._roundTimer = (new Date()).getTime();
        this._current = params._current || this.order[ 0 ];
        this._$target = params.target ? jQuery(params.target) : ""; 
        
        this._autoSave();
        
        jQuery(document).ready(this._create.bind(this));
    };

    Initiative.prototype.initFromFile = function(event) {
        var _self, reader, files, file;
        _self = this;
        reader = new FileReader();
        files = event.target.files; // FileList object
        file = files[ 0 ]; // File object
        reader.onload = (function(theFile) {
            return function(e) {
                var data = JSON.parse(e.target.result);
            };
        })(file);
        reader.readAsText(file);
    };

    Initiative.prototype._randomInitiative = function() {
        var actor, i;
        this.order = [];
        for (i = 0; i < this.actors.length; i++) {
            actor = this.actors[ i ];
            this.order.push({ id: actor.id, roll: (new Roll("1d20" + (actor.init < 0 ? "-" : "+") + actor.init)).roll() });
        }
        this.order.sort((function(a, b) {
            return b.roll !== a.roll ? b.roll - a.roll : this._getActor(b.id).init - this._getActor(a.id).init;
        }).bind(this));
        for (i = 0; i < this.order.length; i++) {
            this.order[ i ] = this.order[ i ].id;
        }
        if (this.order.length) {
            this._getActor(this.order[ 0 ]).startTurn();
        }
    };

    
    // DOM READY METHODS
    
    Initiative.prototype._create = function() {
        this.$parent = jQuery(this._$target.length ? this._$target : "body");
            
        this.$display = jQuery("#display");
        
        this.$menuBar = jQuery("#header");
        this.$round = jQuery("#round");
        this.$previousButton = jQuery("#previous").on({ click: (this._previous).bind(this) });
        this.$nextButton = jQuery("#next").on({ click: (this._next).bind(this) });
        
        this.$displayButton = jQuery("#open").on({ click: this._renderDisplay.bind(this, true) });
        
        this.$fileInput = jQuery("#fileInput").on({ change: this.initFromFile.bind(this) });
        
        this.$import = jQuery("#import").on({ click: this._import.bind(this) });
        this.$export = jQuery("#export").on({ click: this._export.bind(this) });
        
        this.$clearAll = jQuery("#clearAll").on({ click: this._clearAll.bind(this) });
        this.$clearCreatures = jQuery("#clearCreatures").on({ click: this._clearCreatures.bind(this) });
        this.$clearMonsters = jQuery("#clearMonsters").on({ click: this._clearMonsters.bind(this) });
        this.$clearHistory = jQuery("#clearHistory").on({ click: this._clearHistory.bind(this) });
        
        this.$shortRest = jQuery("#shortRestButton").on({ click: this._shortRest.bind(this) });
        this.$extendedRest = jQuery("#extendedRestButton").on({ click: this._extendedRest.bind(this) });
        
        this.creatureDialog = new DnD.Dialog.Creature({
            $trigger: jQuery("#creatures"),
            callback: (function(toAdd) {
                var i, creature;
                for (i = 0; i < toAdd.length; i++) {
                    creature = toAdd[ i ];
                    this._addActor(creature);
                }
                this._render(true);
            }).bind(this) 
        });
        
        this.imageDialog = new DnD.Dialog.Image({
            $trigger: jQuery("#imageButton"),
            toDisplay: this._messageDisplay.bind(this) 
        });

        this.initiativeDialog = new DnD.Dialog.Initiative({ 
            actors: this.actors, 
            order: this.order, 
            addHistory: this._addHistory.bind(this),
            onchange: this._changeInitiative.bind(this) 
        });

        this.attackDialog = new DnD.Dialog.Attack({ callback: (function(msg) {
            this._render(false);
            this._messageDisplay(msg, false);
        }).bind(this) });

        this.healDialog = new DnD.Dialog.Heal({ 
            addHistory: this._addHistory.bind(this),
            callback: (function(actor, changes) {
                
            }).bind(this)
        });
        
        this._createBody();
        this._render(false);
    };

    Initiative.prototype._createBody = function() {
        jQuery("#tableContainer").load("/html/partials/actorTable.html", null, this._renderActorTable.bind(this));
        this.history.addToPage(jQuery("#history"));
        this._createHistory();
    };

    Initiative.prototype._createHistory = function() {
        var $option;
        // Editor for adding arbitrary history
        this.$freeFormHistorySubject = jQuery("select#freeFormHistorySubject");
        this._renderHistoryEditor();
        if (!this.freeFormHistory) {
            this.freeFormHistory = new DnD.History.Editor({ 
                $parent: jQuery("#freeFormHistory"), 
                save: (function(value) {
                    $option = jQuery(this.$freeFormHistorySubject[0].options[ this.$freeFormHistorySubject[0].selectedIndex ]);
                    this._addHistory($option.data("actor"), value);
                }).bind(this), 
                cancel: function() {} 
            });
        }
        this.freeFormHistory.$cancel.hide();
    };
    
    
    // ACTOR METHODS
    
    Initiative.prototype._getActor = function(id) {
        var i;
        for (i = 0; i < this.actors.length; i++) {
            if (this.actors[ i ].id === id) {
                return this.actors[ i ];
            }
        }
        return null;
    };

    Initiative.prototype._countActorsByType = function(type, actors, adding) {
        var i, actor, potential, count;
        if (!actors) {
            actors = this.actors;
        }
        potential = count = 0;
        for (i = 0; actors && i < actors.length; i++) {
            actor = actors[ i ];
            if (typeof(actor) === "string") {
                if (actor.indexOf(type) === 0) {
                    potential++;
                }
            }
            else if (actor.name.indexOf(type) === 0) {
                potential++;
                if (actor instanceof Creature) {
                    count++;
                }
            }
        }
        if (potential > 1) {
            return count + 1;
        }
        if (adding) {
            return count === 0 ? 0 : count + 1;
        }
        return 0;
    };

    Initiative.prototype._addActor = function(creature, actors, currentState) {
        var count, actor;
        // in case "-------" or "        " was selected in the Creature dialog or we've encountered junk data
        if (!creature) {
            console.warn("Skipping adding undefined actor");
            return;
        }
        else if (!creature.name) {
            console.warn("Skipping adding invalid actor (missing name)");
            return;
        }
        else if (!creature.image) {
            console.warn("Skipping adding invalid actor (missing image)");
            return;
        }
        if (!this.actors) {
            this.actors = [];
        }
        if (!actors) {
            actors = this.actors;
        }
        count = creature.isPC ? 0 : this._countActorsByType(creature.name, actors, true);
        actor = new Actor(creature, count, currentState);
        this.actors.push(actor);
        jQuery("<option/>").attr("value", actor.name).html(actor.name).data("actor", actor).appendTo(this.$freeFormHistorySubject);
        if (this.order) {
            this.order.push(actor.id);
        }
        if (DnD.History.central) {
            this._addHistory(actor, "Joins the fight");
        }
        actor.addEventListener("change", (function(event) {
            var actor, updateDisplay = false;
            actor = event.target;
            console.debug(actor.name + "'s " + event.property + " changed from " + event.oldValue + " to " + event.newValue);
            // Only bother to update the display with properties reflected in the display
            switch (event.property) {
                case "name":
                case "hp.temp":
                case "hp.current":
                case "hp.total": {
                    updateDisplay = true;
                }
                break;
            }
            if (event.conditionAdded || event.conditionRemoved) {
                updateDisplay = true;
            }
            if (updateDisplay) {
                this._messageDisplay({ 
                    type: "updateActor", 
                    id: actor.id, 
                    name: actor.name,
                    hp: {
                        temp: actor.hp.temp,
                        current: actor.hp.current,
                        total: actor.hp.total
                    },
                    effects: Serializable.prototype.rawArray(actor.effects)
                }, false);
            }
            actor.tr.render();
            this._autoSave();
        }).bind(this));
        actor.addEventListener("takeDamage", (function(event) {
            this._messageDisplay({ actor: event.target.raw(), damage: event.damage }, false);
        }).bind(this));
        if (!this._current) {
            this._current = actor.id;
            actor.startTurn();
        }
        return actor;
    };
    
    
    // RENDERING METHODS

    Initiative.prototype._render = function(updateDisplay) {
        var i, actor;
        
        if (this.$display) {
            this.$display.children().remove();
        }
        
        this._renderActorTable();
        this._renderHistoryEditor();

        if (updateDisplay) {
            this._renderDisplay(false);
        }
        this._autoSave(this.toJSON());
    };

    Initiative.prototype._renderActorTable = function(responseText, textStatus, jqXHR) {
        var setInitiative, attack, i, actor;
        
        this._renderRound();
        
        if (!this.$table || !this.$table.length) {
            this.$table = jQuery("#initiative tbody");
        }
    //  this.$table.sortable({ containment: "parent", handle: ".creaturePanel", items: "tr", 
    //  update: (function(event, ui) {
//          var i, move, before;
//          move = ui.item.data("actor");
//          for (i = 0; i < this.$table[0].rows.length; i++) {
//              if (jQuery(this.$table[0].rows[ i ]).data("actor") === ui.item.data("actor")) {
//                  before = this.actors[ this.order[ i ] ];
//                  break;
//              }
//          }
//          this._changeInitiative({ move: move, before: before });
    //  }).bind(this) 
    //});
        if (this.$table) {
            this.$table.children().remove();
        }
        
        setInitiative = (function() { 
            this.initiativeDialog.show(this.actors, this.order);
        }).bind(this);
        
        attack = function(a) {
            this.attackDialog.show({ attacker: a, actors: this.actors });
        };
        
        for (i = 0; i < this.order.length; i++) {
            actor = this._getActor(this.order[ i ]);
            if (!actor) {
                continue;
            }
            if (!actor.tr || !actor.tr.$tr || !actor.tr.$tr.length) {
                actor.createTr({ 
                    $table: this.$table,
                    isCurrent: actor.id === this._current,
                    order: {
                        up: this._reorder.bind(this, actor, -1),
                        set: setInitiative,
                        down: this._reorder.bind(this, actor, 1)
                    },
                    attack: attack.bind(this, actor),
                    heal: this.healDialog.show.bind(this.healDialog, { patient: actor }), // TODO: pass spcial healing surge values
                    exit: this._exit.bind(this, actor),
                    rename: this._rename.bind(this, actor)
                });
            }
            else {
                actor.tr.reattach(this.$table);
            }
        }
        
    };

    Initiative.prototype._renderHistoryEditor = function() {
        var i, actor;
        this.$freeFormHistorySubject.children().remove();
        for (i = 0; i < this.actors.length; i++) {
            actor = this.actors[ i ];
            jQuery("<option/>").attr("value", actor.name).html(actor.name).data("actor", actor).appendTo(this.$freeFormHistorySubject);
        }
    };

    Initiative.prototype._renderRound = function() {
        if (!this.$round || !this.$round.length) {
            this.$round = jQuery("input#round");
        }
        if (this.$round) {
            this.$round.val(this.round);
        }
    };

    
    // PLAYER DISPLAY METHODS
    
    Initiative.prototype.POST_MESSAGE = {
        LISTEN: window.addEventListener ? "addEventListener" : "attachEvent",
        STOP: window.removeEventListener ? "removeEventListener" : "detachEvent",
        TYPE: window.addEventListener ? "message" : "onmessage"
    };

    Initiative.prototype._renderDisplay = function(createDisplay, event) {
        var data;
        if (event) {
            event.stopPropagation(); // TODO, HACK: why are we getting 80+ hits for the same event?
        }
        data = {
                order: this.order,
                actors: this.rawObj(this.actors),
                current: this._current,
                type: "refresh"
        };
        this._messageDisplay(data, createDisplay);
    };
    
    Initiative.prototype._messageDisplay = function(msg, createDisplay) {
        var json;
        if (createDisplay && !this.display) {
            // Create a new window
            // TODO: what about the initial msg?
            this.display = window.open("initiative.html", "Initiative", "location=0,status=0,toolbar=0", false);
            window[ this.POST_MESSAGE.LISTEN ](this.POST_MESSAGE.TYPE, this._displayLoadHandler.bind(this), false);
            this.display.focus();
        }
        if (this.display) { // TODO: label postMessage events so listener only handles them once in case single dispatch causes multiple listener receptions
            if (typeof(msg) !== "string") {
                json = JSON.stringify(msg, null, "  ");
            }
            else {
                json = msg;
            }
            this.display.postMessage(json, "*");
        }
        return json;
    };

    Initiative.prototype._displayLoadHandler = function(event) {
        var intervalId;
        console.info("Display loaded");
        
        // Clean up the old window
        if (this.display !== event.source) {
            this.display[ this.POST_MESSAGE.STOP ](this.POST_MESSAGE.TYPE, this._displayLoadHandler.bind(this), false);
            this.display = event.window;
        }

        // Keep an eye on the display window and update the "Open player window/Refresh" button if the window is closed or we lost reference to it
        intervalId = setInterval((function() {   
            if (this.display.closed) {  
                clearInterval(this.$displayButton.data("intervalId"));  
                this.$displayButton.attr("id", "open").html("Open player window");
            }  
        }).bind(this), 1000);
        this.$displayButton.attr("id", "refresh").html("Refresh").data("intervalId", intervalId);
        this._renderDisplay(); 
    };

    Initiative.prototype.toString = function() {
        return "[Initiative]";
    };

    Initiative.prototype.toJSON = function() {
        var raw = this.raw();
        return JSON.stringify(raw, null, "  ");
    };

    Initiative.prototype._autoSave = function(data) {
        var e;
        data = data ? data : this.toJSON();
        try {
            window.localStorage.setItem("initiative", data);
        }
        catch (e) {
            window.localStorage.clear();
            window.localStorage.setItem("initiative", data);
        }
    };

    Initiative.prototype._import = function() {
        var data, $textarea;
        if (!this.$importDialog) {
            $textarea = jQuery("<textarea/>").css({ height: "100%", width: "100%" });
            this.$importDialog = jQuery("<div/>").append($textarea).dialog({ 
                autoOpen: false, 
                modal: true, 
                title: "Import", 
                height: window.innerHeight - 200, 
                width: "85%",
                position: [ "center", 50 ],
                buttons: [
                          { 
                              text: "Load", click: (function() {
                                  try {
                                      this._init(JSON.parse($textarea.val()));
                                  }
                                  catch (e) {
                                      console.error(e.toString());
                                  }
                              }).bind(this) 
                          }
                ]
            });
        }
        else {
            $textarea = this.$importDialog.find("textarea");
        }
        this.$importDialog.dialog("open");
    };

    Initiative.prototype._export = function() {
        var data, $textarea;
        if (!this.$exportDialog) {
            $textarea = jQuery("<textarea/>").css({ height: "100%", width: "100%" });
            this.$exportDialog = jQuery("<div/>").append($textarea).dialog({ 
                autoOpen: false, 
                modal: true, 
                title: "Export", 
                height: window.innerHeight - 200, 
                width: "85%",
                position: [ "center", 50 ]
            });
        }
        else {
            $textarea = this.$exportDialog.find("textarea");
        }
        data = window.localStorage.getItem("initiative");
        $textarea.val(data);
        this.$exportDialog.dialog("open");
        $textarea[0].select();
    };

    Initiative.prototype._clearAll = function() {
        var $parent, $old;
        $old = this.history.$html;
        $parent = $old.parent(); 
        DnD.History.Entry.entries = {};
        this.history = new DnD.History({ _includeSubject: true });
        $old.before(this.history.$html);
        $old.remove();
        this.$freeFormHistorySubject.children().remove();
        this.actors = [];
        this.order = [];
        this.round = 1;
        this._current = 0;
        this._render(true);
    };

    Initiative.prototype._clearCreatures = function() {
        Creature.creatures = {};
        this._render(true);
    };

    Initiative.prototype._clearHistory = function() {
        var i, actor;
        // WTF? it's entering the for loop even when i !< this.actors.length
        for (i = 0; i < this.actors.length; i++) {
            actor = this.actors[ i ];
            if (actor) {
                actor.history.clear();
            }
        }
        this.history.clear();
        DnD.History.Entry.init();
        this._render(false);
    };

    Initiative.prototype._clearMonsters = function() {
        var i;
        for (i = 0; i < this.actors.length; i++) {
            if (!this.actors[ i ].isPC) {
                this.actors.splice(i, 1);
                i--;
            }
        }
        this._render(true);
    };

    Initiative.prototype._addHistory = function(actor, message, method) {
        var entry = new DnD.History.Entry({ round: this.round, subject: actor, message: message });
        if (typeof(method) === "undefined") {
            method = "info";
        }
        if (actor) {
            actor.history.add(entry);
        }
        this.history.add(entry);
        console[ method ](message);
        this._autoSave();
    };

    Initiative.prototype._previous = function() {
        var msg, i, actor;
        actor = this._getActor(this._current);
        actor.card.makeCurrent(false);
        i = this.order.indexOf(this._current);
        i--;
        if (i < 0) {
            i = this.order.length - 1;
            this.round--;
        }
        this._current = this.order[ i ];
        for (i = 0; i < this.actors.length; i++) {
            this.actors[ i ].history._round = this.round;
        }
        this.history._round = this.round;
        actor = this._getActor(this._current);
        actor.card.makeCurrent(true);
        if (actor.hasCondition("dead")) {
            this.previous();
            return;
        }
        msg = "Moved back in initiative order to " + actor.name + "'s turn";
        if (msg) {
            this._addHistory(null, msg);
        }
        this._renderRound();
        this._messageDisplay({ type: "changeTurn", current: this._current }, false);
    };

    Initiative.prototype._next = function() {
        var msg, i, actors, actor;
        i = this.order.indexOf(this._current);
        actors = [];
        actor = this._getActor(this._current);
        actor.card.makeCurrent(false);
        actors.push(actor);
        msg = actor.endTurn();
        if (msg) {
            this._addHistory(actor, msg);
        }
        i++;
        if (i >= this.order.length) {
            i = 0;
            this.round++;
        }
        this._current = this.order[ i ];
        for (i = 0; i < this.actors.length; i++) {
            this.actors[ i ].history._round = this.round;
        }
        this.history._round = this.round;
        actor = this._getActor(this._current);
        actor.card.makeCurrent(true);
        actors.push(actor);
        msg = actor.startTurn();
        if (msg) {
            this._addHistory(actor, msg);
        }
        if (actor.hasCondition("dead")) {
            this._next();
            return;
        }
        this._render(true);
        this._messageDisplay({ type: "changeTurn", current: this._current, actors: this.rawArray(actors) }, false);
    };

    Initiative.prototype._changeInitiative = function(order) {
        var test, i, actor;
        
        test = "[ ";
        this.order = order;
        this.$table.children().remove();
        for (i = 0; i < this.order.length; i++) {
            actor = this._getActor(this.order[ i ]);
            actor.tr.$tr.appendTo(this.$table);
            test += (i ? ", " : "") + actor.name;
        }
        console.info("New order: " + test + " ]");
        this._render(true);
    };


    Initiative.prototype._reorder = function(actor, delta) {
        var index, length, other, test, i;
        index = this.order.indexOf(actor.id);
        length = this.order.length;
        this.order.splice(index, 1);
        if (index + delta < 0 || index + delta === length - 1) {
            this.order.push(actor.id);
            this._addHistory(actor, "Moved down to the bottom of the initiative order");
        }
        else if (index + delta >= length) {
            this.order.unshift(actor.id);
            this._addHistory(actor, "Moved up to the top of the initiative order");
        }
        else {
            other = this._getActor(this.order[ index + delta ]);
            this.order.splice(index + delta, 0, actor.id);
            this._addHistory(actor, "Moved " + (delta > 0 ? "down" : "up") + " initiative order to before " + other.name);
        }
        test = "[ ";
        for (i = 0; i < this.order.length; i++) {
            test += (i ? ", " : "") + this._getActor(this.order[ i ]).name;
        }
        console.info("New order: " + test + " ]");
        this._render(true);
    };


    Initiative.prototype._rest = function(isExtendedRest) {
        var actors, i, actor, msg, j, attack;
        
        actors = [];
        actor = this._getActor(this._current);
        actor.card.makeCurrent(false);
        actors.push(actor);
        msg = actor.endTurn();
        if (msg) {
            this._addHistory(actor, msg);
        }
        this._current = this.order[ 0 ];
        
        this.round++;
        
        for (i = 0; i < this.actors.length; i++) {
            actor = this.actors[ i ];
            actor.history._round = this.round;
            actor.hp.temp = 0;
            if (isExtendedRest) {
                actor.hp.current = actor.hp.total;
                actor.surges.current = actor.surges.perDay;
            }
            for (j = 0; j < actor.attacks.length; j++) {
                attack = actor.attacks[ j ];
                if (attack.used && (isExtendedRest || attack.usage.frequency !== DnD.Attack.prototype.USAGE_DAILY)) {
                    attack.used = false;
                }
            }
            this._addHistory(actor, isExtendedRest ? "Takes an extended rest" : "Takes a short rest");
            actor.history._round++;
            this._messageDisplay({ 
                type: "updateActor", 
                id: actor.id, 
                name: actor.name,
                hp: {
                    temp: actor.hp.temp,
                    current: actor.hp.current,
                    total: actor.hp.total
                },
                effects: Serializable.prototype.rawArray(actor.effects)
            }, false);
        }
        
        this.round++;
        
        actor = this._getActor(this._current);
        actor.card.makeCurrent(true);
        actors.push(actor);
        msg = actor.startTurn();
        if (msg) {
            this._addHistory(actor, msg);
        }
        if (actor.hasCondition("dead")) {
            this._next();
            return;
        }
        this._render(true);
        this._messageDisplay({ type: "changeTurn", current: this._current, actors: this.rawArray(actors) }, false);
    };
    
    
    Initiative.prototype._shortRest = function() {
        this._rest(false);
    };
    
    
    Initiative.prototype._extendedRest = function() {
        this._rest(true);
    };
    
    
    Initiative.prototype._getActor = function(id) {
        var i;
        for (i = 0; i < this.actors.length; i++) {
            if (this.actors[ i ] && this.actors[ i ].id === id) {
                return this.actors[ i ]; 
            }
        }
        return null;
    };

    Initiative.prototype._exit = function(actor, event) {
        var i, index;
        if (confirm("Remove " + actor.name + " from play?")) {
            index = this.order.indexOf(actor.id);
            this.order.splice(index, 1);
            this._addHistory(actor, "Leaves the fight");
            index = this.actors.indexOf(actor);
            this.actors.splice(index, 1);
            actor.tr.$tr.remove();
            this._messageDisplay({ type: "removeActor", actor: actor.id });
        }
    };

    Initiative.prototype._rename = function(actor, event) {
        var oldName, newName;
        oldName = actor.name;
        newName = window.prompt("Rename " + oldName);
        if (newName) {
            this._addHistory(actor, "Changed name from " + oldName + " to " + newName);
            actor.name = newName;
            actor.card.refresh();
            actor.dispatchEvent({ type: "change", property: "name", oldValue: oldName, newValue: newName });
            this._autoSave();
        }
    };

    Initiative.prototype.raw = function() {
        var raw = {
            order: this.order,
            actors: this.rawArray(this.actors),
            history: this.history.raw(),
            historyEntries: this.rawObj(DnD.History.Entry.entries),
            round: this.round,
            _current: this._current
        };
        return raw;
    };
    
    DnD.Initiative = Initiative;
})(window.jQuery, safeConsole());
