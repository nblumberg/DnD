/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.githyanki_shade",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o, soulStrike;
            soulStrike = CH.Power.attack("Soul Strike").recharge(4).melee().will(19).addDamage(CH.Damage.radiant("4d10+5")).addEffects(
                CH.Effect.vulnerable(10, "psychic").endTargetNext()
            ).addKeywords("radiant");
            o = {
                name: "Githyanki Shade", level: 16, image: "../images/portraits/githyanki_shade.png",
                hp: { total: 84 },
                defenses: { ac: 30, fort: 26, ref: 29, will: 28 },
                resistances: { insubstantial: 50 },
                init: 19, speed: { walk: 8, fly: 8 },
                abilities: { STR: 21, CON: 18, DEX: 24, INT: 19, WIS: 16, CHA: 21 },
                attacks: [
                    CH.Power.attack("Ghost Sword").atWill().melee().ac(21).addDamage("2d10+5").addKeywords("basic"),
                    CH.Power.attack("Spirit Rake").atWill().minor().ranged(5).will(19).addDamage(CH.Damage.psychic("2d8+7")).addEffects(
                        CH.Effect.multiple(
                            CH.Effect.penalty(2, "ac"),
                            CH.Effect.penalty(2, "fort"),
                            CH.Effect.penalty(2, "ref"),
                            CH.Effect.penalty(2, "will")
                        ).saveEnds()
                    ).addKeywords("basic"),
                    CH.Power.attack("Bladed Wrath").atWill().closeBurst(1).ac(21).addDamage("1d10+5").addEffects(
                        CH.Effect.multiple(
                            CH.Effect.penalty(2, "ac"),
                            CH.Effect.penalty(2, "fort"),
                            CH.Effect.penalty(2, "ref"),
                            CH.Effect.penalty(2, "will"),
                            CH.Effect.slowed()
                        ).saveEnds()
                    ).addKeywords("psychic"),
                    soulStrike
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);