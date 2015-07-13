/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Camulos",
        [ "creature.helpers", "party.level", "jQuery", "html" ],
        function(CH, partyLevel, jQuery, descriptions) {
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
                    new CH.Power({
                        name: "Melee Basic",
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]+STR",
                        miss: {
                            damage: "CON"
                        },
                        keywords: [
                            "weapon", "basic"
                        ]
                    }).atWill().melee(),
                    CH.rangedBasic,
                    new CH.Power({
                        name: "Battle Guardian",
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]+STR",
                        miss: {
                            damage: "STR"
                        },
                        keywords: [
                            "weapon", "basic"
                        ]
                    }).atWill().melee(),
                    new CH.Power({
                        name: "Hammer Rhythm",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "CON",
                        keywords: [
                            "martial"
                        ]
                    }).atWill(),
                    new CH.Power({
                        name: "Guardian's Counter",
                        target: {
                            targets: 1
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: "1[W]",
                        keywords: [
                            "martial", "weapon", "melee"
                        ]
                    }).encounter().closeBurst(2),
                    new CH.Power({
                        name: "Power Strike",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "1[W]",
                        keywords: [
                            "martial", "weapon"
                        ]
                    }).encounter().melee(),
                    new CH.Power({
                        name: "Come and Get It",
                        toHit: "STR",
                        defense: "Will",
                        damage: "1[W]",
                        miss: {
                            damage: "1[W]"
                        },
                        keywords: [
                            "melee", "martial", "weapon"
                        ]
                    }).encounter().closeBurst(3, true),
                    new CH.Power({
                        name: "Melee Basic (Battle Wrath)",
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]+STR",
                        miss: {
                            damage: "CON"
                        },
                        keywords: [
                            "weapon", "basic", "Battle Wrath"
                        ],
                        description: descriptions[ "Battle Wrath" ]
                    }).atWill().melee(),
                    new CH.Power({
                        name: "Ranged Basic (Battle Wrath)",
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+DEX",
                        keywords: [
                            "weapon", "basic", "Battle Wrath"
                        ],
                        description: descriptions[ "Battle Wrath" ]
                    }).atWill().ranged(),
                    new CH.Power({
                        name: "Battle Guardian (Battle Wrath)",
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]+STR",
                        miss: {
                            damage: "STR"
                        },
                        keywords: [
                            "weapon", "basic", "Battle Wrath"
                        ],
                        description: descriptions[ "Battle Guardian" ]
                    }).atWill().melee(),
                    new CH.Power({
                        name: "Hammer Rhythm (Battle Wrath)",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "CON",
                        keywords: [
                            "martial", "Battle Wrath"
                        ],
                        description: descriptions[ "Hammer Rhythm" ]
                    }).atWill().melee(),
                    new CH.Power({
                        name: "Power Strike (Battle Wrath)",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "1[W]",
                        keywords: [
                            "martial", "weapon", "Battle Wrath"
                        ],
                        description: descriptions[ "Power Strike" ]
                    }).encounter().melee(),
                    new CH.Power({
                        name: "Come and Get It (Battle Wrath)",
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
                    }).encounter().closeBurst(3, true),
                    new CH.Power({
                        name: "Melee Basic (Defend the Line)",
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]+STR",
                        miss: {
                            damage: "CON"
                        },
                        keywords: [
                            "weapon", "basic", "Defend the Line"
                        ],
                        description: descriptions[ "Defend the Line" ]
                    }).atWill().melee(),
                    new CH.Power({
                        name: "Ranged Basic (Defend the Line)",
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+DEX",
                        keywords: [
                            "weapon", "basic", "Defend the Line"
                        ],
                        description: descriptions[ "Defend the Line" ]
                    }).atWill().ranged(),
                    new CH.Power({
                        name: "Battle Guardian (Defend the Line)",
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]+STR",
                        miss: {
                            damage: "STR"
                        },
                        keywords: [
                            "weapon", "basic", "Defend the Line"
                        ],
                        description: descriptions[ "Battle Guardian" ]
                    }).atWill().melee(),
                    new CH.Power({
                        name: "Hammer Rhythm (Defend the Line)",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "CON",
                        keywords: [
                            "martial", "Defend the Line"
                        ],
                        description: descriptions[ "Hammer Rhythm" ]
                    }).atWill().melee(),
                    new CH.Power({
                        name: "Power Strike (Defend the Line)",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "1[W]",
                        keywords: [
                            "martial", "weapon", "Defend the Line"
                        ],
                        description: descriptions[ "Power Strike" ]
                    }).encounter().melee(),
                    new CH.Power({
                        name: "Come and Get It (Defend the Line)",
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
                    }).encounter().closeBurst(3, true)
                ],
                effects: []
            };
            Camulos.hp.total = 15 + Camulos.abilities.CON + (6 * (partyLevel - 1));
            Camulos.skills = CH.skills(Camulos, {
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