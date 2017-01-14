/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.pillar_of_light",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Pillar of Light", level: 19 , image: "../images/portraits/pillar_of_light.jpg", // http://img09.deviantart.net/3ebd/i/2007/333/0/f/light_pillar_by_darkknight1986.jpg
                hp: { total: 1 },
                defenses: { ac: 10, fort: 10, ref: 10, will: 10 },
                init: 0, speed: { walk: 0 },
                abilities: { STR: 0, CON: 0, DEX: 0, INT: 0, WIS: 0, CHA: 0 },
                attacks: [
                    new CH.Power("Burn (adjacent)").atWill().melee().automatic().addDamage({ amount: "1d10", type: "radiant" }),
                    new CH.Power("Burn (inside)").atWill().melee().automatic().addDamage({ amount: "2d10", type: "radiant" }).addEffects("Prone")
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);