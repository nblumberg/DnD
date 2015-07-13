/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.troll_vinespeaker",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Troll Vinespeaker", level: 14, image: "../images/portraits/troll.jpg", // "http://www.wizards.com/dnd/images/MM35_gallery/MM35_PG248a.jpg",
                hp: { total: 142, regeneration: 10 },
                defenses: { ac: 28, fort: 26, ref: 23, will: 21 },
                init: 10, speed: 8,
                abilities: { STR: 18, CON: 22, DEX: 16, INT: 16, WIS: 12, CHA: 10 },
                skills: { athletics: 16, endurance: 16, perception: 13 },
                attacks: [
                    { name: "Claw", usage: { frequency: "At-Will" }, range: 2, toHit: 19, defense: "AC", damage: "2d6+7", keywords: [ "melee", "basic" ] },
                    { name: "Frenzied Strike", usage: { frequency: "At-Will" }, range: 2, toHit: 19, defense: "AC", damage: "2d6+7", keywords: [ "melee" ] },
                    { name: "Ray of Thorns", usage: { frequency: "At-Will" }, range: 10, toHit: 18, defense: "Ref", damage: "2d8+6", keywords: [ "ranged" ] },
                    { name: "Thorny Burst", usage: { frequency: "At-Will" }, target: { area: "burst", size: 1, range: 10 }, toHit: 18, defense: "Ref", damage: "1d10+6", effects: [ { name: "immobilized", saveEnds: true } ], keywords: [ "burst", "zone" ] },
                    { name: "Thorny Burst (zone)", usage: { frequency: "At-Will" }, target: { area: "burst", size: 1, range: 10 }, toHit: "automatic", defense: "Ref", damage: "1d8", keywords: [ "burst", "zone" ] }
                ],
                buffs: [
                    {
                        name: "Chant of Power",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: { area: "close", size: 5 },
                        healing: {
                            isTempHP: true,
                            usesHealingSurge: false,
                            amount: "10"
                        },
                        effects: [
                            { name: "bonus", amount: 4, type: "damage" }
                        ],
                        keywords: [ "ranged" ]
                    }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);