/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Camulos",
        [ "creature.helpers", "party.level", "jQuery", "descriptions" ],
        function(helpers, partyLevel, jQuery, descriptions) {
            var Camulos;
            Camulos = {
                name: "Camulos",
                isPC: true,
                level: partyLevel,
                image: "../images/portraits/camulos.png",
                abilities: {
                    STR: 24,
                    CON: 20,
                    DEX: 12,
                    INT: 11,
                    WIS: 11,
                    CHA: 9
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
                    ac: 31,
                    fort: 29,
                    ref: 23,
                    will: 21
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
                        ],
                        description: descriptions[ "Battle Guardian" ]
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
                        ],
                        description: descriptions[ "Hammer Rhythm" ]
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
                        ],
                        description: descriptions[ "Guardian's Counter" ]
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
                        ],
                        description: descriptions[ "Power Strike" ]
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
                        ],
                        description: descriptions[ "Come and Get It" ]
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
                        ],
                        description: descriptions[ "Battle Wrath" ]
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
                        ],
                        description: descriptions[ "Battle Wrath" ]
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
                        ],
                        description: descriptions[ "Battle Guardian" ]
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
                        ],
                        description: descriptions[ "Hammer Rhythm" ]
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
                        ],
                        description: descriptions[ "Power Strike" ]
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
                        ],
                        description: descriptions[ "Come and Get It" ]
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
                        ],
                        description: descriptions[ "Defend the Line" ]
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
                        ],
                        description: descriptions[ "Defend the Line" ]
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
                        ],
                        description: descriptions[ "Battle Guardian" ]
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
                        ],
                        description: descriptions[ "Hammer Rhythm" ]
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
                        ],
                        description: descriptions[ "Power Strike" ]
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
                        ],
                        description: descriptions[ "Come and Get It" ]
                    }
                ],
                effects: []
            };
            Camulos.hp.total = 15 + helpers.mod(Camulos.abilities.CON) + (6 * partyLevel);
            Camulos.skills = helpers.skills(Camulos, {
                athletics: 5,
                endurance: 5,
                heal: 5,
                insight: 2, // Guardian level 5 feature
                perception: 2 // Guardian level 5 feature
            });
            return Camulos;
        },
        false
    );

})();