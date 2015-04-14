/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Apparatus of Kwalish",
        [ "creature.helpers", "party.level", "jQuery" ],
        function(helpers, partyLevel, jQuery) {
            var Apparatus_of_Kwalish;
            Apparatus_of_Kwalish = {
                name: "Apparatus of Kwalish",
                isPC: true,
                level: 15,
                image: "../images/portraits/apparatus_of_kwalish.png",
                ap: 0,
                hp: {
                    total: 200
                },
                surges: {
                    perDay: 0,
                    current: 0
                },
                defenses: {
                    ac: 20,
                    fort: 20,
                    ref: 20,
                    will: 20
                },
                resistances: {
                    all: 15
                },
                init: 0,
                speed: {
                    swim: 4
                },
                abilities: {
                    STR: 10,
                    CON: 10,
                    DEX: 10,
                    INT: 1,
                    WIS: 1,
                    CHA: 1
                },
                skills: {
                    acrobatics: 0,
                    arcana: 0,
                    athletics: 0,
                    bluff: 0,
                    diplomacy: 0,
                    dungeoneering: 0,
                    endurance: 0,
                    heal: 0,
                    history: 0,
                    insight: 0,
                    intimidate: 0,
                    nature: 0,
                    perception: 0,
                    religion: 0,
                    stealth: 0,
                    streetwise: 0,
                    thievery: 0
                },
                attacks: [
                    {
                        name: "Pincers",
                        usage: {
                            frequency: "At-Will"
                        },
                        range: "melee",
                        toHit: 12,
                        defense: "AC",
                        damage: "2d8",
                        keywords: [
                            "melee", "basic"
                        ]
                    }
                ]
            };
            return Apparatus_of_Kwalish;
        },
        false
    );

})();