/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.dragonborn_base",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                attackBonuses: [
                    {
                        name: "Dragonborn Fury",
                        status: [
                            "bloodied"
                        ],
                        toHit: 1
                    }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);