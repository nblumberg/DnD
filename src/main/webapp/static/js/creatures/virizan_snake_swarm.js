/**
 * Created by nblumberg on 7/1/15.
 */

(function (DnD) {
    "use strict";

    DnD.define(
        "creatures.monsters.virizan_snake_swarm",
        [ "jQuery", "Creature", "creatures.monsters.base.virizan" ],
        function(jQuery, Creature, base) {
            var i, o;
            o = {
                name: "Virizan, Snake Swarm form", image: "../images/portraits/virizan_snake_swarm.jpg",
                hp: { total: 170 },
                resistances: { insubstantial: 50 }, // TODO: implement swarm resistances instead of using insubstantial
                attacks: [
                    { name: "Swarm Attack aura", usage: { frequency: "At-Will" }, target: { area: "close burst", size: 1, enemiesOnly: true }, toHit: "automatic", defense: "AC", damage: "7", keywords: [ "aura" ] },
                    { name: "Swarm of Fangs", usage: { frequency: "At-Will" }, range: "melee", toHit: 23, defense: "AC", damage: { amount: "1d10+6", type: "poison" }, effects: [ { name: "ongoing damage", amount: 5, type: "poison", saveEnds: true } ], keywords: [ "melee", "basic", "swarm", "poison" ] }
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