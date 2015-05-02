/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.spitting_troll",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Spitting Troll", level: 10, image: "../images/portraits/spitting_troll.jpg", // "http://www.wizards.com/dnd/images/dx20050907a_91226.jpg",
                hp: { total: 106, regeneration: 10 },
                defenses: { ac: 26, fort: 22, ref: 22, will: 23 },
                init: 12, speed: { walk: 6, climb: 4 },
                abilities: { STR: 16, CON: 18, DEX: 21, INT: 10, WIS: 17, CHA: 13 },
                skills: { acrobatics: 0, arcana: 0, athletics: 13, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 14, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 8, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Claw", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: [ "1d6+5", { amount: "1d6", type: "poison" } ], keywords: [ "melee", "basic" ] },
                    { name: "Javelin", usage: { frequency: "At-Will" }, range: "ranged", toHit: 17, defense: "AC", damage: [ "1d6+5", { amount: "1d6", type: "poison" } ], keywords: [ "ranged", "basic" ] },
                    { name: "Acid Spit", usage: { frequency: "At-Will" }, range: "ranged", toHit: 15, defense: "Ref", damage: { amount: "1d6", type: "acid" }, keywords: [ "ranged" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);