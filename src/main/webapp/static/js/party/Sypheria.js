/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Sypheria",
        [ "creature.helpers", "party.level", "jQuery" ],
        function(CH, partyLevel, jQuery) {
            var Sypheria;
            partyLevel = 1;
            Sypheria = {
                isPC: true,
                level: partyLevel,
                abilities: {
                    STR: 13,
                    CON: 17,
                    DEX: 19,
                    INT: 12,
                    WIS: 15,
                    CHA: 12
                },
                ap: 1,
                hp: {
                },
                surges: {
                    perDay: 8,
                    current: 8
                },
                defenses: {
                    ac: 18,
                    fort: 15,
                    ref: 16,
                    will: 14
                },
                init: 4,
                speed: 6,
                weapons: [
                    {
                        name: "Monk unarmed strike (Sickle)",
                        isMelee: true,
                        enhancement: 0,
                        proficiency: 3,
                        damage: {
                            amount: "1d8",
                            crit: "0"
                        }
                    }, {
                        name: "Sickle",
                        isMelee: true,
                        enhancement: 0,
                        proficiency: 2,
                        damage: {
                            amount: "1d6",
                            crit: "0"
                        }
                    }, {
                        name: "Sling",
                        isMelee: false,
                        enhancement: 0,
                        proficiency: 2,
                        damage: {
                            amount: "1d6",
                            crit: "0"
                        }
                    }
                ],
                "implements": [
                    {
                        name: "Ki Focus",
                        enhancement: 0,
                        crit: "0"
                    }
                ]
            };
            Sypheria.hp.total = 12 + Sypheria.abilities.CON + (5 * (partyLevel - 1));
            Sypheria.skills = CH.skills(Sypheria, {
                acrobatics: 5,
                athletics: 5,
                perception: 5,
                stealth: 5,
                thievery: 5
            });
            Sypheria = jQuery.extend(true, {}, Sypheria, {
                name: "Sypheria",
                image: "https://s-media-cache-ak0.pinimg.com/736x/4f/89/b6/4f89b65747195690d838c159982e0d8e.jpg",
                ap: 1,
                surges: {
                    perDay: 8,
                    current: 8
                },
                attacks: [
                    CH.meleeBasic,
                    CH.rangedBasic,
                    new CH.Power({
                        name: "Crashing Wave",
                        toHit: "DEX",
                        defense: "Fort",
                        damage: "1d8+DEX",
                        keywords: [
                            "full discipline", "elemental", "implement", "psionic", "melee"
                        ]
                    }).atWill(),
                    new CH.Power({
                        name: "Fallen Needle",
                        toHit: "DEX",
                        defense: "Ref",
                        damage: "1d10+DEX",
                        keywords: [
                            "full discipline", "implement", "psionic", "melee"
                        ]
                    }).atWill(),
                    new CH.Power({
                        name: "Steel Wind",
                        toHit: "DEX",
                        defense: "Ref",
                        damage: "1d8+DEX",
                        keywords: [
                            "full discipline", "implement", "psionic"
                        ]
                    }).atWill().blast(2),
                    new CH.Power({
                        name: "Centered Flurry of Blows",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "2+CON",
                        keywords: [
                            "psionic", "melee"
                        ]
                    }).atWill(),
                    new CH.Power({
                        name: "Beguiling Flash",
                        toHit: "DEX",
                        defense: "Will",
                        damage: "0",
                        keywords: [
                            "arcane", "illusion", "implement"
                        ]
                    }).encounter().ranged(10),
                    new CH.Power({
                        name: "Gentle Rainfall",
                        toHit: "DEX",
                        defense: "Ref",
                        damage: "1d10+DEX",
                        keywords: [
                            "full discipline", "implement", "psionic"
                        ]
                    }).encounter().closeBurst(1),
                    new CH.Power({
                        name: "Masterful Spiral",
                        isMelee: true,
                        toHit: "DEX",
                        defense: "Ref",
                        damage: "3d8+DEX",
                        keywords: [
                            "force", "implement", "psionic", "stance"
                        ]
                    }).daily().closeBurst(2)
                ],
                effects: []
            });
            return Sypheria;
        },
        false
    );

})();