/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.war_troll",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "War Troll", level: 14, image: "../images/portraits/war_troll.jpg", // http://www.wizards.com/dnd/images/iw_war_troll.jpg
                hp: { total: 110, regeneration: 10 },
                defenses: { ac: 30, fort: 29, ref: 25, will: 25 },
                init: 12, speed: 7,
                abilities: { STR: 24, CON: 20, DEX: 16, INT: 10, WIS: 16, CHA: 12 },
                skills: { acrobatics: 0, arcana: 0, athletics: 15, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 17, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 15, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Greatsword", usage: { frequency: "At-Will" }, range: "reach", toHit: 20, defense: "AC", damage: "1d12+7", effects: [
                        { name: "Marked", duration: "endAttackerNext" }
                    ], keywords: [ "melee", "basic" ] },
                    { name: "Claw", usage: { frequency: "At-Will" }, range: "reach", toHit: 20, defense: "AC", damage: "2d6+7", keywords: [ "melee" ] },
                    { name: "Longbow", usage: { frequency: "At-Will" }, range: 20, toHit: 20, defense: "AC", damage: "1d12+3", keywords: [ "ranged", "basic" ] },
                    { name: "Sweeping Strike", usage: { frequency: "At-Will" }, range: 2, toHit: 20, defense: "AC", damage: "1d12+7", effects: [ "Prone" ], keywords: [ "melee", "close blast" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);