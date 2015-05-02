/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Kallista",
        [ "creature.helpers", "party.level", "jQuery", "descriptions" ],
        function(helpers, partyLevel, jQuery, descriptions) {
            var Kallista;
            Kallista = {
                name: "Kallista",
                isPC: true,
                level: partyLevel,
                image: "../images/portraits/kallista.jpg", // "http://www.wizards.com/dnd/images/Dragon_373/11.jpg",
                abilities: {
                    STR: 15,
                    CON: 13,
                    DEX: 22,
                    INT: 15,
                    WIS: 13,
                    CHA: 24
                },
                ap: 1,
                hp: {
                },
                surges: {
                    perDay: 8,
                    current: 8
                },
                defenses: {
                    ac: 27,
                    fort: 21,
                    ref: 27,
                    will: 26
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
                        ],
                        description: descriptions[ "Duelist's Flurry" ]
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
                        ],
                        description: descriptions[ "Sly Flourish" ]
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
                        ],
                        description: descriptions[ "Demonic Frenzy" ]
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
                        ],
                        description: descriptions[ "Acrobat's Blade Trick" ]
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
                        ],
                        description: descriptions[ "Stunning Strike" ]
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
                        ],
                        description: descriptions[ "Cloud of Steel" ]
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
                        ],
                        description: descriptions[ "Hell's Ram" ]
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
                        ],
                        description: descriptions[ "Bloodbath" ]
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
                        ],
                        description: descriptions[ "Burst Fire" ]
                    }, {
                        name: "Black Wrath of Hell",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: "2d10",
                        effects: [ { name: "Penalty", amount: "INT^CHA", other: "to hit Kallista", saveEnds: true } ], // TODO: implement penalty against specific creature
                        keywords: [ "racial" ],
                        description: descriptions[ "Black Wrath of Hell" ]
                    }/*, {
                     name: "Duelist's Prowess",
                     usage: {
                     frequency: "At-Will",
                     action: "Immediate Interrupt"
                     },
                     toHit: "DEX",
                     defense: "Ref",
                     damage: "1[W]+DEX",
                     keywords: [
                     "weapon", "martial", "melee"
                     ],
                     description: descriptions[ "Duelist's Prowess" ]
                     }*/, {
                        name: "Garrote Grip",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "DEX",
                        defense: "Ref",
                        damage: "2[W]+DEX",
                        effects: [
                            { name: "Grabbed" }
                        ],
                        keywords: [ "melee", "martial", "reliable", "weapon" ],
                        description: descriptions[ "Garrote Grip" ]
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
                        keywords: [ "melee", "martial", "reliable", "weapon" ],
                        description: descriptions[ "Garrote Grip" ]
                    }, {
                        name: "Sneak Attack",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "automatic",
                        defense: "AC",
                        damage: "2d8",
                        description: descriptions[ "Sneak Attack" ]
                    }
                ],
                effects: []
            };
            Kallista.hp.total = 12 + Kallista.abilities.CON + (5 * (partyLevel - 1));
            Kallista.skills = helpers.skills(Kallista, {
                acrobatics: 5 + helpers.mod(Kallista.abilities.CHA), // Duelist's Panache feat
                athletics: 5 + helpers.mod(Kallista.abilities.CHA), // Duelist's Panache feat
                bluff: 5,
                intimidate: 2, // Demon Spawn level 5 feature
                perception: 5,
                stealth: 5,
                thievery: 5
            });
            return Kallista;
        },
        false
    );

})();