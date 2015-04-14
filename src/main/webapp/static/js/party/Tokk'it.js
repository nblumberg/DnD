/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Tokk'it",
        [ "creature.helpers", "party.level", "jQuery" ],
        function(helpers, partyLevel, jQuery) {
            var Tokk_it;
            Tokk_it = {
                name: "Tokk'it",
                isPC: true,
                level: 11,
                image: "../images/portraits/tokk_it.jpg", // http://images.community.wizards.com/community.wizards.com/user/sotp_seamus/character_pictures/4223f53dc5c63a22aab6cc8ac8031d16.jpg?v=115650
                ap: 0,
                hp: {
                    total: 108
                },
                surges: {
                    perDay: 12,
                    current: 12
                },
                defenses: {
                    ac: 27,
                    fort: 22,
                    ref: 23,
                    will: 23
                },
                init: 12,
                speed: {
                    walk: 7,
                    jump: 5
                },
                abilities: {
                    STR: 15,
                    CON: 12,
                    DEX: 17,
                    INT: 10,
                    WIS: 16,
                    CHA: 11
                },
                skills: {
                    acrobatics: 15,
                    arcana: 0,
                    athletics: 9,
                    bluff: 0,
                    diplomacy: 0,
                    dungeoneering: 0,
                    endurance: 0,
                    heal: 0,
                    history: 0,
                    insight: 13,
                    intimidate: 0,
                    nature: 0,
                    perception: 13,
                    religion: 0,
                    stealth: 0,
                    streetwise: 0,
                    thievery: 0
                },
                attacks: [
                    {
                        name: "Unarmed Strike",
                        usage: {
                            frequency: "At-Will"
                        },
                        range: "melee",
                        toHit: 17,
                        defense: "AC",
                        damage: "2d8+3",
                        keywords: [
                            "melee", "basic"
                        ]
                    }, {
                        name: "Stunning Strike",
                        usage: {
                            frequency: "At-Will"
                        },
                        range: "melee",
                        toHit: 14,
                        defense: "Fort",
                        damage: "1d8+3",
                        effects: [
                            {
                                name: "Stunned",
                                duration: "endAttackerNext"
                            }
                        ],
                        keywords: [
                            "melee"
                        ]
                    }, {
                        name: "Trace Chance",
                        usage: {
                            frequency: "Recharge",
                            recharge: 6
                        },
                        range: 5,
                        toHit: "automatic",
                        defense: "AC",
                        damage: "0",
                        effects: [
                            {
                                name: "NextMeleeHitIsACrit",
                                duration: "endAttackerNext"
                            }
                        ],
                        keywords: [
                            "ranged"
                        ]
                    }
                ]
            };
            return Tokk_it;
        },
        false
    );

})();