/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.astral_shade",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Astral Shade", level: 16, image: "../images/portraits/astral_shade.jpg", // https://www.dandwiki.com/w/images/thumb/5/57/AirElemental.jpg/180px-AirElemental.jpg
                hp: { total: 448 },
                defenses: { ac: 29, fort: 28, ref: 30, will: 28 },
                resistances: { insubstantial: 50 },
                immunities: [ "disease", "poison" ],
                init: 19, speed: { fly: 10, teleport: 6 },
                abilities: { STR: 21, CON: 16, DEX: 24, INT: 18, WIS: 16, CHA: 21 },
                attacks: [
                    CH.Power.attack("Astral Slam").atWill().melee().fort(20).addDamage(CH.Damage.radiant("3d8+4")).addEffects(
                            CH.Effect.vulnerable(10, "radiant").endAttackerNext()
                        ).addKeywords("radiant", "basic"),
                    CH.Power.attack("Astral Slam (bloodied)").atWill().melee().fort(20).addDamage(CH.Damage.radiant("3d8+4")).addEffects(
                            CH.Effect.vulnerable(10, "radiant").endAttackerNext(),
                            CH.Effect.restrained().saveEnds()
                        ).addKeywords("radiant", "basic"),
                    CH.Power.attack("Radiant Ray").atWill().minor().ranged(10).ref(22).addDamage(CH.Damage.radiant("3d8")).addKeywords("radiant", "basic"),
                    CH.Power.attack("Radiant Ray (bloodied").atWill().minor().ranged(10).ref(22).addDamage(CH.Damage.radiant("3d8+5")).addKeywords("radiant", "basic"),
                    CH.Power.attack("Wrathful Strike").atWill().immediateReaction().melee().automatic().addDamage("0"),
                    CH.Power.attack("Astral Shockwave").recharge(2).closeBurst(3).ref(20).addDamage(CH.Damage.force("3d8+5")),
                    CH.Power.attack("Radiant Chains").recharge(5).closeBurst(3).fort(20).addDamage(CH.Damage.radiant("3d8+5")).addEffects(
                            CH.Effect.immobilized().saveEnds()
                        )
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);