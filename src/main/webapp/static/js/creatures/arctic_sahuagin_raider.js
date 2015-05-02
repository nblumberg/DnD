/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.arctic_sahuagin_raider",
        [ "jQuery", "Creature", "creatures.monsters.arctic_sahuagin_base" ],
        function(jQuery, Creature, base) {
            var o = {
                name: "Arctic Sahuagin Raider", level: 11, image: "../images/portraits/arctic_sahuagin.jpg",
                hp: { total: 112 },
                defenses: { ac: 27, fort: 24, ref: 23, will: 22 },
                resistances: { cold: 10 },
                init: 11, speed: { walk: 5, swim: 5, charge: 7 },
                abilities: { STR: 20, CON: 14, DEX: 14, INT: 10, WIS: 12, CHA: 10 },
                skills: { perception: 8 },
                attackBonuses: base.attackBonuses,
                attacks: [
                    { name: "Trident", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "AC", damage: [
                        { amount: "1d8+5" },
                        { amount: "1d8", type: "cold" }
                    ], effects: [
                        { name: "Marked", duration: "endAttackerNext" }
                    ], keywords: [ "melee", "basic", "cold", "weapon" ] },
                    { name: "Javelin", usage: { frequency: "At-Will" }, range: 10, toHit: 18, defense: "AC", damage: { amount: "2d6+5" }, keywords: [ "ranged", "weapon" ] }
                ]
            };
            return jQuery.extend(true, {}, base, o);
        },
        false
    );
})(window.DnD);