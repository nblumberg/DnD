/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Oomooroo",
        [ "jQuery", "Barases" ],
        function(jQuery, Barases) {
            var Oomooroo;
            Oomooroo = jQuery.extend(true, {}, Barases, {
                name: "Oomooroo",
                image: "../images/portraits/owlbear.jpg", // http://www.lpzoo.org/sites/default/files/imagesfacts/black_bear.jpg?1331759862
                abilities: {
                    STR: 20,
                    CON: 17,
                    DEX: 12,
                    INT: 2,
                    WIS: 14,
                    CHA: 6
                },
                skills: {
                    acrobatics: window.Math.floor(Barases.hp.total / 2) + 1,
                    arcana: window.Math.floor(Barases.hp.total / 2) - 4,
                    athletics: window.Math.floor(Barases.hp.total / 2) + 5,
                    bluff: window.Math.floor(Barases.hp.total / 2) - 2,
                    diplomacy: window.Math.floor(Barases.hp.total / 2) - 2,
                    dungeoneering: window.Math.floor(Barases.hp.total / 2) - 4,
                    endurance: window.Math.floor(Barases.hp.total / 2) + 3,
                    heal: window.Math.floor(Barases.hp.total / 2) + 2,
                    history: window.Math.floor(Barases.hp.total / 2) - 4,
                    insight: window.Math.floor(Barases.hp.total / 2) + 2,
                    intimidate: window.Math.floor(Barases.hp.total / 2) - 2,
                    nature: window.Math.floor(Barases.hp.total / 2) + 2,
                    perception: Barases.skills.perception + 2,
                    religion: window.Math.floor(Barases.hp.total / 2) - 4,
                    stealth: window.Math.floor(Barases.hp.total / 2) + 1,
                    streetwise: window.Math.floor(Barases.hp.total / 2) - 2,
                    thievery: window.Math.floor(Barases.hp.total / 2) + 1
                },
                hp: {
                    total: window.Math.floor(Barases.hp.total / 2)
                },
                defenses: {
                    ac: 13 + Barases.level,
                    fort: 15 + Barases.level,
                    ref: 11 + Barases.level,
                    will: 15 + Barases.level
                },
                speed: 6,
                attacks: [
                    {
                        name: "Claw",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: Barases.level + 5,
                        defense: "AC",
                        damage: "1d12+" + window.Math.floor(Barases.level / 2),
                        keywords: [
                            "melee", "beast", "basic"
                        ]
                    }
                ]
            });
            return Oomooroo;
        },
        false
    );

})();