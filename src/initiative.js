/** 
 * @param {Array[Actor]} params.order
 * @param {String} params.target
 */
var Initiative = function(params) {
	var i;
	params = params || {};
    this.creatures = params.creatures || {};
	this.actors = params.actors || {};
	for (i = 0; i < this.actors.length; i++) {
		this.addRoute(this.actors[ i ]);
        this.addEventListener("change", this._render.bind(this));
        this.addEventListener("reorder", this._changeInitiative.bind(this));
	}
	this.order = params.order;
	if (!this.order || !this.order.length) {
		this._rollInitiative();
	}
	this.round = 1;
	this._current = 0;
	this._$target = params.target ? jQuery(params.target) : ""; 
	this.history = new History(params.history || { includeSubject: true });
	History.central = this.history;
	jQuery(document).ready(this._create.bind(this));
};

Initiative.prototype = new EventBus();

Initiative._CARD_SIZE = 120;
Initiative._STYLES = [
	"th, td { border-color: white; }",
	
	".alignTop { vertical-align: top; }",
	".bordered { border-style: solid; border-width: 3px; }",
	".bloodied { background-color: red; }",
	".centered { text-align: center; }",
	".centered img { display: block; margin-left: auto; margin-right: auto; }",
	".current { border-color: blue; border-width: 6px; }",
	".f1 { font-size: 1.5em; }",
	".f2 { font-size: 1.2em; }",
    ".floatLeft { float: left; }",
    ".gridItem { display: inline-block; vertical-align: top; }", 
	".fullHeight { height: 100%; }",
	".fullWidth { clear: both; width: 100%; }",
	".halfWidth { width: 50%; }",
	".fullBoth { height: 100%; width: 100%; }",
	".numerator:after { content: '/' }",
	
	"div#header * { margin-right: 10px; }",
	"span#spanLabel { font-size: 1.2em; }",
	"input#round { width: 30px; }",
	
	"#history div { text-align: center; }",
	
    "#display .creaturePanel {  }",
	".creaturePanel { min-height: " + Initiative._CARD_SIZE + "px; margin:2px; position: relative; width: " + Initiative._CARD_SIZE + "px; }",
	".creaturePanel .column { float: left; margin-right: 4px; }",
    ".creaturePanel img.icon { margin-right: 2px; }",
    ".creaturePanel .effects { bottom: 0; left: 0; position: absolute; right:0; top: 0; }",
    ".creaturePanel .effects { margin: 0 1px 2px 0; }",
		
	"div#history { float: right; height: 100%; min-width: 30%; padding: 0 5px; }",
	"div#history h3 { margin: 5px 0; }",
//		"table#initiative { border-collapse: collapse; }",
	"table#initiative th, table#initiative td { text-align: center; }", 
	"table#initiative td.hp { padding: 3px; text-align: left; }",
	"table#initiative .tempHp { font-style: italic; }",
	"div#attacksDialog { padding: 5px; }",
	"div#attacksDialog table { width: 98%; }",
	"div#attacksDialog td { vertical-align: top; }",
	"div#attacksDialog td.attacks2targets { padding-top: 30%; }",
	"div#attacksDialog td, div#attacksDialog select { height: 100%; }",
	"table#initiative td.history div { font-size: 0.75em; max-height: 130px; overflow-y: auto; padding-right: 20px; text-align: left; white-space: nowrap; }"
];

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

Initiative.prototype._create = function() {
	var columns, i, $table, $tr, $td, image, $div, $span, $select, $option;
	this.$parent = jQuery(this._$target.length ? this._$target : "body");
	
//	this.$style = jQuery("<style/>").attr("id", "initStyles").html(Initiative._STYLES.join("\n"));
//	this.$parent.append(this.$style);
	
	this.$attackDialog = jQuery("<div/>").attr("id", "attacksDialog");
	$table = jQuery("<table/>");
	$table.attr("id", "attacks");
	this.$attackDialog.append($table);
	$tr = jQuery("<tr/>");
	$table.append($tr);
	$td = jQuery("<td/>");
	$tr.append($td);
	this.$attacks = jQuery("<select/>").attr("id", "attackSelect");
	$td.append(this.$attacks);
	$td = jQuery("<td/>").addClass("attacks2targets");
	$tr.append($td);
	image = new Image();
	image.height = 30;
	image.src = "http://gamereviewhero.com/images/sword_icon.png";
	$td.append(image);
	$td = jQuery("<td/>");
	$tr.append($td);
	this.$targets = jQuery("<select/>").attr("id", "targetSelect").attr("multiple", "true");
	$td.append(this.$targets);
	jQuery(this.$targets).on({ dblclick: this._resolveAttack.bind(this) });
	this.$attackDialog.dialog({ 
		autoOpen: false, 
		buttons: { 
			"Attack":  this._resolveAttack.bind(this)
		}, 
		modal: true, 
		title: "Attacks", 
		width: "auto" 
	});
	
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
	
    this.$display = jQuery("<div/>").attr("id", "display").addClass("fullWidth").appendTo(this.$parent);
    
	$div = jQuery("<div/>").attr("id", "header").addClass("fullWidth");
	this.$parent.append($div);
	$span = jQuery("<span/>").attr("id", "roundLabel").html("Round");
	$div.append($span);
	this.$round = jQuery("<input/>").attr("id", "round").attr("type", "text").attr("disabled", "disabled").val(this.round);
	$div.append(this.$round);
	this.$nextButton = jQuery("<button/>").attr("id", "next").html("Next").on({ click: (function() {
		this._current++;
		if (this._current >= this.order.length) {
			this._current = 0;
			this.round++;
			this.$round.val(this.round);
		}
		this._render();
	}).bind(this) });
	$div.append(this.$nextButton);
	
    this.$displayButton = jQuery("<button/>").attr("id", "open").html("Open player window").on({ click: this._renderDisplay.bind(this, true) });
    $div.append(this.$displayButton);
	
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
	        this._changeInitiative({ move: ui.item.data("actor"), before: this.actors[ this.order[ ui.item.index() + 1 ] ] });
	    }).bind(this) 
    });
	
	$td = jQuery("<td/>").attr("id", "history").addClass("halfWidth bordered alignTop").appendTo($tr);
	jQuery("<div/>").addClass("bordered f1").html("History").appendTo($td);
	$td.append(this.history.$html);

	
	// Editor for adding arbitrary history
	$div = jQuery("<div/>").attr("id", "freeFormHistory");
	$td.append($div);
	$select = jQuery("<select/>").appendTo($div);
	for (i = 0; i < this.actors.length; i++) {
		a = this.actors[ i ];
		$option = jQuery("<option/>").attr("value", a.name).html(a.name).data("actor", a).appendTo($select);
	}
	this.freeFormHistory = new History.Editor({ 
		$parent: $div, 
		save: (function(value) {
			$option = jQuery($select[0].options[ $select[0].selectedIndex ]);
			this._addHistory($option.data("actor"), value);
		}).bind(this), 
		cancel: function() {} 
	});
	this.freeFormHistory.$cancel.hide();
	
	this._render();
};

Initiative.prototype._render = function() {
	var i, actor;
	
	this.$table.find("tr").remove();
	this.$display.children().remove();
	
	for (i = 0; i < this.order.length; i++) {
		actor = this.actors[ this.order[ i ] ];
		actor.createTr({ 
			$table: this.$table,
			isCurrent: i === this._current,
			attack: this._attack.bind(this, actor),
			heal: this._heal.bind(this, actor)
		});
//        actor.createCard({ 
//            $parent: this.$display,
//            isCurrent: i === this._current,
//            className: "gridItem"
//        });
	}
	this._renderDisplay(false);
};

Initiative.prototype._renderDisplay = function(createDisplay, event) {
	var displayOnLoad, intervalId;
	
	if (event) {
		event.stopPropagation = true; // TODO, HACK: why are we getting 80+ hits for the same event?
	}
	
	if (!this.display && createDisplay) {
		// Log when the other window loads
		displayOnLoad = (function() { 
	        if (console && console.info) {
	            console.info("Display loaded");
	        }
	        this._renderDisplay(); 
	    }).bind(this);
		// Clean up the old window
		if (this.display) {
		    if (this.display.removeEventListener) {
		    	this.display.removeEventListener("load", displayOnLoad, false);
		    }
		    else {
		    	this.display.detachEvent("onload", displayOnLoad, false);
		    }
		}
		// Create a new window
	    this.display = window.open("initiative.html", "Initiative", "location=0,status=0,toolbar=0", false);
	    if (this.display.addEventListener) {
	    	this.display.addEventListener("load", displayOnLoad, false);
	    }
	    else {
	    	this.display.attachEvent("onload", displayOnLoad, false);
	    }
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
		this.display.postMessage(JSON.stringify({ order: this.order, actors: this.actors, current: this._current }, null, "  "), "*");
	}
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
	window.localStorage.setItem("initiative", JSON.stringify(this), null, "  ");
};

Initiative.prototype._attack = function(actor) {
	var $option, i, a;
	this.$attackDialog.data("attacker", actor);
	
	this.$attacks.html("");
	for (i = 0; i < actor.attacks.length; i++) {
		$option = jQuery("<option/>").html(actor.attacks[ i ].name).data("attack", actor.attacks[ i ]);
		this.$attacks.append($option);
	}
	this.$attacks.attr("size", actor.attacks.length);
	
	this.$targets.html("");
	for (i = 0; i < this.order.length; i++) {
		a = this.actors[ this.order[ i ] ];
		if (a.name === actor.name) {
			continue;
		}
		$option = jQuery("<option/>").html(a.name).data("target", a);
		this.$targets.append($option);
	}
	this.$targets.attr("size", this.order.length);
	this.$attackDialog.dialog("open");
};

Initiative.prototype._resolveAttack = function() {
	var attacker, attack, i, targets, toHit, isCrit, def, damage, target, msg, temp;
	if (this.$attacks.val() && this.$targets.val()) {
		this.$attackDialog.dialog("close");
		attacker = this.$attackDialog.data("attacker");
		attack = jQuery(this.$attacks[0].options[ this.$attacks[0].selectedIndex ]).data("attack");
		targets = [];
		
		toHit = attack.roll();
		damage = attack.damage.roll() + (isCrit ? attack.crit.roll() : 0);
		
		for (i = 0; i < this.$targets[0].options.length; i++) {
			if (this.$targets[0].options[ i ].selected) {
				targets.push(jQuery(this.$targets[0].options[ i ]).data("target"));
			}
		}
		for (i = 0; i < targets.length; i++) {
			target = targets[ i ];
			if (toHit >= target.defenses[ attack.defense.toLowerCase() ]) {
				msg = "Hit by " + attacker.name + "'s " + attack.anchor(toHit) + " for " + attack.damage.anchor();
				if (target.hp.temp) {
					temp = target.hp.temp;
					target.hp.temp -= damage;
					damage -= temp;
					msg += " (" + temp + " absorbed by temporary HP)";
				}
				target.hp.current -= damage;
				if (target.hp.current < 0) {
					msg += "; " + target.name + " falls unconscious";
				}
			}
			else {
				msg = "Missed by " + attacker.name + "'s " + attack.anchor(toHit);
			}
			this._addHistory(target, msg);
			if (console && console.info) {
				console.info(target.name + " " + msg.charAt(0).toLowerCase() + msg.substr(1));
			}
		}
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

Initiative.prototype.toJSON = function() {
    var json, i;
    json = "{";
    json += "\n\t\"round\":" + this.round;
    json += ",\n\t\"_current\":" + this._current;
    json += ",\n\t\"order\": " + JSON.stringify(this.order);
    json += ",\n\t\"actors\": [";
    for (i = 0; i < this.actors.length; i++) {
        json += (i ? "," : "") + "\n\t\t" + this.actors[ i ].toJSON();
    }
    json += "\n]";
    json += "\n,\"creatures\": [";
    for (i = 0; i < this.creatures.length; i++) {
        json += (i ? "," : "") + "\n\t\t" + this.creatures[ i ].toJSON();
    }
    json += "\n\t]";
    json += ",\n\t\"history\":" + this.history.toJSON();
    json += "\n}";
    return json;
};