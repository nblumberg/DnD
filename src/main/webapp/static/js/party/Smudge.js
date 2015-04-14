/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Smudge",
        [ "jQuery" ],
        function(jQuery) {
            var Smudge;
            Smudge = {
                name: "Smudge",
                isPC: true,
                level: 12,
                image: "../images/portraits/redspawn_firebelcher.png", // http://images3.wikia.nocookie.net/__cb20100421223543/dndawokenheroes/images/9/93/Redspawn_Firebelcher.png
                ap: 0,
                hp: {
                    total: 97
                },
                surges: {
                    perDay: 0,
                    current: 0
                },
                abilities: {
                    STR: 18,
                    CON: 13,
                    DEX: 19,
                    INT: 2,
                    WIS: 13,
                    CHA: 8
                },
                skills: {
                    acrobatics: 10,
                    arcana: 2,
                    athletics: 10,
                    bluff: 5,
                    diplomacy: 7,
                    dungeoneering: 2,
                    endurance: 7,
                    heal: 7,
                    history: 2,
                    insight: 7,
                    intimidate: 5,
                    nature: 7,
                    perception: 6,
                    religion: 7,
                    stealth: 10,
                    streetwise: 5,
                    thievery: 10
                },
                defenses: {
                    ac: 25,
                    fort: 25,
                    ref: 22,
                    will: 21
                },
                init: 7,
                speed: 4,
                attacks: [
                    {
                        name: "Bite",
                        usage: {
                            frequency: "At-Will"
                        },
                        range: "melee",
                        toHit: 16,
                        defense: "AC",
                        damage: {
                            amount: "1d10+4",
                            type: "fire"
                        },
                        effects: [
                            {
                                name: "ongoing damage",
                                amount: 5,
                                type: "fire",
                                saveEnds: true
                            }
                        ],
                        keywords: [
                            "melee", "fire", "basic"
                        ]
                    }, {
                        name: "Fire Belch",
                        usage: {
                            frequency: "At-Will"
                        },
                        target: {
                            range: 12
                        },
                        toHit: 15,
                        defense: "Ref",
                        damage: {
                            amount: "2d6+1",
                            type: "fire"
                        },
                        effects: [
                            {
                                name: "ongoing damage",
                                amount: 5,
                                type: "fire",
                                saveEnds: true
                            }
                        ],
                        keywords: [
                            "ranged", "fire", "basic"
                        ]
                    }, {
                        name: "Fire Burst",
                        usage: {
                            frequency: "Recharge",
                            recharge: 5
                        },
                        target: {
                            area: "burst",
                            size: 2,
                            range: 10
                        },
                        toHit: 15,
                        defense: "Ref",
                        damage: {
                            amount: "3d6+1",
                            type: "fire"
                        },
                        effects: [
                            {
                                name: "ongoing damage",
                                amount: 5,
                                type: "fire",
                                saveEnds: true
                            }
                        ],
                        miss: {
                            halfDamage: true
                        },
                        keywords: [
                            "ranged", "fire"
                        ]
                    }
                ]
            };
            return Smudge;
        },
        false
    );

})();