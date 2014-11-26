/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.dragonborn_gladiator",
        [ "jQuery", "Creature", "creatures.monsters.dragonborn_base" ],
        function(jQuery, Creature, base) {
            var o = {
                name: "Dragonborn Gladiator", level: 10, image: "../images/portraits/dragonborn_gladiator.jpg", // "http://img213.imageshack.us/img213/2721/dragonborn29441748300x3.jpg",
                hp: { total: 106 },
                defenses: { ac: 24, fort: 23, ref: 20, will: 21 },
                init: 9, speed: 5,
                abilities: { STR: 21, CON: 18, DEX: 15, INT: 10, WIS: 12, CHA: 16 },
                skills: { athletics: 15, history: 7, intimidate: 15, perception: 6 },
                attacks: [
                    { name: "Bastard Sword", usage: { frequency: "At-Will" }, range: "melee", toHit: 15, defense: "AC", damage: "1d10+5", keywords: [ "melee", "basic" ] },
                    { name: "Bastard Sword (lone fighter)", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: "1d10+5", keywords: [ "melee" ] },
                    { name: "Finishing Blow", usage: { frequency: "At-Will" }, range: "melee", toHit: 15, defense: "AC", damage: "1d10+5", keywords: [ "melee" ] },
                    { name: "Finishing Blow (lone fighter)", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: "1d10+5", keywords: [ "melee" ] },
                    { name: "Howl", usage: { frequency: "At-Will" }, range: "blast 3", toHit: 16, defense: "Fort", damage: { amount: "1d6+6", type: "thunder" }, keywords: [ "ranged" ] },
                    { name: "Shriek of Pain", usage: { frequency: "Encounter" }, range: "blast 5", toHit: 16, defense: "Fort", damage: { amount: "3d6+6", type: "thunder" }, miss: { halfDamage: true }, keywords: [ "ranged" ] }
                ]
            };
            return jQuery.extend(true, {}, base, o);
        },
        false
    );
})(window.DnD);