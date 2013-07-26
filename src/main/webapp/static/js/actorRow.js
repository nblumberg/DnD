var DnD;

(function() {
    "use strict";
    
    if (!DnD) {
        DnD = {};
    }
    if (!DnD.Display) {
        DnD.Display = {};
    }
    
    
    // CONSTRUCTOR
    
    /**
     * @param actor Actor The Actor
     * @param $table jQuery("<table/>") The parent table element
     * @param isCurrent {Boolean} Indicates if it is this Creature's turn in the initiative order
     * @param order {Object} The click handlers for the move initiative order actions
     * @param order.up {Function} The click handler for the move initiative order up action
     * @param order.down {Function} The click handler for the move initiative order down action
     * @param attack {Function} The click handler for the attack action
     * @param heal {Function} The click handler for the heal action
     * @param history {DnD.History} The History of the Actor
     */
    function ActorRow(params) {
        this.params = params || {};
        
        this.actor = params.actor;
        this.ac = null;
        this.fort = null;
        this.ref = null;
        this.will = null;
        this.tempHp = null;
        this.hpCurrent = null;
        this.hpTotal = null;
        this.surgesCurrent = null;
        this.surgesPerDay = null;
        this.history = params.history;
        
        this.$tr = jQuery("<tr/>").attr("id", this.actor.name + "_row").data("actor", this.actor).appendTo(params.$table);
        if (params.isCurrent) {
            this.$tr.addClass("current");
        }
        if (this.actor.isBloodied()) {
            this.$tr.addClass("bloodied");
        }
        this.$tr.load("/html/partials/actorRow.html", null, this._init.bind(this));
    }

    // PUBLIC METHODS
    
    ActorRow.prototype.render = function() {
        if (!this.ac) {
            return; // TODO: why is this.ac null?
        }
        this.ac.setValue(this.actor.defenses.ac);
        this.fort.setValue(this.actor.defenses.fort);
        this.ref.setValue(this.actor.defenses.ref);
        this.will.setValue(this.actor.defenses.ac);
        this.tempHp.setValue(this.actor.hp.temp);
        this.hpCurrent.setValue(this.actor.hp.current);
        this.hpTotal.setValue(this.actor.hp.total);
        this.surgesCurrent.setValue(this.actor.surges.current);
        this.surgesPerDay.setValue(this.actor.surges.perDay);
        this.card.refresh();
    };
    
    ActorRow.prototype.remove = function() {
        this.$tr.remove();
    };

    ActorRow.prototype.reattach = function($parent) {
        if ($parent) {
            this.$parent = $parent;
            this.$tr.appendTo(this.$parent);
        }
        // Removing elements from the DOM seems to break their event listeners so reattach them
        this.$up.on({ click: this.params.order.up });
        this.$order.on({ click: this.params.order.set });
        this.$down.on({ click: this.params.order.down });
        
        this.ac.reattach();
        this.fort.reattach();
        this.ref.reattach();
        this.will.reattach();
        
        this.tempHp.reattach();
        this.hpCurrent.reattach();
        this.hpTotal.reattach();
        this.surgesCurrent.reattach();
        this.surgesPerDay.reattach();
        
        this.$attack.on({ click: this.params.attack });
        this.$heal.on({ click: this.params.heal });
        this.$exit.on({ click: this.params.exit });
        this.$rename.on({ click: this.params.rename });
        
        this.render();
    };

    
    // PRIVATE METHODS
    
    ActorRow.prototype._init = function(responseText, textStatus, jqXHR) {
        this.$up = this.$tr.find(".action.up").on({ click: this.params.order.up });
        this.$order = this.$tr.find(".action.order").on({ click: this.params.order.set });
        this.$down = this.$tr.find(".action.down").on({ click: this.params.order.down });
        
        this.actor.card = this.card = new DnD.Display.ActorCard({
            actor: this.actor,
            staticSize: true,
            $parent: this.$tr.find(".card"),
            isCurrent: this.params.isCurrent,
            cardSize: 150,
            showPcHp: this.params.showPcHp
        });
        
//        this.card = this.actor.createCard({ $parent: $td, isCurrent: params.isCurrent, cardSize: 120 });
//        this.card.$panel.attr("draggable", "true").addClass("grab").on({ 
//            dragstart: (function(event) {
//                event.dataTransfer.setData("actor", this);
//                this.$panel.addClass("grabbing");
//            }).bind(this),
//            dragover: (function(event) {
//                var actor = event.dataTransfer.getData("actor");
//                if (actor && actor !== this) {
//                    event.preventDefault();
//                    this.$panel.addClass("droppable");
//                }
//            }).bind(this),
//            drop: (function(event) {
//                var actor = event.dataTransfer.getData("actor");
//                if (actor && actor !== this) {
//                    event.preventDefault();
//                    this.dispatchEvent({ type: "reorder", move: actor, before: this });
//                }
//                this.$panel.removeClass("grabbing");
//            }).bind(this)
//        });
        
        this.ac = this._addDefense(this.$tr.find(".ac > span"), "ac");
        this.fort = this._addDefense(this.$tr.find(".fort > span"), "fort");
        this.ref = this._addDefense(this.$tr.find(".ref > span"), "ref");
        this.will = this._addDefense(this.$tr.find(".will > span"), "will");
        
        this.tempHp = new Editor({ $parent: this.$tr.find(".hp .temp .editor"), tagName: "span", html: this.actor.hp.temp, onchange: (function(v) {
            var oldValue = this.actor.hp.temp;
            this.actor.hp.temp = parseInt(v, 10);
            this.actor.dispatchEvent({ type: "change", property: "hp.temp", oldValue: oldValue, newValue: this.actor.hp.temp });
        }).bind(this) });
        this.hpCurrent = new Editor({ $parent: this.$tr.find(".hp .current .editor"), tagName: "span", html: this.actor.hp.current, onchange: (function(v) {
            var oldValue = this.actor.hp.current;
            this.actor.hp.current = parseInt(v, 10);
            this.actor.dispatchEvent({ type: "change", property: "hp.current", oldValue: oldValue, newValue: this.actor.hp.current });
        }).bind(this) });
        this.hpTotal = new Editor({ $parent: this.$tr.find(".hp .total .editor"), tagName: "span", html: this.actor.hp.total, onchange: (function(v) {
            var oldValue = this.actor.hp.total;
            this.actor.hp.current = parseInt(v, 10);
            this.actor.dispatchEvent({ type: "change", property: "hp.total", oldValue: oldValue, newValue: this.actor.hp.total });
        }).bind(this) });
        this.surgesCurrent = new Editor({ $parent: this.$tr.find(".hp .surgesCurrent .editor"), tagName: "span", html: this.actor.surges.current, onchange: (function(v) {
            var oldValue = this.actor.surges.current;
            this.actor.surges.current = parseInt(v, 10);
            this.actor.dispatchEvent({ type: "change", property: "surges.current", oldValue: oldValue, newValue: this.actor.surges.current });
        }).bind(this) });
        this.surgesPerDay = new Editor({ $parent: this.$tr.find(".hp .surgesPerDay .editor"), tagName: "span", html: this.actor.surges.perDay, onchange: (function(v) {
            var oldValue = this.actor.surges.perDay;
            this.actor.surges.perDay = parseInt(v, 10);
            this.actor.dispatchEvent({ type: "change", property: "surges.perDay", oldValue: oldValue, newValue: this.actor.surges.perDay });
        }).bind(this) });
                    
        this.$attack = this.$tr.find(".attack").on({ click: this.params.attack });
        this.$heal = this.$tr.find(".heal").on({ click: this.params.heal });
        this.$exit = this.$tr.find(".exit").on({ click: this.params.exit });
        this.$rename = this.$tr.find(".rename").on({ click: this.params.rename });
        
        this.history.addToPage(this.$tr.find(".history div"));
    };
    
    ActorRow.prototype._addDefense = function($field, defense) {
        return new Editor({ $parent: $field, tagName: "span", html: this.actor.defenses[ defense ], onchange: (function(v) {
            var old, entry;
            old = this.actor.defenses[ defense ];
            this.actor.defenses[ defense ] = parseInt(v, 10);
            entry = new DnD.History.Entry({ 
                subject: this, 
                message: "Manually changed " + className.toUpperCase() + " from " + old + " to " + this.actor.defenses[ defense ], 
                round: this.actor.history._round // TODO: make History.Entry inherit the round from the History instance 
            });
            this.actor.history.add();
            this.actor.dispatchEvent({ type: "change", property: "defenses." + defense, oldValue: old, newValue: this.actor.defenses[ defense ] });
        }).bind(this) });
    };

    
    DnD.Display.ActorRow = ActorRow;
})();
