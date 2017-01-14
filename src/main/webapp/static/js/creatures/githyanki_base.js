/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.base.githyanki",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Githyanki",
                image: "../images/portraits/githyanki.jpg",
                speed: { walk: 5, jump: 5 },
                buffs: [
                    new CH.Power({ name: "Telekinetic Leap" }).encounter().ranged(5)
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);