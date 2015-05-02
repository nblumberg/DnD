/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.hethralga",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Hethralga", level: 12, image: "../images/portraits/night_hag.jpg",
                hp: { total: 126 },
                defenses: { ac: 26, fort: 25, ref: 24, will: 23 },
                init: 11, speed: 6,
                abilities: { STR: 21, CON: 22, DEX: 21, INT: 13, WIS: 18, CHA: 19 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 15, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 15, intimidate: 0, nature: 15, perception: 10, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Quarterstaff", usage: { frequency: "At-Will" }, range: "melee", toHit: 15, defense: "AC", damage: "1d10+5", keywords: [ "melee", "basic" ] },
                    { name: "Howl", usage: { frequency: "At-Will" }, range: "blast 3", toHit: 16, defense: "Fort", damage: { amount: "1d6+6", type: "thunder" }, keywords: [ "ranged" ] },
                    { name: "Shriek of Pain", usage: { frequency: "Encounter" }, range: "blast 5", toHit: 16, defense: "Fort", damage: { amount: "3d6+6", type: "thunder" }, keywords: [ "ranged", "miss half" ] },
                    { name: "Shriek of Pain (bloodied)", usage: { frequency: "Encounter" }, range: "blast 5", toHit: 16, defense: "Fort", damage: { amount: "3d6+11", type: "thunder" }, keywords: [ "ranged", "miss half" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);