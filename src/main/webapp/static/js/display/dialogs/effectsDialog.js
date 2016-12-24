(function() {
    "use strict";

    DnD.define(
        "Display.Dialog.Effects",
        [ "Display.Dialog", "jQuery" ],
        function(Dialog, jQuery) {
            // CONSTRUCTOR & INITIALIZATION METHODS

            function EffectsDialog(params) {
                this.callback = params.callback;
                this._init(params);
            }

            EffectsDialog.prototype = new Dialog("effectsDialog", "/html/partials/effectsDialog.html");

            // OVERRIDDEN METHODS

            EffectsDialog.prototype.show = function(character) {
                var i;
                this.$tbody.html("");
                if (character) {
                    for (i = 0; i < character.effects.length; i++) {
                        this._createEffect(character.effects[ i ]);
                    }
                }
                Dialog.prototype.show.call(this);
            };

            EffectsDialog.prototype._createEffect = function(effect, isChild) {
                let condition, img, attacker, $effect, i;
                condition = effect.breakdown().condition;
                img = effect.breakdown().condition.image || "../images/symbols/unknown.png";
                attacker = effect.attacker ? effect.attacker.name : "unknown";
                $effect = jQuery(`<tr>
                    <td class="indent"><img src="${img}"/></td>
                    <td class="indent">${effect.name}</td>
                    <td class="indent">${effect.amount}</td>
                    <td class="indent">${effect.type}</td>
                    <td class="indent">${effect.duration}</td>
                    <td class="indent">${effect.saveEnds}</td>
                    <td class="indent">${attacker}</td>
                    <td><button class="js-remove">Remove</button></td>
                </tr>`);
                $effect.data("effect", effect);
                $effect.addClass(isChild ? "child" : "parent");
                $effect.appendTo(this.$tbody);
                if (effect.children && effect.children.length) {
                    for (i = 0; i < effect.children.length; i++) {
                        this._createEffect(effect.children[ i ], true);
                    }
                }
            };

            EffectsDialog.prototype._onReady = function() {
                let callback, show;
                callback = this.callback;
                show = this.show.bind(this);
                this.$body = this.$dialog.find(".body");
                this.$tbody = this.$dialog.find("tbody");
                this._onOkButtonClick = this.hide.bind(this);
                this.$body.on("click.effectsDialog", ".js-remove", function removeEffect() {
                    let effect, character;
                    effect = jQuery(this).closest("tr").data("effect");
                    if (effect) {
                        character = effect.target;
                        effect.remove();
                        callback({ type: "updateActor", id: character.id, name: character.name, hp: { temp: character.hp.temp, current: character.hp.current }, effects: character.effects });
                        show(character);
                    }
                });
            };

            EffectsDialog.prototype._onShow = function() {
            };

            return EffectsDialog;
        },
        true
    );

})();