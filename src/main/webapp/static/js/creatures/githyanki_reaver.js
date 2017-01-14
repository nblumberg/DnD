/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.githyanki_reaver",
        [ "jQuery", "Creature", "creature.helpers", "creatures.monsters.base.githyanki" ],
        function(jQuery, Creature, CH, base) {
            var o, silverFullblade;
            silverFullblade = CH.Power.attack("Silver Fullblade")
                .atWill().melee().ac(20).addDamage("2d12+4", CH.Damage.psychic("1d6")).addKeywords("psychic");
            o = {
                name: "Githyanki Reaver", level: 17, image: "../images/portraits/githyanki_reaver.png", // http://t10.deviantart.net/qJABca6WV6dOBJQXAUEEmj-grks=/fit-in/700x350/filters:fixed_height(100,100):origin()/pre13/b421/th/pre/f/2014/254/2/f/githyanki_2_by_quesstionmark-d7ytbcx.png
                hp: { total: 197 },
                defenses: { ac: 29, fort: 30, ref: 28, will: 28 },
                init: 13, speed: { walk: 5 },
                abilities: { STR: 24, CON: 17, DEX: 21, INT: 15, WIS: 14, CHA: 21 },
                attacks: [
                    CH.Power.attack(silverFullblade).addKeywords("basic"),
                    CH.Power.attack(silverFullblade, "Silver Fullblade (crit)").addDamage("24"),
                    CH.Power.attack(silverFullblade, "Silver Fullblade (Immobilized target)").addDamage(CH.Damage.psychic("3d6")),
                    CH.Power.attack(silverFullblade, "Silver Fullblade (crit, Immobilized target)").addDamage("24", CH.Damage.psychic("3d6")),
                    CH.Power.attack("Reaving Strike")
                        .encounter().melee().ac(18).addDamage(
                            "3d12+4",
                            CH.Damage.psychic("1d6")
                        ).addEffects(
                            CH.Effect.immobilized().saveEnds()
                        ).addKeywords("psychic", "reliable")
                ]
            };
            return jQuery.extend(true, {}, base, o);
        },
        false
    );
})(window.DnD);