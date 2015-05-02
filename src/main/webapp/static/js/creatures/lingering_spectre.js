/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.lingering_spectre",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Lingering Spectre", level: 12, image: "../images/portraits/spectre.jpg", // http://www.wizards.com/dnd/images/dx1003tt_spectre.jpg
                hp: { total: 66 },
                defenses: { ac: 26, fort: 23, ref: 25, will: 23 },
                immunities: [ "poison", "disease" ],
                resistances: { necrotic: 15 },
                vulnerabilities: { radiant: 5 },
                insubstantial: true,
                init: 16, speed: { fly: 6 }, //, flyAgility: "hover", phasing: true },
                abilities: { STR: 19, CON: 16, DEX: 22, INT: 10, WIS: 12, CHA: 19 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 12, religion: 0, stealth: 17, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Spectral Touch", usage: { frequency: "At-Will" }, range: "melee", toHit: 15, defense: "Ref", damage: { amount: "2d8+5", type: "necrotic" }, keywords: [ "melee", "basic", "necrotic" ] },
                    { name: "Spectral Barrage", usage: { frequency: "Recharge", recharge: 5 }, toHit: 15, defense: "Will", damage: { amount: "3d6", type: "psychic" }, effects: [
                        { name: "Prone" }
                    ], keywords: [ "ranged", "illusion", "psychic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);