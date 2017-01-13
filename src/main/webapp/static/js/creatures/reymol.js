/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.reymol",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Reymol", level: 1, image: "https://s-media-cache-ak0.pinimg.com/564x/9e/7f/90/9e7f905b3c5e44387607d410d213beda.jpg",
                hp: { total: 31 },
                defenses: { ac: 18, fort: 14, ref: 14, will: 14 },
                init: 3, speed: 6,
                abilities: { STR: 10, CON: 14, DEX: 14, INT: 16, WIS: 10, CHA: 16 },
                skills: { arcana: 8, perception: 5, thievery: 7 },
                attacks: [
                    { name: "Dagger", usage: { frequency: "At-Will" }, range: "melee", toHit: 6, defense: "AC", damage: "1d4", keywords: [ "melee", "basic" ] },
                    { name: "Eldritch Blast", usage: { frequency: "At-Will" }, range: 10, toHit: 6, defense: "Ref", damage: "1d10+3", keywords: [ "implement", "ranged" ] },
                    { name: "Dire Radiance", usage: { frequency: "At-Will" }, range: 10, toHit: 6, defense: "Fort", damage: { amount: "1d6+3", type: "radiant" }, keywords: [ "ranged", "implement", "radiant" ] },
                    { name: "Dire Radiance (secondary)", usage: { frequency: "At-Will" }, range: 10, toHit: "automatic", defense: "Fort", damage: { amount: "1d6+3", type: "radiant" }, keywords: [ "ranged", "implement", "radiant" ] },
                    { name: "Arms of Hadar", usage: { frequency: "Encounter" }, target: { area: "close burst", size: 2 }, toHit: 6, defense: "Ref", damage: "1d8+3", keywords: [ "implement", "close blast" ] }
                ],
                buffs: [
                    new CH.Power({
                        name: "Second Chance"
                    }).encounter()
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);