/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Barases",
        [ "creature.helpers", "party.level", "jQuery", "html" ],
        function(CH, partyLevel, jQuery, descriptions) {
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
                    ac: 28,
                    fort: 30,
                    ref: 23,
                    will: 29
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
                Barases.abilities.CON +
                (5 * (partyLevel - 1)) +
                10; // Toughness @ level 11
            Barases.skills = CH.skills(Barases, { athletics: 5, bluff: 5, nature: 5, perception: 5 });
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
                        name: "Thunder Brand Quarterstaff +3",
                        isMelee: true,
                        enhancement: 3,
                        proficiency: 2,
                        type: "thunder",
                        damage: {
                            // Druid of Summer
                            amount: "1d12",
                            crit: { amount: "3d8", type: "thunder" }
                        },
                        keywords: [ "thunder" ]
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
                        name: "Lasting Thunder",
                        effects: [ { name: "Vulnerable", amount: 5, type: "thunder", duration: "endAttackerNext" } ],
                        keywords: [ "thunder" ],
                        description: descriptions[ "Lasting Frost" ]
                    }, {
                        name: "Thundertouched",
                        vulnerable: "thunder",
                        toHit: 2,
                        description: descriptions[ "Wintertouched" ]
                    }
                ],
                attacks: [
                    CH.meleeBasic,
                    CH.rangedBasic,
                    new CH.Power({
                        name: "Tending Strike",
                        toHit: "WIS",
                        defense: "AC",
                        damage: "1[W]+WIS",
                        keywords: [
                            "weapon", "primal"
                        ]
                    }).atWill().melee(),
                    new CH.Power({
                        name: "Combined Attack",
                        toHit: "WIS",
                        defense: "AC",
                        damage: "1[W]+WIS",
                        keywords: [
                            "weapon", "primal"
                        ]
                    }).encounter().melee(),
                    new CH.Power({
                        name: "Combined Attack (beast)",
                        toHit: 15,
                        defense: "AC",
                        damage: "1d12+9",
                        crit: "",
                        keywords: [
                            "primal", "beast"
                        ],
                        description: descriptions[ "Combined Attack" ]
                    }).atWill().melee(),
                    new CH.Power({
                        name: "Redfang Prophecy",
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
                        ]
                    }).encounter().ranged(5),
                    new CH.Power({
                        name: "Spirit's Shield",
                        target: {
                            range: 1,
                            area: "spirit"
                        },
                        toHit: "WIS",
                        defense: "Ref",
                        damage: "WIS",
                        keywords: [
                            "healing", "implement", "spirit", "primal"
                        ]
                    }).encounter(),
                    new CH.Power({
                        name: "Vexing Overgrowth",
                        toHit: "WIS",
                        defense: "AC",
                        damage: "2[W]+WIS",
                        miss: {
                            halfDamage: true
                        },
                        keywords: [
                            "weapon", "primal"
                        ]
                    }).daily().closeBurst(1),
                    new CH.Power({
                        name: "Life Blood Harvest",
                        toHit: "WIS",
                        defense: "AC",
                        damage: "3[W]+WIS",
                        miss: {
                            halfDamage: true
                        },
                        keywords: [
                            "weapon", "primal", "healing"
                        ]
                    }).daily().melee()
                ],
                buffs: [
                    new CH.Power({
                        name: "Tending Strike",
                        healing: {
                            isTempHP: true,
                            usesHealingSurge: false,
                            amount: "CON"
                        }
                    }).atWill(),
                    new CH.Power({
                        name: "Life Blood Harvest",
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: false,
                            amount: "HS"
                        }
                    }).daily(),
                    new CH.Power({
                        name: "Healing Spirit",
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: true,
                            amount: "HS"
                        }
                    }).encounter(),
                    new CH.Power({
                        name: "Healing Spirit (secondary)",
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: false,
                            amount: "3d6"
                        },
                        description: descriptions[ "Healing Spirit" ]
                    }).encounter(),
                    new CH.Power({
                        name: "Healing Word",
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: true,
                            amount: "4d6+HS"
                        },
                        description: descriptions[ "Healing Word" ]
                    }).encounter(3),
                    new CH.Power({
                        name: "Spirit's Shield",
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: false,
                            amount: "WIS"
                        }
                    }).encounter(),
                    new CH.Power({
                        name: "Summon Crocodile",
                        keywords: [ "implement", "primal", "summoning" ]
                    }).daily().ranged(5),
                    new CH.Power({
                        name: "Summon Venomous Scorpion",
                        keywords: [ "primal", "summoning" ],
                        description: descriptions[ "Summon Natural Ally" ]
                    }).daily().ranged(5),
                    new CH.Power({
                        name: "Thunder Brand (resistance)",
                        effects: [
                            { name: "resistance", type: "thunder", amount: 9 }
                        ],
                        description: descriptions[ "Frost Brand Weapon" ]
                    }).atWill()
                ]
            });
            return Barases;
        },
        false
    );

})();