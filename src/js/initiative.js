/** 
 * @param {Array[Actor]} params.order
 * @param {String} params.target
 */
var Initiative = function(params) {
    if (params) {
        this._init(params);
    }
};

Initiative.prototype = new EventBus();

Initiative.prototype._init = function(params) {
    var p, i, actor, count;
    params = params || {
    	historyEntries: {},
    	creatures: {},
    	actors: [],
    	history: { _includeSubject: true },
    	order: []
    };
    
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
//        Creature.creatures = {};
        for (p in params.creatures) {
            new Creature(params.creatures[ p ], false);
        }
    }

    if (params.actors) {
        this.actors = params.actors;
        for (i = 0; i < this.actors.length; i++) {
            actor = this.actors[ i ];
            count = typeof(actor) === "string" && !Creature.creatures[ actor ].isPC ? this._countActorsByType(actor) : 0;
            actor = this.actors[ i ] = typeof(actor) === "string" ? Creature.creatures[ actor ].toActor(count) : new Creature(actor, true);
//          this.addRoute(actor);
            actor.addEventListener("change", this._render.bind(this));
            actor.addEventListener("reorder", this._changeInitiative.bind(this));
        }
    }
    
    if (params.history) {
        this.history = new History(params.history); // NOTE: must come after this.actors is initialized because of _includeSubject
        History.central = this.history;
    }

    this.order = params.order;
    if (!this.order || !this.order.length) {
        this._rollInitiative();
    }
    this.round = params.round || 1;
    this._current = params._current || 0;
    this._$target = params.target ? jQuery(params.target) : ""; 

    this._autoSave();
    
    jQuery(document).ready(this._create.bind(this));
};

Initiative.prototype.initFromLocalStorage = function() {
	var data;
	if (window.localStorage.getItem("initiative")) {
	    data = JSON.parse(window.localStorage.getItem("initiative"));
	    if (window.console && window.console.info) {
	        window.console.info("Loaded from localStorage");
	    }
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
            _self._hideMenus();            
        };
    })(file);
    reader.readAsText(file);
};

Initiative.prototype.loadInitFromJs = function() {
	var data = loadInitiative();
	this._init(data);
};

Initiative.prototype.loadMonstersFromJs = function() {
	var data = loadMonsters();
	data.creatures = data.monsters;
	this._init(data);
};

Initiative.prototype.loadPartyFromJs = function() {
	var data = loadParty();
	data.creatures = data.party;
	this._init(data);
};

Initiative.prototype._countActorsByType = function(type, adding) {
    var i, actor, potential, count;
    potential = count = 0;
    for (i = 0; this.actors && i < this.actors.length; i++) {
        actor = this.actors[ i ];
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

Initiative.prototype._rollInitiative = function() {
	var actor, i;
	this.order = [];
	for (i = 0; i < this.actors.length; i++) {
	    actor = this.actors[ i ];
		this.order.push({ index: i, roll: (new Roll("1d20" + (actor.init < 0 ? "-" : "+") + actor.init)).roll() });
	}
	this.order.sort((function(a, b) {
		return b.roll !== a.roll ? b.roll - a.roll : this.actors[ b.index ].init - this.actors[ a.index ].init;
	}).bind(this));
	for (i = 0; i < this.order.length; i++) {
		this.order[ i ] = this.order[ i ].index;
	}
	if (this.order.length) {
		this.actors[ this.order[ 0 ] ].startTurn();
	}
};

Initiative.prototype._create = function() {
	var columns, i, $li, $table, $tr, $td, image, $div, $span, $select, $option, menu;
	this.$parent = jQuery(this._$target.length ? this._$target : "body");
	this.$parent.children().remove();
	
	this._createAttackDialog();
	this._createHealDialog();
	
    this.$display = jQuery("<div/>").attr("id", "display").addClass("fullWidth").appendTo(this.$parent);
    
    this.$menuBar = jQuery("<div/>").attr("id", "header").addClass("fullWidth");
	this.$parent.append(this.$menuBar);
	$span = jQuery("<span/>").attr("id", "roundLabel").html("Round");
	this.$menuBar.append($span);
	this.$round = jQuery("<input/>").attr("id", "round").attr("type", "text").attr("disabled", "disabled").val(this.round);
	this.$menuBar.append(this.$round);
	this.$nextButton = jQuery("<button/>").attr("id", "next").html("Next").on({ click: (this._next).bind(this) });
	this.$menuBar.append(this.$nextButton);
	
    this.$displayButton = jQuery("<button/>").attr("id", "open").html("Open player window").on({ click: this._renderDisplay.bind(this, true) });
    this.$menuBar.append(this.$displayButton);
    
    this._createFileMenu();
    this._createCreatureDialog();
    
    jQuery("body").on({ click: this._hideMenus.bind(this) });
    
    this._createTable();
	
	this._render();
};

Initiative.prototype._createAttackDialog = function() {
    var i, $li, $table, $tr, $td, image, $div, $span, $select, $option;
    
    if (this.$attackDialog && this.$attackDialog.length) {
    	try {
        	this.$attackDialog.dialog("destroy").remove();
    	}
    	catch (e) {
    	}
    	finally {
        	this.$attackDialog.remove();
    	}
    }
    this.$attackDialog = jQuery("<div/>").attr("id", "attacksDialog");
    $table = jQuery("<table/>");
    $table.attr("id", "attacks");
    this.$attackDialog.append($table);
    $tr = jQuery("<tr/>");
    $table.append($tr);
    $td = jQuery("<td/>");
    $tr.append($td);
    this.$weapons = jQuery("<select/>").attr("id", "weaponSelect").css("display", "block");
    $td.append(this.$weapons);
    this.$attacks = jQuery("<select/>").attr("id", "attackSelect").on({ change: this._selectAttack.bind(this) });
    $td.append(this.$attacks);
    $td = jQuery("<td/>").addClass("attacks2targets");
    $tr.append($td);
    image = new Image();
    image.height = 30;
    image.src = "images/symbols/attack.png";
    this.$combatAdvantage = jQuery(image).data("combatAdvantage", false).on({ click: function() {
        var combatAdvantage = this.src.indexOf("images/symbols/attack.png") !== -1;
        this.src = combatAdvantage ? "images/symbols/combat_advantage.png" : "images/symbols/attack.png";
        jQuery(this).data("combatAdvantage", combatAdvantage);
    } });
    $td.append(image);
    $td = jQuery("<td/>");
    $tr.append($td);
    this.$targets = jQuery("<select/>").attr("id", "targetSelect").attr("multiple", "true");
    $td.append(this.$targets);
    jQuery(this.$targets).dblclick(this._resolveAttack.bind(this));
    this.$attackDialog.dialog({ 
        autoOpen: false, 
        buttons: { 
            "Attack":  this._resolveAttack.bind(this)
        }, 
        modal: true, 
        title: "Attacks", 
        width: "auto" 
    });
};

Initiative.prototype._createHealDialog = function() {
    var columns, i, $li, $table, $tr, $td, image, $div, $span, $select, $option, menu;

    if (this.$healDialog && this.$healDialog.length) {
    	try {
        	this.$healDialog.dialog("destroy").remove();
    	}
    	catch (e) {
    	}
    	finally {
        	this.$healDialog.remove();
    	}
    }
    this.$healDialog = jQuery("<div/>").attr("id", "healDialog");
    $div = jQuery("<div/>").appendTo(this.$healDialog);
    jQuery("<span/>").html("Description:").appendTo($div);
    this.$healingDescription = jQuery("<input/>").attr("type", "text").attr("id", "healingDescription").appendTo($div);
    $div = jQuery("<div/>").appendTo(this.$healDialog);
    jQuery("<span/>").html("Is temporary HP").appendTo($div);
    this.$isTempHp = jQuery("<input/>").attr("type", "checkbox").attr("id", "isTempHp").attr("checked", false).appendTo($div);
    $div = jQuery("<div/>").appendTo(this.$healDialog);
    jQuery("<span/>").html("Uses healing surge").appendTo($div);
    this.$usesHealingSurge = jQuery("<input/>").attr("type", "checkbox").attr("id", "usesHealingSurge").attr("checked", true).appendTo($div);
    $div = jQuery("<div/>").appendTo(this.$healDialog);
    this.$healingAmount = jQuery("<input/>").attr("type", "text").attr("id", "healingAmount").attr("disabled", "disabled").appendTo($div);
    this.$usesHealingSurge.on({ click: (function() {
        if (this.$usesHealingSurge[0].checked) {
            this.$healingAmount.val(this.$usesHealingSurge.data("healingSurgeValue"));
            this.$healingAmount.attr("disabled", "disabled");
        }
        else {
            this.$healingAmount.removeAttr("disabled");
        }
    }).bind(this) });
    jQuery("<span/>").html("+").appendTo($div);
    this.$healingExtra = jQuery("<input/>").attr("type", "text").attr("id", "healingExtra").appendTo($div);
    this.$healDialog.dialog({ 
        autoOpen: false, 
        buttons: { 
            "Heal":  this._resolveHeal.bind(this)
        }, 
        modal: true, 
        title: "Heal", 
        width: "auto" 
    });
};

Initiative.prototype._createFileMenu = function() {
    var columns, i, j, $ul, $li, $a, menu;
    
    this.$fileButton = jQuery("<button/>").attr("id", "fileButton").html("File").on({ 
        click: (function(event) {
            event.stopPropagation();
            this.$fileMenu.toggle(); 
        }).bind(this) 
    });
    this.$menuBar.append(this.$fileButton);
    menu = [ 
            { id: "load", html: "Load", submenu: [
                  { id: "file", html: "from file: <input type=\"file\" id=\"fileInput\"/>", click: function(event) { event.stopPropagation(); } },
                  { id: "initiative", html: "Initiative", click: this.loadInitFromJs.bind(this) },
                  { id: "monsters", html: "Monsters", click: this.loadMonstersFromJs.bind(this) },
                  { id: "party", html: "Party", click: this.loadPartyFromJs.bind(this) }
              ]
            }, 
            { id: "import", html: "Import", click: this._import.bind(this) }, 
            { id: "export", html: "Export", click: this._export.bind(this) },
            { id: "clearAll", html: "Clear all", click: this._clearAll.bind(this) },
           ];
    this.$fileMenu = jQuery("<ul/>").attr("id", "fileMenu").css({ position: "absolute", left: this.$fileButton.position().left }).delegate("li", "click", (function(event) { 
        event.stopPropagation();
        this.$fileMenu.toggle(); 
    }).bind(this));
    this.$menuBar.append(this.$fileMenu);
    for (i = 0; i < menu.length; i++) {
    	$a = jQuery("<a/>").attr("href", "javascript:void(0);").html(menu[ i ].html);
        $li = jQuery("<li/>").attr("id", menu[ i ].id).append($a).on({ click: menu[ i ].click }).appendTo(this.$fileMenu);
    	if (menu[ i ].submenu) {
    		$ul = jQuery("<ul/>").appendTo($li);
            for (j = 0; j < menu[ i ].submenu.length; j++) {
            	$a = jQuery("<a/>").attr("href", "javascript:void(0);").html(menu[ i ].submenu[ j ].html);
                $li = jQuery("<li/>").attr("id", menu[ i ].submenu[ j ].id).append($a).on({ click: menu[ i ].submenu[ j ].click }).appendTo($ul);
            }
    	}
    }
    jQuery("#fileInput").on({ change: this.initFromFile.bind(this) });

    this.$fileMenu.menu().hide();
};

Initiative.prototype._createCreatureDialog = function() {
    var i, pcs, npcs, sort, $li, $div, $span, $select, $option, menu;
    
    if (this.$creatureDialog && this.$creatureDialog.length) {
    	try {
        	this.$creatureDialog.dialog("destroy").remove();
    	}
    	catch (e) {
    	}
    	finally {
        	this.$creatureDialog.remove();
    	}
    }
    this.$creatureDialog = jQuery("<div/>").attr("id", "creatureDialog");
    this.$creatures = jQuery("<select/>").attr("id", "creatureSelect").attr("multiple", "true").attr("size", 10);
    this.$creatureDialog.append(this.$creatures);
    pcs = [];
    npcs = [];
    for (i in Creature.creatures) {
    	if (Creature.creatures[ i ].isPC) {
    		pcs.push(Creature.creatures[ i ]);
    	}
    	else {
    		npcs.push(Creature.creatures[ i ]);
    	}
    }
    sort = function(a, b) {
    	return a.name >= b.name ? 1 : -1;
    };
    pcs.sort(sort);
    npcs.sort(sort);
    for (i = 0; i < pcs.length; i++) {
        jQuery("<option/>").html(pcs[ i ].name).data("creature", pcs[ i ]).appendTo(this.$creatures);
    }
    if (pcs.length && npcs.length) {
        jQuery("<option/>").html("------------").appendTo(this.$creatures).on({ click: function() { this.selected = false; } });
    }
    for (i = 0; i < npcs.length; i++) {
        jQuery("<option/>").html(npcs[ i ].name).data("creature", npcs[ i ]).appendTo(this.$creatures);
    }
    this.$creatureDialog.dialog({ 
        autoOpen: false, 
        buttons: { 
            "Add":  (function() {
                var i, toAdd, count, creature, actor;
                toAdd = [];
                for (i = 0; i < this.$creatures[0].options.length; i++) {
                    if (this.$creatures[0].options[ i ].selected) {
                        toAdd.push(jQuery(this.$creatures[0].options[ i ]).data("creature"));
                    }
                }
                for (i = 0; i < toAdd.length; i++) {
                    creature = toAdd[ i ];
                    count = creature.isPC ? 0 : this._countActorsByType(creature.name, true);
                    actor = creature.toActor(count);
                    this.actors.push(actor);
                    jQuery("<option/>").attr("value", actor.name).html(actor.name).data("actor", actor).appendTo(this.$freeFormHistorySubject);
                    this.order.push(this.actors.length - 1);
                    this._addHistory(actor, "Joins the fight");
                }
                this._render();
            }).bind(this)
        }, 
        modal: true, 
        title: "Creatures", 
        width: "auto" 
    });
    
    this.$creatureButton = jQuery("<button/>").attr("id", "creatures").html("Creatures").on({ 
        click: (function(event) {
            event.stopPropagation();
            //this.$creaturesMenu.toggle();
            this.$creatureDialog.dialog("open");
        }).bind(this) 
    });
    this.$menuBar.append(this.$creatureButton);
//    this.$creaturesMenu = jQuery("<ul/>").attr("id", "creaturesMenu").css({ position: "absolute", left: this.$creatureButton.position().left }).delegate("li", "click", (function(event) { 
//        event.stopPropagation();
//        this.$creaturesMenu.toggle();
//    }).bind(this));
//    this.$menuBar.append(this.$creaturesMenu);
//    for (i in Creature.creatures) {
//        $li = jQuery("<li/>").attr("id", Creature.creatures[ i ].name).append(jQuery("<a/>").attr("href", "javascript:void(0);").html(Creature.creatures[ i ].name)).on({ 
//            click: (function(creature) {
//                var count, actor;
//                count = creature.isPC ? 0 : this._countActorsByType(creature.name);
//                actor = creature.toActor(count);
//                this.actors.push(actor);
//                this.order.push(this.actors.length - 1);
//                this._render();
//                this._addHistory(actor, "Joins the fight");
//            }).bind(this, Creature.creatures[ i ]) 
//        }).appendTo(this.$creaturesMenu);
//    }
//    this.$creaturesMenu.menu().hide();
};

Initiative.prototype._createTable = function() {
    var columns, i, $li, $table, $tr, $td, image, $div, $span, $select, $option, menu;
    $table = jQuery("<table/>").attr("id", "history").addClass("fullWidth").appendTo(this.$parent);
    $tr = jQuery("<tr/>").appendTo($table);
    $td = jQuery("<td/>").addClass("halfWidth").appendTo($tr);
    
    this.$table = jQuery("<table/>").attr("id", "initiative");
    $td.append(this.$table);
    columns = [ "Character", "Def", "HP", "Actions", "History" ];
    for (i = 0; i < columns.length; i++) {
        this.$table.append(jQuery("<th/>").addClass("bordered f1").html(columns[ i ]));
    }
    this.$table.sortable({ containment: "parent", handle: ".creaturePanel", items: "tr", 
        update: (function(event, ui) {
            var i, move, before;
            move = ui.item.data("actor");
            for (i = 0; i < this.$table[0].rows.length; i++) {
                if (jQuery(this.$table[0].rows[ i ]).data("actor") === ui.item.data("actor")) {
                    before = this.actors[ this.order[ i ] ];
                    break;
                }
            }
            this._changeInitiative({ move: move, before: before });
        }).bind(this) 
    });
    
    $td = jQuery("<td/>").attr("id", "history").addClass("halfWidth bordered alignTop").appendTo($tr);
    jQuery("<div/>").addClass("bordered f1").html("History").appendTo($td);
    $td.append(this.history.$html);

    
    // Editor for adding arbitrary history
    $div = jQuery("<div/>").attr("id", "freeFormHistory");
    $td.append($div);
    this.$freeFormHistorySubject = jQuery("<select/>").appendTo($div);
    for (i = 0; i < this.actors.length; i++) {
        a = this.actors[ i ];
        $option = jQuery("<option/>").attr("value", a.name).html(a.name).data("actor", a).appendTo(this.$freeFormHistorySubject);
    }
    this.freeFormHistory = new History.Editor({ 
        $parent: $div, 
        save: (function(value) {
            $option = jQuery(this.$freeFormHistorySubject[0].options[ this.$freeFormHistorySubject[0].selectedIndex ]);
            this._addHistory($option.data("actor"), value);
        }).bind(this), 
        cancel: function() {} 
    });
    this.freeFormHistory.$cancel.hide();
};

Initiative.prototype._hideMenus = function() {
    this.$fileMenu.hide(); 
//    this.$creaturesMenu.hide(); 
};

Initiative.prototype._render = function() {
	var i, actor;
	
    this.$round.val(this.round);
    
	this.$table.find("tr").remove();
	this.$display.children().remove();
	
	for (i = 0; i < this.order.length; i++) {
		actor = this.actors[ this.order[ i ] ];
		actor.createTr({ 
			$table: this.$table,
			isCurrent: i === this._current,
			attack: this._attack.bind(this, actor),
			heal: this._heal.bind(this, actor),
			exit: this._exit.bind(this, actor)
		});
//        actor.createCard({ 
//            $parent: this.$display,
//            isCurrent: i === this._current,
//            className: "gridItem"
//        });
	}
	this._renderDisplay(false);
};

Initiative.prototype._displayLoadHandler = function(event) {
    if (console && console.info) {
        console.info("Display loaded");
    }
    this._renderDisplay(); 
};

Initiative.prototype._renderDisplay = function(createDisplay, event) {
	var listen, stopListening, eventType, intervalId, json;
	json = this.toJSON();
	
	if (event) {
		event.stopPropagation = true; // TODO, HACK: why are we getting 80+ hits for the same event?
	}
	
	if (!this.display && createDisplay) {
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
	    
	    return;
	}
	else if (this.display) {
		this.display.postMessage(json, "*");
	}
	this._autoSave(json);
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
            height: 800, 
            width: "85%",
            position: [ "center", 50 ],
            buttons: [
                      { 
                          text: "Load", click: (function() {
                              try {
                                  this._init(JSON.parse($textarea.val()));
                              }
                              catch (e) {
                                  if (window.console && window.console.error) {
                                      window.console.error(e.toString());
                                  }
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
            height: 800, 
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
    this._render();
};

Initiative.prototype._addHistory = function(actor, message, method) {
	var entry = new History.Entry({ round: this.round, subject: actor, message: message });
	if (typeof(method) === "undefined") {
		method = "info";
	}
	actor.history.add(entry);
	message = actor.name + " " + message.charAt(0).toLowerCase() + message.substr(1);
	this.history.add(entry);
	if (console && console[ method ]) {
		console[ method ](message);
	}
    this._autoSave();
};

Initiative.prototype._next = function() {
    var msg, i, actor;
    actor = this.actors[ this.order[ this._current ] ];
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
    actor = this.actors[ this.order[ this._current ] ];
    msg = actor.startTurn();
    if (msg) {
        this._addHistory(actor, msg);
    }
    if (actor.hasCondition("dead")) {
        this._next();
        return;
    }
    this._render();
};

Initiative.prototype._changeInitiative = function(event) {
    var getIndex, moveIndex, moveOrder, beforeIndex, beforeOrder;
    move = event.move;
    before = event.before;
    getIndex = (function(actor) {
        var i, j;
        for (i = 0; i < this.actors.length; i++) {
            if (this.actors[ i ] === actor) {
                return i;
            }
        }
        return -1;
    }).bind(this);
    moveIndex = getIndex(event.move);
    moveOrder = this.order.indexOf(moveIndex);
    this.order.splice(moveOrder, 1);
    beforeIndex = getIndex(event.before);
    beforeOrder = this.order.indexOf(beforeIndex);
    this.order.splice(beforeOrder, 0, moveIndex);
    this._addHistory(move, "Moved initiative order to before " + before.name);
    var test = "[ ";
    for (var i = 0; i < this.order.length; i++) {
    	test += (i ? ", " : "") + this.actors[ this.order[ i ] ].name;
    }
    console.info("New order: " + test + " ]");
    this._render();
};

Initiative.prototype._attack = function(actor) {
	var $option, i, a;
	this.$attackDialog.data("attacker", actor);
	
	this.$weapons.html("").hide();
	
	if (this.$combatAdvantage.data("combatAdvantage")) {
	    this.$combatAdvantage.click();
	}
	this.$attacks.html("");
	for (i = 0; i < actor.attacks.length; i++) {
		$option = jQuery("<option/>").html(actor.attacks[ i ].name).data("attack", actor.attacks[ i ]);
		this.$attacks.append($option);
	}
	this.$attacks.attr("size", Math.max(actor.attacks.length, 2));
	
	this._selectAttack();
	
	this.$targets.html("");
	for (i = 0; i < this.order.length; i++) {
		a = this.actors[ this.order[ i ] ];
		if (a.name === actor.name) {
			continue;
		}
		$option = jQuery("<option/>").html(a.name).data("target", a);
		this.$targets.append($option);
	}
	this.$targets.attr("size", Math.max(this.order.length, 2));
	this.$attackDialog.dialog("open");
};

Initiative.prototype._selectAttack = function() {
    var attack, actor, needsWeapon, needsImplement, items, isMelee, isRanged, i, item;
    if (this.$attacks[0].selectedIndex === -1) {
        this.$weapons.hide();
        return;
    }
    attack = jQuery(this.$attacks[0].options[ this.$attacks[0].selectedIndex ]).data("attack");
    actor = this.$attackDialog.data("attacker");
    if (attack.keywords) {
        needsWeapon = attack.keywords.indexOf("weapon") !== -1;
        isMelee = needsWeapon && attack.keywords.indexOf("melee") !== -1;
        isRanged = needsWeapon && attack.keywords.indexOf("ranged") !== -1;
        needsImplement = attack.keywords.indexOf("implement") !== -1;
        items = needsWeapon ? actor.weapons: null;
        if (!items && needsImplement) {
            items = actor[ "implements" ];
        }
    }
    if (needsWeapon || needsImplement) {
        this.$weapons.html("");
        for (i = 0; items && i < items.length; i++) {
            if (needsWeapon && (!!items[ i ].isMelee !== !!isMelee || !items[ i ].isMelee !== !!isRanged)) {
                continue;
            }
            $option = jQuery("<option/>").html(items[ i ].name).data("item", items[ i ]);
            this.$weapons.append($option);
        }
//        this.$weapons.attr("size", items.length);
        this.$weapons.show();
    }
    else {
        this.$weapons.hide();
    }
};

Initiative.prototype._resolveAttack = function() {
	var attacker, attack, item, i, targets, combatAdvantage;
	if (this.$attacks.val() && this.$targets.val()) {
		this.$attackDialog.dialog("close");
		attacker = this.$attackDialog.data("attacker");
		attack = jQuery(this.$attacks[0].options[ this.$attacks[0].selectedIndex ]).data("attack");
		if (attack.keywords && (attack.keywords.indexOf("weapon") !== -1 || attack.keywords.indexOf("implement") !== -1)) {
		    item = jQuery(this.$weapons[0].options[ this.$weapons[0].selectedIndex ]).data("item");
		}
		targets = [];
		for (i = 0; i < this.$targets[0].options.length; i++) {
			if (this.$targets[0].options[ i ].selected) {
				targets.push(jQuery(this.$targets[0].options[ i ]).data("target"));
			}
		}
		combatAdvantage = this.$combatAdvantage.data("combatAdvantage");
		attacker.attack(attack, item, targets, combatAdvantage, this.round, this._addHistory.bind(this));
		this._render();
	} 
	else {
		alert("Please select both an attack and 1 or more valid target(s)");
	}
};

Initiative.prototype._heal = function(actor) {
	this.$healDialog.data("patient", actor);
	this.$usesHealingSurge.data("healingSurgeValue", Math.floor(actor.hp.total / 4));
	this.$healingAmount.val(this.$usesHealingSurge.data("healingSurgeValue"));
	this.$healingExtra.val(0);
	this.$healDialog.dialog("open");
};

Initiative.prototype._resolveHeal = function(actor) {
	var target, amount, msg, method;
	if (!this.$healingDescription.val()) {
		alert("Please enter a description of the healing");
		return;
	}
	this.$healDialog.dialog("close");
	target = this.$healDialog.data("patient");
	amount = parseInt(this.$healingAmount.val()) + parseInt(this.$healingExtra.val());
	method = "info";
	if (this.$isTempHp[0].checked) {
		target.hp.temp = Math.max(amount, target.hp.temp);
		msg = "Gained " + amount + " temporary hit points from " + this.$healingDescription.val();
	}
	else {
		target.hp.current = Math.min(target.hp.current + amount, target.hp.total);
		msg = "Healed " + amount + " damage from " + this.$healingDescription.val();
	}
	if (this.$usesHealingSurge[0].checked) {
		if (target.surges.current <= 0) {
			msg += ", should have used a healing surge but has none remaining";
			method = "error";
		}
		else {
			target.surges.current = Math.max(--target.surges.current, 0);
			msg += ", using a healing surge";
		}
	}
	this._addHistory(target, msg, method);
	this._render();
};

Initiative.prototype._exit = function(actor) {
	var $dialog;
	$dialog = jQuery("<div/>").html("Remove " + actor.name + " from play?").dialog({ 
        autoOpen: false, 
        modal: true, 
        title: "Remove " + actor.name, 
        position: [ "center", 50 ],
        buttons: [
                  { 
                      text: "Remove", click: (function() {
                    	  var i, index;
                    	  index = this.actors.indexOf(actor);
                    	  this.order.splice(this.order.indexOf(index), 1);
                    	  this._addHistory(actor, "Leaves the fight");
//                    	  this.actors.splice(index, 1);
//                    	  for (i = 0; i < this.order.length; i++) {
//                    		  if (this.order[ i ] > index) {
//                    			  this.order[ i ]--;
//                    		  }
//                    	  }
                    	  this._render();
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
