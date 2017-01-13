/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Cassian",
        [ "creature.helpers", "party.level", "jQuery", "html" ],
        function(CH, partyLevel, jQuery, descriptions) {
            var Cassian;
            partyLevel = 1;
            Cassian = {
                isPC: true,
                level: partyLevel,
                abilities: {
                    STR: 11,
                    CON: 14,
                    DEX: 12,
                    INT: 10,
                    WIS: 20,
                    CHA: 8
                },
                ap: 1,
                hp: {
                },
                surges: {
                    perDay: 9,
                    current: 9
                },
                defenses: {
                    ac: 18,
                    fort: 13,
                    ref: 13,
                    will: 16
                },
                init: 1,
                speed: 6,
                weapons: [],
                "implements": [],
                effects: []
            };
            Cassian.hp.total = 12 + Cassian.abilities.CON + (5 * (partyLevel - 1));
            Cassian.skills = CH.skills(Cassian, {
                diplomacy: 5,
                history: 5,
                insight: 5,
                perception: 2,
                religion: 5
            });
            Cassian = jQuery.extend(true, {}, Cassian, {
                name: "Cassian",
                image: "https://s-media-cache-ak0.pinimg.com/236x/d5/b2/4d/d5b24d209b4df47e889ffad3ef6480bf.jpg", //"https://s-media-cache-ak0.pinimg.com/236x/72/61/18/7261187b6a90fe4ea0aa7efaa5946d46.jpg",
                ap: 1,
                surges: {
                    perDay: 9,
                    current: 9
                },
                weapons: [
                    {
                        name: "Crossbow",
                        isMelee: false,
                        enhancement: 0,
                        proficiency: 2,
                        damage: {
                            amount: "1d8",
                            crit: "0"
                        }
                    }, {
                        name: "Mace",
                        isMelee: true,
                        enhancement: 0,
                        proficiency: 2,
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
                        name: "Blessing of Battle",
                        toHit: "WIS",
                        defense: "AC",
                        damage: "1[W]+WIS",
                        keywords: [
                            "divine", "weapon"
                        ]
                    }).atWill().melee(),
                    new CH.Power({
                        name: "Brand of the Moon",
                        toHit: "WIS",
                        defense: "AC",
                        damage: { amount: "1[W]+WIS", type: "radiant" },
                        keywords: [
                            "weapon", "divine", "radiant"
                        ]
                    }).atWill().melee(),
                    new CH.Power({
                        name: "Sun Burst",
                        toHit: "WIS",
                        defense: "AC",
                        damage: { amount: "1[W]+WIS", type: "radiant" },
                        keywords: [
                            "weapon", "divine", "radiant"
                        ]
                    }).encounter().melee(),
                    new CH.Power({
                        name: "Levy of Judgement",
                        toHit: "WIS",
                        defense: "AC",
                        damage: { amount: "2[W]+WIS", type: "radiant" },
                        miss: { halfDamage: true },
                        keywords: [
                            "weapon", "divine", "radiant"
                        ]
                    }).daily().melee()                ],
                buffs: [
                    new CH.Power({
                        name: "Elven Accuracy"
                    }).encounter(),
                    new CH.Power({
                        name: "Healing Word",
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: true,
                            amount: "1d6+HS"
                        },
                        keywords: [ "healing" ]
                    }).encounter(2).minor().closeBurst(5),
                    new CH.Power({
                        name: "Healing Word (Sun domain)",
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: false,
                            amount: "2"
                        },
                        keywords: [ "healing" ]
                    }).encounter(2).free().closeBurst(5),
                    new CH.Power({
                        name: "Soothing Light",
                        keywords: [ "shadow" ]
                    }).encounter().minor().closeBurst(2)
                ]
            });
            return Cassian;
        },
        false
    );

})();