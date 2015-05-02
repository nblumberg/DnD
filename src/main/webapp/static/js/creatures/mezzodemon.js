/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.mezzodemon",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Mezzodemon", level: 11, image: "../images/portraits/mezzodemon.jpg",
                hp: { total: 113 },
                defenses: { ac: 27, fort: 25, ref: 22, will: 23 },
                init: 9, speed: { walk: 6 },
                abilities: { STR: 20, CON: 17, DEX: 15, INT: 10, WIS: 16, CHA: 13 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 11, nature: 0, perception: 13, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Trident", usage: { frequency: "At-Will" }, range: 2, toHit: 18, defense: "AC", damage: "1d8+5", keywords: [ "melee", "basic" ] },
                    { name: "Skewering Tines", usage: { frequency: "At-Will" }, range: 2, toHit: 18, defense: "AC", damage: "1d8+5", effects: [
                        { name: "multiple", saveEnds: true, children: [
                            { name: "Ongoing damage", amount: 5 },
                            "Restrained"
                        ] }
                    ], keywords: [ "ranged", "basic" ] },
                    { name: "Poison Breath", usage: { frequency: "Recharge", recharge: 5 }, range: "blast 3", toHit: 16, defense: "Fort", damage: { amount: "2d6+3", type: "poison" }, effects: [
                        { name: "Ongoing damage", type: "poison", amount: 5, saveEnds: true }
                    ], keywords: [ "ranged", "poison" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);