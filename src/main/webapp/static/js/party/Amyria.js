/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Amyria",
        [ "creature.helpers", "party.level", "jQuery" ],
        function(helpers, partyLevel, jQuery) {
            var Amyria;
            Amyria = {
                name: "Amyria",
                isPC: true,
                level: 14,
                image: "../images/portraits/amyria.jpg",
                ap: 1,
                hp: {
                    total: 252
                },
                surges: {
                    perDay: 0,
                    current: 0
                },
                defenses: {
                    ac: 30,
                    fort: 24,
                    ref: 27,
                    will: 28
                },
                resistances: {
                    radiant: 10
                },
                savingThrows: 2,
                init: 16,
                speed: {
                    walk: 8
                },
                abilities: {
                    STR: 10,
                    CON: 12,
                    DEX: 12,
                    INT: 18,
                    WIS: 21,
                    CHA: 16
                },
                skills: {
                    acrobatics: 0,
                    arcana: 0,
                    athletics: 0,
                    bluff: 0,
                    diplomacy: 15,
                    dungeoneering: 0,
                    endurance: 0,
                    heal: 0,
                    history: 0,
                    insight: 0,
                    intimidate: 0,
                    nature: 0,
                    perception: 12,
                    religion: 17,
                    stealth: 0,
                    streetwise: 0,
                    thievery: 0
                },
                attacks: [
                    {
                        name: "Longsword",
                        usage: {
                            frequency: "At-Will"
                        },
                        range: "melee",
                        toHit: 21,
                        defense: "AC",
                        damage: "1d8+7",
                        effects: [ { name: "Marked", duration: "endAttackerNext" } ],
                        keywords: [
                            "melee", "basic", "radiant", "weapon"
                        ]
                    }, {
                        name: "Retributive Strike",
                        usage: {
                            frequency: "At-Will"
                        },
                        range: "melee",
                        toHit: "automatic",
                        defense: "AC",
                        damage: { amount: "7", type: "radiant" },
                        keywords: [
                            "melee", "radiant"
                        ]
                    }, {
                        name: "Crusader's Assault",
                        usage: {
                            frequency: "At-Will"
                        },
                        range: "melee",
                        toHit: 21,
                        defense: "AC",
                        damage: [ { amount: "1d8+7" }, { amount: "1d8", type: "radiant" } ],
                        keywords: [
                            "melee", "radiant", "weapon"
                        ]
                    }, {
                        name: "Bahamut's Accusing Eye",
                        usage: {
                            frequency: "At-Will"
                        },
                        target: { range: 10 },
                        toHit: 18,
                        defense: "Ref",
                        damage: { amount: "2d8+7", type: [ "cold", "radiant" ] },
                        effects: [ { name: "multiple", saveEnds: true, children: [ { name: "ongoing damage", amount: "5", type: [ "cold", "radiant" ] }, { name: "Slowed" } ] } ],
                        keywords: [
                            "ranged", "cold", "radiant"
                        ]
                    }
                ]
            };
            return Amyria;
        },
        false
    );

})();