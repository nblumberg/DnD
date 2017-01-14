/**
 * Created by nblumberg on 11/16/14.
 * Based on Arwyl Swan's Son
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.megan_swiftblade",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Megan Swiftblade", level: 17, image: "../images/portraits/megan_swiftblade.png",
                hp: { total: 156 },
                defenses: { ac: 35, fort: 32, ref: 29, will: 31 },
                savingThrows: 2,
                actionPoints: 1,
                init: 12, speed: { walk: 5 },
                abilities: { STR: 25, CON: 20, DEX: 14, INT: 19, WIS: 18, CHA: 23 },
                skills: { diplomacy: 19, insight: 17, perception: 12, religion: 17, streetwise: 19 },
                attacks: [
                    CH.Power.attack("Sword of Justice")
                        .atWill().melee().ac(24).addDamage("2d8+7").addEffects(
                            CH.Effect.marked().endAttackerNext()
                        ).addKeywords("radiant", "basic"),
                    CH.Power.attack("Defender's Challenge").atWill().melee().automatic().addDamage(CH.Damage.radiant("10")).addKeywords("radiant"),
                    CH.Power.attack("Purifying Smite")
                        .encounter().melee().ac(24).addDamage("4d8+7").addEffects(
                            CH.Effect.marked().endAttackerNext()
                        ).addKeywords("radiant"),
                    CH.Power.attack("Righteous Arc")
                            .encounter().closeBurst(1).ac(24).addDamage("2d8+7").addEffects(
                            CH.Effect.marked().endAttackerNext()
                        ),
                    CH.Power.attack("Mete Justice")
                        .recharge(4).immediateReaction().ac(24).addDamage("3d8+7")
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);