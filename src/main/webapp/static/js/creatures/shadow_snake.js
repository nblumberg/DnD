/**
 * Created by nblumberg on 06/29/15.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.shadow_snake",
        [ "jQuery", "Creature", "Effect" ],
        function(jQuery, Creature, Effect) {
            var o = {
                name: "Shadow Snake", level: 16, image: "../images/portraits/shadow_snake.jpg",
                hp: { total: 158 },
                defenses: { ac: 30, fort: 28, ref: 29, will: 27 },
                resistances: { poison: 10 },
                init: 17, speed: { walk: 7, climb: 7 },
                abilities: { STR: 20, CON: 22, DEX: 25, INT: 4, WIS: 10, CHA: 20 },
                skills: { perception: 13, stealth: 20 },
                attacks: [
                    { name: "Bite", usage: { frequency: "At-Will" }, range: "reach", toHit: 21, defense: "AC", damage: "2d6+7", effects: [
                        { name: "ongoing damage", amount: 10, type: "poison", saveEnds: true }
                    ], keywords: [ "melee", "basic", "poison" ] }
                ],
                buffs: [
                    {
                        name: "Vanish into the Night",
                        usage: {
                            frequency: "Encounter"
                        },
                        toHit: "automatic",
                        effects: [
                            { name: "resistance", amount: 50, type: "insubstantial", duration: Effect.DURATION_END_TARGET_NEXT }
                        ]
                    }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);