var DnD, safeConsole;

(function(console) {
    "use strict";
    
    if (!DnD) {
        DnD = {};
    }
    if (!DnD.Dialog) {
        DnD.Dialog = {};
    }
    
    
    // CONSTRUCTOR & INITIALIZATION METHODS
    
    function InitiativeDialog(params) {
        var i;
        
        this.addHistory = params.addHistory;
        this.buttons = {
                $roll: null,
                $update: null
        };
        this.$sortable = null;
        this._setData(params.actors, params.order, params.rolls);
        this.change = params.onchange;
        
        this._init(params);
    }
    
    InitiativeDialog.prototype = new DnD.Dialog("initiativeDialog", "/html/partials/initiativeDialog.html");

    
    // OVERRIDDEN METHODS
    
    InitiativeDialog.prototype.show = function(actors, order, rolls) {
        if (actors || order || rolls) {
            this._setData(actors || this.actors, order || this.order, rolls || this.rolls);
        }
        DnD.Dialog.prototype.show.call(this);
    };
    
    InitiativeDialog.prototype._onReady = function() {
        this.$sortable = this.$body.find(".sortable");
        this.buttons.$roll = this.$dialog.find(".roll").on({ click: this._rollInitiative.bind(this) });
        this.buttons.$update = this.$dialog.find(".update").on({ click: this._resolveInitiative.bind(this) });
        this._onOkButtonClick = this._resolveInitiative.bind(this);

        this.$sortable.sortable({ items: "li", update: this._onSortableUpdate.bind(this) });
        this.$sortable.disableSelection();
    };

    InitiativeDialog.prototype._onShow = function() {
        this._populate();
    };
    
    
    // PRIVATE METHODS
    
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
        var i;
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
                else if (parseInt($input.val(), 10) >= lastRoll) {
                    $input.val(--lastRoll);
                    this.rolls.push(lastRoll);
                }
            }
            else {
                lastRoll = parseInt($li.find("input").val(), 10);
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
            entries.push({ id: parseInt($input.attr("name"), 10), order: parseInt($input.val(), 10) || parseInt($input.attr("placeholder"), 10) });
        });
        entries.sort(function(a, b) { return b.order - a.order; });
        test = "[ ";
        for (i = 0; i < entries.length; i++) {
            actor = Creature.actors[ entries[ i ].id ];
            if (this.order[ i ] !== entries[ i ].id) {
                this.addHistory(actor, "Moved to #" + (i + 1) + " in the initiative order");
                this.order[ i ] = entries[ i ].id;
            }
            test += (i ? ", " : "") + actor.name;
        }
        console.info("New order: " + test + " ]");
        this.hide();
        this.change(this.order);
    };


    InitiativeDialog.prototype._populate = function() {
        var i, actor, $li, $a, $name, roll, $input;
        
        this.$sortable.children().remove();
        for (i = 0; i < this.order.length; i++) {
            actor = this._getActor(this.order[ i ]);
            if (!actor) {
                console.warn("Skipping order #" + i + " (actor id " + this.order[ i ] + "), not found in the list of actors");
                continue;
            }
            $li = jQuery("<li/>").addClass("ui-state-default grab actor active").data("actor", actor).appendTo(this.$sortable);
            $a = jQuery("<a href=\"javascript:void(0);\"/>").appendTo($li);
            $name = jQuery("<div/>").addClass("name").html(actor.name).appendTo($a);
            roll = this.rolls && this.rolls.length === this.order.length ? this.rolls[ i ] : this.order.length - i;
            $input = jQuery("<input/>").attr("type", "number").attr("min", "1").attr("step", 1).addClass("order").attr("name", actor.id).val(roll).attr("placeholder", roll).appendTo($a);
        }
    };    
    

    DnD.Dialog.Initiative = InitiativeDialog;
})(safeConsole());