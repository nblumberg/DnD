/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.elder_troglodyte_curse_chanter",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Elder Troglodyte Curse Chanter", level: 12, image: "../images/portraits/troglodyte_curse_chanter.jpg",
                hp: { total: 127 },
                defenses: { ac: 27, fort: 26, ref: 21, will: 26 },
                init: 7, speed: 5,
                abilities: { STR: 16, CON: 23, DEX: 12, INT: 10, WIS: 19, CHA: 15 },
                skills: { dungeoneering: 15, endurance: 17, perception: 15, religion: 11 },
                attacks: [
                    { name: "Quarterstaff", usage: { frequency: "At-Will" }, range: "melee", toHit: 16, defense: "AC", damage: "1d8+4", keywords: [ "melee", "basic" ] },
                    { name: "Claw", usage: { frequency: "At-Will" }, range: "melee", toHit: 14, defense: "AC", damage: "1d4+4", keywords: [ "melee", "basic" ] },
                    { name: "Poison Ray", usage: { frequency: "At-Will" }, range: 10, toHit: 15, defense: "Fort", damage: { amount: "1d8+6", type: "poison" }, effects: [
                        { name: "Weakened", saveEnds: true }
                    ], keywords: [ "ranged", "poison" ] },
                    { name: "Cavern Curse", usage: { frequency: "Recharge", recharge: 3 }, range: 5, toHit: 16, defense: "Fort", damage: "0", effects: [
                        { name: "multiple", saveEnds: true, children: [
                            { name: "ongoing damage", amount: 5, type: "necrotic" },
                            { name: "Slowed" }
                        ] }
                    ], keywords: [ "ranged", "necrotic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);