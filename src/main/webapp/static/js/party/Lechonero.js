/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Lechonero",
        [ "creature.helpers", "party.level", "jQuery", "html" ],
        function(helpers, partyLevel, jQuery, descriptions) {
            var Lechonero;
            Lechonero = {
                isPC: true,
                level: 15,
                abilities: {
                    STR: 17,
                    CON: 15,
                    DEX: 22,
                    INT: 15,
                    WIS: 16,
                    CHA: 11
                },
                ap: 0,
                hp: {
                },
                surges: {
                    perDay: 0,
                    current: 0
                },
                defenses: {
                    ac: 31,
                    fort: 24,
                    ref: 28,
                    will: 24
                },
                init: 13,
                speed: 7,
                weapons: [],
                "implements": [],
                effects: []
            };
            Lechonero.hp.total = 12 + Lechonero.abilities.CON + (5 * (partyLevel - 1));
            Lechonero.skills = helpers.skills(Lechonero, {
                athletics: 5,
                nature: 5,
                perception: 7, // Sylvan Senses
                stealth: 5,
                streetwise: 5
            });
            Lechonero = jQuery.extend(true, {}, Lechonero, {
                name: "Lechonero",
                image: "../images/portraits/lechonero.jpg", // "http://www.critical-hits.com/wp-content/uploads/2007/12/elf.jpg",
                ap: 1,
                surges: {
                    perDay: 8,
                    current: 8
                },
                weapons: [
                    {
                        name: "Forceful Longbow +4",
                        isMelee: false,
                        enhancement: 4,
                        proficiency: 2,
                        damage: {
                            amount: "1d10",
                            crit: "0"
                        }
                    }, {
                        name: "Longbow of Speed +2",
                        isMelee: false,
                        enhancement: 2,
                        proficiency: 2,
                        damage: {
                            amount: "1d10",
                            crit: "2d8"
                        }
                    }, {
                        name: "Sentinel Marshall Honorblade +1",
                        isMelee: true,
                        enhancement: 1,
                        proficiency: 3,
                        damage: {
                            amount: "1d8",
                            crit: "1d8"
                        }
                    }, {
                        name: "Duelist's Longbow +1",
                        isMelee: false,
                        enhancement: 1,
                        proficiency: 2,
                        damage: {
                            amount: "1d10",
                            crit: "1d6"
                        }
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
                        damage: "1[W]+STR",
                        keywords: [
                            "weapon", "melee", "basic"
                        ]
                    },
                    {
                        name: "Ranged Basic",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+DEX",
                        keywords: [
                            "weapon", "ranged", "basic"
                        ]
                    },
                    {
                        name: "Rapid Shot",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+DEX",
                        keywords: [
                            "weapon", "martial", "ranged"
                        ],
                        description: descriptions[ "Rapid Shot" ]
                    },
                    {
                        name: "Twin Strike",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "STR/DEX",
                        defense: "AC",
                        damage: "1[W]",
                        keywords: [
                            "weapon", "martial"
                        ],
                        description: descriptions[ "Twin Strike" ]
                    },
                    //{
                    //    name: "Hindering Shot",
                    //    usage: {
                    //        frequency: "Encounter"
                    //    },
                    //    toHit: "DEX",
                    //    defense: "AC",
                    //    damage: "2[W]+DEX",
                    //    effects: [
                    //        {
                    //            name: "slowed",
                    //            duration: "endAttackerNext"
                    //        }
                    //    ],
                    //    keywords: [
                    //        "weapon", "martial", "ranged"
                    //    ],
                    //    description: descriptions[ "Hindering Shot" ]
                    //},
                    {
                        name: "Covering Volley",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+DEX",
                        keywords: [
                            "weapon", "martial", "ranged"
                        ],
                        description: descriptions[ "Covering Volley" ]
                    }, {
                        name: "Covering Volley (secondary)",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: "5",
                        keywords: [
                            "martial", "ranged"
                        ],
                        description: descriptions[ "Covering Volley" ]
                    },
                    {
                        name: "Spikes of the Manticore",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "2[W]+DEX",
                        keywords: [
                            "weapon", "martial", "ranged"
                        ],
                        description: descriptions[ "Spikes of the Manticore" ]
                    }, {
                        name: "Spikes of the Manticore (secondary)",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+DEX",
                        keywords: [
                            "weapon", "martial", "ranged"
                        ],
                        description: descriptions[ "Spikes of the Manticore" ]
                    },
                    {
                        name: "Shaft Splitter",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "DEX",
                        defense: "Ref",
                        damage: "2[W]+DEX",
                        keywords: [
                            "weapon", "martial", "ranged"
                        ],
                        description: descriptions[ "Shaft Splitter" ]
                    },
                    {
                        name: "Hammering Volley",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: { target: 2 },
                        toHit: "DEX",
                        defense: "Fort",
                        damage: "2[W]+DEX",
                        effects: [ { name: "Prone" } ],
                        keywords: [
                            "weapon", "martial", "ranged"
                        ],
                        description: descriptions[ "Hammering Volley" ]
                    },
                    //{
                    //    name: "Sure Shot",
                    //    usage: {
                    //        frequency: "Daily"
                    //    },
                    //    toHit: "DEX",
                    //    defense: "AC",
                    //    damage: "3[W]+DEX",
                    //    keywords: [
                    //        "weapon", "martial", "ranged"
                    //    ],
                    //    description: descriptions[ "Sure Shot" ]
                    //},
                    {
                        name: "Flying Steel",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "2[W]+DEX",
                        keywords: [
                            "weapon", "martial", "ranged"
                        ],
                        description: descriptions[ "Flying Steel" ]
                    },
                    {
                        name: "Trick Shot (prone)",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "2[W]+DEX",
                        effects: [
                            { name: "Prone" }
                        ],
                        keywords: [
                            "weapon", "martial", "ranged"
                        ],
                        description: descriptions[ "Trick Shot" ]
                    }, {
                        name: "Trick Shot (slowed)",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "2[W]+DEX",
                        effects: [
                            { name: "Slowed", saveEnds: true }
                        ],
                        keywords: [
                            "weapon", "martial", "ranged"
                        ],
                        description: descriptions[ "Trick Shot" ]
                    }, {
                        name: "Trick Shot (dazed)",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "2[W]+DEX",
                        effects: [
                            { name: "Dazed", saveEnds: true }
                        ],
                        keywords: [
                            "weapon", "martial", "ranged"
                        ],
                        description: descriptions[ "Trick Shot" ]
                    }, {
                        name: "Trick Shot (immobilized)",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "2[W]+DEX",
                        effects: [
                            { name: "Immobilized", saveEnds: true }
                        ],
                        keywords: [
                            "weapon", "martial", "ranged"
                        ],
                        description: descriptions[ "Trick Shot" ]
                    },
                    {
                        name: "Marked for Death",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "3[W]+STR/DEX",
                        effects: [
                            {
                                name: "marked",
                                duration: "endAttackerNext"
                            }
                        ],
                        keywords: [
                            "weapon", "martial"
                        ],
                        description: descriptions[ "Marked for Death" ]
                    },
                    {
                        name: "Hunter's Quarry",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: "1d8",
                        description: descriptions[ "Hunter's Quarry" ]
                    }
                ],
                buffs: [
                    {
                        name: "Communion (self)",
                        usage: {
                            frequency: "Encounter"
                        },
                        healing: {
                            isTempHP: true,
                            usesHealingSurge: true,
                            amount: "" + (3 + Math.floor(partyLevel / 2))
                        },
                        description: descriptions[ "Communion" ]
                    },
                    {
                        name: "Communion (other)",
                        usage: {
                            frequency: "Encounter"
                        },
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: false,
                            amount: "HS"
                        },
                        description: descriptions[ "Communion" ]
                    }
                ]
            });
            return Lechonero;
        },
        false
    );

})();