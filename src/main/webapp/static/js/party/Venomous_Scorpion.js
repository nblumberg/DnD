/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Venomous_Scorpion",
        [ "creature.helpers", "jQuery", "Barases" ],
        function(CH, jQuery, Barases) {
            var Venmonous_Scorpion;
            Venmonous_Scorpion = jQuery.extend(true, {}, Barases, {
                name: "Venomous Scorpion",
                image: "../images/portraits/venomous_scorpion.jpg", // http://cdn.obsidianportal.com/assets/11534/Scorpion.jpg
                hp: {
                    total: window.Math.floor(Barases.hp.total / 2)
                },
                speed: 6,
                attacks: [
                    new CH.Power({
                        name: "Sting",
                        toHit: Barases.level + 5,
                        defense: "Ref",
                        damage: {
                            amount: "2d8+WIS",
                            type: "poison"
                        },
                        effects: [
                            {
                                name: "multiple",
                                children: [
                                    { name: "ongoing damage", amount: 10, type: "poison" },
                                    "immobilized"
                                ],
                                saveEnds: true
                            }
                        ]
                    }).atWill().melee().addKeywords("primal", "summoned", "basic")
                ]
            });
            return Venmonous_Scorpion;
        },
        false
    );

})();