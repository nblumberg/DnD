/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.astral_nexus",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Astral Nexus", level: 17, image: "../images/portraits/astral_nexus.gif", // http://www.galaraf.net/movies/GalaxyQuest/omega13a.gif
                hp: { total: 1 },
                defenses: { ac: 10, fort: 10, ref: 10, will: 10 },
                init: 0, speed: { walk: 0 },
                abilities: { STR: 0, CON: 0, DEX: 0, INT: 0, WIS: 0, CHA: 0 },
                attacks: [
                    CH.Power.attack("Blast").atWill().ranged(20).fort(20).addDamage("2d6+6").addEffects(CH.Effect.ongoing(5, "radiant").saveEnds()),
                    CH.Power.attack("Burst").atWill().burst(2, 20).ref(24).addDamage("1d10+3").addEffects(CH.Effect.dazed().saveEnds()),
                    CH.Power.attack("Failed save").atWill().ranged(20).automatic().addDamage("2d10").addEffects(CH.Effect.dazed().saveEnds())
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);