/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.frost_giant",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Frost Giant", level: 17, image: "../images/portraits/frost_giant.png",
                hp: { total: 201 },
                defenses: { ac: 29, fort: 32, ref: 27, will: 28 },
                resistances: { cold: 15 },
                init: 11, speed: { walk: 8 },
                abilities: { STR: 23, CON: 21, DEX: 16, INT: 10, WIS: 20, CHA: 12 },
                skills: { athletics: 19, perception: 13 },
                attacks: [
                    { name: "Icy Greataxe", usage: { frequency: "At-Will" }, target: { range: 2 }, range: "melee", toHit: 20, defense: "AC", damage: { amount: "4d6+7", type: "cold" }, crit: { amount: "8d6+31", type: "cold" }, keywords: [ "melee", "basic", "cold", "weapon" ] },
                    { name: "Icy Handaxe", usage: { frequency: "At-Will" }, target: { range: 5 }, toHit: 20, defense: "AC", damage: { amount: "2d8+7", type: "cold" }, keywords: [ "ranged", "basic", "cold", "weapon" ] },
                    { name: "Chilling Strike", usage: { frequency: "Recharge", recharge: 5 }, target: { range: 2 }, range: "melee", toHit: 20, defense: "AC", damage: { amount: "2d6+7", type: "cold" }, effects: [
                        { name: "Vulnerable", amount: 10, type: "cold", saveEnds: true }
                    ], keywords: [ "melee", "cold", "weapon" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);