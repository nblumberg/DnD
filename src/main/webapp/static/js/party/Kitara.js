/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Kitara",
        [ "creature.helpers", "party.level", "jQuery", "descriptions" ],
        function(helpers, partyLevel, jQuery, descriptions) {
            var Kitara;
            Kitara = {
                name: "Kitara",
                isPC: true,
                level: partyLevel,
                image: "../images/portraits/kitara.jpg", // "http://www.deviantart.com/download/46708270/Maiden_of_the_Mirthless_Smile_by_UdonCrew.jpg",
                abilities: {
                    STR: 17,
                    CON: 15,
                    DEX: 21,
                    INT: 24,
                    WIS: 17,
                    CHA: 18
                },
                ap: 1,
                hp: {
                },
                surges: {
                    perDay: 9,
                    current: 9
                },
                defenses: {
                    ac: 30,
                    fort: 26,
                    ref: 28,
                    will: 27
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
                        ],
                        description: descriptions[ "Magic Missile" ]
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
                        ],
                        description: descriptions[ "Lightning Ring" ]
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
                        ],
                        description: descriptions[ "Lightning Ring" ]
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
                        ],
                        description: descriptions[ "Shadow Sever" ]
                    }, {
                        name: "Unseen Hand",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: {
                            amount: "5",
                            type: "force"
                        },
                        keywords: [
                            "arcane", "bladespell", "force"
                        ],
                        description: descriptions[ "Unseen Hand" ]
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
                        ],
                        description: descriptions[ "Gaze of the Evil Eye" ]
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
                        ],
                        description: descriptions[ "Orbmaster's Incendiary Detonation" ]
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
                        ],
                        description: descriptions[ "Orbmaster's Incendiary Detonation" ]
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
                        ],
                        description: descriptions[ "Force Orb" ]
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
                        ],
                        description: descriptions[ "Force Orb" ]
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
                        ],
                        description: descriptions[ "Burning Hands" ]
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
                        ],
                        description: descriptions[ "Skewering Spikes" ]
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
                        ],
                        description: descriptions[ "Skewering Spikes" ]
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
                        ],
                        description: descriptions[ "Glorious Presence" ]
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
                        ],
                        description: descriptions[ "Ray of Enfeeblement" ]
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
                        ],
                        description: descriptions[ "Grim Shadow" ]
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
                        ],
                        description: descriptions[ "Icy Rays" ]
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
                        ],
                        description: descriptions[ "Pinioning Vortex" ]
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
                        ],
                        description: descriptions[ "Lightning Bolt" ]
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
                        ],
                        description: descriptions[ "Ghoul Strike" ]
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
                        ],
                        description: descriptions[ "Ghoul Strike" ]
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
                        ],
                        description: descriptions[ "Thunder Cage" ]
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
                        ],
                        description: descriptions[ "Thunder Cage" ]
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
                        ],
                        description: descriptions[ "Phantom Chasm" ]
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
                        ],
                        description: descriptions[ "Phantom Chasm" ]
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
                        ],
                        description: descriptions[ "Fountain of Flame" ]
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
                        ],
                        description: descriptions[ "Fountain of Flame" ]
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
                        ],
                        description: descriptions[ "Slimy Transmutation" ]
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
                        ],
                        description: descriptions[ "Acid Arrow" ]
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
                        ],
                        description: descriptions[ "Acid Arrow" ]
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
                        ],
                        description: descriptions[ "Rolling Thunder" ]
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
                        ],
                        description: descriptions[ "Rolling Thunder" ]
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
                        ],
                        description: descriptions[ "Fireball" ]
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
                        ],
                        description: descriptions[ "Grasp of the Grave" ]
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
                        ],
                        description: descriptions[ "Grasp of the Grave" ]
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
                        ],
                        description: descriptions[ "Scattering Shock" ]
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
                        ],
                        description: descriptions[ "Scattering Shock" ]
                    }
                ],
                effects: []
            };
            Kitara.hp.total = 12 + helpers.mod(Kitara.abilities.CON) + (5 * partyLevel);
            Kitara.skills = helpers.skills(Kitara, {
                arcana: 5,
                diplomacy: 5,
                perception: 5,
                thievery: 5
            });
            return Kitara;
        },
        false
    );

})();