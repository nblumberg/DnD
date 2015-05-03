/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Karrion",
        [ "creature.helpers", "party.level", "jQuery", "descriptions", "Effect" ],
        function(helpers, partyLevel, jQuery, descriptions, Effect) {
            var Karrion;
            Karrion = {
                name: "Karrion",
                isPC: true,
                level: partyLevel,
                image: "../images/portraits/karrion.jpg", // "http://rogueartfx.com/images/tiefling03.jpg",
                abilities: {
                    STR: 21,
                    CON: 17,
                    DEX: 20,
                    INT: 19,
                    WIS: 18,
                    CHA: 17
                },
                ap: 1,
                hp: {
                    total: 104
                },
                surges: {
                    perDay: 9,
                    current: 9
                },
                defenses: {
                    ac: 27,
                    fort: 25,
                    ref: 25,
                    will: 23
                },
                resistances: {
                    fire: 12
                },
                init: 14,
                speed: 6,
                weapons: [
                    {
                        name: "Withering Spiked Chain +3",
                        isMelee: true,
                        enhancement: 3,
                        proficiency: 3,
                        damage: {
                            amount: "2d4",
                            crit: "3d6"
                        },
                        effects: [
                            function(target, attacker, round) {
                                var otherId, effect, i, amount;
                                otherId = "Karrion's Withering Spiked Chain +3 effect";
                                amount = 0;
                                for (i = 0; i < target.effects.length; i++) {
                                    effect = target.effects[ i ];
                                    if (effect.otherId === otherId) {
                                        amount = effect.amount;
                                        effect.remove();
                                        break;
                                    }
                                }
                                amount++;
                                return new Effect({
                                    name: "penalty",
                                    otherId: otherId,
                                    type: "ac",
                                    amount: amount || 1,
                                    saveEnds: true,
                                    target: target,
                                    attacker: attacker,
                                    round: round
                                });
                            }
                        ]
                    }, {
                        name: "Learning Longbow +3",
                        isMelee: false,
                        enhancement: 3,
                        proficiency: 2,
                        damage: {
                            amount: "1d10",
                            crit: "3d6"
                        }
                    }, {
                        name: "Sid Vicious Longbow +1",
                        isMelee: false,
                        enhancement: 1,
                        proficiency: 2,
                        damage: {
                            amount: "1d10",
                            crit: "1d12"
                        }
                    }, {
                        name: "Lightning Spiked Chain +1",
                        isMelee: true,
                        enhancement: 1,
                        proficiency: 3,
                        damage: {
                            amount: "2d4",
                            crit: "1d6"
                        }
                    }
                ],
                "implements": [
                    {
                        name: "Totem",
                        enhancement: 0,
                        crit: "0"
                    }
                ],
                attackBonuses: [
                    {
                        name: "Bloodhunt",
                        foeStatus: [
                            "bloodied"
                        ],
                        toHit: 1
                    }
                    /*
                     * , { name: "Hunter's Quarry", foeStatus: [ "hunter's quarry" ], damage: "1d8", oncePerRound: true }
                     */
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
                    }, {
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
                    }, {
                        name: "Marauder's Rush",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]+STR+WIS",
                        keywords: [
                            "weapon", "martial", "melee"
                        ],
                        description: descriptions[ "Marauder's Rush" ]
                    }, {
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
                    }, {
                        name: "Pinning Strike",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "STR/DEX",
                        defense: "AC",
                        damage: "1[W]+STR/DEX",
                        effects: [ { name: "Immobilized", duration: "startAttackerNext" } ],
                        keywords: [
                            "weapon", "martial"
                        ],
                        description: descriptions[ "Pinning Strike" ]
                    }, {
                        name: "Thundertusk Boar Strike",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "STR/DEX",
                        defense: "AC",
                        damage: "1[W]+STR/DEX",
                        keywords: [
                            "weapon", "martial"
                        ],
                        description: descriptions[ "Thundertusk Boar Strike" ]
                    }, {
                        name: "Sweeping Whirlwind",
                        usage: {
                            frequency: "Encounter"
                        },
                        isMelee: true,
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]+STR",
                        keywords: [
                            "weapon", "martial", "melee"
                        ],
                        description: descriptions[ "Sweeping Whirlwind" ]
                    }, {
                        name: "Your Doom Awaits",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: {
                            area: "close burst",
                            size: 3
                        },
                        toHit: "STR",
                        defense: "Will",
                        damage: {
                            amount: "3d10+STR",
                            type: "psychic"
                        },
                        effects: [
                            {
                                name: "dazed",
                                duration: "endTargetNext"
                            }
                        ],
                        keywords: [
                            "fear", "implement", "primal", "psychic"
                        ],
                        description: descriptions[ "Your Doom Awaits" ]
                    }/*, {
                     name: "Boar Assault",
                     usage: {
                     frequency: "Daily"
                     },
                     toHit: "STR/DEX",
                     defense: "AC",
                     damage: "2[W]+STR/DEX",
                     keywords: [
                     "weapon", "martial"
                     ],
                     description: descriptions[ "Boar Assault" ]
                     }*/, {
                        name: "Steeling Flurry",
                        usage: {
                            frequency: "Daily"
                        },
                        target: {
                            area: "close burst",
                            size: 1,
                            enemiesOnly: true
                        },
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]+STR",
                        miss: { halfDamage: true },
                        keywords: [
                            "weapon", "martial"
                        ],
                        description: descriptions[ "Steeling Flurry" ]
                    }, {
                        name: "Invigorating Assault",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "3[W]+DEX",
                        miss: {
                            halfDamage: true
                        },
                        keywords: [
                            "weapon", "martial", "ranged"
                        ],
                        description: descriptions[ "Invigorating Assault" ]
                    }, {
                        name: "Infernal Wrath",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: {
                            amount: "2d6+INT^CHA",
                            type: "fire"
                        },
                        keywords: [
                            "fire"
                        ],
                        description: descriptions[ "Infernal Wrath" ]
                    }, {
                        name: "Spirit's Fangs",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "WIS",
                        defense: "Ref",
                        damage: "1d10+WIS",
                        keywords: [
                            "implement", "primal", "spirit"
                        ],
                        description: descriptions[ "Spirit's Fangs" ]
                    }, {
                        name: "Hunter's Thorn Trap",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: "5+WIS",
                        keywords: [
                            "primal", "zone"
                        ],
                        description: descriptions[ "Hunter's Thorn Trap" ]
                    }, {
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
                    /* {
                        name: "Boar Assault",
                        usage: {
                             frequency: "At-Will"
                        },
                        healing: {
                             isTempHP: true,
                             usesHealingSurge: false,
                             amount: "WIS"
                        },
                        description: descriptions[ "Boar Assault" ]
                    }, */
                    {
                        name: "Invigorating Assault",
                        usage: {
                            frequency: "At-Will"
                        },
                        healing: {
                            isTempHP: true,
                            usesHealingSurge: false,
                            amount: "WIS+5"
                        },
                        description: descriptions[ "Invigorating Assault" ]
                    },
                    {
                        name: "Healing Spirit",
                        usage: {
                            frequency: "Encounter"
                        },
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: true,
                            amount: "HS"
                        },
                        description: descriptions[ "Healing Spirit" ]
                    },
                    {
                        name: "Healing Spirit (secondary)",
                        usage: {
                            frequency: "Encounter"
                        },
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: false,
                            amount: "3d6"
                        },
                        description: descriptions[ "Healing Spirit" ]
                    },
                    {
                        name: "Spirit of Sacrifice",
                        usage: {
                            frequency: "Encounter"
                        },
                        healing: {
                            isTempHP: true,
                            usesHealingSurge: false,
                            amount: "7+STR^WIS"
                        },
                        description: descriptions [ "Spirit of Sacrifice" ]
                    }
                ],
                effects: []
            };
            Karrion.hp.total = 12 + Karrion.abilities.CON + (5 * (partyLevel - 1));
            Karrion.skills = helpers.skills(Karrion, {
                acrobatics: 5,
                athletics: 5,
                dungeoneering: 5,
                nature: 5,
                perception: 5,
                stealth: 5
            });
            return Karrion;
        },
        false
    );

})();