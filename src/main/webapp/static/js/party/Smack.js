/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Smack",
        [ "jQuery", "Barases" ],
        function(jQuery, Barases) {
            var Smack;
            Smack = jQuery.extend(true, {}, Barases, {
                name: "Smack",
                image: "../images/portraits/smack.jpg", // http://www.lpzoo.org/sites/default/files/imagesfacts/black_bear.jpg?1331759862
                // Use Barases' abilities for all attacks
                skills: {
                    acrobatics: window.Math.floor(Barases.level / 2) + 1,
                    arcana: window.Math.floor(Barases.level / 2) - 2,
                    athletics: window.Math.floor(Barases.level / 2) + 8,
                    bluff: window.Math.floor(Barases.level / 2) - 2,
                    diplomacy: window.Math.floor(Barases.level / 2) + 1,
                    dungeoneering: window.Math.floor(Barases.level / 2) - 2,
                    endurance: window.Math.floor(Barases.level / 2) + 7,
                    heal: window.Math.floor(Barases.level / 2) + 1,
                    history: window.Math.floor(Barases.level / 2) - 2,
                    insight: window.Math.floor(Barases.level / 2) + 1,
                    intimidate: window.Math.floor(Barases.level / 2) - 2,
                    nature: window.Math.floor(Barases.level / 2) + 1,
                    perception: Barases.skills.perception + 2,
                    religion: window.Math.floor(Barases.level / 2) - 2,
                    stealth: window.Math.floor(Barases.level / 2) + 1,
                    streetwise: window.Math.floor(Barases.level / 2) - 2,
                    thievery: window.Math.floor(Barases.level / 2) + 1
                },
                hp: {
                    total: window.Math.floor(Barases.hp.total / 2)
                },
                defenses: {
                    ac: 12 + Barases.level,
                    fort: 14 + Barases.level,
                    ref: 10 + Barases.level,
                    will: 12 + Barases.level
                },
                speed: 5,
                attacks: [
                    {
                        name: "Animal Attack",
                        usage: {
                            frequency: "At-Will"
                        },
                        toHit: "WIS+5",
                        defense: "AC",
                        damage: "1d12+3+WIS+CON",
                        keywords: [
                            "melee", "beast", "basic"
                        ]
                    }
                ]
            });
            return Smack;
        },
        false
    );

})();