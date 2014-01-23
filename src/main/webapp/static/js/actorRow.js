/* global define, DnD, DnD.Creature.actors */
/* exported DnD.Display.ActorCard, DnD.Display.ActorCard.Event */
(function() {
    "use strict";

    define({
        name: "Display.ActorRow",
        dependencyNames: [ "Display.ActorCard", "Display.Editor", "History", "jQuery" ],
        factory: function(ActorCard, Editor, History, jQuery) {

            jQuery(document).on("click", ".actorRow .action", function() {
                var $action, actor, row;
                $action = jQuery(this);
                actor = DnD.Creature.actors[ $action.parents(".actorRow").attr("data-actor-id") ];
                row = actor ? actor.__tr : null;
                if (!row) {
                    return;
                }
                if ($action.hasClass("up")) {
                    row.params.order.up();
                }
                else if ($action.hasClass("order")) {
                    row.params.order.set();
                }
                else if ($action.hasClass("down")) {
                    row.params.order.down();
                }
                else if ($action.hasClass("attack")) {
                    row.params.attack();
                }
                else if ($action.hasClass("heal")) {
                    row.params.heal();
                }
                else if ($action.hasClass("exit")) {
                    row.params.exit();
                }
                else if ($action.hasClass("rename")) {
                    row.params.rename();
                }
            });

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
                this.hpTemp = null;
                this.hpCurrent = null;
                this.hpTotal = null;
                this.surgesCurrent = null;
                this.surgesPerDay = null;
                this.ap = null;
                this.history = params.history;

                this.actor.__tr = this;
                this.$tr = jQuery("<tr/>").attr("id", this.actor.name + "_row").addClass("actorRow").attr("data-actor-id", this.actor.id).appendTo(params.$table);
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
                this.hpTemp.setValue(this.actor.hp.temp);
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

                this.render();
            };


            // PRIVATE METHODS

            ActorRow.prototype._init = function() { // responseText, textStatus, jqXHR
                this.$up = this.$tr.find(".action.up");
                this.$order = this.$tr.find(".action.order");
                this.$down = this.$tr.find(".action.down");

                this.actor.card = this.card = new ActorCard({
                    actor: this.actor,
                    staticSize: true,
                    $parent: this.$tr.find(".card"),
                    isCurrent: this.params.isCurrent,
                    cardSize: 150,
                    showPcHp: this.params.showPcHp
                });

//                this.card = this.actor.createCard({ $parent: $td, isCurrent: params.isCurrent, cardSize: 120 });
//                this.card.$panel.attr("draggable", "true").addClass("grab").on({
//                    dragstart: (function(event) {
//                        event.dataTransfer.setData("actor", this);
//                        this.$panel.addClass("grabbing");
//                    }).bind(this),
//                    dragover: (function(event) {
//                        var actor = event.dataTransfer.getData("actor");
//                        if (actor && actor !== this) {
//                            event.preventDefault();
//                            this.$panel.addClass("droppable");
//                        }
//                    }).bind(this),
//                    drop: (function(event) {
//                        var actor = event.dataTransfer.getData("actor");
//                        if (actor && actor !== this) {
//                            event.preventDefault();
//                            this.dispatchEvent({ type: "reorder", move: actor, before: this });
//                        }
//                        this.$panel.removeClass("grabbing");
//                    }).bind(this)
//                });

                this.ac = this._addDefense(this.$tr.find(".ac ._editor"), "ac");
                this.fort = this._addDefense(this.$tr.find(".fort ._editor"), "fort");
                this.ref = this._addDefense(this.$tr.find(".ref ._editor"), "ref");
                this.will = this._addDefense(this.$tr.find(".will ._editor"), "will");

                this.hpTemp = new Editor({ $parent: this.$tr.find(".hp .temp ._editor"), _className: "hp temp", tagName: "span", html: this.actor.hp.temp, onchange: function(v) {
                    var oldValue = this.actor.hp.temp;
                    this.actor.hp.temp = parseInt(v, 10);
                    this.actor.dispatchEvent({ type: "change", property: "hp.temp", oldValue: oldValue, newValue: this.actor.hp.temp });
                }.bind(this) });
                this.hpCurrent = new Editor({ $parent: this.$tr.find(".hp .current ._editor"), _className: "hp current", tagName: "span", html: this.actor.hp.current, onchange: function(v) {
                    var oldValue = this.actor.hp.current;
                    this.actor.hp.current = parseInt(v, 10);
                    this.actor.dispatchEvent({ type: "change", property: "hp.current", oldValue: oldValue, newValue: this.actor.hp.current });
                }.bind(this) });
                this.hpTotal = new Editor({ $parent: this.$tr.find(".hp .total ._editor"), _className: "hp total", tagName: "span", html: this.actor.hp.total, onchange: function(v) {
                    var oldValue = this.actor.hp.total;
                    this.actor.hp.current = parseInt(v, 10);
                    this.actor.dispatchEvent({ type: "change", property: "hp.total", oldValue: oldValue, newValue: this.actor.hp.total });
                }.bind(this) });
                this.surgesCurrent = new Editor({ $parent: this.$tr.find(".hp .surgesCurrent ._editor"), _className: "surge current", tagName: "span", html: this.actor.surges.current, onchange: function(v) {
                    var oldValue = this.actor.surges.current;
                    this.actor.surges.current = parseInt(v, 10);
                    this.actor.dispatchEvent({ type: "change", property: "surges.current", oldValue: oldValue, newValue: this.actor.surges.current });
                }.bind(this) });
                this.surgesPerDay = new Editor({ $parent: this.$tr.find(".hp .surgesPerDay ._editor"), _className: "surge perDay", tagName: "span", html: this.actor.surges.perDay, onchange: function(v) {
                    var oldValue = this.actor.surges.perDay;
                    this.actor.surges.perDay = parseInt(v, 10);
                    this.actor.dispatchEvent({ type: "change", property: "surges.perDay", oldValue: oldValue, newValue: this.actor.surges.perDay });
                }.bind(this) });
                this.ap = new Editor({ $parent: this.$tr.find(".hp .ap ._editor"), _className: "ap", tagName: "span", html: this.actor.ap, onchange: function(v) {
                    var oldValue = this.actor.ap;
                    this.actor.ap = parseInt(v, 10);
                    this.actor.dispatchEvent({ type: "change", property: "ap", oldValue: oldValue, newValue: this.actor.ap });
                }.bind(this) });

                this.$attack = this.$tr.find(".attack");
                this.$heal = this.$tr.find(".heal");
                this.$exit = this.$tr.find(".exit");
                this.$rename = this.$tr.find(".rename");

                this.history.addToPage(this.$tr.find(".history div"));
            };

            ActorRow.prototype._addDefense = function($field, defense) {
                return new Editor({ $parent: $field, _className: defense, tagName: "span", html: this.actor.defenses[ defense ], onchange: function(v) {
                    var old = this.actor.defenses[ defense ];
                    this.actor.defenses[ defense ] = parseInt(v, 10);
                    new History.Entry({
                        subject: this,
                        message: "Manually changed " + defense.toUpperCase() + " from " + old + " to " + this.actor.defenses[ defense ],
                        round: this.actor.history._round // TODO: make History.Entry inherit the round from the History instance
                    });
                    this.actor.history.add();
                    this.actor.dispatchEvent({ type: "change", property: "defenses." + defense, oldValue: old, newValue: this.actor.defenses[ defense ] });
                }.bind(this) });
            };

            return ActorCard;
        },
        includeInNamespace: true,
        namespace: "DnD"
    });

})();
