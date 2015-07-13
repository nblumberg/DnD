/**
 * Created by nblumberg on 6/30/15.
 */

(function () {
    "use strict";

    DnD.define(
        "creatures.monsters.howling_spirit",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Howling Spirit", level: 14, image: "../images/portraits/wailing_ghost.png",
                hp: { total: 1 },
                defenses: { ac: 30, fort: 26, ref: 30, will: 28 },
                resistances: { necrotic: 10, insubstantial: 50 },
                immunities: [ "disease", "poison" ],
                init: 14, speed: { fly: 8 },
                abilities: { STR: 6, CON: 12, DEX: 24, INT: 6, WIS: 14, CHA: 21 },
                skills: { perception: 14 },
                attacks: [
                    { name: "Spectral Strafe", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "Ref", damage: { amount: "7", type: "necrotic" }, keywords: [ "melee", "basic", "necrotic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );

})();