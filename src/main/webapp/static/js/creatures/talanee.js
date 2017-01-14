/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.talanee",
        [ "jQuery", "Creature", "creature.helpers", "creatures.monsters.githyanki_astraan" ],
        function(jQuery, Creature, CH, base) {
            return jQuery.extend(true, {}, base, {
                name: "Talanee",
                image: "../images/portraits/talanee.jpg", // http://orig05.deviantart.net/8c99/f/2014/058/d/9/githyanki_by_goatlord51-d6r91kt.jpg
            });
        },
        false
    );
})(window.DnD);