/**
 * Created by nblumberg on 11/05/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Bierdon",
        [ "creature.helpers", "party.level", "jQuery", "html" ],
        function(CH, partyLevel, jQuery, descriptions) {
            var Bierdon;
            Bierdon = {
                name: "Bierdon",
                isPC: true,
                level: partyLevel,
                image: "../images/portraits/bierdon.jpg", // http://cdn.obsidianportal.com/images/336089/mul.jpg
                abilities: {
                    STR: 22,
                    CON: 18,
                    DEX: 14,
                    INT: 9,
                    WIS: 14,
                    CHA: 12
                },
                ap: 1,
                hp: {
                },
                surges: {
                    perDay: 16,
                    current: 38
                },
                defenses: {
                    ac: 31,
                    fort: 30, // Mark of Warding
                    ref: 24, // Mark of Warding
                    will: 24, // Mark of Warding
                },
                resistances: {
                    all: 4 // Ironwrought level 5 feature, 6 at 21st level
                },
                init: 14, // Improved Initiative
                speed: 5 + 1, // Quick steps
                weapons: [
                    {
                        name: "Double axe of Defense +4",
                        category: "axes",
                        isMelee: true,
                        enhancement: 4,
                        proficiency: 2,
                        damage: {
                            amount: "1d10",
                            crit: "4d6"
                        }
                    },
                    {
                        name: "Magic Longbow +2",
                        category: "bows",
                        isMelee: false,
                        enhancement: 2,
                        proficiency: 2,
                        damage: {
                            amount: "1d10",
                            crit: "2d6"
                        }
                    }
                ],
                "implements": [
                ],
                attackBonuses: [
                ],
                attacks: [
                    CH.meleeBasic,
                    CH.rangedBasic,
                    new CH.Power(jQuery.extend({}, CH.meleeBasic, {
                        name: "Combat Challenge",
                        keywords: [ "weapon" ]
                    })).atWill().melee(),
                    new CH.Power({
                        name: "Cleave",
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]+STR",
                        keywords: [ "weapon" ]
                    }).atWill().melee(),
                    new CH.Power({
                        name: "Cleave (secondary)",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "STR",
                        keywords: [ "weapon" ]
                    }).atWill().melee(),
                    new CH.Power({
                        name: "Dual Strike",
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]",
                        keywords: [ "weapon" ]
                    }).atWill().melee(),

                    new CH.Power({
                        name: "Inevitable Strike",
                        toHit: "STR",
                        defense: "AC",
                        damage: "2d8",
                        keywords: [ "elemental", "weapon" ]
                    }).encounter().melee(),
                    new CH.Power({
                        name: "Hack and Hew",
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]+STR",
                        keywords: [ "invigorating", "martial", "weapon" ]
                    }).encounter().melee(),
                    new CH.Power({
                        name: "Hack and Hew (secondary)",
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]+STR",
                        keywords: [ "invigorating", "martial", "weapon" ]
                    }).encounter().melee(),
                    new CH.Power({
                        name: "Come and Get It",
                        toHit: "STR",
                        defense: "Will",
                        damage: "1[W]",
                        keywords: [ "martial", "weapon" ]
                    }).encounter().closeBurst(2, true),
                    new CH.Power({
                        name: "Driven Before You",
                        toHit: "STR",
                        defense: "AC",
                        damage: "2[W]+STR",
                        keywords: [ "invigorating", "martial", "weapon" ]
                    }).encounter().melee(),
                    new CH.Power({
                        name: "Bash and Pummel",
                        toHit: "STR",
                        defense: "AC",
                        damage: "2[W]+STR",
                        effects: [ { name: "Dazed", duration: "endAttackerNext" } ],
                        keywords: [ "invigorating", "martial", "weapon" ]
                    }).encounter().melee(),
                    new CH.Power({
                        name: "Bash and Pummel (secondary)",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "DEX",
                        keywords: []
                    }).encounter().melee(),
                    new CH.Power({
                        name: "Harrying Assault",
                        toHit: "STR",
                        defense: "AC",
                        damage: "2[W]+STR",
                        keywords: [ "martial", "weapon" ]
                    }).encounter().melee(),
                    new CH.Power({
                        name: "Glowering Threat",
                        toHit: "automatic",
                        defense: "Will",
                        damage: "0",
                        effects: [ { name: "attacks", amount: -5, duration: "endAttackerNext" } ],
                        keywords: [ "martial" ]
                    }).encounter().minor().closeBurst(2, true),

                    new CH.Power({
                        name: "Rain of Steel",
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]",
                        keywords: [ "martial", "stance", "weapon" ]
                    }).daily().free(),
                    new CH.Power({
                        name: "Jackal Strike",
                        toHit: "STR",
                        defense: "AC",
                        damage: "3[W]+STR",
                        keywords: [ "martial", "reliable", "weapon" ]
                    }).daily().immediateReaction(),
                    new CH.Power({
                        name: "Unyielding Avalanche",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "1[W]",
                        effects: [ { name: "Slowed", duration: "startTargetNext" } ],
                        keywords: [ "healing", "martial", "stance", "weapon" ]
                    }).daily().free()
                ],
                buffs: [
                    new CH.Power({
                        name: "Incredible Toughness",
                        healing: {
                            isTempHP: true,
                            usesHealingSurge: false,
                            amount: "0"
                        }
                    }).encounter().noAction(),
                    new CH.Power({
                        name: "Ignore Weakness",
                        healing: {
                            isTempHP: true,
                            usesHealingSurge: false,
                            amount: "0"
                        }
                    }).encounter().noAction(),
                    new CH.Power({
                        name: "Weapon Unity",
                        healing: {
                            isTempHP: true,
                            usesHealingSurge: false,
                            amount: "0"
                        },
                        keywords: [ "elemental", "stance" ]
                    }).daily().minor(),
                    new CH.Power({
                        name: "Diehard",
                        healing: {
                            isTempHP: true,
                            usesHealingSurge: false,
                            amount: "0"
                        }
                    }).daily().immediateInterrupt(),
                    new CH.Power({
                        name: "Blood-Soaked Fury",
                        healing: {
                            isTempHP: true,
                            usesHealingSurge: false,
                            amount: "0"
                        },
                        effects: [
                            {
                                name: "multiple",
                                children: [
                                    { name: "penalty", amount: 2, type: "ac" },
                                    { name: "penalty", amount: 2, type: "fort" },
                                    { name: "penalty", amount: 2, type: "ref" },
                                    { name: "penalty", amount: 2, type: "will" },
                                    { name: "bonus", amount: 2, type: "attacks" }
                                ]
                            }
                        ],
                        keywords: [ "healing", "martial", "stance" ]
                    }).daily().immediateReaction(),
                    new CH.Power({
                        name: "Blood-Soaked Fury (healing)",
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: false,
                            amount: "CON"
                        },
                        effects: [
                            {
                                name: "multiple",
                                children: [
                                    { name: "penalty", amount: 2, type: "ac" },
                                    { name: "penalty", amount: 2, type: "fort" },
                                    { name: "penalty", amount: 2, type: "ref" },
                                    { name: "penalty", amount: 2, type: "will" },
                                    { name: "bonus", amount: 2, type: "attacks" }
                                ]
                            }
                        ],
                        keywords: [ "healing", "martial", "stance" ]
                    }).daily().immediateReaction()
                ],
                effects: []
            };
            Bierdon.buffs.push(new CH.Power({
                name: "Unyielding Avalanche",
                effects: [
                    { name: "regeneration", amount: CH.mod(Bierdon.abilities.CON) }, // TODO: implement
                    { name: "bonus", amount: 1, type: "ac" }, // TODO: implement?
                    { name: "bonus", amount: 1, type: "savingThrows" } // TODO: implement
                ],
                keywords: [ "healing", "martial", "stance", "weapon" ]
            }).daily().noAction());
            Bierdon.attackBonuses = [
                {
                    name: "Battlerager Vigor",
                    weapon: "axes",
                    attackerStatus: [ "tempHp" ], // also the character must be wearing light armor or chainmail
                    keywords: [ "melee" ], // or close
                    damage: 2,
                    tempHp: "CON+" + (2 * CH.tier(partyLevel)) // Dwarf Stoneblood
                },
                {
                    name: "Axe Expertise",
                    weapon: "axes",
                    toHit: CH.tier(partyLevel)
                },
                {
                    name: "Weapon Focus (Axe)",
                    weapon: "axes",
                    damage: CH.tier(partyLevel)
                },
                {
                    name: "Combat Challenge",
                    keywords: [
                        "melee"
                    ],
                    effects: [ { name: "Marked", duration: "endAttackerNext" } ]
                }//,
                //{
                //    name: "Combat Superiority",
                //    opportunity: true,
                //    toHit: CH.mod(Bierdon.abilities.WIS)
                //}
            ];
            Bierdon.hp.total = 12 + Bierdon.abilities.CON + (6 * (partyLevel - 1)) + 10; // 10 for Toughness, 15 at 21st level
            Bierdon.skills = CH.skills(Bierdon, {
                athletics: 6, // trained, Ironwrought
                endurance: 6, // trained, Ironwrought
                intimidate: 5 // trained
            });
            return Bierdon;
        },
        false
    );

})();