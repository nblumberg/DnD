/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Karrion",
        [ "creature.helpers", "party.level", "jQuery", "html", "Effect" ],
        function(CH, partyLevel, jQuery, descriptions, Effect) {
            var Karrion;
            Karrion = {
                name: "Karrion",
                isPC: true,
                level: partyLevel,
                image: "../images/portraits/karrion.jpg", // "http://rogueartfx.com/images/tiefling03.jpg",
                abilities: {
                    STR: 22,
                    CON: 17,
                    DEX: 21,
                    INT: 19,
                    WIS: 18,
                    CHA: 17
                },
                ap: 1,
                hp: {
                    total: 114
                },
                surges: {
                    perDay: 9,
                    current: 9
                },
                defenses: {
                    ac: 28,
                    fort: 27,
                    ref: 26,
                    will: 24
                },
                resistances: {
                    fire: 14,
                    necrotic: 14
                },
                init: 16,
                speed: 6,
                weapons: [
                    {
                        name: "Withering Spiked Chain +3",
                        isMelee: true,
                        enhancement: 3,
                        proficiency: 3,
                        damage: {
                            amount: "2d4",
                            crit: "3d6"
                        },
                        effects: [
                            function(target, attacker, round) {
                                var otherId, effect, i, amount;
                                otherId = "Karrion's Withering Spiked Chain +3 effect";
                                amount = 0;
                                for (i = 0; i < target.effects.length; i++) {
                                    effect = target.effects[ i ];
                                    if (effect.otherId === otherId) {
                                        amount = effect.amount;
                                        effect.remove();
                                        break;
                                    }
                                }
                                amount++;
                                return new Effect({
                                    name: "penalty",
                                    otherId: otherId,
                                    type: "ac",
                                    amount: amount || 1,
                                    saveEnds: true,
                                    target: target,
                                    attacker: attacker,
                                    round: round
                                });
                            }
                        ]
                    }, {
                        name: "Learning Longbow +3",
                        isMelee: false,
                        enhancement: 3,
                        proficiency: 2,
                        damage: {
                            amount: "1d10",
                            crit: "3d6"
                        }
                    }, {
                        name: "Sid Vicious Longbow +1",
                        isMelee: false,
                        enhancement: 1,
                        proficiency: 2,
                        damage: {
                            amount: "1d10",
                            crit: "1d12"
                        }
                    }, {
                        name: "Lightning Spiked Chain +1",
                        isMelee: true,
                        enhancement: 1,
                        proficiency: 3,
                        damage: {
                            amount: "2d4",
                            crit: "1d6"
                        }
                    }
                ],
                "implements": [
                    {
                        name: "Totem",
                        enhancement: 0,
                        crit: "0"
                    }
                ],
                attackBonuses: [
                    {
                        name: "Bloodhunt",
                        foeStatus: [
                            "bloodied"
                        ],
                        toHit: 1
                    }
                    /*
                     * , { name: "Hunter's Quarry", foeStatus: [ "hunter's quarry" ], damage: "1d8", oncePerRound: true }
                     */
                ],
                attacks: [
                    CH.meleeBasic,
                    CH.rangedBasic,
                    new CH.Power({
                        name: "Marauder's Rush",
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]+STR+WIS",
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
                        name: "Pinning Strike",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "STR/DEX",
                        defense: "AC",
                        damage: "1[W]+STR/DEX",
                        effects: [ { name: "Immobilized", duration: "startAttackerNext" } ],
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).encounter(),
                    new CH.Power({
                        name: "Sweeping Whirlwind",
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]+STR",
                        keywords: [
                            "weapon", "martial", "melee"
                        ]
                    }).encounter().closeBurst(1, true),
                    new CH.Power({
                        name: "Your Doom Awaits",
                        toHit: "STR",
                        defense: "Will",
                        damage: {
                            amount: "3d10+STR",
                            type: "psychic"
                        },
                        effects: [
                            {
                                name: "dazed",
                                duration: "endTargetNext"
                            }
                        ],
                        keywords: [
                            "fear", "implement", "primal", "psychic"
                        ]
                    }).encounter().closeBurst(3, true),
                    new CH.Power({
                        name: "Blow-Through Assault",
                        toHit: "STR/DEX",
                        defense: "AC",
                        damage: "3[W]+STR/DEX",
                        keywords: [
                            "martial", "weapon"
                        ]
                    }).encounter(),
                    new CH.Power({
                        name: "Blow-Through Assault (secondary)",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "WIS",
                        keywords: [
                            "martial", "weapon"
                        ],
                        description: descriptions[ "Blow-Through Assault" ]
                    }).encounter().burst(1, null, true),
                    /*
                    new CH.Power({
                        name: "Thundertusk Boar Strike",
                        toHit: "STR/DEX",
                        defense: "AC",
                        damage: "1[W]+STR/DEX",
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).encounter(),
                    new CH.Power({
                        name: "Boar Assault",
                        toHit: "STR/DEX",
                        defense: "AC",
                        damage: "2[W]+STR/DEX",
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).daily(),
                    */
                    new CH.Power({
                        name: "Steeling Flurry",
                        toHit: "STR",
                        defense: "AC",
                        damage: "1[W]+STR",
                        miss: { halfDamage: true },
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).daily().closeBurst(1, true),
                    new CH.Power({
                        name: "Invigorating Confrontation",
                        toHit: "DEX",
                        defense: "AC",
                        damage: "3[W]+DEX",
                        miss: {
                            halfDamage: true
                        },
                        keywords: [
                            "weapon", "martial"
                        ]
                    }).daily().ranged(),
                    new CH.Power({
                        name: "Infernal Wrath",
                        toHit: "automatic",
                        defense: "AC",
                        damage: {
                            amount: "2d6+INT^CHA",
                            type: "fire"
                        },
                        keywords: [
                            "fire"
                        ]
                    }).encounter(),
                    new CH.Power({
                        name: "Spirit's Fangs",
                        toHit: "WIS",
                        defense: "Ref",
                        damage: "1d10+WIS",
                        keywords: [
                            "implement", "primal", "spirit"
                        ]
                    }).encounter(),
                    new CH.Power({
                        name: "Hunter's Thorn Trap",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "5+WIS",
                        keywords: [
                            "primal", "zone"
                        ]
                    }).encounter(),
                    new CH.Power({
                        name: "Hunter's Quarry",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "2d8"
                    }).atWill()
                ],
                buffs: [
                    /* {
                        name: "Boar Assault",
                        usage: {
                             frequency: "At-Will"
                        },
                        healing: {
                             isTempHP: true,
                             usesHealingSurge: false,
                             amount: "WIS"
                        },
                        description: descriptions[ "Boar Assault" ]
                    }, */
                    new CH.Power({
                        name: "Invigorating Confrontation",
                        healing: {
                            isTempHP: true,
                            usesHealingSurge: false,
                            amount: "WIS+5"
                        }
                    }).atWill(),
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
                        name: "Spirit of Sacrifice",
                        healing: {
                            isTempHP: true,
                            usesHealingSurge: false,
                            amount: "7+STR^WIS"
                        }
                    }).encounter()
                ],
                effects: []
            };
            Karrion.hp.total = 12 + Karrion.abilities.CON + (5 * (partyLevel - 1));
            Karrion.skills = CH.skills(Karrion, {
                acrobatics: 5,
                athletics: 5,
                dungeoneering: 5,
                nature: 5,
                perception: 5,
                stealth: 5
            });
            return Karrion;
        },
        false
    );

})();