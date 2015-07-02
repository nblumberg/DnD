/**
 * Created by nblumberg on 7/1/15.
 */

(function (DnD) {
    "use strict";

    DnD.define(
        "creatures.monsters.virizan_venom_wisp",
        [ "jQuery", "Creature", "creatures.monsters.base.virizan" ],
        function(jQuery, Creature, base) {
            var i, o;
            o = {
                name: "Virizan, Venom Wisp form", image: "../images/portraits/virizan_venom_wisp.jpg",
                hp: { total: 120 },
                resistances: { insubstantial: 50 },
                immunities: [ "poison" ],
                speed: { walk: 0, fly: 8 },
                attacks: [
                    { name: "Venomous Claws", usage: { frequency: "At-Will" }, range: "melee", toHit: 23, defense: "AC", damage: { amount: "2d8+7", type: "poison" }, keywords: [ "melee", "basic", "poison" ] },
                    { name: "Caustic Breath", usage: { frequency: "At-Will" }, target: { area: "blast", size: 3 }, toHit: 22, defense: "Fort", damage: { amount: "1d10+7", type: "poison" }, miss: { halfDamage: true }, keywords: [ "blast", "poison" ] }
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