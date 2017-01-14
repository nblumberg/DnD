/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.haryssus",
        [ "jQuery", "Creature", "creature.helpers", "creatures.monsters.eldritch_giant" ],
        function(jQuery, Creature, CH, base) {
            return jQuery.extend(true, {}, base, { name: "Haryssus" });
        },
        false
    );
})(window.DnD);