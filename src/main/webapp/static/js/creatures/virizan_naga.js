/**
 * Created by nblumberg on 7/1/15.
 */

(function (DnD) {
    "use strict";

    DnD.define(
        "creatures.monsters.virizan_naga",
        [ "jQuery", "Creature", "creatures.monsters.base.virizan" ],
        function(jQuery, Creature, base) {
            var i, o;
            o = {
                name: "Virizan, Naga form", image: "../images/portraits/virizan_naga.gif",
                hp: { total: 170 },
                attacks: [
                    { name: "Tail Slap", usage: { frequency: "At-Will" }, target: { range: 2 }, toHit: 23, defense: "AC", damage: "2d8+7", keywords: [ "melee", "basic" ] },
                    { name: "Exarch's Thunder", usage: { frequency: "At-Will" }, target: { area: "burst", size: 10, range: 20 }, toHit: 22, defense: "Fort", damage: { amount: "1d10+7", type: "thunder" }, miss: { halfDamage: true }, keywords: [ "burst", "thunder" ] }
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