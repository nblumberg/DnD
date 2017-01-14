/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.stair_gate",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Stair Gate", level: 19, image: "../images/portraits/stair_gate.png",
                hp: { total: 120 },
                defenses: { ac: 33, fort: 31, ref: 31, will: 10 },
                resistances: { all: 5 },
                immunities: [ "acid", "cold", "fire", "lightning", "necrotic", "poison", "psychic", "radiant", "thunder" ],
                init: 0, speed: { walk: 0 },
                abilities: { STR: 0, CON: 0, DEX: 0, INT: 0, WIS: 0, CHA: 0 },
                attacks: [
                    CH.Power.attack("Overload").encounter().closeBurst(20).automatic().addDamage(CH.Damage.force("2d10")),
                    CH.Power.attack("Falling").encounter().closeBurst(20).automatic().addDamage("2d10")
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);