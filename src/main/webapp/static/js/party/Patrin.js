/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Patrin",
        [ "creature.helpers", "party.level", "jQuery", "html" ],
        function(CH, partyLevel, jQuery, descriptions) {
            var Patrin;
            partyLevel = 1;
            Patrin = {
                isPC: true,
                level: partyLevel,
                abilities: {
                    STR: 16,
                    CON: 14,
                    DEX: 10,
                    INT: 14,
                    WIS: 10,
                    CHA: 16
                },
                ap: 1,
                hp: {
                },
                surges: {
                    perDay: 9,
                    current: 9
                },
                defenses: {
                    ac: 17,
                    fort: 14,
                    ref: 13,
                    will: 14
                },
                init: 2,
                speed: 5,
                weapons: [],
                "implements": [],
                effects: []
            };
            Patrin.hp.total = 12 + Patrin.abilities.CON + (5 * (partyLevel - 1));
            Patrin.skills = CH.skills(Patrin, {
                athletics: 5,
                diplomacy: 5,
                heal: 5,
                history: 5
            });
            Patrin = jQuery.extend(true, {}, Patrin, {
                name: "Patrin",
                image: "http://pre05.deviantart.net/88b3/th/pre/f/2011/117/6/0/602bfcae82e5e148a2e6b67e107909c2-d3f17mn.jpg",
                ap: 1,
                surges: {
                    perDay: 9,
                    current: 9
                },
                weapons: [
                    {
                        name: "Sling",
                        isMelee: false,
                        enhancement: 0,
                        proficiency: 2,
                        damage: {
                            amount: "1d6",
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
                        name: "Intuitive Strike",
                        toHit: "STR",
                        defense: "Will",
                        damage: "1[W]",
                        keywords: [
                            "martial", "weapon"
                        ]
                    }).atWill().melee(),
                    new CH.Power({
                        name: "Paint the Bulls-Eye",
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]",
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).atWill().melee(),
                    new CH.Power({
                        name: "Dragon Breath",
                        toHit: "STR",
                        defense: "Ref",
                        damage: { amount: "1d6+CON", type: "acid" },
                        keywords: [
                            "acid"
                        ]
                    }).encounter().blast(3).minor(),
                    new CH.Power({
                        name: "Bastion of Defense",
                        toHit: "STR",
                        defense: "AC",
                        damage: "3[W]+STR",
                        keywords: [
                            "martial", "weapon"
                        ]
                    }).daily().melee()                ],
                buffs: [
                    new CH.Power({
                        name: "Guardian's Counter",
                        keywords: [ "martial" ]
                    }).encounter().immediateInterrupt(),
                    new CH.Power({
                        name: "Vengeance is Mine",
                        keywords: [ "martial" ]
                    }).encounter().immediateReaction(),
                    new CH.Power({
                        name: "Inspiring Word",
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: true,
                            amount: "1d6+HS"
                        },
                        keywords: [ "martial", "healing" ]
                    }).encounter(2),
                    new CH.Power({
                        name: "Bastion of Defense",
                        healing: {
                            isTempHP: true,
                            usesHealingSurge: false,
                            amount: "5+CHA"
                        },
                        keywords: [ "martial" ]
                    }).daily()
                ]
            });
            return Patrin;
        },
        false
    );

})();