/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Kallista",
        [ "creature.helpers", "party.level", "jQuery", "html" ],
        function(CH, partyLevel, jQuery, descriptions) {
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
                    CH.meleeBasic,
                    CH.rangedBasic,
                    new CH.Power({
                        name: "Duelist's Flurry",
                        toHit: "DEX",
                        defense: "AC",
                        damage: "DEX",
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).atWill().melee(),
                    new CH.Power({
                        name: "Sly Flourish",
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+DEX+CHA",
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).atWill(),
                    new CH.Power({
                        name: "Demonic Frenzy",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "1d6",
                        keywords: [
                            "elemental"
                        ]
                    }).encounter(),
                    new CH.Power({
                        name: "Stunning Strike",
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+DEX",
                        effects: [ { name: "Stunned", duration: "endAttackerNext" } ],
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).encounter().melee(),
                    new CH.Power({
                        name: "Cloud of Steel",
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+DEX",
                        keywords: [
                            "weapon", "martial", "ranged"
                        ]
                    }).encounter().blast(5, true),
                    new CH.Power({
                        name: "Hell's Ram",
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
                        ]
                    }).encounter(),
                    new CH.Power({
                        name: "Tumbling Strike",
                        toHit: "DEX",
                        defense: "AC",
                        damage: "3[W]+DEX",
                        keywords: [ "martial", "weapon" ]
                    }).encounter().melee(),
                    new CH.Power({
                        name: "Bloodbath",
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
                        ]
                    }).daily(),
                    new CH.Power({
                        name: "Burst Fire",
                        toHit: "DEX",
                        defense: "Ref",
                        damage: "2[W]+DEX",
                        keywords: [
                            "weapon", "martial", "ranged"
                        ]
                    }).daily().burst(1, 10, true),
                    new CH.Power({
                        name: "Black Wrath of Hell",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "2d10",
                        effects: [ { name: "Penalty", amount: "INT^CHA", other: "to hit Kallista", saveEnds: true } ], // TODO: implement penalty against specific creature
                        keywords: [ "racial" ]
                    }).daily(),
                    /*
                    new CH.Power({
                        name: "Acrobat's Blade Trick",
                        toHit: "DEX",
                        defense: "AC",
                        damage: "1[W]+DEX",
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).encounter().melee(),
                    new CH.Power({
                        name: "Duelist's Prowess",
                        toHit: "DEX",
                        defense: "Ref",
                        damage: "1[W]+DEX",
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).atWill().immediateInterrupt().melee(),
                    */
                    new CH.Power({
                        name: "Garrote Grip",
                        toHit: "DEX",
                        defense: "Ref",
                        damage: "2[W]+DEX",
                        effects: [
                            { name: "Grabbed" }
                        ],
                        keywords: [ "melee", "martial", "reliable", "weapon" ]
                    }).daily(),
                    new CH.Power({
                        name: "Garrote Grip (3rd failed save)",
                        toHit: "automatic",
                        defense: "Ref",
                        damage: "0",
                        effects: [
                            { name: "Unconscious" }
                        ],
                        keywords: [ "melee", "martial", "reliable", "weapon" ],
                        description: descriptions[ "Garrote Grip" ]
                    }).daily(),
                    new CH.Power({
                        name: "Sneak Attack",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "2d8"
                    }).atWill()
                ],
                effects: []
            };
            Kallista.hp.total = 12 + Kallista.abilities.CON + (5 * (partyLevel - 1));
            Kallista.skills = CH.skills(Kallista, {
                acrobatics: 5 + CH.mod(Kallista.abilities.CHA), // Duelist's Panache feat
                athletics: 5 + CH.mod(Kallista.abilities.CHA), // Duelist's Panache feat
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