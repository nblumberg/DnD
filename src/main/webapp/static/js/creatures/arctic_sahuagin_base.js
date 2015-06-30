/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.base.arctic_sahuagin",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                attackBonuses: [
                    {
                        name: "Blood Frenzy",
                        foeStatus: [
                            "bloodied"
                        ],
                        toHit: 1,
                        damage: 2
                    }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);