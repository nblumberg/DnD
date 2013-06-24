var DnD;

(function() {
	"use strict";
	
	function InitiativeDialog(params) {
	    this.$dialog = null;
		this.buttons = {
				$roll: null,
				$update: null
		};
		this.$body = null;
		this.actors = params.actors;
		this.order = params.order;
		
		jQuery(document).ready((function() {
		    this.$dialog = jQuery("#initiativeDialog").on("show", this.show.bind(this));
			this.$body = this.$dialog.find(".modal-body");
			this.buttons.$roll = this.$dialog.find(".roll").on({ click: this._rollInitiative.bind(this) });
			this.buttons.$update = this.$dialog.find(".update").on({ click: this._resolveInitiative.bind(this) });
		    this._populate();
		}).bind(this));
	}

	InitiativeDialog.prototype._setInitiative = function(event) {
	    this._populate();
	    // TODO: recenter dialog
	    this.$dialog.modal("show");
	};


	InitiativeDialog.prototype._rollInitiative = function() {
		this.$dialog.find("input.order").each(function() {
			var $input, actor;
			$input = jQuery(this);
			actor = Creature.actors[ parseInt($input.attr("name")) ];
			$input.val((new Roll("1d20" + (actor.init < 0 ? "-" : "+") + actor.init)).roll());
		});
	};


	InitiativeDialog.prototype._resolveInitiative = function() {
		var entries, test, i, actor;
		entries = [];
		this.$dialog.find("input.order").each(function() {
			var $input = jQuery(this);
			entries.push({ id: parseInt($input.attr("name")), order: parseInt($input.val()) || parseInt($input.attr("placeholder")) });
		});
		entries.sort(function(a, b) { return b.order - a.order; });
	    test = "[ ";
		for (i = 0; i < entries.length; i++) {
			actor = Creature.actors[ entries[ i ].id ];
			if (this.order[ i ] !== entries[ i ].id) {
			    this._addHistory(actor, "Moved to #" + (i + 1) + " in the initiative order");
				this.order[ i ] = entries[ i ].id;
			}
	    	test += (i ? ", " : "") + actor.name;
		}
		try { window.console.info("New order: " + test + " ]"); } catch(e) {}
	    this.$dialog.modal("hide");
	    this._render(true);
	};


	InitiativeDialog.prototype._populate = function(actors, order) {
	    var i, actor, $div, $input, $span;
	    if (actors) {
	    	this.actors = actors;
	    }
	    if (order) {
	    	this.order = order;
	    }
	    this.$body.html("");
	    for (i = 0; i < this.order.length; i++) {
	    	actor = Creature.actors[ this.order[ i ] ];
	    	if (!actor) {
	    	    try { window.console.warn("Skipping order #" + i + " (actor id " + this.order[ i ] + "), not found in Creature.actors"); } catch(e) {}
	    		continue;
	    	}
	        $div = jQuery("<div/>").appendTo(this.$body);
	        $input = jQuery("<input/>").attr("type", "number").attr("min", "1").attr("step", 1).addClass("order").attr("name", actor.id).val(this.order.length - i).attr("placeholder", this.order.length - i).appendTo($div);
	        $span = jQuery("<span/>").html(actor.name).appendTo($div);
	    }
	};	
	
	InitiativeDialog.prototype.show = function(actors, order) {
		this._populate(actors, order);
	};
	
	if (!DnD) {
		DnD = {};
	}
	if (!DnD.Dialog) {
		DnD.Dialog = {};
	}
	DnD.Dialog.Initiative = InitiativeDialog;
})();