/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Bin",
        [ "creature.helpers", "party.level", "jQuery", "descriptions" ],
        function(helpers, partyLevel, jQuery, descriptions) {
            var Bin;
            Bin = {
                name: "Bin",
                isPC: true,
                level: partyLevel,
                image: "../images/portraits/bin.jpg", // "http://wizards.com/dnd/images/386_wr_changeling.jpg",
                abilities: {
                    STR: 15,
                    CON: 18,
                    DEX: 16,
                    INT: 23,
                    WIS: 20,
                    CHA: 12
                },
                ap: 1,
                hp: {
                },
                surges: {
                    perDay: 10,
                    current: 10
                },
                defenses: {
                    ac: 28,
                    fort: 25,
                    ref: 26,
                    will: 27
                },
                resistances: { cold: 10 }, // technically the energy type is random after each extended rest "Chaos touched" paragon path feature
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
                        ],
                        description: ""
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
                        ],
                        description: ""
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
                        ],
                        description: descriptions[ "Magic Weapon" ]
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
                        ],
                        description: descriptions[ "Thundering Armor" ]
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
                        ],
                        description: descriptions[ "Stone Panoply" ]
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
                        ],
                        description: descriptions[ "Lightning Sphere" ]
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
                        ],
                        description: descriptions[ "Vampiric Weapons" ]
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
                        keywords: [ "arcane", "force", "implement", "ranged" ],
                        description: descriptions[ "Energy Shroud" ]
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
                        ],
                        description: descriptions[ "Elemental Cascade" ]
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
                     ],
                     description: descriptions[ "Caustic Rampart" ]
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
                        ],
                        description: descriptions[ "Lightning Motes" ]
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
                        ],
                        description: descriptions[ "Clockroach Swarm" ]
                    }
                ],
                buffs: [
                    {
                        name: "Vampiric Weapons",
                        usage: {
                            frequency: "Encounter"
                        },
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: false,
                            amount: "1d6+CON"
                        },
                        description: descriptions[ "Vampiric Weapons" ]
                    },
                    {
                        name: "Healing Infusion: Curative Admixture",
                        usage: {
                            frequency: "Encounter",
                            perEncounter: 2
                        },
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: false,
                            amount: "WIS+6+HS"
                        },
                        description: descriptions[ "Healing Infusion: Curative Admixture" ]
                    },
                    {
                        name: "Healing Infusion: Resistive Formula",
                        usage: {
                            frequency: "Encounter",
                            perEncounter: 2
                        },
                        healing: {
                            isTempHP: true,
                            usesHealingSurge: false,
                            amount: "CON+CON+HS"
                        },
                        description: descriptions[ "Healing Infusion: Resistive Formula" ]
                    },
                    {
                        name: "Recuperative Enchantment",
                        usage: {
                            frequency: "Encounter"
                        },
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: false,
                            amount: "HS"
                        },
                        description: descriptions[ "Recuperative Enchantment" ]
                    },
                    {
                        name: "Shared Valor Leather Armor",
                        usage: {
                            frequency: "At-Will"
                        },
                        healing: {
                            isTempHP: true,
                            usesHealingSurge: false,
                            amount: "5"
                        },
                        description: descriptions[ "Shared Valor Armor" ]
                    }
                ],
                effects: []
            };
            Bin.hp.total = 12 +
                Bin.abilities.CON +
                (5 * (partyLevel - 1));
            Bin.skills = helpers.skills(Bin, { arcana: 5, dungeoneering: 5, endurance: 2, history: 5, perception: 5, thievery: 5 });
            return Bin;
        },
        false
    );

})();