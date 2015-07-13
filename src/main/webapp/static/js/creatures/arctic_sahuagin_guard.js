/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.arctic_sahuagin_guard",
        [ "jQuery", "Creature", "creatures.monsters.base.arctic_sahuagin" ],
        function(jQuery, Creature, base) {
            var o = {
                name: "Arctic Sahuagin Guard", level: 11, image: "../images/portraits/sahuagin.png",
                hp: { total: 1 },
                defenses: { ac: 27, fort: 24, ref: 23, will: 22 },
                immunities: [ "cold" ],
                init: 11, speed: { walk: 5, swim: 6, charge: 7 },
                abilities: { STR: 16, CON: 14, DEX: 14, INT: 10, WIS: 12, CHA: 10 },
                skills: { perception: 7 },
                attacks: [
                    { name: "Trident", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "AC", damage: { amount: "7" }, effects: [
                        { name: "Marked", duration: "endAttackerNext" }
                    ], keywords: [ "melee", "basic", "cold", "weapon" ] },
                    { name: "Javelin", usage: { frequency: "At-Will" }, range: 10, toHit: 18, defense: "AC", damage: { amount: "7" }, keywords: [ "ranged", "weapon" ] }
                ]
            };
            return jQuery.extend(true, {}, base, o);
        },
        false
    );
})(window.DnD);