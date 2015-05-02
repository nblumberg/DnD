/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.windstriker",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Windstriker", level: 9, image: "../images/portraits/windstriker.jpg",
                hp: { total: 56 },
                defenses: { ac: 21, fort: 22, ref: 20, will: 20 },
                immunities: [ "disease", "poison" ],
                resistances: { insubstantial: 50 },
                init: 11, speed: { fly: 8 },
                abilities: { STR: 14, CON: 20, DEX: 17, INT: 5, WIS: 10, CHA: 17 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 9, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Windstrike", usage: { frequency: "At-Will" }, target: { range: 2 }, range: "melee", toHit: 14, defense: "AC", damage: { amount: "2d6+5", type: [ "cold", "thunder" ] }, keywords: [ "melee", "basic", "cold", "thunder" ] },
                    { name: "Lethal Windstrike", usage: { frequency: "At-Will" }, target: { range: 2 }, range: "melee", toHit: 14, defense: "AC", damage: { amount: "2d8+5", type: [ "cold", "thunder" ] }, keywords: [ "melee", "cold", "thunder" ] },
                    { name: "Searching Wind", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 12, defense: "Will", damage: { amount: "2d6+5", type: [ "cold", "thunder" ] }, effects: [
                        { name: "Prone"}
                    ], keywords: [ "melee", "cold", "thunder" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);