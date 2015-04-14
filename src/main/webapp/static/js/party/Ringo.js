/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Ringo",
        [ "jQuery" ],
        function(jQuery) {
            var Ringo;
            Ringo = {
                name: "Ringo",
                isPC: true,
                level: 5,
                image: "../images/portraits/ringo.jpg", // http://beta.ditzie.com/gallery/main.php?g2_view=core.DownloadItem&g2_itemId=14896&g2_serialNumber=1
                ap: 0,
                hp: {
                    total: 62
                },
                surges: {
                    perDay: 0,
                    current: 0
                },
                abilities: {
                    STR: 18,
                    CON: 10,
                    DEX: 14,
                    INT: 1,
                    WIS: 12,
                    CHA: 8
                },
                skills: {
                    acrobatics: 4,
                    arcana: -3,
                    athletics: 6,
                    bluff: 1,
                    diplomacy: 3,
                    dungeoneering: -3,
                    endurance: 2,
                    heal: 3,
                    history: -3,
                    insight: 3,
                    intimidate: 1,
                    nature: 3,
                    perception: 3,
                    religion: 3,
                    stealth: 4,
                    streetwise: 1,
                    thievery: 4
                },
                defenses: {
                    ac: 19,
                    fort: 17,
                    ref: 13,
                    will: 14
                },
                init: 2,
                speed: 6,
                attacks: [
                    {
                        name: "Bite",
                        usage: {
                            frequency: "At-Will"
                        },
                        range: "reach",
                        toHit: 10,
                        defense: "AC",
                        damage: "1d10+4",
                        keywords: [
                            "melee", "basic"
                        ]
                    }, {
                        name: "Entangling Spittle",
                        usage: {
                            frequency: "Recharge",
                            recharge: 4
                        },
                        target: {
                            range: 5
                        },
                        toHit: 8,
                        defense: "Ref",
                        damage: "0",
                        effects: [
                            {
                                name: "immobilized",
                                aveEnds: true
                            }
                        ],
                        keywords: [
                            "ranged"
                        ]
                    }
                ]
            };
            return Ringo;
        },
        false
    );

})();