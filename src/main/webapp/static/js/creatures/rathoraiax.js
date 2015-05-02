/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.rathoraiax",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Rathoraiax", level: 13, image: "../images/portraits/zombie_dragon.jpg", // http://4.bp.blogspot.com/-rclvSPUh9iM/ToBowVvsz_I/AAAAAAAADKI/wwQ5VTfwAeU/s1600/02-The-Dragons_Zombie-Dragon.jpg
                hp: { total: 328 },
                defenses: { ac: 27, fort: 29, ref: 22, will: 24 },
                resistances: { necrotic: 15 },
                vulnerabilities: { radiant: 15 },
                immunities: [ "disease", "poison" ],
                savingThrows: 2,
                init: 5, speed: { walk: 4, fly: 8 },
                abilities: { STR: 22, CON: 24, DEX: 9, INT: 1, WIS: 16, CHA: 3 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 9, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Claw", usage: { frequency: "At-Will" }, range: "reach", toHit: 16, defense: "AC", damage: "2d10+6", effects: [ "Prone"], keywords: [ "melee", "basic" ] },
                    { name: "Tail Crush", usage: { frequency: "At-Will" }, range: "reach", toHit: 14, defense: "Fort", damage: "3d8+6", keywords: [ "melee", "prone" ] },
                    { name: "Breath of the Grave", usage: { frequency: "Encounter" }, range: 5, toHit: 14, defense: "Fort", damage: { amount: "4d10+6", type: [ "poison", "necrotic" ] }, effects: [
                        { name: "multiple", saveEnds: true, children: [
                            { name: "Ongoing necrotic", amount: 10 },
                            "Weakened"
                        ] }
                    ], keywords: [ "close blast", "necrotic", "poison" ] },
                    { name: "Loose stones", usage: { frequency: "At-Will" }, range: 1, toHit: 14, defense: "Ref", damage: "2d6+10", effects: [ "Prone" ], keywords: [ "burst" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);