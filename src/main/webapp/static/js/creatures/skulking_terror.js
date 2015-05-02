/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.skulking_terror",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Skulking Terror", level: 11, image: "../images/portraits/skulking_terror.png",
                hp: { total: 83 },
                defenses: { ac: 25, fort: 21, ref: 23, will: 21 },
                init: 13, speed: { walk: 6, fly: 6 },
                abilities: { STR: 14, CON: 11, DEX: 19, INT: 13, WIS: 13, CHA: 12 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 11, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Slam", usage: { frequency: "At-Will" }, range: "melee", toHit: 16, defense: "AC", damage: "2d6+6", keywords: [ "melee", "basic" ] },
                    { name: "Slam [combat advantage]", usage: { frequency: "At-Will" }, range: "melee", toHit: 16, defense: "AC", damage: "4d6+6", keywords: [ "melee", "basic" ] },
                    { name: "Lethargic Countenance", usage: { frequency: "At-Will" }, target: { area: "blast", size: 1 }, toHit: 12, defense: "Will", damage: "0", effects: [
                        { name: "Slowed", duration: "endAttackerNext" },
                        { name: "combat advantage", duration: "endAttackerNext" }
                    ], keywords: [ "ranged" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);