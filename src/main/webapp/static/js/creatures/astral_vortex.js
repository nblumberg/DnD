/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.astral_vortex",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Astral Vortex", level: 17, image: "../images/portraits/astral_vortex.gif", // http://38.media.tumblr.com/cc87d3b855a4dfbc0478e526d896505c/tumblr_njdjph9RSy1qz6f9yo1_r3_500.gif
                hp: { total: 1 },
                defenses: { ac: 10, fort: 10, ref: 10, will: 10 },
                init: 0, speed: { walk: 0 },
                abilities: { STR: 0, CON: 0, DEX: 0, INT: 0, WIS: 0, CHA: 0 },
                attacks: [
                    CH.Power.attack("Falling").atWill().melee().automatic().addDamage("1d10"),
                    CH.Power.attack("Near").atWill().melee().automatic().addDamage(CH.Damage.radiant("2d8")),
                    CH.Power.attack("Caught").atWill().melee().automatic().addDamage(CH.Damage.radiant("3d10")).addEffects(CH.Effect.dazed().endTargetNext())
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);