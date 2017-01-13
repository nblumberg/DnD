/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Killtr",
        [ "creature.helpers", "party.level", "jQuery", "html" ],
        function(CH, partyLevel, jQuery, descriptions) {
            var Killtr;
            partyLevel = 1;
            Killtr = {
                isPC: true,
                level: partyLevel,
                abilities: {
                    STR: 11,
                    CON: 14,
                    DEX: 18,
                    INT: 10,
                    WIS: 10,
                    CHA: 14
                },
                ap: 1,
                hp: {
                },
                surges: {
                    perDay: 8,
                    current: 8
                },
                defenses: {
                    ac: 17,
                    fort: 14,
                    ref: 16,
                    will: 14
                },
                init: 4,
                speed: 6,
                weapons: [],
                "implements": [],
                effects: []
            };
            Killtr.hp.total = 10 + Killtr.abilities.CON + (5 * (partyLevel - 1));
            Killtr.skills = CH.skills(Killtr, {
                arcana: 5,
                athletics: 5,
                bluff: 5,
                perception: 5,
                stealth: 5,
                thievery: 5
            });
            Killtr = jQuery.extend(true, {}, Killtr, {
                name: "Killtr",
                image: "http://2.bp.blogspot.com/-05EhZ_6MXUg/Uiol2x8FvuI/AAAAAAAABH8/7kXdLmwpAzE/s1600/Rogue.png", // http://2.bp.blogspot.com/-05EhZ_6MXUg/Uiol2x8FvuI/AAAAAAAABH8/7kXdLmwpAzE/s1600/Rogue.png
                ap: 1,
                surges: {
                    perDay: 8,
                    current: 8
                },
                weapons: [
                    {
                        name: "Repeating Crossbow",
                        isMelee: false,
                        enhancement: 0,
                        proficiency: 2,
                        damage: {
                            amount: "1d6",
                            crit: "0"
                        }
                    }, {
                        name: "Longsword",
                        isMelee: true,
                        enhancement: 0,
                        proficiency: 3,
                        damage: {
                            amount: "1d8",
                            crit: "0"
                        }
                    }
                ],
                attacks: [
                    CH.meleeBasic,
                    CH.rangedBasic,
                    new CH.Power({
                        name: "Executioner's Noose",
                        toHit: "DEX",
                        defense: "Fort",
                        damage: { amount: "1d6+DEX", type: "force" },
                        effects: [ { name: "Slowed", duration: "endAttackerNext" } ],
                        keywords: [
                            "force", "implement", "shadow"
                        ]
                    }).atWill().ranged(),
                    new CH.Power({
                        name: "Leaping Shade",
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+DEX",
                        keywords: [
                            "weapon", "shadow"
                        ]
                    }).atWill().melee(),
                    new CH.Power({
                        name: "Assassin's Shroud",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "1d8", // Lethal Shroud
                        keywords: [
                            "shadow"
                        ]
                    }).atWill().melee(),
                    new CH.Power({
                        name: "Color Orb",
                        toHit: "DEX",
                        defense: "Will",
                        damage: "1d8+DEX",
                        effects: [
                            { name: "dazed", duration: "endAttackerNext" }
                        ],
                        keywords: [
                            "arcane", "implement", "radiant"
                        ]
                    }).encounter().ranged(),
                    new CH.Power({
                        name: "Gloom Thief",
                        toHit: "DEX",
                        defense: "AC",
                        damage: "2[W]+DEX",
                        keywords: [
                            "weapon", "shadow"
                        ]
                    }).encounter().melee(),
                    new CH.Power({
                        name: "Targeted for Death",
                        toHit: "DEX",
                        defense: "Will",
                        damage: {  amount: "3d8+DEX", type: "cold" },
                        miss: {
                            halfDamage: true
                        },
                        keywords: [
                            "cold", "implement", "shadow"
                        ]
                    }).daily().ranged()
                ],
                buffs: [
                    new CH.Power({
                        name: "Heroic Effort"
                    }).encounter(),
                    new CH.Power({
                        name: "Shade Form",
                        keywords: [ "shadow" ]
                    }).encounter()
                ]
            });
            return Killtr;
        },
        false
    );

})();