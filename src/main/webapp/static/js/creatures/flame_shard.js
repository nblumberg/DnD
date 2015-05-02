/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.flame_shard",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Flame Shard", level: 12, image: "../images/portraits/flame_shard.jpg",
                hp: { total: 100 },
                defenses: { ac: 24, fort: 25, ref: 23, will: 23 },
                init: 10, speed: { walk: 4, fly: 4 },
                abilities: { STR: 19, CON: 22, DEX: 19, INT: 7, WIS: 15, CHA: 18 },
                skills: { perception: 8 },
                attacks: [
                    { name: "Burning Shard", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "Ref", damage: { amount: "1d8+5", type: "fire" }, keywords: [ "melee", "basic", "fire" ] },
                    { name: "Flame Shatter", usage: { frequency: "Encounter" }, target: { range: 2, area: "close burst" }, toHit: 17, defense: "Ref", damage: { amount: "1d8+5", type: "fire" }, effects: [
                        { name: "ongoing damage", amount: 5, type: "fire", saveEnds: true }
                    ], keywords: [ "close burst", "fire" ] },
                    { name: "Flame Burst", usage: { frequency: "At-Will" }, target: { range: 20, size: 2, area: "burst" }, toHit: 17, defense: "Ref", damage: { amount: "1d8+5", type: "fire" }, keywords: [ "close burst", "fire" ] },
                    { name: "Heat Wave (aura)", usage: { frequency: "At-Will", action: "Immediate Reaction" }, target: { range: 2, area: "close burst" }, toHit: "automatic", defense: "AC", damage: { amount: "5", type: "fire" }, keywords: [ "close burst", "fire", "aura" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);