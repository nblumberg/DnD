/**
 * Created by nblumberg on 6/30/15.
 */

(function () {
    "use strict";
    DnD.define(
        "creatures.monsters.drider_fanglord",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Drider Fanglord", level: 15, image: "../images/portraits/drider.jpg",
                hp: { total: 172 },
                defenses: { ac: 26, fort: 27, ref: 25, will: 23 },
                init: 12, speed: { walk: 8, climb: 8 },
                abilities: { STR: 24, CON: 22, DEX: 21, INT: 13, WIS: 16, CHA: 9 },
                skills: { dungeoneering: 15, perception: 15, stealth: 17 },
                attacks: [
                    { name: "Greatsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: "1d12+7", keywords: [ "melee", "basic", "weapon" ] },
                    { name: "Quick Bite", usage: { frequency: "At-Will", action: "Minor" }, range: "melee", toHit: 16, defense: "Fort", damage: "1d4", effects: [ { name: "ongoing damage", amount: 10, type: "poison", saveEnds: true } ], keywords: [ "melee", "poison" ] },
                    { name: "Darkfire", usage: { frequency: "Encounter", action: "Minor" }, target: { range: 10 }, toHit: 16, defense: "Ref", damage: "0", effects: [ { name: "no invisibility or concealment", duration: "endAttackerNext" }, { name: "combat advantage", duration: "endAttackerNext" } ], keywords: [ "ranged" ] },
                    { name: "Web", usage: { frequency: "Recharge", recharge: 4 }, target: { range: 5 }, toHit: 15, defense: "Ref", damage: "0", effects: [ { name: "restrained" } ], keywords: [ "ranged" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);