/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Barases",
        [ "creature.helpers", "party.level", "jQuery", "descriptions" ],
        function(helpers, partyLevel, jQuery, descriptions) {
            var Barases;
            Barases = {
                isPC: true,
                level: partyLevel,
                abilities: {
                    STR: 12,
                    CON: 20,
                    DEX: 11,
                    INT: 11,
                    WIS: 22,
                    CHA: 11
                },
                // Druid of Summer
                defenses: {
                    ac: 27,
                    fort: 29,
                    ref: 22,
                    will: 28
                },
                // Druid of the Wastes
                //defenses: {
                //    ac: 29,
                //    fort: 30,
                //    ref: 24,
                //    will: 29
                //},
                ap: 0,
                init: 7,
                hp: {
                },
                surges: {
                    perDay: 0,
                    current: 0
                },
                weapons: [],
                "implements": [],
                effects: []
            };
            Barases.hp.total = 12 +
                helpers.mod(Barases.abilities.CON) +
                (5 * partyLevel) +
                10; // Toughness @ level 11
            Barases.skills = helpers.skills(Barases, { athletics: 5, bluff: 5, nature: 5, perception: 5 });
            Barases = jQuery.extend(true, {}, Barases, {
                name: "Barases",
                image: "../images/portraits/barases.jpg", // "http://images5.fanpop.com/image/photos/31000000/Satyr-fantasy-31060204-283-400.jpg",
                ap: 1,
                surges: {
                    perDay: 12,
                    current: 12
                },
                speed: 6,
                weapons: [
                    {
                        name: "Frost Brand Quarterstaff +3",
                        isMelee: true,
                        enhancement: 3,
                        proficiency: 2,
                        type: "cold",
                        damage: {
                            // Druid of Summer
                            //amount: "1d12",
                            // Druid of the Wastes
                            amount: "1d8",
                            crit: { amount: "3d8", type: "cold" }
                        },
                        keywords: [ "cold" ]
                    }, {
                        name: "Summoner's Staff +4",
                        isMelee: true,
                        enhancement: 4,
                        proficiency: 2,
                        damage: {
                            // Druid of Summer
                            //amount: "1d12",
                            // Druid of the Wastes
                            amount: "1d8",
                            crit: "4d6"
                        }
                    }, {
                        name: "Vicious Quarterstaff +2",
                        isMelee: true,
                        enhancement: 2,
                        proficiency: 2,
                        damage: {
                            // Druid of Summer
                            //amount: "1d12",
                            // Druid of the Wastes
                            amount: "1d8",
                            crit: "2d12"
                        }
                    }, {
                        name: "Distance Sling +1",
                        isMelee: false,
                        enhancement: 1,
                        proficiency: 2,
                        damage: {
                            amount: "1d6",
                            crit: "0"
                        }
                    }
                ],
                "implements": [
                    {
                        name: "Summoner's Staff +4",
                        enhancement: 4,
                        crit: "4d6"
                    }
                ],
                attackBonuses: [
                    {
                        name: "Lasting Frost",
                        effects: [ { name: "Vulnerable", amount: 5, type: "cold", duration: "endAttackerNext" } ],
                        keywords: [ "cold" ],
                        description: descriptions[ "Lasting Frost" ]
                    }, {
                        name: "Wintertouched",
                        vulnerable: "cold",
                        toHit: 2,
                        description: descriptions[ "Wintertouched" ]
                    }
                ],
                attacks: [
                    {
                        name: "Melee Basic",
                        usage: {
                            frequency: "At-Will"
                        },
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
                        name: "Tending Strike",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "WIS",
                        defense: "AC",
                        damage: "1[W]+WIS",
                        keywords: [
                            "weapon", "melee", "primal"
                        ],
                        description: descriptions[ "Tending Strike" ]
                    }, {
                        name: "Combined Attack",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "WIS",
                        defense: "AC",
                        damage: "1[W]+WIS",
                        keywords: [
                            "weapon", "melee", "primal"
                        ],
                        description: descriptions[ "Combined Attack" ]
                    }, {
                        name: "Combined Attack (beast)",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: 15,
                        defense: "AC",
                        damage: "1d12+9",
                        crit: "",
                        keywords: [
                            "melee", "primal", "beast"
                        ],
                        description: descriptions[ "Combined Attack" ]
                    }, {
                        name: "Redfang Prophecy",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: {
                            range: 5
                        },
                        toHit: "WIS",
                        defense: "Will",
                        damage: "2d8+WIS",
                        effects: [
                            {
                                name: "vulnerable summoned creature",
                                amount: 5,
                                duration: "endAttackerNext"
                            }
                        ],
                        keywords: [
                            "implement", "primal", "psychic"
                        ],
                        description: descriptions[ "Redfang Prophecy" ]
                    }, {
                        name: "Spirit's Shield",
                        usage: {
                            frequency: "Encounter"
                        },
                        target: {
                            range: 1,
                            area: "spirit"
                        },
                        toHit: "WIS",
                        defense: "Ref",
                        damage: "WIS",
                        keywords: [
                            "healing", "implement", "spirit", "primal"
                        ],
                        description: descriptions[ "Spirit's Shield" ]
                    }, {
                        name: "Vexing Overgrowth",
                        usage: {
                            frequency: "Daily"
                        },
                        target: {
                            area: "close burst",
                            size: 1
                        },
                        toHit: "WIS",
                        defense: "AC",
                        damage: "2[W]+WIS",
                        miss: {
                            halfDamage: true
                        },
                        keywords: [
                            "weapon", "primal"
                        ],
                        description: descriptions[ "Vexing Overgrowth" ]
                    }, {
                        name: "Life Blood Harvest",
                        usage: {
                            frequency: "Daily"
                        },
                        toHit: "WIS",
                        defense: "AC",
                        damage: "3[W]+WIS",
                        miss: {
                            halfDamage: true
                        },
                        keywords: [
                            "weapon", "melee", "primal", "healing"
                        ],
                        description: descriptions[ "Life Blood Harvest" ]
                    }
                ],
                healing: [
                    {
                        name: "Tending Strike",
                        frequency: "At-Will",
                        isTempHP: true,
                        usesHealingSurge: false,
                        amount: "CON",
                        description: descriptions[ "Tending Strike" ]
                    },
                    {
                        name: "Life Blood Harvest",
                        frequency: "Daily",
                        isTempHP: false,
                        usesHealingSurge: false,
                        amount: "HS",
                        description: descriptions[ "Life Blood Harvest" ]
                    },
                    {
                        name: "Healing Spirit",
                        frequency: "Encounter",
                        isTempHP: false,
                        usesHealingSurge: true,
                        amount: "HS",
                        description: descriptions[ "Healing Spirit" ]
                    },
                    {
                        name: "Healing Spirit (secondary)",
                        frequency: "Encounter",
                        isTempHP: false,
                        usesHealingSurge: false,
                        amount: "3d6",
                        description: descriptions[ "Healing Spirit" ]
                    },
                    {
                        name: "Healing Word",
                        frequency: "2xEncounter",
                        isTempHP: false,
                        usesHealingSurge: true,
                        amount: "HS+3d6",
                        description: descriptions[ "Healing Word" ]
                    },
                    {
                        name: "Spirit's Shield",
                        frequency: "Encounter",
                        isTempHP: false,
                        usesHealingSurge: false,
                        amount: "WIS",
                        description: descriptions[ "Spirit's Shield" ]
                    }
                ]
            });
            return Barases;
        },
        false
    );

})();