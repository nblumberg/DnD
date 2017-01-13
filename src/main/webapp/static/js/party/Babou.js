/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Babou",
        [ "creature.helpers", "party.level", "jQuery", "html" ],
        function(CH, partyLevel, jQuery, descriptions) {
            var Babou;
            partyLevel = 1;
            Babou = {
                isPC: true,
                level: partyLevel,
                abilities: {
                    STR: 16,
                    CON: 12,
                    DEX: 18,
                    INT: 10,
                    WIS: 14,
                    CHA: 8
                },
                ap: 1,
                hp: {
                },
                surges: {
                    perDay: 7,
                    current: 7
                },
                defenses: {
                    ac: 17,
                    fort: 14,
                    ref: 15,
                    will: 12
                },
                init: 4,
                speed: 7,
                weapons: [],
                "implements": [],
                effects: []
            };
            Babou.hp.total = 12 + Babou.abilities.CON + (5 * (partyLevel - 1)) + 5; // Toughness
            Babou.skills = CH.skills(Babou, {
                acrobatics: 5,
                athletics: 5,
                endurance: 5,
                nature: 5,
                perception: 2, // Sylvan Senses
                stealth: 5
            });
            Babou = jQuery.extend(true, {}, Babou, {
                name: "Babou",
                image: "../images/portraits/lechonero.jpg", // "http://www.critical-hits.com/wp-content/uploads/2007/12/elf.jpg",
                ap: 1,
                surges: {
                    perDay: 8,
                    current: 8
                },
                weapons: [
                    {
                        name: "Longbow",
                        isMelee: false,
                        enhancement: 0,
                        proficiency: 2,
                        damage: {
                            amount: "1d10",
                            crit: "0"
                        }
                    }, {
                        name: "Longsword",
                        isMelee: true,
                        enhancement: 0,
                        proficiency: 3,
                        damage: {
                            amount: "1d8",
                            crit: "0"
                        }
                    }
                ],
                attacks: [
                    CH.meleeBasic,
                    CH.rangedBasic,
                    new CH.Power({
                        name: "Hit and Run",
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]+STR",
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).atWill().melee(),
                    new CH.Power({
                        name: "Twin Strike",
                        toHit: "STR/DEX",
                        defense: "AC",
                        damage: "1[W]",
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).atWill(),
                    new CH.Power({
                        name: "Takedown Strike",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "STR",
                        effects: [
                            { name: "prone" }
                        ],
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).encounter().melee(),
                    new CH.Power({
                        name: "Singular Shot",
                        toHit: "DEX",
                        defense: "AC",
                        damage: "2[W]+DEX",
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).encounter().ranged(),
                    new CH.Power({
                        name: "Guardian Arrow",
                        toHit: "DEX",
                        defense: "AC",
                        damage: "2[W]+DEX",
                        miss: {
                            halfDamage: true
                        },
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).daily().ranged(),
                    new CH.Power({
                        name: "Hunter's Quarry",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "2d8"
                    }).atWill()
                ],
                buffs: [
                    new CH.Power({
                        name: "Elven Accuracy"
                    }).encounter()
                ]
            });
            return Babou;
        },
        false
    );

})();