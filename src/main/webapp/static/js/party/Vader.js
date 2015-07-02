/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Vader",
        [ "creature.helpers", "party.level", "jQuery", "descriptions", "Effect" ],
        function(h, partyLevel, jQuery, descriptions, Effect) {
            var Vader;
            Vader = {
                name: "Vader",
                isPC: true,
                level: partyLevel,
                image: "../images/portraits/vader.jpg",
                abilities: {
                    STR: 13,
                    CON: 21,
                    DEX: 11,
                    INT: 20,
                    WIS: 13,
                    CHA: 10
                },
                ap: 1,
                hp: {
                    total: 109
                },
                surges: {
                    perDay: 12,
                    current: 12
                },
                defenses: {
                    ac: 34,
                    fort: 28,
                    ref: 28,
                    will: 26
                },
                init: 12,
                speed: 6,
                weapons: [
                    {
                        name: "Goblin Totem Longsword +4",
                        isMelee: true,
                        enhancement: 4,
                        proficiency: 3,
                        damage: {
                            amount: "1d8",
                            crit: "4d6"
                        }
                    }
                ],
                "implements": [
                    {
                        name: "Goblin Totem Longsword +4",
                        enhancement: 4,
                        crit: "4d6"
                    }
                ],
                attackBonuses: [
                ],
                attacks: [
                    h.meleeBasic,
                    h.rangedBasic,
                    new h.Power({
                        name: "Eldritch Strike",
                        toHit: "CON",
                        defense: "AC",
                        damage: "1[W]+CON",
                        keywords: [
                            "arcane", "weapon"
                        ]
                    }).atWill().melee(),
                    new h.Power({
                        name: "Hellish Rebuke",
                        toHit: "CON",
                        defense: "Ref",
                        damage: { amount: "1d6+CON", type: "fire" },
                        keywords: [
                            "arcane", "fire", "implement"
                        ]
                    }).atWill().ranged(10),
                    new h.Power({
                        name: "Hellish Rebuke (redux)",
                        toHit: "automatic",
                        defense: "Ref",
                        damage: { amount: "1d6+CON", type: "fire" },
                        keywords: [
                            "arcane", "fire", "implement"
                        ],
                        description: descriptions[ "Hellish Rebuke" ]
                    }).atWill().ranged(10),
                    new h.Power({
                        name: "Sword Burst",
                        toHit: "INT",
                        defense: "Ref",
                        damage: "1d6+INT",
                        keywords: [
                            "arcane", "force", "implement"
                        ]
                    }).atWill().closeBurst(1, true),
                    new h.Power({
                        name: "Warlock's Curse",
                        toHit: "automatic",
                        defense: "AC",
                        damage: "2d8"
                    }).atWill().ranged().minor(),
                    new h.Power({
                        name: "Dimensional Vortex",
                        toHit: "INT",
                        defense: "Will",
                        damage: "0",
                        keywords: [
                            "arcane", "implement", "teleportation"
                        ]
                    }).encounter().ranged(10).immediateInterrupt(),
                    new h.Power({
                        name: "Transposing Lunge",
                        toHit: "INT",
                        defense: "AC",
                        damage: "2[W]+INT",
                        keywords: [
                            "weapon", "arcane", "teleportation"
                        ]
                    }).encounter().melee(),
                    new h.Power({
                        name: "Thunderclap Strike",
                        toHit: "INT",
                        defense: "Fort",
                        damage: {
                            amount: "2d6+INT",
                            type: "thunder"
                        },
                        effects: [
                            "Prone"
                        ],
                        keywords: [
                            "arcane", "implement", "thunder"
                        ]
                    }).encounter().closeBurst(1),
                    new h.Power({
                        name: "Soul Flaying",
                        toHit: "CON",
                        defense: "Will",
                        damage: {
                            amount: "2d8+CON+INT",
                            type: "necrotic"
                        },
                        effects: [
                            "Prone"
                        ],
                        keywords: [
                            "arcane", "implement", "necrotic"
                        ]
                    }).encounter().ranged(10),
                    new h.Power({
                        name: "Aegis of Shielding",
                        target: {
                            targets: 1
                        },
                        toHit: "CON",
                        defense: "Will",
                        damage: {
                            amount: "2d8+CON+INT",
                            type: "necrotic"
                        },
                        effects: [
                            "Prone"
                        ],
                        keywords: [
                            "arcane", "implement", "necrotic"
                        ]
                    }).encounter().minor().closeBurst(2),
                    new h.Power({
                        name: "Swordmage Shielding Fire",
                        target: {
                            targets: 1
                        },
                        toHit: "INT",
                        defense: "Fort",
                        damage: {
                            amount: "2d10+CON",
                            type: "fire"
                        },
                        effects: [
                            "Marked"
                        ],
                        miss: {
                            effects: [ "Marked" ]
                        },
                        keywords: [
                            "arcane", "fire", "implement"
                        ]
                    }).daily().closeBurst(10),
                    new h.Power({
                        name: "Swordmage Shielding Fire (redux)",
                        toHit: "automatic",
                        defense: "Fort",
                        damage: {
                            amount: "10+CON",
                            type: "fire"
                        },
                        effects: [
                            "Marked"
                        ],
                        miss: {
                            effects: [ "Marked" ]
                        },
                        keywords: [
                            "arcane", "fire", "implement"
                        ],
                        description: descriptions[ "Swordmage Shielding Fire" ]
                    }).atWill().closeBurst(10),
                    new h.Power({
                        name: "Armor of Agathys",
                        toHit: "automatic",
                        defense: "AC",
                        damage: {
                            amount: "1d6+CON",
                            type: "cold"
                        },
                        keywords: [
                            "arcane", "cold", "aura"
                        ]
                    }).atWill(),
                    new h.Power({
                        name: "Menacing Shadow",
                        toHit: "CHA",
                        defense: "Ref",
                        damage: {
                            amount: "2d6+CHA",
                            type: "necrotic"
                        },
                        effects: [
                            { name: "Dazed", duration: "endAttackerNext" }
                        ],
                        keywords: [
                            "arcane", "implement", "necrotic", "shadow"
                        ]
                    }).atWill().minor().melee()
                ],
                buffs: [
                    new h.Power({
                        name: "Armor of Agathys",
                        healing: {
                            isTempHP: true,
                            usesHealingSurge: false,
                            amount: "10+INT"
                        }
                    }).daily(),
                    new h.Power({
                        name: "Dark One's Blessing",
                        healing: {
                            isTempHP: true,
                            usesHealingSurge: false,
                            amount: "" + partyLevel
                        }
                    }).atWill(),
                    new h.Power({
                        name: "Heroic Effort"
                    }).encounter(),
                    new h.Power({
                        name: "Arcane Mutterings"
                    }).encounter(),
                    new h.Power({
                        name: "Channeling Shield"
                    }).encounter().immediateInterrupt(),
                    new h.Power({
                        name: "Painful Transference"
                    }).encounter().noAction(),
                    new h.Power({
                        name: "Menacing Shadow",
                        keywords: [
                            "arcane", "conjuration", "shadow"
                        ]
                    }).daily().minor().ranged(5),
                    new h.Power({
                        name: "Dimensional Dodge",
                        keywords: [
                            "arcane", "teleportation"
                        ]
                    }).daily().immediateInterrupt().ranged(20),
                    new h.Power({
                        name: "Amulet of Life",
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: true,
                            amount: "HS"
                        }
                    }).encounter()
                ],
                effects: []
            };
            Vader.hp.total = 12 + Vader.abilities.CON + (5 * (partyLevel - 1));
            Vader.skills = h.skills(Vader, {
                arcana: 5,
                athletics: 5,
                endurance: 5,
                heal: 5,
                intimidate: 5
            });
            return Vader;
        },
        false
    );

})();