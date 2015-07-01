/**
 * Created by nblumberg on 7/1/15.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.thunderfury_boar",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Thunderfury Boar", level: 15, image: "../images/portraits/boar.jpg",
                hp: { total: 182 },
                defenses: { ac: 27, fort: 29, ref: 20, will: 20 },
                init: 9, speed: 8,
                abilities: { STR: 23, CON: 22, DEX: 15, INT: 5, WIS: 12, CHA: 9 },
                skills: { perception: 8 },
                attacks: [
                    { name: "Gore", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "AC", damage: "2d8+7", keywords: [ "melee", "basic" ] },
                    { name: "Gore (bloodied)", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "AC", damage: "3d8+7", keywords: [ "melee", "basic" ] },
                    { name: "Thunderfury", usage: { frequency: "Recharge", recharge: 5 }, target: { area: "close burst", size: 2 }, toHit: 17, defense: "Fort", damage: { amount: "2d8+6", type: "thunder" }, effects: [ "Prone" ], miss: { halfDamage: true }, keywords: [ "close burst", "thunder" ] },
                    { name: "Thunderous Charge", usage: { frequency: "At-Will" }, range: "melee", toHit: "automatic", defense: "AC", damage: { amount: "10", type: "thunder" }, keywords: [ "melee", "charge", "thunder" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);