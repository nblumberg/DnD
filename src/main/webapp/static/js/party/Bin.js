/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Bin",
        [ "creature.helpers", "party.level", "jQuery", "html" ],
        function(CH, partyLevel, jQuery, descriptions) {
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
                    CH.meleeBasic,
                    CH.rangedBasic,
                    new CH.Power({
                        name: "Magic Weapon",
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
                    }).atWill(),
                    new CH.Power({
                        name: "Thundering Armor",
                        target: {
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
                    }).atWill().closeBurst(10),
                    new CH.Power({
                        name: "Stone Panoply",
                        toHit: "INT",
                        defense: "AC",
                        damage: "2[W]+INT",
                        keywords: [
                            "elemental", "weapon"
                        ]
                    }).encounter().closeBurst(1, false),
                    new CH.Power({
                        name: "Lightning Sphere",
                        toHit: "INT",
                        defense: "Fort",
                        damage: {
                            amount: "1d8+INT",
                            type: "lightning"
                        },
                        keywords: [
                            "arcane", "implement", "lightning"
                        ]
                    }).encounter().burst(1, 10, true),
                    new CH.Power({
                        name: "Vampiric Weapons",
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
                    }).encounter(),
                    new CH.Power({
                        name: "Energy Shroud",
                        toHit: "INT",
                        defense: "Ref",
                        damage: {
                            amount: "2d10+INT",
                            type: "force"
                        },
                        keywords: [ "arcane", "force", "implement", "ranged" ]
                    }).encounter().closeBurst(2),
                    new CH.Power({
                        name: "Elemental Cascade",
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
                    }).encounter()
                    /*, {
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
                     } */,
                    new CH.Power({
                        name: "Lightning Motes",
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
                    }).daily().closeBurst(3, true),
                    new CH.Power({
                        name: "Clockroach Swarm",
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
                    }).daily().blast(5, true)
                ],
                buffs: [
                    new CH.Power({
                        name: "Vampiric Weapons",
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: false,
                            amount: "1d6+CON"
                        }
                    }).atWill(),
                    new CH.Power({
                        name: "Healing Infusion: Curative Admixture",
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: false,
                            amount: "WIS+6+HS"
                        }
                    }).encounter(2),
                    new CH.Power({
                        name: "Healing Infusion: Resistive Formula",
                        healing: {
                            isTempHP: true,
                            usesHealingSurge: false,
                            amount: "CON+CON+HS"
                        }
                    }).encounter(2),
                    new CH.Power({
                        name: "Recuperative Enchantment",
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: false,
                            amount: "HS"
                        }
                    }).encounter(),
                    new CH.Power({
                        name: "Shared Valor Armor",
                        healing: {
                            isTempHP: true,
                            usesHealingSurge: false,
                            amount: "5"
                        }
                    }).atWill()
                ],
                effects: []
            };
            Bin.hp.total = 12 +
                Bin.abilities.CON +
                (5 * (partyLevel - 1));
            Bin.skills = CH.skills(Bin, { arcana: 5, dungeoneering: 5, endurance: 2, history: 5, perception: 5, thievery: 5 });
            return Bin;
        },
        false
    );

})();