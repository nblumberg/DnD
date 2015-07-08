/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Festivus",
        [ "creature.helpers", "party.level", "jQuery", "html" ],
        function(CH, partyLevel, jQuery, descriptions) {
            var Festivus;
            Festivus = {
                name: "Festivus",
                isPC: true,
                level: partyLevel,
                image: "../images/portraits/festivus.jpg", // "http://www.worldofazolin.com/wiki/images/8/8d/Dragsorc.jpg",
                abilities: {
                    STR: 19,
                    CON: 17,
                    DEX: 11,
                    INT: 18,
                    WIS: 11,
                    CHA: 22
                },
                ap: 1,
                hp: {
                },
                surges: {
                    perDay: 9,
                    current: 9
                },
                defenses: {
                    ac: 25,
                    fort: 23,
                    ref: 23,
                    will: 27
                },
                init: 7,
                speed: 6,
                weapons: [
                    {
                        name: "Harmonic Songblade +1",
                        isMelee: true,
                        enhancement: 1,
                        proficiency: 3,
                        damage: {
                            amount: "1d8",
                            crit: "1d6"
                        }
                    }
                ],
                "implements": [
                    {
                        name: "Wand of Psychic Ravaging +1",
                        enhancement: 1,
                        crit: "1d8"
                    }, {
                        name: "Harmonic Songblade +1",
                        enhancement: 1,
                        crit: "1d6"
                    }
                ],
                attackBonuses: [
                    {
                        name: "Dragonborn Fury",
                        status: [
                            "bloodied"
                        ],
                        toHit: 1
                    }, {
                        name: "White Lotus Dueling Expertise",
                        keywords: [
                            "basic"
                        ],
                        toHit: 1
                    }, {
                        name: "White Lotus Dueling Expertise",
                        keywords: [
                            "implement"
                        ],
                        toHit: 1
                    }, {
                        name: "White Lotus Dueling Expertise",
                        keywords: [
                            "implement"
                        ],
                        toHit: 1
                    }, {
                        name: "Wand of Psychic Ravaging",
                        keywords: [
                            "implement", "psychic"
                        ],
                        damage: 1
                    }, {
                        name: "Resplendent Gloves",
                        defense: "Will",
                        damage: 2
                    }
                ],
                attacks: [
                    CH.meleeBasic,
                    CH.rangedBasic,
                    new CH.Power({
                        name: "Blazing Starfall",
                        toHit: "CHA",
                        defense: "Ref",
                        damage: {
                            amount: "1d4+10",
                            type: "radiant"
                        },
                        keywords: [
                            "arcane", "fire", "implement", "radiant", "zone"
                        ]
                    }).atWill().burst(1, 10),
                    new CH.Power({
                        name: "Vicious Mockery",
                        toHit: "CHA",
                        defense: "Will",
                        damage: {
                            amount: "1d6+9",
                            type: [ "acid", "psychic" ]
                        },
                        effects: [
                            {
                                name: "penalty",
                                type: "attacks",
                                amount: -2,
                                duration: "endAttackerNext"
                            }
                        ],
                        keywords: [
                            "arcane", "charm", "implement", "psychic"
                        ]
                    }).atWill().ranged(10),
                    new CH.Power({
                        name: "Chains of Fire",
                        target: {
                            targets: 2
                        },
                        toHit: "CHA",
                        defense: "Ref",
                        damage: {
                            amount: "2d8+13",
                            type: "fire"
                        },
                        keywords: [
                            "arcane", "fire", "implement", "teleportation"
                        ]
                    }).encounter().ranged(10),
                    new CH.Power({
                        name: "Chains of Fire (secondary)",
                        toHit: "automatic",
                        defense: "Ref",
                        damage: {
                            amount: "1d10",
                            type: "fire"
                        },
                        keywords: [
                            "arcane", "fire", "implement"
                        ],
                        description: descriptions[ "Chains of Fire" ]
                    }).encounter(),
                    new CH.Power({
                        name: "Eyebite",
                        toHit: "CHA",
                        defense: "Will",
                        damage: {
                            amount: "1d6+9",
                            type: "psychic"
                        },
                        keywords: [
                            "arcane", "charm", "implement", "psychic"
                        ]
                    }).encounter(),
                    new CH.Power({
                        name: "Dissonant Strain",
                        toHit: "CHA",
                        defense: "Will",
                        damage: {
                            amount: "2d6+9",
                            type: "psychic",
                            crit: "1d8"
                        },
                        keywords: [
                            "arcane", "implement", "psychic"
                        ]
                    }).encounter(),
                    new CH.Power({
                        name: "Chaos Ray",
                        toHit: "CHA",
                        defense: "Will",
                        damage: {
                            amount: "2d8+13",
                            type: "psychic",
                            crit: "1d8"
                        },
                        keywords: [
                            "arcane", "implement", "psychic", "teleportation"
                        ]
                    }).encounter(),
                    new CH.Power({
                        name: "Dragon's Wrath",
                        toHit: "STR^CON^DEX+4",
                        defense: "Ref",
                        damage: {
                            amount: "3d6+CON",
                            type: "acid",
                            crit: "1d8"
                        },
                        keywords: [
                            "acid"
                        ]
                    }).encounter().burst(2, 10, true),
                    new CH.Power({
                        name: "Resounding War Cry",
                        toHit: "CHA",
                        defense: "Fort",
                        damage: {
                            amount: "2d6+CHA",
                            type: "thunder"
                        },
                        keywords: [ "arcane", "implement", "thunder" ]
                    }).encounter().blast(5, true),
                    new CH.Power({
                        name: "Resounding War Cry (secondary)",
                        toHit: "automatic",
                        defense: "Fort",
                        damage: "0",
                        effects: [
                            { name: "Dazed", duration: "endAttackerNext" }
                        ],
                        description: descriptions[ "Resounding War Cry" ],
                        keywords: [ "arcane", "implement", "thunder" ]
                    }).encounter().melee(),
                    new CH.Power({
                        name: "Stirring Shout",
                        toHit: "CHA",
                        defense: "Will",
                        damage: {
                            amount: "2d6+9",
                            type: "psychic",
                            crit: "1d8"
                        },
                        keywords: [
                            "arcane", "healing", "implement", "psychic"
                        ]
                    }).daily(),
                    /*
                    new CH.Power({
                        name: "Reeling Torment",
                        toHit: "CHA",
                        defense: "Will",
                        damage: {
                            amount: "3d8+13",
                            type: "psychic",
                            crit: "1d8"
                        },
                        keywords: [
                            "arcane", "charm", "implement", "psychic"
                        ]
                    }).daily(),
                    */
                    new CH.Power({
                        name: "Counterpoint",
                        toHit: "CHA",
                        defense: "Will",
                        damage: {
                            amount: "2d8+8",
                            crit: "1d8"
                        },
                        keywords: [
                            "arcane", "implement"
                        ]
                    }).daily(),
                    new CH.Power({
                        name: "Dragon Breath",
                        toHit: "STR^CON^DEX+2",
                        defense: "Ref",
                        damage: {
                            amount: "1d6+3",
                            type: "acid"
                        },
                        keywords: [
                            "acid"
                        ]
                    }).encounter(),
                    new CH.Power({
                        name: "Prismatic Lightning (Fort)",
                        toHit: "CHA",
                        defense: "Fort",
                        damage: {
                            amount: "3d6+CHA",
                            type: "lightning"
                        },
                        effects: [
                            { name: "ongoing damage", amount: 10, type: "acid", saveEnds: true }
                        ],
                        keywords: [
                            "acid", "arcane", "implement", "lightning"
                        ],
                        description: descriptions[ "Prismatic Lightning" ]
                    }).daily(),
                    new CH.Power({
                        name: "Prismatic Lightning (Ref)",
                        toHit: "CHA",
                        defense: "Ref",
                        damage: {
                            amount: "3d6+CHA",
                            type: [ "cold", "lightning" ]
                        },
                        effects: [
                            { name: "immobilized", saveEnds: true }
                        ],
                        keywords: [
                            "arcane", "cold", "implement", "lightning"
                        ],
                        description: descriptions[ "Prismatic Lightning" ]
                    }).daily(),
                    new CH.Power({
                        name: "Prismatic Lightning (Will)",
                        toHit: "CHA",
                        defense: "Will",
                        damage: {
                            amount: "3d6+CHA",
                            type: [ "acid", "lightning" ]
                        },
                        effects: [
                            { name: "blinded", duration: "endAttackerNext" }
                        ],
                        keywords: [
                            "arcane", "implement", "lightning", "psychic"
                        ],
                        description: descriptions[ "Prismatic Lightning" ]
                    }).daily()
                ],
                buffs: [
                    new CH.Power({
                        name: "Majestic Word",
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: true,
                            amount: "2d6+CHA+HS",
                        }
                    }).encounter(3),
                    new CH.Power({
                        name: "Stirring Shout",
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: false,
                            amount: "CHA"
                        }
                    }).atWill()
                ],
                effects: []
            };
            Festivus.hp.total = 12 + Festivus.abilities.CON + (5 * (partyLevel - 1));
            Festivus.skills = CH.skills(Festivus, {
                arcana: 7, // Bardic Knowledge feat
                dungeoneering: 2, // Bardic Knowledge feat
                history: 7, // Bardic Knowledge feat
                nature: 2, // Bardic Knowledge feat
                perception: 5,
                religion: 7, // Bardic Knowledge feat
                streetwise: 7 // Bardic Knowledge feat
            });
            return Festivus;
        },
        false
    );

})();