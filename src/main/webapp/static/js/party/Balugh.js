/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Balugh",
        [ "jQuery", "Lechonero" ],
        function(jQuery, Lechonero) {
            var Balugh;
            Balugh = jQuery.extend(true, {}, Lechonero, {
                name: "Balugh",
                image: "../images/portraits/balugh.jpg", // http://images3.wikia.nocookie.net/__cb20100421223543/dndawokenheroes/images/9/93/Redspawn_Firebelcher.png
                hp: {
                    total: 16 + Lechonero.level * 10
                },
                surges: {
                    perDay: 2,
                    current: 2
                },
                // Use Lechonero's abilities for all attacks
                skills: {
                    acrobatics: Math.floor(Lechonero.level / 2) + 1,
                    arcana: Math.floor(Lechonero.level / 2) - 4,
                    athletics: Math.floor(Lechonero.level / 2) + 10,
                    bluff: Math.floor(Lechonero.level / 2) - 2,
                    diplomacy: Math.floor(Lechonero.level / 2) + 1,
                    dungeoneering: Math.floor(Lechonero.level / 2) - 2,
                    endurance: Math.floor(Lechonero.level / 2) + 7,
                    heal: Math.floor(Lechonero.level / 2) + 1,
                    history: Math.floor(Lechonero.level / 2) - 2,
                    insight: Math.floor(Lechonero.level / 2) + 1,
                    intimidate: Math.floor(Lechonero.level / 2) - 2,
                    nature: Math.floor(Lechonero.level / 2) + 1,
                    perception: Lechonero.skills.perception + 2,
                    religion: Math.floor(Lechonero.level / 2) - 2,
                    stealth: Math.floor(Lechonero.level / 2) + 1,
                    streetwise: Math.floor(Lechonero.level / 2) - 2,
                    thievery: Math.floor(Lechonero.level / 2) + 1
                },
                defenses: {
                    ac: 12 + Lechonero.level,
                    fort: 14 + Lechonero.level,
                    ref: 10 + Lechonero.level,
                    will: 12 + Lechonero.level
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
            return Balugh;
        },
        false
    );

})();