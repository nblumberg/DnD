/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.bitterglass",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Bitterglass", level: 14, image: "../images/portraits/bitterglass.png",
                hp: { total: 200 },
                defenses: { ac: 28, fort: 26, ref: 24, will: 26 },
                vulnerabilities: { thunder: 10 },
                init: 12, speed: 0,
                attacks: [
                    { name: "Hazard", usage: { frequency: "At-Will" }, target: { area: "close", size: 10 }, toHit: 18, defense: "Will", damage: { amount: "2d8+5", type: "psychic" }, effects: [
                        { name: "ongoing damage", amount: 5, type: "psychic", saveEnds: true },
                        { name: "Dazed", duration: "endAttackerNext" }
                    ], miss: { halfDamage: true }, keywords: [ "melee", "psychic", "basic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);