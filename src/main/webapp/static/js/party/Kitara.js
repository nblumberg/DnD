/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Kitara",
        [ "creature.helpers", "party.level", "jQuery", "html" ],
        function(CH, partyLevel, jQuery, descriptions) {
            var Kitara, prepared;
            prepared = {
                // Encounter 1
                //"Burning Hands": true,
                //"Skewering Spikes": true,
                "Glorious Presence": true,
                //"Orbmaster's Incendiary Detonation": true,
                //"Ray of Enfeeblement": true,
                //"Force Orb": true,

                // Encounter 3
                //"Icy Rays": true,
                "Grim Shadow": true,
                "Color Spray": true,
                //"Pinioning Vortex": true,

                // Encounter 7
                //"Ghoul Strike": true,
                "Lightning Bolt": true,
                //"Thunder Cage": true,

                // Encounter 11
                "Shadowy Tendrils": true,

                // Encounter 17
                // "Dancing Flames": true,
                "Force Volley": true,

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
                    CH.meleeBasic,
                    CH.rangedBasic,
                    new CH.Power({
                        name: "Magic Missile",
                        toHit: "automatic",
                        defense: "AC",
                        damage: {
                            amount: "3+INT",
                            type: "force"
                        },
                        keywords: [
                            "arcane", "evocation", "force", "implement"
                        ]
                    }).atWill().ranged(20),
                    new CH.Power({
                        name: "Lightning Ring",
                        toHit: "automatic",
                        defense: "AC",
                        damage: {
                            amount: "DEX",
                            type: "lightning"
                        },
                        keywords: [
                            "arcane", "bladespell", "lightning"
                        ]
                    }).atWill().ranged(10),
                    new CH.Power({
                        name: "Lightning Ring (secondary)",
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
                    }).atWill(),
                    new CH.Power({
                        name: "Shadow Sever",
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
                        ]
                    }).atWill().ranged(10),
                    new CH.Power({
                        name: "Unseen Hand",
                        toHit: "automatic",
                        defense: "AC",
                        damage: {
                            amount: "2+DEX",
                            type: "force"
                        },
                        keywords: [
                            "arcane", "bladespell", "force"
                        ]
                    }).atWill().ranged(10),
                    new CH.Power({
                        name: "Gaze of the Evil Eye",
                        toHit: "automatic",
                        defense: "AC",
                        damage: {
                            amount: "2",
                            type: "psychic"
                        },
                        keywords: [
                            "arcane", "psychic"
                        ]
                    }).atWill(),

                    // Encounter 1
                    new CH.Power({
                        name: "Burning Hands",
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
                    }).encounter().blast(5),
                    new CH.Power({
                        name: "Orbmaster's Incendiary Detonation",
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
                        prepared: prepared[ "Orbmaster's Incendiary Detonation" ] === true
                    }).encounter().burst(1, 10),
                    new CH.Power({
                        name: "Orbmaster's Incendiary Detonation (zone)",
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
                    }).encounter().burst(1, 10),
                    new CH.Power({
                        name: "Force Orb",
                        toHit: "INT",
                        defense: "Ref",
                        damage: {
                            amount: "2d8+INT",
                            type: "force"
                        },
                        keywords: [
                            "arcane", "evocation", "force", "implement"
                        ],
                        prepared: prepared[ "Force Orb" ] === true
                    }).encounter(),
                    new CH.Power({
                        name: "Force Orb (secondary)",
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
                    }).encounter().burst(1, 20),
                    new CH.Power({
                        name: "Skewering Spikes",
                        toHit: "INT",
                        defense: "Ref",
                        damage: "1d8+INT",
                        keywords: [
                            "arcane", "evocation", "implement"
                        ],
                        prepared: prepared[ "Skewering Spikes" ] === true
                    }).encounter().ranged(5),
                    new CH.Power({
                        name: "Skewering Spikes (single target)",
                        toHit: "INT",
                        defense: "Ref",
                        damage: "2d8+INT",
                        keywords: [
                            "arcane", "evocation", "implement"
                        ],
                        description: descriptions[ "Skewering Spikes" ],
                        prepared: prepared[ "Skewering Spikes" ] === true
                    }).encounter().ranged(5),
                    new CH.Power({
                        name: "Glorious Presence",
                        toHit: "INT",
                        range: 2,
                        defense: "Will",
                        damage: {
                            amount: "2d6+INT",
                            type: "radiant"
                        },
                        keywords: [
                            "arcane", "charm", "echantment", "implement", "radiant"
                        ],
                        prepared: prepared[ "Glorious Presence" ] === true
                    }).encounter().closeBurst(2),
                    new CH.Power({
                        name: "Ray of Enfeeblement",
                        toHit: "INT",
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
                            "arcane", "implement", "necromancy", "necrotic"
                        ],
                        prepared: prepared[ "Ray of Enfeeblement" ] === true
                    }).encounter().ranged(10),

                    // Encounter 3
                    new CH.Power({
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
                    }).encounter(),
                    new CH.Power({
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
                    }).encounter(),
                    new CH.Power({
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
                    }).encounter(),
                    new CH.Power({
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
                    }).encounter(),

                    // Encounter 7
                    new CH.Power({
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
                    }).encounter(),
                    new CH.Power({
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
                    }).encounter(),
                    new CH.Power({
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
                    }).encounter(),
                    new CH.Power({
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
                    }).encounter(),
                    new CH.Power({
                        name: "Thunder Cage (secondary)",
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
                    }).encounter(),

                    // Encounter 11
                    new CH.Power({
                        name: "Shadowy Tendrils",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "0",
                        effects: [ { name: "dazed", duration: "endAttackerNext" } ],
                        keywords: [
                            "shadow", "teleportation"
                        ],
                        prepared: prepared[ "Shadowy Tendrils" ] === true
                    }).encounter(),

                    // Encounter 17
                    new CH.Power({
                        name: "Dancing Flames",
                        toHit: "INT",
                        defense: "Ref",
                        damage: {
                            amount: "5d6",
                            type: "fire"
                        },
                        miss: { halfDamage: true },
                        keywords: [
                            "arcane", "evocation", "fire", "implement"
                        ],
                        prepared: prepared[ "Dancing Flames" ] === true
                    }).encounter().blast(5, true),
                    new CH.Power({
                        name: "Force Volley",
                        target: {
                            targets: 3
                        },
                        toHit: "INT",
                        defense: "Ref",
                        damage: {
                            amount: "3d6",
                            type: "force"
                        },
                        effects: [ { name: "dazed", duration: "endAttackerNext" } ],
                        keywords: [
                            "arcane", "evocation", "force", "implement"
                        ],
                        prepared: prepared[ "Force Volley" ] === true
                    }).encounter().ranged(),

                    // Daily 1
                    new CH.Power({
                        name: "Phantom Chasm",
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
                        prepared: prepared[ "Phantom Chasm" ] === true
                    }).daily().burst(1, 10),
                    new CH.Power({
                        name: "Phantom Chasm (zone)",
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
                    }).atWill().burst(1, 10),
                    new CH.Power({
                        name: "Fountain of Flame",
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
                        prepared: prepared[ "Fountain of Flame" ] === true
                    }).daily().burst(1, 10),
                    new CH.Power({
                        name: "Fountain of Flame (zone)",
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
                    }).atWill().burst(1, 10),
                    new CH.Power({
                        name: "Slimy Transmutation",
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
                        prepared: prepared[ "Slimy Transmutation" ] === true
                    }).daily().ranged(10),
                    new CH.Power({
                        name: "Acid Arrow",
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
                        prepared: prepared[ "Acid Arrow" ] === true
                    }).daily().ranged(20),
                    new CH.Power({
                        name: "Acid Arrow (secondary)",
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
                    }).daily().burst(1, 20),
                    new CH.Power({
                        name: "Rolling Thunder",
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
                        prepared: prepared[ "Rolling Thunder" ] === true
                    }).daily(),
                    new CH.Power({
                        name: "Rolling Thunder (secondary)",
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
                    }).atWill(),

                    // Daily 5
                    new CH.Power({
                        name: "Fireball",
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
                        prepared: prepared[ "Fireball" ] === true
                    }).daily().burst(3, 20),
                    new CH.Power({
                        name: "Grasp of the Grave",
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
                        prepared: prepared[ "Grasp of the Grave" ] === true
                    }).daily().burst(2, 20, true),
                    new CH.Power({
                        name: "Grasp of the Grave (zone)",
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
                    }).atWill().burst(2, 20, true),
                    new CH.Power({
                        name: "Scattering Shock",
                        toHit: "INT",
                        defense: "Fort",
                        damage: "0",
                        keywords: [
                            "arcane", "evocation", "implement", "lightning"
                        ],
                        prepared: prepared[ "Scattering Shock" ] === true
                    }).daily().burst(3, 10),
                    new CH.Power({
                        name: "Scattering Shock (secondary)",
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
                    }).daily(),

                    // Daily 9
                    new CH.Power({
                        name: "Taunting Phantoms",
                        toHit: "INT",
                        defense: "Will",
                        damage: "0",
                        effects: [ { name: "dominated", duration: "startTargetNext" }, { name: "Damage on miss", amount: 5, saveEnds: true } ],
                        keywords: [
                            "arcane", "evocation", "implement", "lightning"
                        ],
                        prepared: prepared[ "Taunting Phantoms" ] === true
                    }).daily().burst(1, 10),
                    new CH.Power({
                        name: "Taunting Phantoms (effect)",
                        toHit: "automatic",
                        defense: "Will",
                        damage: "0",
                        effects: [ { name: "Damage on miss", amount: 5, saveEnds: true } ],
                        keywords: [
                            "arcane", "evocation", "implement", "lightning"
                        ],
                        description: descriptions[ "Taunting Phantoms" ],
                        prepared: prepared[ "Taunting Phantoms" ] === true
                    }).daily().burst(1, 10),
                    new CH.Power({
                        name: "Symphony of the Dark Court",
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
                        prepared: prepared[ "Symphony of the Dark Court" ] === true
                    }).daily().burst(2, 20),
                    new CH.Power({
                        name: "Circle of Death",
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
                        prepared: prepared[ "Circle of Death" ] === true
                    }).daily().burst(2, 10)
                ],
                buffs: [
                    new CH.Power({
                        name: "Circle of Protection",
                        toHit: "automatic",
                        effects: [
                            { name: "resistance", amount: CH.mod(Kitara.abilities.INT), type: "all" }
                        ]
                    }).daily(),
                    new CH.Power({
                        name: "Mass Resistance (acid)",
                        toHit: "automatic",
                        effects: [
                            { name: "resistance", amount: 5 + CH.mod(Kitara.abilities.INT), type: "acid" }
                        ],
                        description: descriptions[ "Mass Resistance" ]
                    }).daily(),
                    new CH.Power({
                        name: "Mass Resistance (cold)",
                        toHit: "automatic",
                        effects: [
                            { name: "resistance", amount: 5 + CH.mod(Kitara.abilities.INT), type: "cold" }
                        ],
                        description: descriptions[ "Mass Resistance" ]
                    }).daily(),
                    new CH.Power({
                        name: "Mass Resistance (fire)",
                        toHit: "automatic",
                        effects: [
                            { name: "resistance", amount: 5 + CH.mod(Kitara.abilities.INT), type: "fire" }
                        ],
                        description: descriptions[ "Mass Resistance" ]
                    }).daily(),
                    new CH.Power({
                        name: "Mass Resistance (force)",
                        toHit: "automatic",
                        effects: [
                            { name: "resistance", amount: 5 + CH.mod(Kitara.abilities.INT), type: "force" }
                        ],
                        description: descriptions[ "Mass Resistance" ]
                    }).daily(),
                    new CH.Power({
                        name: "Mass Resistance (lightning)",
                        toHit: "automatic",
                        effects: [
                            { name: "resistance", amount: 5 + CH.mod(Kitara.abilities.INT), type: "lightning" }
                        ],
                        description: descriptions[ "Mass Resistance" ]
                    }).daily(),
                    new CH.Power({
                        name: "Mass Resistance (necrotic)",
                        toHit: "automatic",
                        effects: [
                            { name: "resistance", amount: 5 + CH.mod(Kitara.abilities.INT), type: "necrotic" }
                        ],
                        description: descriptions[ "Mass Resistance" ]
                    }).daily(),
                    new CH.Power({
                        name: "Mass Resistance (poison)",
                        toHit: "automatic",
                        effects: [
                            { name: "resistance", amount: 5 + CH.mod(Kitara.abilities.INT), type: "poison" }
                        ],
                        description: descriptions[ "Mass Resistance" ]
                    }).daily(),
                    new CH.Power({
                        name: "Mass Resistance (psychic)",
                        toHit: "automatic",
                        effects: [
                            { name: "resistance", amount: 5 + CH.mod(Kitara.abilities.INT), type: "psychic" }
                        ],
                        description: descriptions[ "Mass Resistance" ]
                    }).daily(),
                    new CH.Power({
                        name: "Mass Resistance (radiant)",
                        toHit: "automatic",
                        effects: [
                            { name: "resistance", amount: 5 + CH.mod(Kitara.abilities.INT), type: "radiant" }
                        ],
                        description: descriptions[ "Mass Resistance" ]
                    }).daily(),
                    new CH.Power({
                        name: "Mass Resistance (thunder)",
                        toHit: "automatic",
                        effects: [
                            { name: "resistance", amount: 5 + CH.mod(Kitara.abilities.INT), type: "thunder" }
                        ],
                        description: descriptions[ "Mass Resistance" ]
                    }).daily(),
                    new CH.Power({
                        name: "Stoneskin",
                        target: {
                            targets: 1
                        },
                        toHit: "automatic",
                        effects: [
                            { name: "resistance", amount: 10, type: "all" }
                        ],
                        keywords: [ "arcane", "transmutation" ]
                    }).daily()

                ],
                effects: []
            });
            Kitara.hp.total = 12 + Kitara.abilities.CON + (5 * (partyLevel - 1));
            Kitara.skills = CH.skills(Kitara, {
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