var DnD;

(function() {
	"use strict";
	
	function InitiativeDialog(params) {
	    var i;
	    
	    this.$dialog = null;
		this.buttons = {
				$roll: null,
				$update: null
		};
        this.$body = null;
        this.$sortable = null;
        this._setData(params.actors, params.order, params.rolls);
        this.change = params.change;
		
		jQuery(document).ready((function() {
		    this.$dialog = jQuery("#initiativeDialog").on("show", this._onshow.bind(this));
			this.$body = this.$dialog.find(".modal-body");
			this.$sortable = this.$body.find(".sortable");
            this.buttons.$roll = this.$dialog.find(".roll").on({ click: this._rollInitiative.bind(this) });
            this.buttons.$update = this.$dialog.find(".update").on({ click: this._resolveInitiative.bind(this) });

			this.$sortable.sortable({ items: "li", update: this._onSortableUpdate.bind(this) });
            this.$sortable.disableSelection();
		}).bind(this));
	}

    InitiativeDialog.prototype._cloneArray = function(array) {
        var clone, i;
        if (!array) {
            return null;
        }
        clone = [];
        for (i = 0; i < array.length; i++) {
            clone.push(array[ i ]);
        }
        return clone;
    };

    InitiativeDialog.prototype._getActor = function(id) {
        var i;
        for (i = 0; i < this.actors.length; i++) {
            if (this.actors[ i ].id === id) {
                return this.actors[ i ];
            }
        }
        return null;
    };

    InitiativeDialog.prototype._setData = function(actors, order, rolls) {
        if (actors && actors.length) {
            this.actors = actors;
        }
        if (!this.actors) {
            this.actors = [];
        }
        if (!order || !order.length) {
            if (!this.order) {
                this.order = [];
                for (i = 0; i < this.actors.length; i++) {
                    this.order.push(this.actors[ i ].id);
                }
            }
        }
        else {
            this.order = this._cloneArray(order);
        }
        if (!rolls || !rolls.length || rolls.length !== this.order.length) {
            if (!this.rolls || this.rolls.length !== this.order.length) {
                this.rolls = [];
                for (i = this.order.length; i > 0; i--) {
                    this.rolls.push(i);
                }
            }
        }
        else {
            this.rolls = this._cloneArray(rolls);
        }
    };
    
    InitiativeDialog.prototype._onSortableUpdate = function(event, ui) {
        var index, $input, i, $li, lastRoll;

        index = ui.item.index();
        this.order = [];
        lastRoll = this.rolls[ 0 ]; 
        this.rolls = [];
        for (i = 0; i < this.$sortable.children().length; i++) {
            $li = jQuery(this.$sortable.children()[ i ]);
            this.order.push($li.data("actor").id);
            if (i >= index) {
                $input = $li.find("input");
                if (i === 0) {
                    $input.val(lastRoll);
                    this.rolls.push(lastRoll);
                }
                else if (parseInt($input.val()) >= lastRoll) {
                    $input.val(--lastRoll);
                    this.rolls.push(lastRoll);
                }
            }
            else {
                lastRoll = parseInt($li.find("input").val());
                this.rolls.push(lastRoll);
            }
        }
    };

	InitiativeDialog.prototype._rollInitiative = function() {
	    var i, actor;
	    this.rolls = [];
	    this.order = [];
	    for (i = 0; i < this.actors.length; i++) {
	        actor = this.actors[ i ];
	        this.rolls.push({ roll: (new Roll("1d20" + (actor.init < 0 ? "-" : "+") + actor.init)).roll(), actor: actor });
	    }
	    this.rolls.sort(function(a, b) {
	        if (a.roll < b.roll) {
	            return -1;
	        }
	        else if (a.roll > b.roll) {
	            return 1;
	        }
	        else {
	            if (a.actor.init < b.actor.init) {
	                return -1;
	            }
	            else if (a.actor.init > b.actor.init) {
	                return 1;
	            }
	            else {
	                return 0;
	            }
	        }
	    });
	    for (i = 0; i < this.rolls.length; i++) {
	        this.order.push(this.rolls[ i ].actor.id);
	        this.rolls[ i ] = this.rolls[ i ].roll;
	    }
		this._populate();
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
	    this.change(this.order);
	};


	InitiativeDialog.prototype._populate = function() {
	    var i, actor, $li, roll, $input, $span;
	    
        this.$sortable.children().remove();
	    for (i = 0; i < this.order.length; i++) {
	    	actor = this._getActor(this.order[ i ]);
	    	if (!actor) {
	    	    try { window.console.warn("Skipping order #" + i + " (actor id " + this.order[ i ] + "), not found in the list of actors"); } catch(e) {}
	    		continue;
	    	}
	        $li = jQuery("<li/>").addClass("ui-state-default grab actor").data("actor", actor).appendTo(this.$sortable);
            $span = jQuery("<i></i>").addClass("icon-resize-vertical icon-white").appendTo($li);
            roll = this.rolls && this.rolls.length === this.order.length ? this.rolls[ i ] : this.order.length - i;
            $input = jQuery("<input/>").attr("type", "number").attr("min", "1").attr("step", 1).addClass("order").attr("name", actor.id).val(roll).attr("placeholder", roll).appendTo($li);
            $span = jQuery("<span/>").addClass("label label-info").html(actor.name).appendTo($li);
	    }
	};	
	
    InitiativeDialog.prototype.show = function(actors, order, rolls) {
        if (actors || order || rolls) {
            this._setData(actors || this.actors, order || this.order, rolls || this.rolls);
        }
        this.$dialog.modal("show");
    };
    
	InitiativeDialog.prototype._onshow = function() {
        this._populate();
	};
	
	if (!DnD) {
		DnD = {};
	}
	if (!DnD.Dialog) {
		DnD.Dialog = {};
	}
	DnD.Dialog.Initiative = InitiativeDialog;
})();