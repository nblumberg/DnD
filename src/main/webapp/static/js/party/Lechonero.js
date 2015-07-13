/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Lechonero",
        [ "creature.helpers", "party.level", "jQuery", "html" ],
        function(CH, partyLevel, jQuery, descriptions) {
            var Lechonero;
            Lechonero = {
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
                ap: 0,
                hp: {
                },
                surges: {
                    perDay: 0,
                    current: 0
                },
                defenses: {
                    ac: 31,
                    fort: 24,
                    ref: 28,
                    will: 24
                },
                init: 13,
                speed: 7,
                weapons: [],
                "implements": [],
                effects: []
            };
            Lechonero.hp.total = 12 + Lechonero.abilities.CON + (5 * (partyLevel - 1));
            Lechonero.skills = CH.skills(Lechonero, {
                athletics: 5,
                nature: 5,
                perception: 7, // Sylvan Senses
                stealth: 5,
                streetwise: 5
            });
            Lechonero = jQuery.extend(true, {}, Lechonero, {
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
                    CH.meleeBasic,
                    CH.rangedBasic,
                    new CH.Power({
                        name: "Rapid Shot",
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+DEX",
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).atWill().ranged(),
                    new CH.Power({
                        name: "Twin Strike",
                        toHit: "STR/DEX",
                        defense: "AC",
                        damage: "1[W]",
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).atWill(),
                    /*
                    new CH.Power({
                        name: "Hindering Shot",
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
                            "weapon", "martial"
                        ]
                    }).encoutner().ranged(),
                    new CH.Power({
                        name: "Covering Volley",
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+DEX",
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).encounter().burst(1, null, true),
                    new CH.Power({
                        name: "Covering Volley (secondary)",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "5",
                        keywords: [
                            "martial", "ranged"
                        ],
                        description: descriptions[ "Covering Volley" ]
                    }).encounter().ranged(),
                    new CH.Power({
                        name: "Sure Shot",
                        toHit: "DEX",
                        defense: "AC",
                        damage: "3[W]+DEX",
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).daily().ranged(),
                    */
                    new CH.Power({
                        name: "Suppressing Shots",
                        toHit: "DEX",
                        defense: "AC",
                        damage: "2[W]+DEX",
                        effects: [
                            { name: "immobilized", duration: "endAttackerNext" }
                        ],
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).encounter().burst(1, 20, true),
                    new CH.Power({
                        name: "Spikes of the Manticore",
                        toHit: "DEX",
                        defense: "AC",
                        damage: "2[W]+DEX",
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).encounter().ranged(),
                    new CH.Power({
                        name: "Spikes of the Manticore (secondary)",
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+DEX",
                        keywords: [
                            "weapon", "martial"
                        ],
                        description: descriptions[ "Spikes of the Manticore" ]
                    }).encounter().ranged(),
                    new CH.Power({
                        name: "Shaft Splitter",
                        toHit: "DEX",
                        defense: "Ref",
                        damage: "2[W]+DEX",
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).encounter().immediateInterrupt().ranged(),
                    new CH.Power({
                        name: "Hammering Volley",
                        target: { target: 2 },
                        toHit: "DEX",
                        defense: "Fort",
                        damage: "2[W]+DEX",
                        effects: [ { name: "Prone" } ],
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).encounter().ranged(),
                    new CH.Power({
                        name: "Flying Steel",
                        toHit: "DEX",
                        defense: "AC",
                        damage: "2[W]+DEX",
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).daily().ranged(),
                    new CH.Power({
                        name: "Trick Shot (prone)",
                        toHit: "DEX",
                        defense: "AC",
                        damage: "2[W]+DEX",
                        effects: [
                            { name: "Prone" }
                        ],
                        keywords: [
                            "weapon", "martial"
                        ],
                        description: descriptions[ "Trick Shot" ]
                    }).daily().ranged(),
                    new CH.Power({
                        name: "Trick Shot (slowed)",
                        toHit: "DEX",
                        defense: "AC",
                        damage: "2[W]+DEX",
                        effects: [
                            { name: "Slowed", saveEnds: true }
                        ],
                        keywords: [
                            "weapon", "martial"
                        ],
                        description: descriptions[ "Trick Shot" ]
                    }).daily().ranged(),
                    new CH.Power({
                        name: "Trick Shot (dazed)",
                        toHit: "DEX",
                        defense: "AC",
                        damage: "2[W]+DEX",
                        effects: [
                            { name: "Dazed", saveEnds: true }
                        ],
                        keywords: [
                            "weapon", "martial"
                        ],
                        description: descriptions[ "Trick Shot" ]
                    }).daily().ranged(),
                    new CH.Power({
                        name: "Trick Shot (immobilized)",
                        toHit: "DEX",
                        defense: "AC",
                        damage: "2[W]+DEX",
                        effects: [
                            { name: "Immobilized", saveEnds: true }
                        ],
                        keywords: [
                            "weapon", "martial"
                        ],
                        description: descriptions[ "Trick Shot" ]
                    }).daily().ranged(),
                    new CH.Power({
                        name: "Marked for Death",
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
                    }).daily(),
                    new CH.Power({
                        name: "Hunter's Quarry",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "2d8"
                    }).atWill()
                ],
                buffs: [
                    new CH.Power({
                        name: "Communion (self)",
                        healing: {
                            isTempHP: true,
                            usesHealingSurge: true,
                            amount: "" + (3 + Math.floor(partyLevel / 2))
                        },
                        description: descriptions[ "Communion" ]
                    }).encounter(),
                    new CH.Power({
                        name: "Communion (other)",
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: false,
                            amount: "HS"
                        },
                        description: descriptions[ "Communion" ]
                    }).encounter()
                ]
            });
            return Lechonero;
        },
        false
    );

})();