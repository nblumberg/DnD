/**
 * Created by nblumberg on 7/1/15.
 */

(function (DnD) {
    "use strict";

    DnD.define(
        "creatures.monsters.blackroot_treant",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Blackroot Treant", level: 19, image: "../images/portraits/blackroot_treant.png",
                hp: { total: 368 },
                defenses: { ac: 36, fort: 34, ref: 29, will: 32 },
                vulnerabilities: { fire: 5 },
                savingThrows: 2,
                actionPoints: 1,
                init: 14, speed: 6,
                abilities: { STR: 27, CON: 24, DEX: 14, INT: 16, WIS: 18, CHA: 22 },
                skills: { nature: 18, perception: 13, stealth: 16 },
                attacks: [
                    { name: "Slam", usage: { frequency: "At-Will" }, target: { range: 3 }, toHit: 25, defense: "AC", damage: "1d12+8", effects: [ { name: "ongoing damage", amount: 5, type: "necrotic", saveEnds: true } ], keywords: [ "melee", "basic", "necrotic" ] },
                    { name: "Entangling Roots", usage: { frequency: "At-Will", action: "Minor" }, target: { range: 4 }, toHit: 23, defense: "Ref", damage: "0", effects: [ "Prone", { name: "Restrained", saveEnds: true } ], keywords: [ "melee" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );

})(window.DnD);