/**
 * Created by nblumberg on 11/05/16.
 */

(function () {
    "use strict";

    DnD.define(
        "Dart",
        [ "creature.helpers", "party.level", "jQuery", "html" ],
        function(CH, partyLevel, jQuery, descriptions) {
            var Dart;
            Dart = {
                name: "Dart",
                isPC: true,
                level: partyLevel,
                image: "../images/portraits/Dart.png", // http://rs997.pbsrc.com/albums/af94/garryypicture/Games/RacePortRevenant.png~c200Dart
                abilities: {
                    STR: 16,
                    CON: 24,
                    DEX: 19,
                    INT: 13,
                    WIS: 14,
                    CHA: 20
                },
                ap: 1,
                hp: {
                },
                surges: {
                    perDay: 16,
                    current: 16
                },
                defenses: {
                    ac: 37,
                    fort: 30,
                    ref: 29,
                    will: 32
                },
                resistances: {
                    necrotic: 10, // Lifegiving Plate Armor +4
                    poison: 10
                },
                init: 13,
                speed: 5,
                weapons: [
                    {
                        name: "Jagged Broadsword +4",
                        category: "heavy blade",
                        isMelee: true,
                        enhancement: 4,
                        proficiency: 2,
                        damage: {
                            amount: "1d10",
                            crit: "0" // TODO: ongoing 10 damage (save ends)
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

                    new CH.Power({
                        name: "Battlemind's Demand",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "0",
                        effects: [ { name: "Marked", duration: "startAttackerNext" } ], // TODO: duration should be end of encounter or until this power is used again
                        keywords: [ "augmentable", "psionic" ]
                    }).atWill().minor().ranged({ range: 5, area: "closeBurst", targets: 1 }), // range 5 due to Deman's Reach feat
                    new CH.Power({
                        name: "Battlemind's Demand (1 augment)",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "0",
                        effects: [ { name: "Marked", duration: "startAttackerNext" } ], // TODO: duration should be end of encounter or until this power is used again
                        keywords: [ "augmentable", "psionic" ],
                        description: descriptions[ "Battlemind's Demand" ]
                    }).atWill().minor().ranged({ range: 5, area: "closeBurst", targets: 2 }), // range 5 due to Deman's Reach feat

                    new CH.Power({
                        name: "Mind Spike",
                        toHit: "automatic",
                        defense: "AC",
                        damage: { amount: "1[W]", type: [ "force", "psychic" ] }, // TODO: should be the amount of damage the target dealt to an ally
                        effects: [ { name: "Marked", duration: "startAttackerNext" } ], // TODO: duration should be end of encounter or until this power is used again
                        keywords: [ "force", "psionic", "psychic" ]
                    }).atWill().immediateReaction().melee(),

                    new CH.Power({
                        name: "Lightning Rush",
                        toHit: "CON",
                        defense: "AC",
                        damage: "1[W]+CON",
                        keywords: [ "augmentable", "psionic", "weapon" ]
                    }).atWill().immediateInterrupt().melee(),
                    new CH.Power({
                        name: "Lightning Rush (1 augment)",
                        toHit: "CON",
                        defense: "AC",
                        damage: "1[W]+CON",
                        effects: [
                            {
                                name: "penalty",
                                amount: 4, // TODO: amount should be CHA
                                type: "attacks",
                                duration: "startTargetNext" // TODO: duration should be just the next attack
                            }
                        ],
                        keywords: [ "augmentable", "psionic", "weapon" ],
                        description: descriptions[ "Lightning Rush" ]
                    }).atWill().immediateInterrupt().melee(),
                    new CH.Power({
                        name: "Lightning Rush (2 augment)",
                        toHit: "CON",
                        defense: "AC",
                        damage: "2[W]+CON",
                        effects: [
                            {
                                name: "penalty",
                                amount: 4, // TODO: amount should be CHA
                                type: "attacks",
                                duration: "startTargetNext" // TODO: duration should be just the next attack
                            }
                        ],
                        keywords: [ "augmentable", "psionic", "weapon" ],
                        description: descriptions[ "Lightning Rush" ]
                    }).atWill().immediateInterrupt().melee(),

                    new CH.Power({
                        name: "Intellect Snap",
                        toHit: "CON",
                        defense: "Will",
                        damage: { amount: "CON", type: "psychic" },
                        effects: [ { name: "Dazed", duration: "startAttackerNext" } ],
                        keywords: [ "augmentable", "psionic", "psychic", "weapon" ]
                    }).atWill().melee(),
                    new CH.Power({
                        name: "Intellect Snap (1 augment)",
                        toHit: "CON",
                        defense: "Will",
                        damage: { amount: "CON", type: "psychic" },
                        effects: [ { name: "Dazed", duration: "startAttackerNext" } ], // TODO: stops self dazed/marked
                        keywords: [ "augmentable", "psionic", "psychic", "weapon" ],
                        description: descriptions[ "Intellect Snap" ]
                    }).atWill().melee(),
                    new CH.Power({
                        name: "Intellect Snap (4 augment)",
                        toHit: "CON",
                        defense: "Will",
                        damage: { amount: "2[W]+CON", type: "psychic" },
                        effects: [ { name: "Dazed", duration: "endAttackerNext" } ], // TODO: you or ally save vs. dazed/stunned
                        keywords: [ "augmentable", "psionic", "psychic", "weapon" ],
                        description: descriptions[ "Intellect Snap" ]
                    }).atWill().melee(),

                    new CH.Power({
                        name: "Ruinous Grasp",
                        toHit: "CON",
                        defense: "AC",
                        damage: "1[W]+CON",
                        //effects: [], // TODO: slide marked creature 3
                        keywords: [ "augmentable", "psionic", "weapon" ],
                        description: descriptions[ "Ruinous Grasp" ]
                    }).atWill().melee(),
                    new CH.Power({
                        name: "Ruinous Grasp (1 augment)",
                        toHit: "CON",
                        defense: "AC",
                        damage: "1[W]+CON",
                        //effects: [], // TODO: slide marked creature 3, you shift 1 & gain +2 power bonus to 1 defense of your choice endAttackerNext
                        keywords: [ "augmentable", "psionic", "weapon" ],
                        description: descriptions[ "Ruinous Grasp" ]
                    }).atWill().melee(),
                    new CH.Power({
                        name: "Ruinous Grasp (4 augment)",
                        toHit: "CON",
                        defense: "AC",
                        damage: "2[W]+CON",
                        effects: [ { name: "Immobilized", duration: "endAttackerNext" } ], // TODO: push target creature CHA, slide target 1 as free action whenever you take damage
                        keywords: [ "augmentable", "psionic", "weapon" ],
                        description: descriptions[ "Ruinous Grasp" ]
                    }).atWill().melee(),

                    new CH.Power({
                        name: "Cunning Abduction",
                        toHit: "CON",
                        defense: "AC",
                        damage: "2[W]+CON",
                        keywords: [ "augmentable", "psionic", "teleportation", "weapon" ],
                        description: descriptions[ "Cunning Abduction" ]
                    }).encounter().melee(),
                    new CH.Power({
                        name: "Cunning Abduction (2 augment)",
                        toHit: "CON",
                        defense: "AC",
                        damage: "2[W]+CON",
                        effects: [ { name: "Dazed", duration: "endAttackerNext" } ],
                        keywords: [ "augmentable", "psionic", "teleportation", "weapon" ],
                        description: descriptions[ "Cunning Abduction" ]
                    }).encounter().melee(),

                    new CH.Power({
                        name: "Dark Reaping",
                        toHit: "automatic",
                        defense: "AC",
                        damage: { amount: "1d8+CON", type: "necrotic" },
                        keywords: [ "necrotic" ]
                    }).encounter().free().melee(),
                    new CH.Power({
                        name: "Mark of the Vigilante",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "0",
                        effects: [ { name: "Marked", duration: "endAttackerNext" } ],
                        keywords: [ "fear", "stance" ]
                    }).encounter().free().melee(),

                    new CH.Power({
                        name: "Psionic Anchor",
                        toHit: "CON",
                        defense: "AC",
                        damage: { amount: "2[W]+CON" },
                        miss: {
                            halfDamage: true
                        },
                        keywords: [ "psionic", "teleportation", "weapon" ]
                    }).daily().melee(),

                    new CH.Power({
                        name: "Fated Confrontation (secondary)",
                        toHit: "CON",
                        defense: "AC",
                        damage: { amount: "3[W]+CON" },
                        effects: [ { name: "Marked", duration: "endAttackerNext" } ],
                        miss: {
                            halfDamage: true,
                            effects: [ { name: "Marked", duration: "endAttackerNext" } ]
                        },
                        keywords: [ "psionic", "teleportation" ],
                        description: descriptions[ "Fated Confrontation" ]
                    }).daily().ranged({ range: 5 }),

                    new CH.Power({
                        name: "Precognitive Eye",
                        toHit: "CON",
                        defense: "AC",
                        damage: { amount: "2[W]+CON" },
                        effects: [ { name: "Marked" } ], // TODO: duration should be end of encounter
                        miss: {
                            halfDamage: true,
                            effects: [ { name: "Marked", duration: "endAttackerNext" } ]
                        },
                        keywords: [ "psionic", "stance", "weapon" ]
                    }).daily().melee(),
                    new CH.Power({
                        name: "Warning Premonition", // TODO: no longer surprised, shift 1/2 speed & mark 1 adjacent creature
                        toHit: "automatic",
                        defense: "AC",
                        damage: "0",
                        effects: [ { name: "Marked", duration: "endAttackerNext" } ],
                        keywords: [ "psionic" ]
                    }).daily().noAction().melee(),

                    new CH.Power({
                        name: "Bracers of Tactical Blows",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "1d6",
                        keywords: []
                    }).daily().noAction().melee()
                ],
                buffs: [
                    new CH.Power({
                        name: "Mark of the Vigilante",
                        // effects: [ // TODO: only applies to opportunity attack that you provoke by moving
                        //     {
                        //         name: "multiple",
                        //         children: [
                        //             { name: "bonus", amount: 2, type: "ac" },
                        //             { name: "bonus", amount: 2, type: "fort" },
                        //             { name: "bonus", amount: 2, type: "ref" },
                        //             { name: "bonus", amount: 2, type: "will" }
                        //         ]
                        //     }
                        // ],
                        keywords: [ "fear", "stance" ]
                    }).encounter().free().melee(),
                    new CH.Power({
                        name: "Speed of Thought", // TODO: on initiative move 3+CHA squares
                        keywords: [ "psionic" ]
                    }).encounter().free().melee(), // TODO: personal range
                    new CH.Power({
                        name: "Dimension Slide",
                        healing: {
                            isTempHP: true,
                            usesHealingSurge: false,
                            amount: "0"
                        }
                    }).encounter().move().ranged({ range: 5, targets: 2 }), // you and 1 ally
                    new CH.Power({
                        name: "Uncanny Senses",
                        effects: [ {
                            name: "Uncanny Senses", // TODO: see invisible creatures & objects, +5 power to Insight & Perception
                            duration: "endAttackerNext"
                        } ],
                        keywords: [ "psionic" ]
                    }).encounter().minor().melee(), // TODO: personal range
                    new CH.Power({
                        name: "Warning Premonition", // TODO: no longer surprised, shift 1/2 speed
                        keywords: [ "psionic" ]
                    }).daily().noAction().melee(), // TODO: personal range
                    new CH.Power({
                        name: "One Hundred Doors", // TODO: summon reusable moving teleportation portal
                        keywords: [ "conjuration", "psionic", "teleportation" ]
                    }).daily().immediateReaction().melee(), // TODO: personal range
                    new CH.Power({
                        name: "Mind of Endurance",
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: true,
                            amount: "HS"
                        },
                        effects: [ { name: "regeneration", amount: 5, duration: "10" } ], // TODO: duration is encounter
                        keywords: [ "healing", "psionic" ]
                    }).daily().minor(),
                    new CH.Power({
                        name: "Circlet of Second Chances", // TODO: reroll a save
                        keywords: []
                    }).daily().noAction(),
                    new CH.Power({
                        name: "Guardian's Whistle", // TODO: teleport an ally to you
                        keywords: [ "teleportation" ]
                    }).daily().move(),
                    new CH.Power({
                        name: "Lifegiving Plate Armor +4",
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: false,
                            amount: "30"
                        },
                        keywords: [ "healing" ],
                        description: descriptions[ "Lifegiving Armor" ]
                    }).daily().minor(),
                    new CH.Power({
                        name: "Stalwart Belt",
                        healing: {
                            isTempHP: true,
                            usesHealingSurge: false,
                            amount: "CON"
                        },
                        keywords: []
                    }).daily().noAction(),
                    new CH.Power({
                        name: "Eladrin Ring of Passage", // TODO: teleport 6
                        keywords: [ "teleportation" ]
                    }).daily().move(),
                    new CH.Power({
                        name: "Eladrin Boots", // TODO: teleport 10
                        keywords: [ "teleportation" ]
                    }).daily().move(),
                    new CH.Power({
                        name: "Cloak of Translocation +2", // TODO: regain a encounter teleportation power
                        keywords: [],
                        description: descriptions[ "Cloak of Translocation" ]
                    }).daily().minor()
                ]
            };
            Dart.attackBonuses = [
            ];
            Dart.hp.total = 15 + Dart.abilities.CON + (6 * (partyLevel - 1));
            Dart.skills = CH.skills(Dart, {
                bluff: 5, // trained
                history: 5, // trained
                intimidate: 5 // trained
            });
            return Dart;
        },
        false
    );

})();