/**
 * Created by nblumberg on 7/1/15.
 */

(function (DnD) {
    "use strict";

    DnD.define(
        "creatures.monsters.virizan_snaketongue",
        [ "jQuery", "Creature", "creatures.monsters.base.virizan" ],
        function(jQuery, Creature, base) {
            var i, o;
            o = {
                name: "Virizan, Snaketongue form", image: "../images/portraits/virizan_snaketongue.jpg",
                hp: { total: 170 },
                resistances: { poison: 10 },
                attacks: [
                    { name: "Serpent Staff", usage: { frequency: "At-Will" }, range: "melee", toHit: 23, defense: "AC", damage: { amount: "1d10+7", type: "poison" }, keywords: [ "melee", "basic", "poison" ] },
                    { name: "Emerald Coils", usage: { frequency: "At-Will" }, target: { range: 20, targets: 2 }, toHit: 22, defense: "Ref", damage: { amount: "2d6+7", type: "poison" }, keywords: [ "ranged", "poison" ] }
                ]
            };
            for (i = 0; i < base.attacks.length; i++) {
                o.attacks.push(base.attacks[ i ]);
            }
            return jQuery.extend(true, {}, Creature.base, base, o);
        },
        false
    );

})(window.DnD);