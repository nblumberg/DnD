(function() {
    "use strict";

    DnD.define(
        "Display.Dialog.Creature",
        [ "Display.Dialog", "jQuery", "Creature" ],
        function(Dialog, jQuery, Creature) {
            // CONSTRUCTOR & INITIALIZATION METHODS

            function CreatureDialog(params) {
                this.callback = params.callback;
                this.$dialog = null;
                this.$creatures = null;
                this.$selection = null;
                this.$add = null;
                this.$remove = null;
                this.buttons = {
                    $ok: null
                };

                this._init(params);
            }

            CreatureDialog.prototype = new Dialog("creaturesDialog", "/html/partials/creaturesDialog.html");


            // OVERRIDDEN METHODS

            CreatureDialog.prototype._onReady = function() {
                this.$creatures = this.$dialog.find("select#creatureSelect");
                this.$selection = this.$dialog.find("select#creatureSelected");
                this.$add = this.$dialog.find(".add").on({ click: this._add.bind(this) });
                this.$remove = this.$dialog.find(".remove").on({ click: this._remove.bind(this) });
                this.buttons.$ok = this.$dialog.find(".btn-primary").on({ click: this._ok.bind(this) });
                this._onOkButtonClick = this._ok.bind(this);
            };

            CreatureDialog.prototype._onShow = function() {
                var i, creature, pcs, npcs, sort;
                pcs = [];
                npcs = [];
                for (i in Creature.creatures) {
                    if (Creature.creatures.hasOwnProperty(i) && Creature.creatures[ i ] instanceof Creature) {
                        creature = Creature.creatures[ i ];
                        if (creature.isPC) {
                            pcs.push(creature);
                        }
                        else {
                            npcs.push(creature);
                        }
                    }
                }
                sort = function(a, b) {
                    return a.name >= b.name ? 1 : -1;
                };
                pcs.sort(sort);
                npcs.sort(sort);
                this.$creatures.children().remove();
                this.$selection.children().remove();
                for (i = 0; i < pcs.length; i++) {
                    jQuery("<option/>").html(pcs[ i ].name).data("creature", pcs[ i ]).appendTo(this.$creatures);
                }
                if (pcs.length && npcs.length) {
                    jQuery("<option/>").html("------------").appendTo(this.$creatures).on({ click: function() { this.selected = false; } });
                }
                for (i = 0; i < npcs.length; i++) {
                    jQuery("<option/>").html(npcs[ i ].name).data("creature", npcs[ i ]).appendTo(this.$creatures);
                }
            };


            // NON-PUBLIC METHODS

            CreatureDialog.prototype._add = function() {
                var i, toAdd;
                toAdd = [];
                this.$creatures.children("option").each(function() {
                    if (this.selected) {
                        toAdd.push(jQuery(this).data("creature"));
                    }
                });
                for (i = 0; i < toAdd.length; i++) {
                    jQuery("<option/>").html(toAdd[ i ].name).data("creature", toAdd[ i ]).appendTo(this.$selection);
                }
            };

            CreatureDialog.prototype._remove = function() {
                this.$selection.children("option").each(function() {
                    if (this.selected) {
                        jQuery(this).remove();
                    }
                });
            };

            CreatureDialog.prototype._ok = function() {
                var toAdd = [];
                this.$selection.children("option").each(function() {
                    toAdd.push(jQuery(this).data("creature"));
                });
                this.callback(toAdd);
                this.hide();
            };


            return CreatureDialog;
        },
        true
    );

})();