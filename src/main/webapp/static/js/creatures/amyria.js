/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.amyria",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Amyria", level: 13, image: "../images/portraits/amyria.jpg",
                hp: { total: 254 },
                defenses: { ac: 29, fort: 23, ref: 25, will: 28 },
                resistances: { necrotic: 11, radiant: 11 },
                savingThrows: 2,
                actionPoints: 1,
                init: 15, speed: { walk: 8 },
                abilities: { STR: 11, CON: 15, DEX: 13, INT: 19, WIS: 24, CHA: 17 },
                skills: { bluff: 19, diplomacy: 14, perception: 13, religion: 17 },
                attacks: [
                    { name: "Longsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 20, defense: "AC", damage: "1d8+7", effects: [
                        { name: "Marked", duration: "startAttackerNext" }
                    ], keywords: [ "melee", "basic", "radiant", "weapon" ] },
                    { name: "Marked damage", usage: { frequency: "At-Will", action: "Immediate Interrupt" }, range: "melee", toHit: "automatic", defense: "AC", damage: { amount: "7", type: "radiant" }, keywords: [ "radiant" ] },
                    { name: "Crusader's Assault", usage: { frequency: "At-Will" }, range: "melee", toHit: 20, defense: "AC", damage: [ "1d8+7", { amount: "1d8", type: "radiant" } ], keywords: [ "melee", "radiant", "weapon" ] },
                    { name: "Bahamut's Accusing Eye", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 18, defense: "Ref", damage: { amount: "2d8+7", type: [ "cold", "radiant" ] }, effects: [
                        { name: "multiple", saveEnds: true, children: [
                            { name: "ongoing damage", amount: 5, type: [ "cold", "radiant" ] },
                            "Slowed"
                        ] }
                    ], keywords: [ "cold", "radiant" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);