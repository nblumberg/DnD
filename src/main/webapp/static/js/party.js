/* exported loadParty */
var loadParty;
(function(jQuery) {
    "use strict";

    var Barases_base, lastingFrost_effect, Lechonero_base;
    Barases_base = {
        isPC: true,
        level: 15,
        abilities: {
            STR: 12,
            CON: 20,
            DEX: 11,
            INT: 11,
            WIS: 22,
            CHA: 11
        },
        skills: {
            acrobatics: 6,
            arcana: 9,
            athletics: 16,
            bluff: 12,
            diplomacy: 7,
            dungeoneering: 13,
            endurance: 11,
            heal: 13,
            history: 7,
            insight: 13,
            intimidate: 7,
            nature: 20,
            perception: 18,
            religion: 7,
            stealth: 8,
            streetwise: 7,
            thievery: 8
        },
        defenses: {
            ac: 27,
            fort: 29,
            ref: 22,
            will: 28
        },
        ap: 0,
        init: 7,
        hp: {
            total: 112
        },
        surges: {
            perDay: 0,
            current: 0
        },
        weapons: [],
        "implements": [],
        effects: []
    };
    lastingFrost_effect = { name: "Vulnerable", amount: 5, type: "cold", duration: "endAttackerNext" };
    Lechonero_base = {
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
        skills: {
            acrobatics: 11,
            arcana: 7,
            athletics: 15,
            bluff: 5,
            diplomacy: 5,
            dungeoneering: 8,
            endurance: 12,
            heal: 13,
            history: 7,
            insight: 8,
            intimidate: 5,
            nature: 17,
            perception: 17,
            religion: 7,
            stealth: 13,
            streetwise: 10,
            thievery: 11
        },
        ap: 0,
        hp: {
            total: 97
        },
        surges: {
            perDay: 0,
            current: 0
        },
        defenses: {
            ac: 30,
            fort: 23,
            ref: 27,
            will: 23
        },
        init: 13,
        speed: 7,
        weapons: [],
        "implements": [],
        effects: []
    };

    loadParty = function() {
        return {
            Barases: jQuery.extend(true, {}, Barases_base, {
                name: "Barases",
                image: "../images/portraits/barases.jpg", // "http://images5.fanpop.com/image/photos/31000000/Satyr-fantasy-31060204-283-400.jpg",
                ap: 1,
                surges: {
                    perDay: 12,
                    current: 12
                },
                speed: 6,
                weapons: [
                    {
                        name: "Frost Brand Quarterstaff +3",
                        isMelee: true,
                        enhancement: 3,
                        proficiency: 2,
                        type: "cold",
                        damage: {
                            amount: "1d12",
                            crit: { amount: "3d8", type: "cold" }
                        }
                    }, {
                        name: "Summoner's Staff +4",
                        isMelee: true,
                        enhancement: 4,
                        proficiency: 2,
                        damage: {
                            amount: "1d12",
                            crit: "4d6"
                        }
                    }, {
                        name: "Vicious Quarterstaff +2",
                        isMelee: true,
                        enhancement: 2,
                        proficiency: 2,
                        damage: {
                            amount: "1d12",
                            crit: "2d12"
                        }
                    }, {
                        name: "Distance Sling +1",
                        isMelee: false,
                        enhancement: 1,
                        proficiency: 2,
                        damage: {
                            amount: "1d6",
                            crit: "0"
                        }
                    }
                ],
                "implements": [
                    {
                        name: "Summoner's Staff +4",
                        enhancement: 4,
                        crit: "4d6"
                    }
                ],
                attackBonuses: [
                    {
                        name: "Wintertouched",
                        vulnerable: "cold",
                        toHit: 2
                    }
                ],
                attacks: [
                    {
                        name: "Melee Basic",
                        usage: {
                            frequency: "At-Will"
                        },
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
                        name: "Tending Strike",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "WIS",
                        defense: "AC",
                        damage: "1[W]+WIS",
                        effects: [ lastingFrost_effect ],
                        keywords: [
                            "weapon", "melee", "primal"
                        ]
                    }, {
                        name: "Combined Attack",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "WIS",
                        defense: "AC",
                        damage: "1[W]+WIS",
                        effects: [ lastingFrost_effect ],
                        keywords: [
                            "weapon", "melee", "primal"
                        ]
                    }, {
                        name: "Combined Attack (beast)",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: 15,
                        defense: "AC",
                        damage: "1d12+9",
                        crit: "",
                        keywords: [
                            "melee", "primal", "beast"
                        ]
                    }, {
                        name: "Redfang Prophecy",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: {
                            range: 5
                        },
                        toHit: "WIS",
                        defense: "Will",
                        damage: "2d8+WIS",
                        effects: [
                            {
                                name: "vulnerable summoned creature",
                                amount: 5,
                                duration: "endAttackerNext"
                            }
                        ],
                        keywords: [
                            "implement", "primal", "psychic"
                        ]
                    }, {
                        name: "Spirit's Shield",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: {
                            range: 1,
                            area: "spirit"
                        },
                        toHit: "WIS",
                        defense: "Ref",
                        damage: "WIS",
                        keywords: [
                            "healing", "implement", "spirit", "primal"
                        ]
                    }, {
                        name: "Vexing Overgrowth",
                        usage: {
                            frequency: "Daily"
                        },
                        target: {
                            area: "close burst",
                            size: 1
                        },
                        toHit: "WIS",
                        defense: "AC",
                        damage: "2[W]+WIS",
                        miss: {
                            halfDamage: true
                        },
                        keywords: [
                            "weapon", "primal"
                        ]
                    }, {
                        name: "Life Blood Harvest",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "WIS",
                        defense: "AC",
                        damage: "3[W]+WIS",
                        effects: [ lastingFrost_effect ],
                        miss: {
                            halfDamage: true
                        },
                        keywords: [
                            "weapon", "melee", "primal", "healing"
                        ]
                    }
                ],
                healing: [
                    { name: "Tending Strike", frequency: "At-Will", isTempHP: true, usesHealingSurge: false, amount: "CON" },
                    { name: "Life Blood Harvest", frequency: "Daily", isTempHP: false, usesHealingSurge: false, amount: "HS" },
                    { name: "Healing Spirit", frequency: "Encounter", isTempHP: false, usesHealingSurge: true, amount: "HS" },
                    { name: "Healing Spirit (secondary)", frequency: "Encounter", isTempHP: false, usesHealingSurge: false, amount: "3d6" },
                    { name: "Healing Word", frequency: "2xEncounter", isTempHP: false, usesHealingSurge: true, amount: "HS+3d6" },
                    { name: "Spirit's Shield", frequency: "Encounter", isTempHP: false, usesHealingSurge: false, amount: "WIS" }
                ]
            }),
            Smack: jQuery.extend(true, {}, Barases_base, {
                name: "Smack",
                image: "../images/portraits/smack.jpg", // http://www.lpzoo.org/sites/default/files/imagesfacts/black_bear.jpg?1331759862
                /* Use Barases' abilities for all attacks
                abilities: {
                    STR: 16,
                    CON: 14,
                    DEX: 12,
                    INT: 6,
                    WIS: 12,
                    CHA: 6
                }, */
                skills: {
                    acrobatics: Math.floor(Barases_base.level / 2) + 1,
                    arcana: Math.floor(Barases_base.level / 2) - 2,
                    athletics: Math.floor(Barases_base.level / 2) + 8,
                    bluff: Math.floor(Barases_base.level / 2) - 2,
                    diplomacy: Math.floor(Barases_base.level / 2) + 1,
                    dungeoneering: Math.floor(Barases_base.level / 2) - 2,
                    endurance: Math.floor(Barases_base.level / 2) + 7,
                    heal: Math.floor(Barases_base.level / 2) + 1,
                    history: Math.floor(Barases_base.level / 2) - 2,
                    insight: Math.floor(Barases_base.level / 2) + 1,
                    intimidate: Math.floor(Barases_base.level / 2) - 2,
                    nature: Math.floor(Barases_base.level / 2) + 1,
                    perception: Barases_base.skills.perception + 2,
                    religion: Math.floor(Barases_base.level / 2) - 2,
                    stealth: Math.floor(Barases_base.level / 2) + 1,
                    streetwise: Math.floor(Barases_base.level / 2) - 2,
                    thievery: Math.floor(Barases_base.level / 2) + 1
                },
                hp: {
                    total: Math.floor(Barases_base.hp.total / 2)
                },
                defenses: {
                    ac: 12 + Barases_base.level,
                    fort: 14 + Barases_base.level,
                    ref: 10 + Barases_base.level,
                    will: 12 + Barases_base.level
                },
                speed: 5,
                attacks: [
                    {
                        name: "Animal Attack",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "WIS+5",
                        defense: "AC",
                        damage: "1d12+3+WIS+CON",
                        keywords: [
                            "melee", "beast", "basic"
                        ]
                    }
                ]
            }),
            Oomooroo: jQuery.extend(true, {}, Barases_base, {
                name: "Oomooroo",
                image: "../images/portraits/owlbear.jpg", // http://www.lpzoo.org/sites/default/files/imagesfacts/black_bear.jpg?1331759862
                abilities: {
                    STR: 20,
                    CON: 17,
                    DEX: 12,
                    INT: 2,
                    WIS: 14,
                    CHA: 6
                },
                skills: {
                    acrobatics: Math.floor(Barases_base.hp.total / 2) + 1,
                    arcana: Math.floor(Barases_base.hp.total / 2) - 4,
                    athletics: Math.floor(Barases_base.hp.total / 2) + 5,
                    bluff: Math.floor(Barases_base.hp.total / 2) - 2,
                    diplomacy: Math.floor(Barases_base.hp.total / 2) - 2,
                    dungeoneering: Math.floor(Barases_base.hp.total / 2) - 4,
                    endurance: Math.floor(Barases_base.hp.total / 2) + 3,
                    heal: Math.floor(Barases_base.hp.total / 2) + 2,
                    history: Math.floor(Barases_base.hp.total / 2) - 4,
                    insight: Math.floor(Barases_base.hp.total / 2) + 2,
                    intimidate: Math.floor(Barases_base.hp.total / 2) - 2,
                    nature: Math.floor(Barases_base.hp.total / 2) + 2,
                    perception: Barases_base.skills.perception + 2,
                    religion: Math.floor(Barases_base.hp.total / 2) - 4,
                    stealth: Math.floor(Barases_base.hp.total / 2) + 1,
                    streetwise: Math.floor(Barases_base.hp.total / 2) - 2,
                    thievery: Math.floor(Barases_base.hp.total / 2) + 1
                },
                hp: {
                    total: Math.floor(Barases_base.hp.total / 2)
                },
                defenses: {
                    ac: 13 + Barases_base.level,
                    fort: 15 + Barases_base.level,
                    ref: 11 + Barases_base.level,
                    will: 15 + Barases_base.level
                },
                speed: 6,
                attacks: [
                    {
                        name: "Claw",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: Barases_base.level + 5,
                        defense: "AC",
                        damage: "1d12+" + Math.floor(Barases_base.level / 2),
                        keywords: [
                            "melee", "beast", "basic"
                        ]
                    }
                ]
            }),
            "Summoned Crocodile": jQuery.extend(true, {}, Barases_base, { // copied from "Visejaw Crocodile" as it's the only large, natural, non-minion crocodile and the only stats listed in the power match
                name: "Summoned Crocodile",
                image: "../images/portraits/crocodile.jpg", // http://usherp.org/wp-content/uploads/2013/04/crocodile-500x324.jpg
                hp: {
                    total: Math.floor(Barases_base.hp.total / 2)
                },
                speed: { walk: 6, swim: 8 },
                attacks: [
                    {
                        name: "Bite",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "WIS",
                        defense: "AC",
                        damage: "1d8+WIS",
                        effects: [ { name: "Grabbed" } ],
                        keywords: [
                            "melee", "primal", "summoned", "basic"
                        ]
                    }, {
                        name: "Clamping Jaws",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: 10,
                        defense: "AC",
                        damage: "2d8+4",
                        miss: { halfDamage: true },
                        keywords: [
                            "melee", "primal", "summoning"
                        ]
                    }
                ]
            }),
            Bin: {
                name: "Bin",
                isPC: true,
                level: 15,
                image: "../images/portraits/bin.jpg", // "http://wizards.com/dnd/images/386_wr_changeling.jpg",
                abilities: {
                    STR: 15,
                    CON: 18,
                    DEX: 16,
                    INT: 23,
                    WIS: 20,
                    CHA: 12
                },
                skills: {
                    acrobatics: 10,
                    arcana: 18,
                    athletics: 9,
                    bluff: 10,
                    diplomacy: 8,
                    dungeoneering: 17,
                    endurance: 13,
                    heal: 12,
                    history: 18,
                    insight: 14,
                    intimidate: 8,
                    nature: 12,
                    perception: 17,
                    religion: 13,
                    stealth: 12,
                    streetwise: 8,
                    thievery: 15
                },
                ap: 1,
                hp: {
                    total: 100
                },
                surges: {
                    perDay: 10,
                    current: 10
                },
                defenses: {
                    ac: 27,
                    fort: 23,
                    ref: 24,
                    will: 25
                },
                init: 10,
                speed: 6,
                weapons: [
                    {
                        name: "Runic Mace +1",
                        isMelee: true,
                        proficiency: 2,
                        enhancement: 1,
                        damage: {
                            amount: "1d8",
                            crit: "1d6"
                        }
                    }, {
                        name: "Rebounding Hand Crossbow +1",
                        isMelee: false,
                        proficiency: 2,
                        enhancement: 1,
                        damage: {
                            amount: "1d6",
                            crit: "1d6"
                        }
                    }, {
                        name: "Learning Crossbow +1",
                        isMelee: false,
                        proficiency: 2,
                        enhancement: 1,
                        damage: {
                            amount: "1d8",
                            crit: "1d6"
                        }
                    }, {
                        name: "Staff of the Impregnable Mind +3",
                        isMelee: true,
                        proficiency: 0,
                        enhancement: 3,
                        damage: {
                            amount: "1d6",
                            crit: "3d8",
                            type: "psychic"
                        }
                    }, {
                        name: "Aversion Staff +2",
                        isMelee: true,
                        proficiency: 0,
                        enhancement: 2,
                        damage: {
                            amount: "1d6",
                            crit: "2d8"
                        }
                    }
                ],
                "implements": [
                    {
                        name: "Staff of the Impregnable Mind +3",
                        enhancement: 3,
                        crit: "3d8"
                    },
                    {
                        name: "Aversion Staff +2",
                        enhancement: 2,
                        crit: "2d8"
                    }
                ],
                attacks: [
                    {
                        name: "Melee Basic",
                        usage: {
                            frequency: "At-Will"
                        },
                        target: {
                            delivery: "melee",
                            targets: 1
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
                        target: {
                            delivery: "ranged",
                            targets: 1
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+DEX",
                        keywords: [
                            "weapon", "ranged", "basic"
                        ]
                    }, {
                        name: "Magic Weapon",
                        usage: {
                            frequency: "At-Will"
                        },
                        target: {
                            delivery: "melee or ranged",
                            targets: 1
                        },
                        toHit: "INT+1",
                        defense: "AC",
                        damage: "1d8+INT",
                        keywords: [
                            "arcane", "weapon"
                        ]
                    }, {
                        name: "Thundering Armor",
                        usage: {
                            frequency: "At-Will"
                        },
                        target: {
                            delivery: "close burst",
                            size: 10,
                            targets: 1
                        },
                        toHit: "INT",
                        defense: "Fort",
                        damage: {
                            amount: "1d8+INT",
                            type: "thunder"
                        },
                        keywords: [
                            "arcane", "implement", "thunder"
                        ]
                    }, {
                        name: "Stone Panoply",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: {
                            delivery: "close burst",
                            size: 1,
                            enemiesOnly: false,
                            targets: "any"
                        },
                        toHit: "INT",
                        defense: "AC",
                        damage: "2[W]+INT",
                        keywords: [
                            "elemental", "weapon"
                        ]
                    }, {
                        name: "Lightning Sphere",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: {
                            delivery: "burst",
                            size: 1,
                            range: 10,
                            enemiesOnly: true,
                            targets: "any"
                        },
                        toHit: "INT",
                        defense: "Fort",
                        damage: {
                            amount: "1d8+INT",
                            type: "lightning"
                        },
                        keywords: [
                            "arcane", "implement", "lightning"
                        ]
                    }, {
                        name: "Vampiric Weapons",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: {
                            delivery: "melee or ranged",
                            targets: 1
                        },
                        toHit: "INT",
                        defense: "AC",
                        damage: {
                            amount: "1d8+INT",
                            type: "necrotic"
                        },
                        keywords: [
                            "arcane", "healing", "necrotic", "weapon"
                        ]
                    }, {
                        name: "Energy Shroud",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: {
                            delivery: "melee",
                            targets: 1
                        },
                        toHit: "INT",
                        defense: "Ref",
                        damage: {
                            amount: "2d10+INT",
                            type: "force"
                        },
                        keywords: [ "arcane", "force", "implement", "ranged" ]
                    }, {
                        name: "Elemental Cascade",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: {
                            delivery: "melee or ranged",
                            range: 10,
                            targets: 1
                        },
                        toHit: "INT+4",
                        defense: "Ref",
                        damage: "2d10+INT",
                        keywords: [
                            "elemental"
                        ]
                    }/*, {
                        name: "Caustic Rampart",
                        usage: {
                            frequency: "Daily"
                        },
                        target: {
                            delivery: "wall",
                            size: 5,
                            range: 10
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: {
                            amount: "1d6+INT",
                            type: "acid"
                        },
                        keywords: [
                            "acid", "arcane", "conjuration", "implement"
                        ]
                    } */, {
                        name: "Lightning Motes",
                        usage: {
                            frequency: "Daily"
                        },
                        target: {
                            delivery: "close burst",
                            size: 3,
                            enemiesOnly: true,
                            targets: "any"
                        },
                        toHit: "INT",
                        defense: "Ref",
                        damage: {
                            amount: "2d6+INT",
                            type: "lightning"
                        },
                        miss: {
                            halfDamage: true,
                            effects: [
                                { name: "ongoing damage", amount: "5", type: "lightning", saveEnds: true }
                            ]
                        },
                        effects: [
                            { name: "dazed", saveEnds: true },
                            { name: "ongoing damage", amount: "5", type: "lightning", saveEnds: true }
                        ],
                        keywords: [
                            "arcane", "implement", "lightning"
                        ]
                    }, {
                        name: "Clockroach Swarm",
                        usage: {
                            frequency: "Daily"
                        },
                        target: {
                            delivery: "blast",
                            size: 5,
                            enemiesOnly: true,
                            targets: "any"
                        },
                        toHit: "INT",
                        defense: "Ref",
                        damage: {
                            amount: "2d8+INT",
                            type: "lightning"
                        },
                        effects: [
                            { name: "ongoing damage", amount: "5", saveEnds: true }
                        ],
                        keywords: [
                            "arcane", "implement", "zone"
                        ]
                    }
                ],
                healing: [
                    { name: "Vampiric Weapons", frequency: "Encounter", isTempHP: false, usesHealingSurge: false, amount: "1d6+CON" },
                    { name: "Healing Infusion: Curative Admixture", frequency: "2xEncounter", isTempHP: false, usesHealingSurge: false, amount: "HS+WIS+4" },
                    { name: "Healing Infusion: Resistive Formula", frequency: "2xEncounter", isTempHP: true, usesHealingSurge: false, amount: "HS+CON+CON" },
                    { name: "Recuperative Enchantment", frequency: "Encounter", isTempHP: false, usesHealingSurge: true, amount: "HS" },
                    { name: "Shared Valor Leather Armor", frequency: "At-Will", isTempHP: true, usesHealingSurge: false, amount: "5" }
                ],
                effects: []
            },
            Camulos: {
                name: "Camulos",
                isPC: true,
                level: 15,
                image: "../images/portraits/camulos.png",
                abilities: {
                    STR: 24,
                    CON: 20,
                    DEX: 12,
                    INT: 11,
                    WIS: 11,
                    CHA: 9
                },
                skills: {
                    acrobatics: 8,
                    arcana: 7,
                    athletics: 21,
                    bluff: 6,
                    diplomacy: 6,
                    dungeoneering: 7,
                    endurance: 17,
                    heal: 12,
                    history: 7,
                    insight: 9,
                    intimidate: 6,
                    nature: 9,
                    perception: 9,
                    religion: 7,
                    stealth: 8,
                    streetwise: 6,
                    thievery: 8
                },
                ap: 1,
                hp: {
                    total: 119
                },
                surges: {
                    perDay: 14,
                    current: 14
                },
                defenses: {
                    ac: 30,
                    fort: 28,
                    ref: 22,
                    will: 20
                },
                init: 12,
                speed: 6,
                weapons: [
                    {
                        name: "Defensive Warhammer +2",
                        isMelee: true,
                        enhancement: 2,
                        proficiency: 2,
                        damage: {
                            amount: "1d10",
                            crit: "2d6"
                        }
                    }
                ],
                "implements": [],
                attackBonuses: [
                    {
                        name: "Battle Wrath",
                        keywords: [
                            "Battle Wrath"
                        ],
                        damage: 3
                    }, {
                        name: "Defend the Line",
                        keywords: [
                            "Defend the Line"
                        ],
                        effects: [
                            {
                                name: "Slowed",
                                duration: "endAttackerNext"
                            }
                        ]
                    }
                ],
                attacks: [
                    {
                        name: "Melee Basic",
                        usage: {
                            frequency: "At-Will"
                        },
                        target: {
                            delivery: "melee",
                            targets: 1
                        },
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]+STR",
                        miss: {
                            damage: "CON"
                        },
                        keywords: [
                            "weapon", "melee", "basic"
                        ]
                    }, {
                        name: "Ranged Basic",
                        usage: {
                            frequency: "At-Will"
                        },
                        target: {
                            delivery: "ranged",
                            targets: 1
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+DEX",
                        keywords: [
                            "weapon", "ranged", "basic"
                        ]
                    }, {
                        name: "Battle Guardian",
                        usage: {
                            frequency: "At-Will"
                        },
                        target: {
                            delivery: "melee",
                            targets: 1
                        },
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]+STR",
                        miss: {
                            damage: "STR"
                        },
                        keywords: [
                            "weapon", "melee", "basic"
                        ]
                    }, {
                        name: "Hammer Rhythm",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: "CON",
                        keywords: [
                            "martial", "melee"
                        ]
                    }, {
                        name: "Guardian's Counter",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: {
                            delivery: "close burst",
                            size: 2,
                            targets: 1
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: "1[W]",
                        keywords: [
                            "martial", "weapon", "melee"
                        ]
                    }, {
                        name: "Power Strike",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: {
                            delivery: "melee",
                            targets: 1
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: "1[W]",
                        keywords: [
                            "martial", "weapon", "melee"
                        ]
                    }, {
                        name: "Come and Get It",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: {
                            area: "close",
                            size: 3,
                            enemiesOnly: true,
                            targets: "any"
                        },
                        toHit: "STR",
                        defense: "Will",
                        damage: "1[W]",
                        miss: {
                            damage: "1[W]"
                        },
                        keywords: [
                            "melee", "martial", "weapon"
                        ]
                    }, {
                        name: "Melee Basic (Battle Wrath)",
                        usage: {
                            frequency: "At-Will"
                        },
                        isMelee: true,
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]+STR",
                        miss: {
                            damage: "CON"
                        },
                        keywords: [
                            "weapon", "melee", "basic", "Battle Wrath"
                        ]
                    }, {
                        name: "Ranged Basic (Battle Wrath)",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+DEX",
                        keywords: [
                            "weapon", "ranged", "basic", "Battle Wrath"
                        ]
                    }, {
                        name: "Battle Guardian (Battle Wrath)",
                        usage: {
                            frequency: "At-Will"
                        },
                        isMelee: true,
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]+STR",
                        miss: {
                            damage: "STR"
                        },
                        keywords: [
                            "weapon", "melee", "basic", "Battle Wrath"
                        ]
                    }, {
                        name: "Hammer Rhythm (Battle Wrath)",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: "CON",
                        keywords: [
                            "martial", "melee", "Battle Wrath"
                        ]
                    }, {
                        name: "Power Strike (Battle Wrath)",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: "1[W]",
                        keywords: [
                            "martial", "weapon", "melee", "Battle Wrath"
                        ]
                    }, {
                        name: "Come and Get It (Battle Wrath)",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: {
                            area: "close",
                            size: 3
                        },
                        toHit: "STR",
                        defense: "Will",
                        damage: "1[W]",
                        miss: {
                            damage: "CON"
                        },
                        keywords: [
                            "psionic", "melee", "Battle Wrath"
                        ]
                    }, {
                        name: "Melee Basic (Defend the Line)",
                        usage: {
                            frequency: "At-Will"
                        },
                        isMelee: true,
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]+STR",
                        miss: {
                            damage: "CON"
                        },
                        keywords: [
                            "weapon", "melee", "basic", "Defend the Line"
                        ]
                    }, {
                        name: "Ranged Basic (Defend the Line)",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+DEX",
                        keywords: [
                            "weapon", "ranged", "basic", "Defend the Line"
                        ]
                    }, {
                        name: "Battle Guardian (Defend the Line)",
                        usage: {
                            frequency: "At-Will"
                        },
                        isMelee: true,
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]+STR",
                        miss: {
                            damage: "STR"
                        },
                        keywords: [
                            "weapon", "melee", "basic", "Defend the Line"
                        ]
                    }, {
                        name: "Hammer Rhythm (Defend the Line)",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: "CON",
                        keywords: [
                            "martial", "melee", "Defend the Line"
                        ]
                    }, {
                        name: "Power Strike (Defend the Line)",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: "1[W]",
                        keywords: [
                            "martial", "weapon", "melee", "Defend the Line"
                        ]
                    }, {
                        name: "Come and Get It (Defend the Line)",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: {
                            area: "close",
                            size: 3
                        },
                        toHit: "STR",
                        defense: "Will",
                        damage: "1[W]",
                        miss: {
                            damage: "CON"
                        },
                        keywords: [
                            "psionic", "melee", "Defend the Line"
                        ]
                    }
                ],
                effects: []
            },
            Festivus: {
                name: "Festivus",
                isPC: true,
                level: 15,
                image: "../images/portraits/festivus.jpg", // "http://www.worldofazolin.com/wiki/images/8/8d/Dragsorc.jpg",
                abilities: {
                    STR: 19,
                    CON: 17,
                    DEX: 11,
                    INT: 18,
                    WIS: 11,
                    CHA: 22
                },
                skills: {
                    acrobatics: 11,
                    arcana: 18,
                    athletics: 15,
                    bluff: 18,
                    diplomacy: 17,
                    dungeoneering: 11,
                    endurance: 14,
                    heal: 11,
                    history: 20,
                    insight: 11,
                    intimidate: 19,
                    nature: 11,
                    perception: 12,
                    religion: 18,
                    stealth: 11,
                    streetwise: 20,
                    thievery: 12
                },
                ap: 1,
                hp: {
                    total: 99
                },
                surges: {
                    perDay: 9,
                    current: 9
                },
                defenses: {
                    ac: 24,
                    fort: 22,
                    ref: 22,
                    will: 26
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
                    }
                ],
                healing: [
                    { name: "Majestic Word", frequency: "2xEncounter", isTempHP: false, usesHealingSurge: true, amount: "HS+2d6+CHA" },
                    { name: "Stirring Shout", frequency: "At-Will", isTempHP: false, usesHealingSurge: false, amount: "CHA" }
                ],
                effects: []
            },
            Kallista: {
                name: "Kallista",
                isPC: true,
                level: 15,
                image: "../images/portraits/kallista.jpg", // "http://www.wizards.com/dnd/images/Dragon_373/11.jpg",
                abilities: {
                    STR: 15,
                    CON: 13,
                    DEX: 22,
                    INT: 15,
                    WIS: 13,
                    CHA: 24
                },
                skills: {
                    acrobatics: 25,
                    arcana: 9,
                    athletics: 21,
                    bluff: 22,
                    diplomacy: 14,
                    dungeoneering: 8,
                    endurance: 8,
                    heal: 8,
                    history: 9,
                    insight: 8,
                    intimidate: 16,
                    nature: 8,
                    perception: 15,
                    religion: 9,
                    stealth: 21,
                    streetwise: 14,
                    thievery: 18
                },
                ap: 1,
                hp: {
                    total: 95
                },
                surges: {
                    perDay: 8,
                    current: 8
                },
                defenses: {
                    ac: 26,
                    fort: 20,
                    ref: 26,
                    will: 25
                },
                resistances: {
                    fire: 12
                },
                init: 13,
                speed: 6,
                weapons: [
                    {
                        name: "Wicked Fang Longsword +3",
                        isMelee: true,
                        enhancement: 3,
                        proficiency: 3,
                        damage: {
                            amount: "1d8",
                            crit: "3d8"
                        }
                    }, {
                        name: "Rebounding Hand Crossbow +2",
                        isMelee: false,
                        enhancement: 2,
                        proficiency: 2,
                        damage: {
                            amount: "1d6",
                            crit: "2d6"
                        }
                    }
                ],
                "implements": [],
                attackBonuses: [
                    {
                        name: "Bloodhunt",
                        foeStatus: [
                            "bloodied"
                        ],
                        toHit: 1
                    }, {
                        name: "Master at Arms",
                        keywords: [
                            "weapon"
                        ],
                        toHit: 1
                    }, {
                        name: "Sneak Attack",
                        foeStatus: [
                            "combat advantage"
                        ],
                        damage: "2d8+2",
                        oncePerRound: true
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
                        name: "Duelist's Flurry",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "DEX",
                        keywords: [
                            "weapon", "martial", "melee"
                        ]
                    }, {
                        name: "Sly Flourish",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+DEX+CHA",
                        keywords: [
                            "weapon", "martial"
                        ]
                    }, {
                        name: "Demonic Frenzy",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: "1d6",
                        keywords: [
                            "elemental"
                        ]
                    }, {
                        name: "Acrobat's Blade Trick",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+DEX",
                        keywords: [
                            "weapon", "martial", "melee"
                        ]
                    }, {
                        name: "Stunning Strike",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+DEX",
                        effects: [ { name: "Stunned", duration: "endAttackerNext" } ],
                        keywords: [
                            "weapon", "martial", "melee"
                        ]
                    }, {
                        name: "Cloud of Steel",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+DEX",
                        keywords: [
                            "weapon", "martial", "ranged"
                        ]
                    }, {
                        name: "Hell's Ram",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "STR^DEX+4",
                        defense: "Fort",
                        damage: "0",
                        effects: [
                            {
                                name: "dazed",
                                duration: "endAttackerNext"
                            }
                        ],
                        keywords: [
                            "martial"
                        ]
                    }, {
                        name: "Bloodbath",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "DEX",
                        defense: "Fort",
                        damage: "1[W]+DEX",
                        effects: [
                            {
                                name: "ongoing damage",
                                amount: "2d6"
                            }
                        ],
                        keywords: [
                            "weapon", "martial"
                        ]
                    }, {
                        name: "Burst Fire",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "DEX",
                        defense: "Ref",
                        damage: "2[W]+DEX",
                        keywords: [
                            "weapon", "martial", "ranged"
                        ]
                    }, {
                        name: "Black Wrath of Hell",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: "2d10",
                        effects: [ { name: "Penalty", amount: "INT^CHA", other: "to hit Kallista", saveEnds: true } ], // TODO: implement penalty against specific creature
                        keywords: [ "racial" ]
                    }/*, {
                        name: "Duelists Prowess",
                        usage: {
                            frequency: "At-Will",
                            action: "Immediate Interrupt"
                        },
                        toHit: "DEX",
                        defense: "Ref",
                        damage: "1[W]+DEX",
                        keywords: [
                            "weapon", "martial", "melee"
                        ]
                    }*/, {
                        name: "Garrote Grip",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "DEX",
                        defense: "Ref",
                        damage: "2[W]+DEX",
                        effects: [
                            { name: "Grab" }
                        ],
                        keywords: [ "melee", "martial", "reliable", "weapon" ]
                    }, {
                        name: "Garrote Grip (3rd failed save)",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "automatic",
                        defense: "Ref",
                        damage: "0",
                        effects: [
                            { name: "Unconscious" }
                        ],
                        keywords: [ "melee", "martial", "reliable", "weapon" ]
                    }, {
                        name: "Sneak Attack",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: "2d8"
                    }
                ],
                effects: []
            },
            Karrion: {
                name: "Karrion",
                isPC: true,
                level: 15,
                image: "../images/portraits/karrion.jpg", // "http://rogueartfx.com/images/tiefling03.jpg",
                abilities: {
                    STR: 21,
                    CON: 17,
                    DEX: 20,
                    INT: 19,
                    WIS: 18,
                    CHA: 17
                },
                skills: {
                    acrobatics: 18,
                    arcana: 11,
                    athletics: 17,
                    bluff: 12,
                    diplomacy: 10,
                    dungeoneering: 16,
                    endurance: 10,
                    heal: 11,
                    history: 11,
                    insight: 11,
                    intimidate: 10,
                    nature: 17,
                    perception: 17,
                    religion: 11,
                    stealth: 19,
                    streetwise: 10,
                    thievery: 12
                },
                ap: 1,
                hp: {
                    total: 99
                },
                surges: {
                    perDay: 9,
                    current: 9
                },
                defenses: {
                    ac: 26,
                    fort: 24,
                    ref: 24,
                    will: 22
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
                    }*/, {
                        name: "Steeling Fury",
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
                        ]
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
                        ]
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
                        ]
                    }, {
                        name: "Spirit Fangs",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "WIS",
                        defense: "Ref",
                        damage: "1d10+WIS",
                        keywords: [
                            "implement", "primal", "spirit"
                        ]
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
                        ]
                    }, {
                        name: "Hunter's Quarry",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: "1d8"
                    }
                ],
                healing: [
                    /* { name: "Boar Assault", frequency: "At-Will", isTempHP: true, usesHealingSurge: false, amount: "WIS" }, */
                    { name: "Invigorating Assault", frequency: "At-Will", isTempHP: true, usesHealingSurge: false, amount: "5+WIS" },
                    { name: "Healing Spirit", frequency: "Encounter", isTempHP: false, usesHealingSurge: true, amount: "HS" },
                    { name: "Healing Spirit (secondary)", frequency: "Encounter", isTempHP: false, usesHealingSurge: false, amount: "3d6" },
                    { name: "Spirit of Sacrifice", frequency: "Encounter", isTempHP: true, usesHealingSurge: false, amount: "7+STR^WIS" }
                ],
                effects: []
            },
            Kitara: {
                name: "Kitara",
                isPC: true,
                level: 15,
                image: "../images/portraits/kitara.jpg", // "http://www.deviantart.com/download/46708270/Maiden_of_the_Mirthless_Smile_by_UdonCrew.jpg",
                abilities: {
                    STR: 17,
                    CON: 15,
                    DEX: 21,
                    INT: 24,
                    WIS: 17,
                    CHA: 18
                },
                skills: {
                    acrobatics: 14,
                    arcana: 19,
                    athletics: 10,
                    bluff: 13,
                    diplomacy: 16,
                    dungeoneering: 10,
                    endurance: 9,
                    heal: 10,
                    history: 14,
                    insight: 10,
                    intimidate: 13,
                    nature: 10,
                    perception: 15,
                    religion: 14,
                    stealth: 15,
                    streetwise: 11,
                    thievery: 17
                },
                ap: 1,
                hp: {
                    total: 97
                },
                surges: {
                    perDay: 9,
                    current: 9
                },
                defenses: {
                    ac: 29,
                    fort: 25,
                    ref: 27,
                    will: 26
                },
                resistances: {
                    psychic: 5 // Mental Block (alternative reward)
                },
                init: 12,
                speed: 8,
                weapons: [
                    {
                        name: "Supremely Vicious Bastard Sword +2",
                        isMelee: true,
                        enhancement: 2,
                        proficiency: 2,
                        damage: {
                            amount: "1d10",
                            crit: "2d8"
                        }
                    }
                ],
                "implements": [
                    {
                        name: "Orb +3",
                        enhancement: 3,
                        crit: "1d6"
                    }, {
                        name: "Supremely Vicious Bastard Sword +2",
                        enhancement: 2,
                        crit: "2d8"
                    }, {
                        name: "Orb of Nimble Thoughts +1",
                        enhancement: 1,
                        crit: "1d6"
                    }
                ],
                attackBonuses: [
                    {
                        name: "Dual Implement Spellcaster",
                        status: [
                            "implement"
                        ],
                        damage: 2 // Assume using the Orb +3, so this is from Supremely Vicious Bastard Sword +2
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
                    }, {
                        name: "Ranged Basic",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: "1[W]+DEX",
                        keywords: [
                            "weapon", "ranged", "basic"
                        ]
                    }, {
                        name: "Magic Missile",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: {
                            amount: "2+INT",
                            type: "force"
                        },
                        keywords: [
                            "arcane", "evocation", "force", "implement"
                        ]
                    }, {
                        name: "Lightning Ring",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: {
                            amount: "5",
                            type: "lightning"
                        },
                        keywords: [
                            "arcane", "bladespell", "lightning"
                        ]
                    }, {
                        name: "Lightning Ring (secondary)",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: {
                            amount: "5",
                            type: "lightning"
                        },
                        keywords: [
                            "arcane", "bladespell", "lightning"
                        ]
                    }, {
                        name: "Shadow Sever",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: {
                            amount: "5",
                            type: "necrotic"
                        },
                        effects: [
                            {
                                name: "Prone"
                            }
                        ],
                        keywords: [
                            "arcane", "bladespell", "necrotic"
                        ]
                    }, {
                        name: "Unseen Hand",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: 12,
                        defense: "AC",
                        damage: {
                            amount: "5",
                            type: "force"
                        },
                        keywords: [
                            "arcane", "bladespell", "force"
                        ]
                    }, {
                        name: "Gaze of the Evil Eye",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: {
                            amount: "2",
                            type: "psychic"
                        },
                        keywords: [
                            "arcane", "psychic"
                        ]
                    }, {
                        name: "Orbmaster's Incendiary Detonation",
                        target: {
                            area: "burst",
                            size: 1,
                            range: 10
                        },
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "INT",
                        defense: "Ref",
                        damage: {
                            amount: "1d6+INT",
                            type: "force"
                        },
                        effects: [
                            "Prone"
                        ],
                        keywords: [
                            "arcane", "evocation", "fire", "implement", "force", "zone"
                        ]
                    }, {
                        name: "Orbmaster's Incendiary Detonation (zone)",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: {
                            area: "burst",
                            size: 1,
                            range: 10
                        },
                        toHit: "automatic",
                        defense: "Ref",
                        damage: {
                            amount: "2",
                            type: "fire"
                        },
                        effects: [
                            "Prone"
                        ],
                        keywords: [
                            "arcane", "evocation", "fire", "force", "zone"
                        ]
                    }, {
                        name: "Force Orb",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "INT",
                        defense: "Ref",
                        damage: {
                            amount: "2d8+INT",
                            type: "force"
                        },
                        keywords: [
                            "arcane", "evocation", "force", "implement"
                        ]
                    }, {
                        name: "Force Orb (secondary)",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: {
                            area: "burst",
                            size: 1,
                            range: 20
                        },
                        toHit: "INT",
                        defense: "Ref",
                        damage: {
                            amount: "1d10+INT",
                            type: "force"
                        },
                        keywords: [
                            "arcane", "evocation", "force", "implement"
                        ]
                    }, {
                        name: "Burning Hands",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: {
                            area: "close blast",
                            size: 5
                        },
                        toHit: "INT",
                        defense: "Ref",
                        damage: {
                            amount: "2d6+INT",
                            type: "fire"
                        },
                        miss: {
                            halfDamage: true
                        },
                        keywords: [
                            "arcane", "evocation", "fire", "implement"
                        ]
                    }, {
                        name: "Skewering Spikes",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: {
                            range: 5
                        },
                        toHit: "INT",
                        defense: "Ref",
                        damage: "1d8+INT",
                        keywords: [
                            "arcane", "evocation", "implement"
                        ]
                    }, {
                        name: "Skewering Spikes (single target)",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: {
                            range: 5
                        },
                        toHit: "INT",
                        defense: "Ref",
                        damage: "2d8+INT",
                        keywords: [
                            "arcane", "evocation", "implement"
                        ]
                    }, {
                        name: "Glorious Presence",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: {
                            area: "close burst",
                            size: 2
                        },
                        toHit: "INT",
                        range: 2,
                        defense: "Will",
                        damage: {
                            amount: "2d6+INT",
                            type: "radiant"
                        },
                        keywords: [
                            "arcane", "charm", "echantment", "implement", "radiant", "close burst"
                        ]
                    }, {
                        name: "Ray of Enfeeblement",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "INT",
                        target: {
                            range: 10
                        },
                        defense: "Fort",
                        damage: {
                            amount: "1d10+INT",
                            type: "necrotic"
                        },
                        effects: [
                            {
                                name: "Weakened",
                                duration: "endAttackerNext"
                            }
                        ],
                        keywords: [
                            "arcane", "implement", "necromancy", "necrotic", "ranged"
                        ]
                    }, {
                        name: "Grim Shadow",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "INT",
                        target: {
                            area: "close blast",
                            size: 3
                        },
                        defense: "Will",
                        damage: {
                            amount: "2d8+INT",
                            type: "necrotic"
                        },
                        effects: [
                            {
                                name: "Attack penalty",
                                amount: -2,
                                duration: "endAttackerNext"
                            }, {
                                name: "Will penalty",
                                amount: -2,
                                duration: "endAttackerNext"
                            }
                        ],
                        keywords: [
                            "arcane", "fear", "implement", "necromancy", "necrotic", "close blast"
                        ]
                    }, {
                        name: "Icy Rays",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: {
                            range: 10
                        },
                        toHit: "INT",
                        defense: "Ref",
                        damage: {
                            amount: "1d10+INT",
                            type: "cold"
                        },
                        effects: [
                            {
                                name: "immobilized",
                                duration: "endAttackerNext"
                            }
                        ],
                        miss: {
                            effects: [
                                {
                                    name: "slowed",
                                    duration: "endAttackerNext"
                                }
                            ]
                        },
                        keywords: [
                            "arcane", "evocation", "cold", "implement", "ranged"
                        ]
                    }, {
                        name: "Pinioning Vortex",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "INT",
                        target: {
                            range: 10
                        },
                        defense: "Fort",
                        damage: "2d6+INT",
                        effects: [
                            {
                                name: "multiple",
                                duration: "startTargetNext",
                                children: [
                                    {
                                        name: "immobilized"
                                    }, {
                                        name: "dazed"
                                    }
                                ]
                            }
                        ],
                        keywords: [
                            "arcane", "evocation", "implement", "ranged"
                        ]
                    }, {
                        name: "Lightning Bolt",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "INT",
                        target: {
                            range: 10
                        },
                        defense: "Ref",
                        damage: {
                            amount: "2d6+INT",
                            type: "lightning"
                        },
                        miss: {
                            halfDamage: true
                        },
                        keywords: [
                            "arcane", "evocation", "implement", "ranged", "lightning"
                        ]
                    }, {
                        name: "Ghoul Strike",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "INT",
                        isMelee: true,
                        target: {
                            range: 5
                        },
                        defense: "Fort",
                        damage: {
                            amount: "2d6+INT",
                            type: "necrotic"
                        },
                        miss: {
                            notExpended: true
                        },
                        effects: [
                            {
                                name: "Immobilized",
                                duration: "endAttackerNext"
                            }
                        ],
                        keywords: [
                            "arcane", "implement", "necromancy", "necrotic", "shadow", "zone", "ranged"
                        ]
                    }, {
                        name: "Ghoul Strike (zone)",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "automatic",
                        target: {
                            area: "close burst",
                            size: 2
                        },
                        defense: "Fort",
                        damage: {
                            amount: "5",
                            type: "necrotic"
                        },
                        effects: [
                            {
                                name: "Combat Advantage"
                            }
                        ],
                        keywords: [
                            "arcane", "implement", "necromancy", "necrotic", "shadow", "zone"
                        ]
                    }, {
                        name: "Thunder Cage",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "INT",
                        target: {
                            range: 10
                        },
                        defense: "Fort",
                        damage: {
                            amount: "2d10+INT",
                            type: "thunder"
                        },
                        keywords: [
                            "arcane", "evocation", "implement", "ranged", "thunder"
                        ]
                    }, {
                        name: "Thunder Cage (secondary)",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "automatic",
                        target: {
                            range: 10
                        },
                        defense: "Fort",
                        damage: {
                            amount: "1d10+INT",
                            type: "thunder"
                        },
                        keywords: [
                            "arcane", "evocation", "implement", "ranged", "thunder"
                        ]
                    }, {
                        name: "Phantom Chasm",
                        usage: {
                            frequency: "Daily"
                        },
                        target: {
                            area: "burst",
                            size: 1,
                            range: 10
                        },
                        toHit: "INT",
                        defense: "Will",
                        damage: {
                            amount: "2d6+INT",
                            type: "psychic"
                        },
                        effects: [
                            "Prone", {
                                name: "immobilized",
                                duration: "endTargetNext"
                            }
                        ],
                        miss: {
                            halfDamage: true,
                            effects: [
                                "Prone"
                            ]
                        },
                        keywords: [
                            "arcane", "illusion", "psychic", "implement", "zone"
                        ]
                    }, {
                        name: "Phantom Chasm (zone)",
                        usage: {
                            frequency: "Daily"
                        },
                        target: {
                            area: "burst",
                            size: 1,
                            range: 10
                        },
                        toHit: "automatic",
                        defense: "Will",
                        damage: "0",
                        effects: [
                            "Prone"
                        ],
                        keywords: [
                            "arcane", "illusion", "psychic", "zone"
                        ]
                    }, {
                        name: "Fountain of Flame",
                        usage: {
                            frequency: "Daily"
                        },
                        target: {
                            area: "burst",
                            size: 1,
                            range: 10
                        },
                        toHit: "INT",
                        defense: "Ref",
                        damage: {
                            amount: "3d8+INT",
                            type: "fire"
                        },
                        miss: {
                            halfDamage: true
                        },
                        keywords: [
                            "arcane", "evocation", "fire", "implement", "zone"
                        ]
                    }, {
                        name: "Fountain of Flame (zone)",
                        usage: {
                            frequency: "Daily"
                        },
                        target: {
                            area: "burst",
                            size: 1,
                            range: 10
                        },
                        toHit: "automatic",
                        defense: "Ref",
                        damage: {
                            amount: "5",
                            type: "fire"
                        },
                        keywords: [
                            "arcane", "evocation", "fire", "zone"
                        ]
                    }, {
                        name: "Slimy Transmutation",
                        usage: {
                            frequency: "Daily"
                        },
                        target: {
                            range: 10
                        },
                        toHit: "INT",
                        defense: "Fort",
                        damage: "0",
                        effects: [
                            {
                                name: "Polymorph (Tiny Toad)",
                                saveEnds: true
                            }
                        ],
                        miss: {
                            effects: [
                                {
                                    name: "Polymorph (Tiny Toad)",
                                    duration: "endTargetNext"
                                }
                            ]
                        },
                        keywords: [
                            "arcane", "implement", "polymorph", "transmutation"
                        ]
                    }, {
                        name: "Acid Arrow",
                        usage: {
                            frequency: "Daily"
                        },
                        target: {
                            range: 20
                        },
                        toHit: "INT",
                        defense: "Ref",
                        damage: {
                            amount: "2d8+INT",
                            type: "acid"
                        },
                        effects: [
                            {
                                name: "ongoing damage",
                                type: "acid",
                                amount: 5,
                                saveEnds: true
                            }
                        ],
                        miss: {
                            halfDamage: true,
                            effects: [
                                {
                                    name: "ongoing damage",
                                    type: "acid",
                                    amount: 2,
                                    saveEnds: true
                                }
                            ]
                        },
                        keywords: [
                            "arcane", "evocation", "acid", "implement"
                        ]
                    }, {
                        name: "Acid Arrow (secondary)",
                        usage: {
                            frequency: "Daily"
                        },
                        target: {
                            area: "burst",
                            size: 1,
                            range: 20
                        },
                        toHit: "INT",
                        defense: "Ref",
                        damage: {
                            amount: "1d8+INT",
                            type: "acid"
                        },
                        effects: [
                            {
                                name: "ongoing damage",
                                type: "acid",
                                amount: 5,
                                saveEnds: true
                            }
                        ],
                        keywords: [
                            "arcane", "evocation", "acid", "implement"
                        ]
                    }, {
                        name: "Rolling Thunder",
                        usage: {
                            frequency: "Daily"
                        },
                        target: {
                            range: 10
                        },
                        toHit: "INT",
                        defense: "Ref",
                        damage: {
                            amount: "3d6+INT",
                            type: "thunder"
                        },
                        miss: {
                            halfDamage: true
                        },
                        keywords: [
                            "arcane", "conjuration", "evocation", "implement", "thunder"
                        ]
                    }, {
                        name: "Rolling Thunder (secondary)",
                        usage: {
                            frequency: "Daily"
                        },
                        target: {
                            range: 10
                        },
                        toHit: "INT",
                        defense: "Ref",
                        damage: {
                            amount: "5",
                            type: "thunder"
                        },
                        keywords: [
                            "arcane", "conjuration", "evocation", "thunder"
                        ]
                    }, {
                        name: "Fireball",
                        usage: {
                            frequency: "Daily"
                        },
                        target: {
                            area: "burst",
                            size: 3,
                            range: 20
                        },
                        toHit: "INT",
                        defense: "Ref",
                        damage: {
                            amount: "4d6+INT",
                            type: "fire"
                        },
                        miss: {
                            halfDamage: true
                        },
                        keywords: [
                            "arcane", "evocation", "implement", "fire"
                        ]
                    }, {
                        name: "Grasp of the Grave",
                        usage: {
                            frequency: "Daily"
                        },
                        target: {
                            area: "burst",
                            size: 2,
                            range: 20,
                            enemiesOnly: true
                        },
                        toHit: "INT",
                        defense: "Ref",
                        damage: {
                            amount: "1d10+INT",
                            type: "necrotic"
                        },
                        effects: [
                            {
                                name: "Dazed",
                                duration: "endAttackerNext"
                            }
                        ],
                        miss: {
                            damage: {
                                amount: "1d10+INT",
                                type: "necrotic"
                            }
                        },
                        keywords: [
                            "arcane", "implement", "necromancy", "necrotic"
                        ]
                    }, {
                        name: "Grasp of the Grave (zone)",
                        usage: {
                            frequency: "Daily"
                        },
                        target: {
                            area: "burst",
                            size: 2,
                            range: 20,
                            enemiesOnly: true
                        },
                        toHit: "automatic",
                        defense: "Ref",
                        damage: {
                            amount: "5",
                            type: "necrotic"
                        },
                        keywords: [
                            "arcane", "necromancy", "necrotic"
                        ]
                    }, {
                        name: "Scattering Shock",
                        usage: {
                            frequency: "Daily"
                        },
                        target: {
                            area: "burst",
                            size: 3,
                            range: 10
                        },
                        toHit: "INT",
                        defense: "Fort",
                        damage: "0",
                        keywords: [
                            "arcane", "evocation", "implement", "lightning"
                        ]
                    }, {
                        name: "Scattering Shock (secondary)",
                        usage: {
                            frequency: "Daily"
                        },
                        target: {
                            area: "creature",
                            size: 1
                        },
                        toHit: "INT",
                        defense: "Ref",
                        damage: {
                            amount: "2d8+INT",
                            type: "lightning"
                        },
                        miss: {
                            halfDamage: true
                        },
                        keywords: [
                            "arcane", "evocation", "implement", "lightning"
                        ]
                    }
                ],
                effects: []
            },
            Lechonero: jQuery.extend(true, {}, Lechonero_base, {
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
                        name: "Rapid Shot",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+DEX",
                        keywords: [
                            "weapon", "martial", "ranged"
                        ]
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
                        ]
                    }, {
                        name: "Hindering Shot",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "2[W]+DEX",
                        effects: [
                            {
                                name: "slowed",
                                duration: "endAttackerNext"
                            }
                        ],
                        keywords: [
                            "weapon", "martial", "ranged"
                        ]
                    }, {
                        name: "Covering Volley",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+DEX",
                        keywords: [
                            "weapon", "martial", "ranged"
                        ]
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
                        ]
                    }, {
                        name: "Spikes of the Manticore",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "2[W]+DEX",
                        keywords: [
                            "weapon", "martial", "ranged"
                        ]
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
                        ]
                    }, {
                        name: "Shaft Splitter",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "DEX",
                        defense: "Ref",
                        damage: "2[W]+DEX",
                        keywords: [
                            "weapon", "martial", "ranged"
                        ]
                    }/*, {
                        name: "Sure Shot",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "3[W]+DEX",
                        keywords: [
                            "weapon", "martial", "ranged"
                        ]
                    }*/, {
                        name: "Flying Steel",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "DEX",
                        defense: "AC",
                        damage: "2[W]+DEX",
                        keywords: [
                            "weapon", "martial", "ranged"
                        ]
                    }, {
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
                        ]
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
                        ]
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
                        ]
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
                        ]
                    }, {
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
                        ]
                    }, {
                        name: "Hunter's Quarry",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: "1d8"
                    }
                ]
            }),
            Balugh: jQuery.extend(true, {}, Lechonero_base, {
                name: "Balugh",
                image: "../images/portraits/balugh.jpg", // http://images3.wikia.nocookie.net/__cb20100421223543/dndawokenheroes/images/9/93/Redspawn_Firebelcher.png
                hp: {
                    total: 16 + Lechonero_base.level * 10
                },
                surges: {
                    perDay: 2,
                    current: 2
                },
                /* Use Lechonero's abilities for all attacks
                abilities: {
                    STR: 20,
                    CON: 17,
                    DEX: 12,
                    INT: 2,
                    WIS: 16,
                    CHA: 6
                },*/
                skills: {
                    acrobatics: Math.floor(Lechonero_base.level / 2) + 1,
                    arcana: Math.floor(Lechonero_base.level / 2) - 4,
                    athletics: Math.floor(Lechonero_base.level / 2) + 10,
                    bluff: Math.floor(Lechonero_base.level / 2) - 2,
                    diplomacy: Math.floor(Lechonero_base.level / 2) + 1,
                    dungeoneering: Math.floor(Lechonero_base.level / 2) - 2,
                    endurance: Math.floor(Lechonero_base.level / 2) + 7,
                    heal: Math.floor(Lechonero_base.level / 2) + 1,
                    history: Math.floor(Lechonero_base.level / 2) - 2,
                    insight: Math.floor(Lechonero_base.level / 2) + 1,
                    intimidate: Math.floor(Lechonero_base.level / 2) - 2,
                    nature: Math.floor(Lechonero_base.level / 2) + 1,
                    perception: Lechonero_base.skills.perception + 2,
                    religion: Math.floor(Lechonero_base.level / 2) - 2,
                    stealth: Math.floor(Lechonero_base.level / 2) + 1,
                    streetwise: Math.floor(Lechonero_base.level / 2) - 2,
                    thievery: Math.floor(Lechonero_base.level / 2) + 1
                },
                defenses: {
                    ac: 12 + Lechonero_base.level,
                    fort: 14 + Lechonero_base.level,
                    ref: 10 + Lechonero_base.level,
                    will: 12 + Lechonero_base.level
                },
                speed: 5,
                attacks: [
                    {
                        name: "Animal Attack",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "WIS+5",
                        defense: "AC",
                        damage: "1d12+3+WIS+CON",
                        keywords: [
                            "melee", "beast", "basic"
                        ]
                    }
                ]
            }),
            Ringo: {
                name: "Ringo",
                isPC: true,
                level: 5,
                image: "../images/portraits/ringo.jpg", // http://beta.ditzie.com/gallery/main.php?g2_view=core.DownloadItem&g2_itemId=14896&g2_serialNumber=1
                ap: 0,
                hp: {
                    total: 62
                },
                surges: {
                    perDay: 0,
                    current: 0
                },
                abilities: {
                    STR: 18,
                    CON: 10,
                    DEX: 14,
                    INT: 1,
                    WIS: 12,
                    CHA: 8
                },
                skills: {
                    acrobatics: 4,
                    arcana: -3,
                    athletics: 6,
                    bluff: 1,
                    diplomacy: 3,
                    dungeoneering: -3,
                    endurance: 2,
                    heal: 3,
                    history: -3,
                    insight: 3,
                    intimidate: 1,
                    nature: 3,
                    perception: 3,
                    religion: 3,
                    stealth: 4,
                    streetwise: 1,
                    thievery: 4
                },
                defenses: {
                    ac: 19,
                    fort: 17,
                    ref: 13,
                    will: 14
                },
                init: 2,
                speed: 6,
                attacks: [
                    {
                        name: "Bite",
                        usage: {
                            frequency: "At-Will"
                        },
                        range: "reach",
                        toHit: 10,
                        defense: "AC",
                        damage: "1d10+4",
                        keywords: [
                            "melee", "basic"
                        ]
                    }, {
                        name: "Entangling Spittle",
                        usage: {
                            frequency: "Recharge",
                            recharge: 4
                        },
                        target: {
                            range: 5
                        },
                        toHit: 8,
                        defense: "Ref",
                        damage: "0",
                        effects: [
                            {
                                name: "immobilized",
                                aveEnds: true
                            }
                        ],
                        keywords: [
                            "ranged"
                        ]
                    }
                ]
            },
            Smudge: {
                name: "Smudge",
                isPC: true,
                level: 12,
                image: "../images/portraits/redspawn_firebelcher.png", // http://images3.wikia.nocookie.net/__cb20100421223543/dndawokenheroes/images/9/93/Redspawn_Firebelcher.png
                ap: 0,
                hp: {
                    total: 97
                },
                surges: {
                    perDay: 0,
                    current: 0
                },
                abilities: {
                    STR: 18,
                    CON: 13,
                    DEX: 19,
                    INT: 2,
                    WIS: 13,
                    CHA: 8
                },
                skills: {
                    acrobatics: 10,
                    arcana: 2,
                    athletics: 10,
                    bluff: 5,
                    diplomacy: 7,
                    dungeoneering: 2,
                    endurance: 7,
                    heal: 7,
                    history: 2,
                    insight: 7,
                    intimidate: 5,
                    nature: 7,
                    perception: 6,
                    religion: 7,
                    stealth: 10,
                    streetwise: 5,
                    thievery: 10
                },
                defenses: {
                    ac: 25,
                    fort: 25,
                    ref: 22,
                    will: 21
                },
                init: 7,
                speed: 4,
                attacks: [
                    {
                        name: "Bite",
                        usage: {
                            frequency: "At-Will"
                        },
                        range: "melee",
                        toHit: 16,
                        defense: "AC",
                        damage: {
                            amount: "1d10+4",
                            type: "fire"
                        },
                        effects: [
                            {
                                name: "ongoing damage",
                                amount: 5,
                                type: "fire",
                                saveEnds: true
                            }
                        ],
                        keywords: [
                            "melee", "fire", "basic"
                        ]
                    }, {
                        name: "Fire Belch",
                        usage: {
                            frequency: "At-Will"
                        },
                        target: {
                            range: 12
                        },
                        toHit: 15,
                        defense: "Ref",
                        damage: {
                            amount: "2d6+1",
                            type: "fire"
                        },
                        effects: [
                            {
                                name: "ongoing damage",
                                amount: 5,
                                type: "fire",
                                saveEnds: true
                            }
                        ],
                        keywords: [
                            "ranged", "fire", "basic"
                        ]
                    }, {
                        name: "Fire Burst",
                        usage: {
                            frequency: "Recharge",
                            recharge: 5
                        },
                        target: {
                            area: "burst",
                            size: 2,
                            range: 10
                        },
                        toHit: 15,
                        defense: "Ref",
                        damage: {
                            amount: "3d6+1",
                            type: "fire"
                        },
                        effects: [
                            {
                                name: "ongoing damage",
                                amount: 5,
                                type: "fire",
                                saveEnds: true
                            }
                        ],
                        miss: {
                            halfDamage: true
                        },
                        keywords: [
                            "ranged", "fire"
                        ]
                    }
                ]
            },
            Melvin: {
                name: "Melvin",
                isPC: true,
                level: 10,
                image: "../images/portraits/melvin.jpg",
                abilities: {
                    STR: 18,
                    CON: 18,
                    DEX: 19,
                    INT: 14,
                    WIS: 19,
                    CHA: 14
                },
                skills: {
                    acrobatics: 16,
                    arcana: 7,
                    athletics: 16,
                    bluff: 7,
                    diplomacy: 7,
                    dungeoneering: 9,
                    endurance: 9,
                    heal: 9,
                    history: 7,
                    insight: 10,
                    intimidate: 7,
                    nature: 11,
                    perception: 19,
                    religion: 7,
                    stealth: 14,
                    streetwise: 7,
                    thievery: 9
                },
                ap: 1,
                hp: {
                    total: 86
                },
                surges: {
                    perDay: 12,
                    current: 12
                },
                defenses: {
                    ac: 26,
                    fort: 27,
                    ref: 26,
                    will: 26
                },
                init: 11,
                speed: 8,
                weapons: [
                    {
                        name: "Monk unarmed strike (Iron Body Ki Focus +2)",
                        isMelee: true,
                        enhancement: 2,
                        proficiency: 0,
                        damage: {
                            amount: "1d8",
                            crit: "2d10"
                        }
                    }, {
                        name: "Monk unarmed strike (Abduction Ki Focus +1)",
                        isMelee: true,
                        enhancement: 1,
                        proficiency: 0,
                        damage: {
                            amount: "1d8",
                            crit: "1d6"
                        }
                    }, {
                        name: "Rhythm Blade Dagger +1",
                        isMelee: true,
                        enhancement: 1,
                        proficiency: 2,
                        damage: {
                            amount: "1d4",
                            crit: "1d6"
                        }
                    }
                ],
                "implements": [
                    {
                        name: "Iron Body Ki Focus +2",
                        enhancement: 2,
                        crit: "2d10"
                    }, {
                        name: "Abduction Ki Focus +1",
                        enhancement: 1,
                        crit: "1d6"
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
                        name: "Dancing Cobra",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "DEX",
                        defense: "Ref",
                        damage: "1d10+DEX",
                        keywords: [
                            "full discipline", "implement", "psionic", "melee"
                        ]
                    }, {
                        name: "Five Storms",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "DEX",
                        defense: "Ref",
                        damage: "1d8+DEX",
                        keywords: [
                            "full discipline", "implement", "psionic", "melee", "close burst"
                        ]
                    }, {
                        name: "Centered Flurry of Blows",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: "2+WIS",
                        keywords: [
                            "psionic", "melee"
                        ]
                    }, {
                        name: "Drunken Monkey",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "DEX",
                        defense: "Will",
                        damage: "1d8+DEX",
                        keywords: [
                            "full discipline", "implement", "psionic", "melee"
                        ]
                    }, {
                        name: "Eternal Mountain",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "DEX",
                        defense: "Will",
                        damage: "2d8+DEX",
                        effects: [
                            "Prone"
                        ],
                        keywords: [
                            "full discipline", "implement", "psionic", "melee", "close burst"
                        ]
                    }, {
                        name: "Wind Fury Assault",
                        usage: {
                            frequency: "Encounter"
                        },
                        isMelee: true,
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+WIS",
                        keywords: [
                            "elemental", "melee", "weapon"
                        ]
                    }, {
                        name: "Arc of the Flashing Storm",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "DEX",
                        defense: "Ref",
                        damage: "2d10+DEX",
                        effects: [
                            {
                                name: "attack penalty",
                                amount: -2,
                                duration: "endAttackerNext"
                            }
                        ],
                        keywords: [
                            "full discipline", "implement", "psionic", "melee", "lightning", "teleportation"
                        ]
                    }, {
                        name: "Goring Charge",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "DEX+4",
                        defense: "AC",
                        damage: "1d6+DEX",
                        effects: [
                            "Prone"
                        ],
                        keywords: [
                            "racial", "melee", "basic"
                        ]
                    }, {
                        name: "Masterful Spiral",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "DEX",
                        defense: "Ref",
                        damage: {
                            amount: "3d8+DEX",
                            type: "force"
                        },
                        keywords: [
                            "force", "implement", "psionic", "melee", "close burst", "miss half", "stance"
                        ]
                    }, {
                        name: "One Hundred Leaves",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "DEX",
                        defense: "Ref",
                        damage: "3d8+DEX",
                        keywords: [
                            "implement", "psionic", "melee", "close blast", "miss half"
                        ]
                    }, {
                        name: "Strength to Weakness",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "DEX",
                        defense: "Ref",
                        damage: "0",
                        effects: [
                            {
                                name: "ongoing damage",
                                amount: "15+DEX"
                            }
                        ],
                        keywords: [
                            "implement", "psionic", "melee"
                        ]
                    }
                ],
                effects: []
            },
            "Tokk'it": {
                name: "Tokk'it",
                isPC: true,
                level: 11,
                image: "../images/portraits/tokk_it.jpg", // http://images.community.wizards.com/community.wizards.com/user/sotp_seamus/character_pictures/4223f53dc5c63a22aab6cc8ac8031d16.jpg?v=115650
                ap: 0,
                hp: {
                    total: 108
                },
                surges: {
                    perDay: 12,
                    current: 12
                },
                defenses: {
                    ac: 27,
                    fort: 22,
                    ref: 23,
                    will: 23
                },
                init: 12,
                speed: {
                    walk: 7,
                    jump: 5
                },
                abilities: {
                    STR: 15,
                    CON: 12,
                    DEX: 17,
                    INT: 10,
                    WIS: 16,
                    CHA: 11
                },
                skills: {
                    acrobatics: 15,
                    arcana: 0,
                    athletics: 9,
                    bluff: 0,
                    diplomacy: 0,
                    dungeoneering: 0,
                    endurance: 0,
                    heal: 0,
                    history: 0,
                    insight: 13,
                    intimidate: 0,
                    nature: 0,
                    perception: 13,
                    religion: 0,
                    stealth: 0,
                    streetwise: 0,
                    thievery: 0
                },
                attacks: [
                    {
                        name: "Unarmed Strike",
                        usage: {
                            frequency: "At-Will"
                        },
                        range: "melee",
                        toHit: 17,
                        defense: "AC",
                        damage: "2d8+3",
                        keywords: [
                            "melee", "basic"
                        ]
                    }, {
                        name: "Stunning Strike",
                        usage: {
                            frequency: "At-Will"
                        },
                        range: "melee",
                        toHit: 14,
                        defense: "Fort",
                        damage: "1d8+3",
                        effects: [
                            {
                                name: "Stunned",
                                duration: "endAttackerNext"
                            }
                        ],
                        keywords: [
                            "melee"
                        ]
                    }, {
                        name: "Trace Chance",
                        usage: {
                            frequency: "Recharge",
                            recharge: 6
                        },
                        range: 5,
                        toHit: "automatic",
                        defense: "AC",
                        damage: "0",
                        effects: [
                            {
                                name: "NextMeleeHitIsACrit",
                                duration: "endAttackerNext"
                            }
                        ],
                        keywords: [
                            "ranged"
                        ]
                    }
                ]
            },
            "Amyria": {
                name: "Amyria",
                isPC: true,
                level: 14,
                image: "../images/portraits/amyria.jpg",
                ap: 1,
                hp: {
                    total: 252
                },
                surges: {
                    perDay: 0,
                    current: 0
                },
                defenses: {
                    ac: 30,
                    fort: 24,
                    ref: 27,
                    will: 28
                },
                resistances: {
                    radiant: 10
                },
                savingThrows: 2,
                init: 16,
                speed: {
                    walk: 8
                },
                abilities: {
                    STR: 10,
                    CON: 12,
                    DEX: 12,
                    INT: 18,
                    WIS: 21,
                    CHA: 16
                },
                skills: {
                    acrobatics: 0,
                    arcana: 0,
                    athletics: 0,
                    bluff: 0,
                    diplomacy: 15,
                    dungeoneering: 0,
                    endurance: 0,
                    heal: 0,
                    history: 0,
                    insight: 0,
                    intimidate: 0,
                    nature: 0,
                    perception: 12,
                    religion: 17,
                    stealth: 0,
                    streetwise: 0,
                    thievery: 0
                },
                attacks: [
                    {
                        name: "Longsword",
                        usage: {
                            frequency: "At-Will"
                        },
                        range: "melee",
                        toHit: 21,
                        defense: "AC",
                        damage: "1d8+7",
                        effects: [ { name: "Marked", duration: "endAttackerNext" } ],
                        keywords: [
                            "melee", "basic", "radiant", "weapon"
                        ]
                    }, {
                        name: "Retributive Strike",
                        usage: {
                            frequency: "At-Will"
                        },
                        range: "melee",
                        toHit: "automatic",
                        defense: "AC",
                        damage: { amount: "7", type: "radiant" },
                        keywords: [
                            "melee", "radiant"
                        ]
                    }, {
                        name: "Crusader's Assault",
                        usage: {
                            frequency: "At-Will"
                        },
                        range: "melee",
                        toHit: 21,
                        defense: "AC",
                        damage: [ { amount: "1d8+7" }, { amount: "1d8", type: "radiant" } ],
                        keywords: [
                            "melee", "radiant", "weapon"
                        ]
                    }, {
                        name: "Bahamut's Accusing Eye",
                        usage: {
                            frequency: "At-Will"
                        },
                        target: { range: 10 },
                        toHit: 18,
                        defense: "Ref",
                        damage: { amount: "2d8+7", type: [ "cold", "radiant" ] },
                        effects: [ { name: "multiple", saveEnds: true, children: [ { name: "ongoing damage", amount: "5", type: [ "cold", "radiant" ] }, { name: "Slowed" } ] } ],
                        keywords: [
                            "ranged", "cold", "radiant"
                        ]
                    }
                ]
            }
        };
    };
})(window.jQuery);
