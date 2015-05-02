/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.gluttonous_cube",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Gluttonous Cube", level: 13, image: "../images/portraits/gluttonous_cube.jpg",
                hp: { total: 324 },
                defenses: { ac: 27, fort: 26, ref: 23, will: 24 },
                init: 9, speed: 4,
                abilities: { STR: 18, CON: 22, DEX: 17, INT: 1, WIS: 18, CHA: 1 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 0, religion: 0, stealth: 14, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Slam", usage: { frequency: "At-Will" }, range: "melee", toHit: 15, defense: "Fort", damage: "2d6+5", effects: [
                        { name: "Immobilized", saveEnds: true }
                    ], keywords: [ "melee", "basic" ] },
                    // Not actually saveEnds, it's ongoing until no longer grabbed
                    { name: "Engulf", usage: { frequency: "At-Will" }, range: "melee", toHit: 14, defense: "Ref", damage: "0", effects: [
                        { name: "Ongoing damage", amount: 15, type: "acid", saveEnds: true }
                    ], keywords: [ "melee", "acid" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);