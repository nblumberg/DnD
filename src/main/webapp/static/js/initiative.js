/** 
 * @param {Array[Actor]} params.order
 * @param {String} params.target
 */
var Initiative = function(params) {
    if (params) {
        this._init(params);
    }
};

Initiative.prototype = new EventDispatcher();

Initiative.prototype._init = function(params) {
    var p, i, j, actor, creature, count;
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
        History.Entry.init(params.historyEntries); // NOTE: must come before this.actors is initialized because Creature.history references it
    }
    
    if (params.creatures) {
        for (p in params.creatures) {
        	if (params.creatures.hasOwnProperty(p)) {
                new Creature(params.creatures[ p ]);
        	}
        }
    }

    if (params.actors && params.actors.length) {
        for (i = 0; i < params.actors.length; i++) {
            actor = params.actors[ i ];
            actor = typeof(actor) === "string" ? Creature.creatures[ actor ] : actor;
            actor = this._addActor(actor, params.actors);
        }
    }
    
    // Overwrite existing actors with their updated Creature template
    if (this.actors && params.creatures && (!params.actors || !params.actors.length)) {
        for (i in Creature.creatures) {
        	creature = Creature.creatures[ i ];
            for (j = 0; j < this.actors.length; j++) {
            	actor = this.actors[ j ];
            	if (actor.type === creature.name) {
            		this.actors.splice(j, 1, new Actor(creature));
            		this.actors[ j ].id = actor.id;
            		this.actors[ j ].name = actor.name;
            		this.actors[ j ].hp.current = actor.hp.current;
            		this.actors[ j ].hp.temp = actor.hp.temp;
            		this.actors[ j ].surges.current = actor.surges.current;
            		this.actors[ j ].effects = actor.effects;
            	}
            }
        }
    }
    
    if (!this.actors) {
        this.actors = [];
    }
    
    if (params.order) {
        this.order = params.order;
    }
    if (!this.order || !this.order.length) {
        this._randomInitiative();
    }

    if (params.history) {
        this.history = new History(params.history); // NOTE: must come after this.actors is initialized because of _includeSubject
        History.central = this.history;
    }

    this.round = params.round || 1;
    this._roundTimer = (new Date()).getTime();
    this._current = params._current || 0;
    this._$target = params.target ? jQuery(params.target) : ""; 
    
    this._autoSave();
    
    jQuery(document).ready(this._create.bind(this));
};

Initiative.prototype.initFromLocalStorage = function() {
	var data;
	if (window.localStorage || window.localStorage.getItem("initiative")) {
		try {
		    data = JSON.parse(window.localStorage.getItem("initiative"));
		}
		finally {}
	}
	if (data) {
	    try { window.console.info("Loaded from localStorage"); } finally {}
		this._init(data);
		return true;
	}
	return false;
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

Initiative.prototype.loadInitFromJs = function() {
	var data = loadInitiative();
	this._init(data);
};

Initiative.prototype.loadMonstersFromJs = function() {
	var data = {
		creatures: loadMonsters()
	};
	this._init(data);
};

Initiative.prototype.loadPartyFromJs = function() {
	var data = {
		creatures: loadParty()
	};
	this._init(data);
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

Initiative.prototype._addActor = function(params, actors) {
	var count, actor;
	// in case "-------" or "        " was selected in the Creature dialog or we've encountered junk data
	if (!params) {
	    try { window.console.warn("Skipping adding undefined actor"); } finally {}
	    return;
	}
	else if (!params.name) {
	    try { window.console.warn("Skipping adding invalid actor (missing name)"); } finally {}
	    return;
	}
	else if (!params.image) {
	    try { window.console.warn("Skipping adding invalid actor (missing image)"); } finally {}
	    return;
	}
    if (!this.actors) {
    	this.actors = [];
    }
	if (!actors) {
		actors = this.actors;
	}
    count = params.isPC ? 0 : this._countActorsByType(params.name, actors, true);
    actor = new Actor(params, count);
    this.actors.push(actor);
    jQuery("<option/>").attr("value", actor.name).html(actor.name).data("actor", actor).appendTo(this.$freeFormHistorySubject);
    if (this.order) {
        this.order.push(actor.id);
    }
    if (History.central) {
        this._addHistory(actor, "Joins the fight");
    }
    actor.addEventListener("change", this._render.bind(this, true));
    actor.addEventListener("takeDamage", this._displayDamage.bind(this));
    return actor;
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


Initiative.prototype._create = function() {
	var dialogsReady, $tmp;
	dialogsReady = (function() {
		if (this.creatureDialog && 
				this.imageDialog &&
				this.initiativeDialog &&
				this.attackDialog && 
				this.healDialog) {
		    this._createBody();
			this._render(true);
			return true;
		}
		return false;
	}).bind(this);
	$tmp = {};
	
	this.$parent = jQuery(this._$target.length ? this._$target : "body");
		
    this.$display = jQuery("#display");
    
    this.$menuBar = jQuery("#header");
	this.$round = jQuery("#round");
	this.$previousButton = jQuery("#previous").on({ click: (this._previous).bind(this) });
	this.$nextButton = jQuery("#next").on({ click: (this._next).bind(this) });
	
    this.$displayButton = jQuery("#open").on({ click: this._renderDisplay.bind(this, true) });
    
    this.$fileInput = jQuery("#fileInput").on({ change: this.initFromFile.bind(this) });
    this.$loadInitiative = jQuery("#loadInitiative").on({ click: this.loadInitFromJs.bind(this) });
    this.$loadMonsters = jQuery("#loadMonsters").on({ click: this.loadMonstersFromJs.bind(this) });
    this.$loadParty = jQuery("#loadParty").on({ click: this.loadPartyFromJs.bind(this) });
    
    this.$import = jQuery("#import").on({ click: this._import.bind(this) });
    this.$export = jQuery("#export").on({ click: this._export.bind(this) });
    
    this.$clearAll = jQuery("#clearAll").on({ click: this._clearAll.bind(this) });
    this.$clearCreatures = jQuery("#clearCreatures").on({ click: this._clearCreatures.bind(this) });
    this.$clearMonsters = jQuery("#clearMonsters").on({ click: this._clearMonsters.bind(this) });
    this.$clearHistory = jQuery("#clearHistory").on({ click: this._clearHistory.bind(this) });
    
    if (dialogsReady()) {
    	return;
    }
    
	if (!this.creatureDialog) {
		$tmp.creatureDialog = jQuery("<div/>");
		$tmp.creatureDialog.load("/html/partials/creaturesDialog.html", null, (function() {
			$tmp.creatureDialog.children().appendTo(this.$parent);
			this.creatureDialog = new DnD.Dialog.Creature({ callback: (function(toAdd) {
				var i, creature;
		        for (i = 0; i < toAdd.length; i++) {
		            creature = toAdd[ i ];
		            this._addActor(creature);
		        }
		        this._render(true);
		        dialogsReady();
			}).bind(this) });
		}).bind(this));
	}
	
	if (!this.imageDialog) {
		$tmp.imageDialog = jQuery("<div/>");
		$tmp.imageDialog.load("/html/partials/imageDialog.html", null, (function() {
			$tmp.imageDialog.children().appendTo(this.$parent);
			this.imageDialog = new DnD.Dialog.Image({ toDisplay: this._messageDisplay.bind(this) });
	        dialogsReady();
		}).bind(this));
	}
	
	if (!this.initiativeDialog) {
		$tmp.initiativeDialog = jQuery("<div/>");
		$tmp.initiativeDialog.load("/html/partials/initiativeDialog.html", null, (function() {
			$tmp.initiativeDialog.children().appendTo(this.$parent);
			this.initiativeDialog = new DnD.Dialog.Initiative({ actors: this.actors, order: this.order, onchange: this._changeInitiative.bind(this) });
	        dialogsReady();
		}).bind(this));
	}
	
	if (!this.attackDialog) {
		$tmp.attackDialog = jQuery("<div/>");
		$tmp.attackDialog.load("/html/partials/attackDialog.html", null, (function() {
			$tmp.attackDialog.children().appendTo(this.$parent);
			this.attackDialog = new DnD.Dialog.Attack({ callback: (function(msg) {
				this._render(false);
				this._messageDisplay(msg, false);
			}).bind(this) });
	        dialogsReady();
		}).bind(this));
	}
	
	if (!this.healDialog) {
		$tmp.healDialog = jQuery("<div/>");
		$tmp.healDialog.attr("id", "healDialog").appendTo("body").load("/html/partials/healDialog.html", null, (function(responseText, textStatus, jqXHR) {
			$tmp.healDialog.children().appendTo(this.$parent);
	    	this.healDialog = new DnD.Dialog.Heal({});
	        dialogsReady();
		}).bind(this));
	}
};

Initiative.prototype._createBody = function() {
    jQuery("#tableContainer").load("/html/partials/actorTable.html", null, this._createActorTable.bind(this));
    jQuery("#history").append(this.history.$html);
    this._createHistory();
};

Initiative.prototype._createActorTable = function(responseText, textStatus, jqXHR) {
	var i, actor;
	
    if (!this.$round || !this.$round.length) {
        this.$round = jQuery("input#round");
    }
    if (this.$round) {
        this.$round.val(this.round);
    }
    
	if (!this.$table || !this.$table.length) {
	    this.$table = jQuery("#initiative tbody");
	}
//  this.$table.sortable({ containment: "parent", handle: ".creaturePanel", items: "tr", 
//  update: (function(event, ui) {
//      var i, move, before;
//      move = ui.item.data("actor");
//      for (i = 0; i < this.$table[0].rows.length; i++) {
//          if (jQuery(this.$table[0].rows[ i ]).data("actor") === ui.item.data("actor")) {
//              before = this.actors[ this.order[ i ] ];
//              break;
//          }
//      }
//      this._changeInitiative({ move: move, before: before });
//  }).bind(this) 
//});
	if (this.$table) {
		this.$table.children().remove();
	}
	
	for (i = 0; i < this.order.length; i++) {
		actor = this._getActor(this.order[ i ]);
		if (!actor) {
			continue;
		}
		if (!actor.tr || !actor.tr.$tr || !actor.tr.$tr.length) {
	        actor.createTr({ 
	            $table: this.$table,
	            isCurrent: i === this._current,
	            order: {
	                up: this._reorder.bind(this, actor, -1),
	                set: (function() { 
	                    this.initiativeDialog.show(this.actors, this.order);
	                }).bind(this),
	                down: this._reorder.bind(this, actor, 1)
	            },
	            attack: (function(a) {
	                this.attackDialog.show({ attacker: a, actors: this.actors });
	            }).bind(this, actor),
	            heal: this.healDialog.show.bind(this.healDialog, { patient: actor }), // TODO: pass spcial healing surge values
	            exit: this._exit.bind(this, actor),
	            rename: this._rename.bind(this, actor)
	        });
		}
		else {
		    actor.tr.$tr.appendTo(this.$table);
		}
	}
	
};

Initiative.prototype._createHistory = function() {
    // Editor for adding arbitrary history
    this.$freeFormHistorySubject = jQuery("select#freeFormHistorySubject");
    this.$freeFormHistorySubject.children().remove();
    for (i = 0; i < this.actors.length; i++) {
        a = this.actors[ i ];
        $option = jQuery("<option/>").attr("value", a.name).html(a.name).data("actor", a).appendTo(this.$freeFormHistorySubject);
    }
    if (!this.freeFormHistory) {
        this.freeFormHistory = new History.Editor({ 
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

Initiative.prototype._render = function(updateDisplay) {
	var i, actor;
	
	if (this.$round) {
	    this.$round.val(this.round);
	}
    
	if (this.$display) {
		this.$display.children().remove();
	}
	
	for (i = 0; i < this.order.length; i++) {
		actor = this._getActor(this.order[ i ]);
		if (!actor) {
			continue;
		}
		if (!actor.tr) {
			actor.createTr({ 
				$table: this.$table,
				isCurrent: i === this._current,
				order: {
	                up: this._reorder.bind(this, actor, -1),
	                set: (function() { 
	                    this.initiativeDialog.show(this.actors, this.order);
	                }).bind(this),
	                down: this._reorder.bind(this, actor, 1)
	            },
				attack: this.attackDialog.show.bind(this.attackDialog, { attacker: actor, actors: this.actors }),
				heal: this.healDialog.show.bind(this.healDialog, { patient: actor }), // TODO: pass spcial healing surge values
				exit: this._exit.bind(this, actor),
				rename: this._rename.bind(this, actor)
			});
		}
		else {
			actor.tr.render();
		}
	}
	if (updateDisplay) {
		this._renderDisplay(false);
	}
	this._autoSave(this.toJSON());
};

Initiative.prototype._displayLoadHandler = function(event) {
	try { window.console.info("Display loaded"); } finally {}
    this._renderDisplay(); 
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

Initiative.prototype._displayDamage = function(event) {
	this._messageDisplay({ actor: event.target.raw(), damage: event.damage }, false);
};

Initiative.prototype._messageDisplay = function(msg, createDisplay) {
	var listen, stopListening, eventType, intervalId, json;
	
	if (createDisplay) {
		// Log when the other window loads
		if (window.addEventListener) {
			listen = "addEventListener";
			stopListening = "removeEventListener";
			eventType = "message";
		}
		else {
			listen = "attachEvent";
			stopListening = "detachEvent";
			eventType = "onmessage";
		}
		// Clean up the old window
		if (this.display) {
			this.display[ stopListening ](eventType, this._displayLoadHandler.bind(this), false);
		}
		// Create a new window
	    this.display = window.open("initiative.html", "Initiative", "location=0,status=0,toolbar=0", false);
	    window[ listen ](eventType, this._displayLoadHandler.bind(this), false);
	    this.display.focus();
	    
	    intervalId = setInterval((function() {   
	        if (this.display.closed) {  
	            clearInterval(this.$displayButton.data("intervalId"));  
	            this.$displayButton.attr("id", "open").html("Open player window");
	        }  
	    }).bind(this), 1000);
	    this.$displayButton.attr("id", "refresh").html("Refresh").data("intervalId", intervalId);
	}
	if (this.display) {
		if (typeof(msg) !== "string") {
			json = JSON.stringify(msg, null, "  "); // msg.toJSON();
		}
		else {
			json = msg;
		}
		this.display.postMessage(json, "*");
	}
	return json;
};

Initiative.prototype.toString = function() {
    return "[Initiative]";
}

Initiative.prototype.toJSON = function() {
    var raw = this.raw();
    return JSON.stringify(raw, null, "  ");
};

Initiative.prototype._autoSave = function(data) {
    data = data ? data : this.toJSON();
    window.localStorage.setItem("initiative", data);
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
                            	  try { window.console.error(e.toString()); } finally {}
                              }
                          }).bind(this) 
                      }
            ]
        });
    }
    else {
        $textarea = this.$exportDialog.find("textarea");
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
    History.Entry.entries = {};
    this.history = new History({ _includeSubject: true });
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
	History.Entry.init();
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
	var entry = new History.Entry({ round: this.round, subject: actor, message: message });
	if (typeof(method) === "undefined") {
		method = "info";
	}
	if (actor) {
		actor.history.add(entry);
		message = actor.name + " " + message.charAt(0).toLowerCase() + message.substr(1);
	}
	this.history.add(entry);
	try { window.console[ method ](message); } finally {}
    this._autoSave();
};

Initiative.prototype._previous = function() {
    var msg, i, actor;
    this._current--;
    if (this._current < 0) {
        this._current = this.order.length - 1;
        this.round--;
    }
    for (i = 0; i < this.actors.length; i++) {
        this.actors[ i ].history._round = this.round;
    }
    this.history._round = this.round;
    actor = this._getActor(this.order[ this._current ]);
    msg = "Moved back in initiative order to " + actor.name + "'s turn";
    if (msg) {
        this._addHistory(null, msg);
    }
    this._render(false);
    this._messageDisplay({ type: "changeTurn", current: this._current }, false);
};

Initiative.prototype._next = function() {
    var msg, i, actors, actor;
    actors = [];
    actor = this._getActor(this.order[ this._current ]);
    actors.push(actor);
    msg = actor.endTurn();
    if (msg) {
        this._addHistory(actor, msg);
    }
    this._current++;
    if (this._current >= this.order.length) {
        this._current = 0;
        this.round++;
    }
    for (i = 0; i < this.actors.length; i++) {
        this.actors[ i ].history._round = this.round;
    }
    this.history._round = this.round;
    actor = this._getActor(this.order[ this._current ]);
    actors.push(actor);
    msg = actor.startTurn();
    if (msg) {
        this._addHistory(actor, msg);
    }
    if (actor.hasCondition("dead")) {
        this._next();
        return;
    }
    this._render(false);
    this._messageDisplay({ type: "changeTurn", current: this._current, actors: this.rawArray(actors) }, false);
};

Initiative.prototype._getActor = function(id) {
    var i;
    for (i = 0; i < this.actors.length; i++) {
        if (this.actors[ i ].id === id) {
            return this.actors[ i ];
        }
    }
    return null;
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
	try { window.console.info("New order: " + test + " ]"); } finally {}
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
	try { window.console.info("New order: " + test + " ]"); } finally {}
	this._createActorTable();
    this._render(true);
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
	var $dialog;
	$dialog = jQuery("<div/>").html("Remove " + actor.name + " from play?").dialog({ 
        autoOpen: false, 
        modal: true, 
        title: "Remove " + actor.name, 
        position: [ "center", event.screenY - 300 ],
        buttons: [
                  { 
                      text: "Remove", click: (function() {
                    	  var i, index;
                    	  index = this.order.indexOf(actor.id);
                    	  this.order.splice(index, 1);
                    	  this._addHistory(actor, "Leaves the fight");
                          index = this.actors.indexOf(actor);
                    	  this.actors.splice(index, 1);
                    	  this._render(true);
                    	  $dialog.dialog("destroy");
                      }).bind(this)
                  },
                  {
                	  text: "Cancel", click: function() { $dialog.dialog("destroy"); }
                  }
        ]
    }).dialog("open");
};

Initiative.prototype._rename = function(actor, event) {
	var $dialog, $input;
	$input = jQuery("<input/>").attr("id", "rename").val(actor.name);
	$dialog = jQuery("<div/>").html($input).dialog({ 
        autoOpen: false, 
        modal: true, 
        title: "Rename " + actor.name, 
        position: [ "center", event.screenY - 300 ],
        buttons: [
                  { 
                      text: "Rename", click: (function() {
                    	  if ($input.val()) {
                        	  this._addHistory(actor, "Changed name from " + actor.name + " to " + $input.val());
                        	  actor.name = $input.val();
                    	  }
                    	  this._render(true);
                    	  $dialog.dialog("destroy");
                      }).bind(this)
                  },
                  {
                	  text: "Cancel", click: function() { $dialog.dialog("destroy"); }
                  }
        ]
    }).dialog("open");
};

Initiative.prototype.raw = function() {
	var raw = {
		order: this.order,
		actors: this.rawArray(this.actors),
		creatures: this.rawObj(Creature.creatures),
		history: this.history.raw(),
		historyEntries: this.rawObj(History.Entry.entries),
		round: this.round,
		_current: this._current
	};
	return raw;
};


