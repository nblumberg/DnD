/**
 * Created by nblumberg on 6/30/15.
 */

(function () {
    "use strict";
    DnD.define(
        "creatures.monsters.drow_underling",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Drow Underling", level: 15, image: "../images/portraits/drow.jpg",
                hp: { total: 1 },
                defenses: { ac: 28, fort: 24, ref: 27, will: 26 },
                init: 15, speed: 6,
                abilities: { STR: 16, CON: 13, DEX: 23, INT: 13, WIS: 14, CHA: 20 },
                skills: { perception: 9 },
                attacks: [
                    { name: "Short Sword", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: "6", keywords: [ "melee", "basic", "weapon" ] },
                    { name: "Thrown Dagger", usage: { frequency: "At-Will" }, target: { range: 5 }, toHit: 19, defense: "AC", damage: { amount: "6", type: "poison" }, keywords: [ "ranged", "basic", "poison", "weapon" ] }
                ],
                buffs: [
                    { name: "Darkfire Sacrifice", effects: [ { name: "multiple", children: [ { name: "ignore concealment" }, { name: "bonus", amount: 2, type: "attack" } ], duration: "startAttackerNext" } ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);