/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Festivus",
        [ "creature.helpers", "party.level", "jQuery", "descriptions" ],
        function(helpers, partyLevel, jQuery, descriptions) {
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
                    {
                        name: "Melee Basic",
                        usage: {
                            frequency: "At-Will"
                        },
                        isMelee: true,
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]+5",
                        keywords: [
                            "weapon", "melee", "basic"
                        ]
                    }, {
                        name: "Ranged Basic",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]",
                        keywords: [
                            "weapon", "ranged", "basic"
                        ]
                    }, {
                        name: "Blazing Starfall",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "CHA",
                        defense: "Ref",
                        damage: {
                            amount: "1d4+10",
                            type: "radiant"
                        },
                        keywords: [
                            "arcane", "fire", "implement", "radiant", "zone"
                        ],
                        description: descriptions[ "Blazing Starfall" ]
                    }, {
                        name: "Vicious Mockery",
                        usage: {
                            frequency: "At-Will"
                        },
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
                        ],
                        description: descriptions[ "Vicious Mockery" ]
                    }, {
                        name: "Chains of Fire",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "CHA",
                        defense: "Ref",
                        damage: {
                            amount: "2d8+13",
                            type: "fire"
                        },
                        keywords: [
                            "arcane", "fire", "implement", "teleportation"
                        ],
                        description: descriptions[ "Chains of Fire" ]
                    }, {
                        name: "Chains of Fire (secondary)",
                        usage: {
                            frequency: "Encounter"
                        },
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
                    }, {
                        name: "Eyebite",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "CHA",
                        defense: "Will",
                        damage: {
                            amount: "1d6+9",
                            type: "psychic"
                        },
                        keywords: [
                            "arcane", "charm", "implement", "psychic"
                        ],
                        description: descriptions[ "Eyebite" ]
                    }, {
                        name: "Dissonant Strain",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "CHA",
                        defense: "Will",
                        damage: {
                            amount: "2d6+9",
                            type: "psychic",
                            crit: "1d8"
                        },
                        keywords: [
                            "arcane", "implement", "psychic"
                        ],
                        description: descriptions[ "Dissonant Strain" ]
                    }, {
                        name: "Chaos Ray",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "CHA",
                        defense: "Will",
                        damage: {
                            amount: "2d8+13",
                            type: "psychic",
                            crit: "1d8"
                        },
                        keywords: [
                            "arcane", "implement", "psychic", "teleportation"
                        ],
                        description: descriptions[ "Chaos Ray" ]
                    }, {
                        name: "Dragon's Wrath",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "STR^CON^DEX+4",
                        defense: "Ref",
                        damage: {
                            amount: "3d6+CON",
                            type: "psychic",
                            crit: "1d8"
                        },
                        keywords: [
                            "acid"
                        ],
                        description: descriptions[ "Dragon's Wrath" ]
                    }, {
                        name: "Stirring Shout",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "CHA",
                        defense: "Will",
                        damage: {
                            amount: "2d6+9",
                            type: "psychic",
                            crit: "1d8"
                        },
                        keywords: [
                            "arcane", "healing", "implement", "psychic"
                        ],
                        description: descriptions[ "Stirring Shout" ]
                    }/*, {
                     name: "Reeling Torment",
                     usage: {
                     frequency: "Daily"
                     },
                     toHit: "CHA",
                     defense: "Will",
                     damage: {
                     amount: "3d8+13",
                     type: "psychic",
                     crit: "1d8"
                     },
                     keywords: [
                     "arcane", "charm", "implement", "psychic"
                     ],
                     description: descriptions[ "Reeling Torment" ]
                     } */, {
                        name: "Counterpoint",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "CHA",
                        defense: "Will",
                        damage: {
                            amount: "2d8+8",
                            crit: "1d8"
                        },
                        keywords: [
                            "arcane", "implement"
                        ],
                        description: descriptions[ "Counterpoint" ]
                    }, {
                        name: "Dragon Breath",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "STR^CON^DEX+2",
                        defense: "Ref",
                        damage: {
                            amount: "1d6+3",
                            type: "acid"
                        },
                        keywords: [
                            "acid"
                        ],
                        description: descriptions[ "Dragon Breath" ]
                    }, {
                        name: "Prismatic Lightning (Fort)",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "CHA",
                        defense: "Fort",
                        damage: {
                            amount: "3d6+CHA",
                            type: "lightning"
                        },
                        effects: [
                            { name: "ongoing damage", amount: "10", type: "acid", saveEnds: true }
                        ],
                        keywords: [
                            "acid", "arcane", "implement", "lightning"
                        ],
                        description: descriptions[ "Prismatic Lightning" ]
                    }, {
                        name: "Prismatic Lightning (Ref)",
                        usage: {
                            frequency: "Daily"
                        },
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
                    }, {
                        name: "Prismatic Lightning (Will)",
                        usage: {
                            frequency: "Daily"
                        },
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
                    }
                ],
                healing: [
                    {
                        name: "Majestic Word",
                        frequency: "2xEncounter",
                        isTempHP: false,
                        usesHealingSurge: true,
                        amount: "HS+2d6+CHA",
                        description: descriptions[ "Majestic Word" ]
                    },
                    {
                        name: "Stirring Shout",
                        frequency: "At-Will",
                        isTempHP: false,
                        usesHealingSurge: false,
                        amount: "CHA",
                        description: descriptions[ "Stirring Shout" ]
                    }
                ],
                effects: []
            };
            Festivus.hp.total = 12 + helpers.mod(Festivus.abilities.CON) + (5 * partyLevel);
            Festivus.skills = helpers.skills(Festivus, {
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