/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Melvin",
        [ "creature.helpers", "party.level", "jQuery" ],
        function(helpers, partyLevel, jQuery) {
            var Melvin;
            Melvin = {
                name: "Melvin",
                isPC: true,
                level: partyLevel,
                image: "../images/portraits/melvin.jpg",
                abilities: {
                    STR: 18,
                    CON: 18,
                    DEX: 19,
                    INT: 14,
                    WIS: 19,
                    CHA: 14
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
            };
            Melvin.hp.total = 12 + Melvin.abilities.CON + (5 * (partyLevel - 1));
            Melvin.skills = helpers.skills(Melvin, {
                acrobatics: 5,
                athletics: 5,
                perception: 5,
                stealth: 5
            });
            return Melvin;
        },
        false
    );

})();