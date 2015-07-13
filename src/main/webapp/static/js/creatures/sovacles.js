/**
 * Created by nblumberg on 7/1/15.
 */

(function (DnD) {
    "use strict";

    DnD.define(
        "creatures.monsters.sovacles",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Sovacles", level: 20, image: "../images/portraits/sovacles.png",
                hp: { total: 340 },
                defenses: { ac: 32, fort: 29, ref: 30, will: 31 },
                resistances: { poison: 10 },
                savingThrows: 2,
                actionPoints: 1,
                init: 14, speed: 6,
                abilities: { STR: 13, CON: 18, DEX: 20, INT: 22, WIS: 19, CHA: 25 },
                skills: { arcana: 20, bluff: 21, diplomacy: 21, history: 20, insight: 18, perception: 18, religion: 20 },
                attacks: [
                    { name: "Staff", usage: { frequency: "At-Will" }, range: "melee", toHit: 23, defense: "AC", damage: { amount: "2d8+7", type: "necrotic" }, keywords: [ "melee", "basic", "weapon", "necrotic" ] },
                    { name: "Ensnaring Coil", usage: { frequency: "At-Will" }, target: { range: 15 }, toHit: 22, defense: "Ref", damage: { amount: "1d6+5", type: "necrotic" }, keywords: [ "ranged", "necrotic" ] },
                    { name: "Bane Quills", usage: { frequency: "At-Will" }, target: { area: "burst", size: 1, range: 10 }, toHit: 22, defense: "Fort", damage: { amount: "2d6+5", type: "poison" }, effects: [ { name: "multiple", children: [ { name: "penalty", amount: 2, type: "attack" }, { name: "penalty", amount: 2, type: "skill" } ], duration: "endAttackerNext" } ], keywords: [ "burst", "poison" ] },
                    { name: "Poison Darkness", usage: { frequency: "Encounter" }, target: { area: "burst", size: 1, range: 20 }, toHit: 22, defense: "Fort", damage: { amount: "3d6+7", type: "poison" }, keywords: [ "burst", "poison" ] },
                    { name: "Poison Darkness (zone)", usage: { frequency: "At-Will" }, toHit: "automatic", defense: "Fort", damage: { amount: "5", type: "poison" }, effects: [ { name: "Blinded", saveEnds: true } ], keywords: [ "zone", "poison" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );

})(window.DnD);