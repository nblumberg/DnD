/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Kitara",
        [ "creature.helpers", "party.level", "jQuery", "descriptions" ],
        function(helpers, partyLevel, jQuery, descriptions) {
            var Kitara, prepared;
            prepared = {
                // Encounter 1
                "Burning Hands": true,
                //"Skewering Spikes": true,
                //"Gorious Presence": true,
                //"Orbmaster's Incendiary Detonation": true,
                "Ray of Enfeeblement": true,
                //"Force Orb": true,

                // Encounter 3
                //"Icy Rays": true,
                "Grim Shadow": true,
                "Color Spray": true,
                //"Pinioning Vortex": true,

                // Encounter 7
                //"Ghoul Strike": true,
                //"Lightning Bolt": true,
                "Thunder Cage": true,

                // Encounter 11
                "Shadowy Tendrils": true,

                // Daily 1
                //"Slimy Transmutation": true,
                //"Fountain of Flame": true,
                "Phantom Chasm": true,
                //"Rolling Thunder": true,
                //"Acid Arrow": true,
                "Wizard's Fury": true,

                // Daily 5
                "Fireball": true,
                //"Grasp of the Grave": true,
                //"Scattering Shock": true,

                // Daily 9
                "Taunting Phantoms": true,
                //"Symphony of the Dark Court": true,
                //"Circle of Death": true,

                // Utility
                "Shadow Jaunt": true,
                "Bladesong": true,

                // Utility 2
                "Feather Fall": true,

                // Utility 6
                "Refocus": true,
                //"Darklight": true,
                //"Invisibility": true,

                // Utility 10
                //"Circle of Protection": true,
                "Mass Resistance": true,

                // Utility 12
                "Shadow Stalk": true,

                // Utility 16
                //"Fly": true,
                "Stoneskin": true,

                "blah": false
            };
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
                    fort: 27,
                    ref: 29,
                    will: 28
                },
                resistances: {
                    psychic: 5 // Mental Block (alternative reward)
                },
                init: 12,
                speed: 8
            };
            Kitara = jQuery.extend({}, Kitara, {
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
                        keywords: [
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
                            amount: "3+INT",
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
                            amount: "DEX",
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
                            amount: "2+DEX",
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
                            amount: "2+DEX",
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
                            amount: "2+DEX",
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
                    },

                    // Encounter 1
                    {
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
                        description: descriptions[ "Burning Hands" ],
                        prepared: prepared[ "Burning Hands" ] === true
                    },
                    {
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
                        description: descriptions[ "Orbmaster's Incendiary Detonation" ],
                        prepared: prepared[ "Orbmaster's Incendiary Detonation" ] === true
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
                        description: descriptions[ "Orbmaster's Incendiary Detonation" ],
                        prepared: prepared[ "Orbmaster's Incendiary Detonation" ] === true
                    },
                    {
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
                        description: descriptions[ "Force Orb" ],
                        prepared: prepared[ "Force Orb" ] === true
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
                        description: descriptions[ "Force Orb" ],
                        prepared: prepared[ "Force Orb" ] === true
                    },
                    {
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
                        description: descriptions[ "Skewering Spikes" ],
                        prepared: prepared[ "Skewering Spikes" ] === true
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
                        description: descriptions[ "Skewering Spikes" ],
                        prepared: prepared[ "Skewering Spikes" ] === true
                    },
                    {
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
                        description: descriptions[ "Glorious Presence" ],
                        prepared: prepared[ "Glorious Presence" ] === true
                    },
                    {
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
                        description: descriptions[ "Ray of Enfeeblement" ],
                        prepared: prepared[ "Ray of Enfeeblement" ] === true
                    },

                    // Encounter 3
                    {
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
                        description: descriptions[ "Grim Shadow" ],
                        prepared: prepared[ "Grim Shadow" ] === true
                    },
                    {
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
                        description: descriptions[ "Icy Rays" ],
                        prepared: prepared[ "Icy Rays" ] === true
                    },
                    {
                        name: "Color Spray",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: {
                            area: "blast", size: 5
                        },
                        toHit: "INT",
                        defense: "Will",
                        damage: {
                            amount: "1d6+INT",
                            type: "radiant"
                        },
                        effects: [
                            {
                                name: "dazed",
                                duration: "endAttackerNext"
                            }
                        ],
                        keywords: [
                            "arcane", "evocation", "radiant", "implement", "blast"
                        ],
                        description: descriptions[ "Color Spray" ],
                        prepared: prepared[ "Color Spray" ] === true
                    },
                    {
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
                        description: descriptions[ "Pinioning Vortex" ],
                        prepared: prepared[ "Pinioning Vortex" ] === true
                    },

                    // Encounter 7
                    {
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
                        description: descriptions[ "Lightning Bolt" ],
                        prepared: prepared[ "Lightning Bolt" ] === true
                    },
                    {
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
                        description: descriptions[ "Ghoul Strike" ],
                        prepared: prepared[ "Ghoul Strike" ] === true
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
                        description: descriptions[ "Ghoul Strike" ],
                        prepared: prepared[ "Ghoul Strike" ] === true
                    },
                    {
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
                        description: descriptions[ "Thunder Cage" ],
                        prepared: prepared[ "Thunder Cage" ] === true
                    },
                    {
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
                        description: descriptions[ "Thunder Cage" ],
                        prepared: prepared[ "Thunder Cage" ] === true
                    },

                    // Encounter 11
                    {
                        name: "Shadowy Tendrils",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: "0",
                        effects: [ { name: "dazed", duration: "endAttackerNext" } ],
                        keywords: [
                            "shadow", "teleportation"
                        ],
                        description: descriptions[ "Shadowy Tendrils" ],
                        prepared: prepared[ "Shadowy Tendrils" ] === true
                    },

                    // Daily 1
                    {
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
                        description: descriptions[ "Phantom Chasm" ],
                        prepared: prepared[ "Phantom Chasm" ] === true
                    }, {
                        name: "Phantom Chasm (zone)",
                        usage: {
                            frequency: "At-Will"
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
                        description: descriptions[ "Phantom Chasm" ],
                        prepared: prepared[ "Phantom Chasm" ] === true
                    },
                    {
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
                        description: descriptions[ "Fountain of Flame" ],
                        prepared: prepared[ "Fountain of Flame" ] === true
                    }, {
                        name: "Fountain of Flame (zone)",
                        usage: {
                            frequency: "At-WIll"
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
                        description: descriptions[ "Fountain of Flame" ],
                        prepared: prepared[ "Fountain of Flame" ] === true
                    },
                    {
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
                        description: descriptions[ "Slimy Transmutation" ],
                        prepared: prepared[ "Slimy Transmutation" ] === true
                    },
                    {
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
                        description: descriptions[ "Acid Arrow" ],
                        prepared: prepared[ "Acid Arrow" ] === true
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
                        description: descriptions[ "Acid Arrow" ],
                        prepared: prepared[ "Acid Arrow" ] === true
                    },
                    {
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
                        description: descriptions[ "Rolling Thunder" ],
                        prepared: prepared[ "Rolling Thunder" ] === true
                    }, {
                        name: "Rolling Thunder (secondary)",
                        usage: {
                            frequency: "At-Will"
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
                        description: descriptions[ "Rolling Thunder" ],
                        prepared: prepared[ "Rolling Thunder" ] === true
                    },

                    // Daily 5
                    {
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
                        description: descriptions[ "Fireball" ],
                        prepared: prepared[ "Fireball" ] === true
                    },
                    {
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
                        description: descriptions[ "Grasp of the Grave" ],
                        prepared: prepared[ "Grasp of the Grave" ] === true
                    }, {
                        name: "Grasp of the Grave (zone)",
                        usage: {
                            frequency: "At-Will"
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
                        description: descriptions[ "Grasp of the Grave" ],
                        prepared: prepared[ "Grasp of the Grave" ] === true
                    },
                    {
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
                        description: descriptions[ "Scattering Shock" ],
                        prepared: prepared[ "Scattering Shock" ] === true
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
                        description: descriptions[ "Scattering Shock" ],
                        prepared: prepared[ "Scattering Shock" ] === true
                    },

                    // Daily 9
                    {
                        name: "Taunting Phantoms",
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
                        damage: "0",
                        effects: [ { name: "dominated", duration: "startTargetNext" }, { name: "Damage on miss", amount: 5, saveEnds: true } ],
                        keywords: [
                            "arcane", "evocation", "implement", "lightning"
                        ],
                        description: descriptions[ "Taunting Phantoms" ],
                        prepared: prepared[ "Taunting Phantoms" ] === true
                    }, {
                        name: "Taunting Phantoms (effect)",
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
                        effects: [ { name: "Damage on miss", amount: 5, saveEnds: true } ],
                        keywords: [
                            "arcane", "evocation", "implement", "lightning"
                        ],
                        description: descriptions[ "Taunting Phantoms" ],
                        prepared: prepared[ "Taunting Phantoms" ] === true
                    },
                    {
                        name: "Symphony of the Dark Court",
                        usage: {
                            frequency: "Daily"
                        },
                        target: {
                            area: "burst",
                            size: 2,
                            range: 20
                        },
                        toHit: "INT",
                        defense: "Will",
                        damage: "0",
                        effects: [ { name: "multiple", saveEnds: true, children: [ { name: "dazed" }, { name: "immobilized" } ] } ],
                        miss: {
                            amount: "0",
                            effects: [ { name: "dazed", duration: "endTargetNext" } ]
                        },
                        keywords: [
                            "arcane", "enchantment", "implement", "ranged"
                        ],
                        description: descriptions[ "Symphony of the Dark Court" ],
                        prepared: prepared[ "Symphony of the Dark Court" ] === true
                    },
                    {
                        name: "Circle of Death",
                        usage: {
                            frequency: "Daily"
                        },
                        target: {
                            area: "burst",
                            size: 2,
                            range: 10
                        },
                        toHit: "INT",
                        defense: "Fort",
                        damage: { amount: "" + partyLevel, type: "necrotic" },
                        effects: [ { name: "multiple", saveEnds: true, children: [ { name: "dazed" }, { name: "slowed" }, { name: "weakened" } ] } ],
                        miss: {
                            amount: "" + Math.floor(partyLevel / 2),
                            effects: [ { name: "slowed", duration: "endAttackerNext" } ]
                        },
                        keywords: [
                            "arcane", "necromancy", "implement", "necrotic", "shadow", "ranged"
                        ],
                        description: descriptions[ "Circle of Death" ],
                        prepared: prepared[ "Circle of Death" ] === true
                    },
                ],
                buffs: [
                    {
                        name: "Circle of Protection",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "automatic",
                        effects: [
                            { name: "resistance", amount: helpers.mod(Kitara.abilities.INT), type: "all" }
                        ]
                    },
                    {
                        name: "Mass Resistance (acid)",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "automatic",
                        effects: [
                            { name: "resistance", amount: 5 + helpers.mod(Kitara.abilities.INT), type: "acid" }
                        ]
                    },
                    {
                        name: "Mass Resistance (cold)",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "automatic",
                        effects: [
                            { name: "resistance", amount: 5 + helpers.mod(Kitara.abilities.INT), type: "cold" }
                        ]
                    },
                    {
                        name: "Mass Resistance (fire)",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "automatic",
                        effects: [
                            { name: "resistance", amount: 5 + helpers.mod(Kitara.abilities.INT), type: "fire" }
                        ]
                    },
                    {
                        name: "Mass Resistance (force)",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "automatic",
                        effects: [
                            { name: "resistance", amount: 5 + helpers.mod(Kitara.abilities.INT), type: "force" }
                        ]
                    },
                    {
                        name: "Mass Resistance (lightning)",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "automatic",
                        effects: [
                            { name: "resistance", amount: 5 + helpers.mod(Kitara.abilities.INT), type: "lightning" }
                        ]
                    },
                    {
                        name: "Mass Resistance (necrotic)",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "automatic",
                        effects: [
                            { name: "resistance", amount: 5 + helpers.mod(Kitara.abilities.INT), type: "necrotic" }
                        ]
                    },
                    {
                        name: "Mass Resistance (poison)",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "automatic",
                        effects: [
                            { name: "resistance", amount: 5 + helpers.mod(Kitara.abilities.INT), type: "poison" }
                        ]
                    },
                    {
                        name: "Mass Resistance (psychic)",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "automatic",
                        effects: [
                            { name: "resistance", amount: 5 + helpers.mod(Kitara.abilities.INT), type: "psychic" }
                        ]
                    },
                    {
                        name: "Mass Resistance (radiant)",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "automatic",
                        effects: [
                            { name: "resistance", amount: 5 + helpers.mod(Kitara.abilities.INT), type: "radiant" }
                        ]
                    },
                    {
                        name: "Mass Resistance (thunder)",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "automatic",
                        effects: [
                            { name: "resistance", amount: 5 + helpers.mod(Kitara.abilities.INT), type: "thunder" }
                        ]
                    }

                ],
                effects: []
            });
            Kitara.hp.total = 12 + Kitara.abilities.CON + (5 * (partyLevel - 1));
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