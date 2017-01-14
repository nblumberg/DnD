/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.eldritch_giant",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Eldritch Giant", level: 18, image: "../images/portraits/eldritch_giant.png",
                hp: { total: 171 },
                defenses: { ac: 32, fort: 29, ref: 31, will: 33 },
                resistances: { force: 10 },
                savingThrows: { charm: 5 },
                init: 12, speed: { walk: 8, teleport: 6 },
                abilities: { STR: 21, CON: 19, DEX: 12, INT: 24, WIS: 22, CHA: 13 },
                attacks: [
                    CH.Power.attack("Eldritch Blade").atWill().melee().ref(21).addDamage(CH.Damage.force("3d6+7")).addKeywords("basic"),
                    CH.Power.attack("Force Missile").atWill().ranged(20).ref(21).addDamage(CH.Damage.force("2d6+7")).addKeywords("basic"),
                    CH.Power.attack("Sweeping Sword").encounter().blast(1).ac(21).addDamage(CH.Damage.force("3d6+7")).addEffects(CH.Effect.prone()),
                    CH.Power.attack("Consume Magic").atWill().minor().melee().will(21).addDamage("0"),
                    CH.Power.attack("Consume Magic (boost)").atWill().free().melee().automatic().addDamage(CH.Damage.force("3d6")),
                    CH.Power.attack("Eldritch Field (boost)").atWill(5).free().melee().addDamage(CH.Damage.force("1d6"))
                ],
                buffs: [
                    CH.Power.buff("Eldritch Field").recharge(5).minor().blast(5).addKeywords("zone")
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);