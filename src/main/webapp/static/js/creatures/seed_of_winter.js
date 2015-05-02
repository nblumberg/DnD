/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.seed_of_winter",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Seed of Winter", level: 18, image: "../images/portraits/seed_of_winter.png",
                hp: { total: 1 },
                defenses: { ac: 10, fort: 10, ref: 10, will: 10 },
                init: 8, speed: { walk: 0 },
                abilities: { STR: 10, CON: 10, DEX: 10, INT: 10, WIS: 10, CHA: 10 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 0, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    {
                        name: "Trap",
                        usage: { frequency: "At-Will" }, range: "melee",
                        toHit: 24, defense: "Will", damage: "0",
                        effects: [
                            { name: "dominated", saveEnds: true, afterEffects: [
                                { name: "immobilized", saveEnds: true }
                            ] }
                        ], keywords: [ "melee", "ranged", "basic" ]
                    },
                    {
                        name: "Trap (after effect)",
                        usage: { frequency: "At-Will" }, range: "melee",
                        toHit: "automatic", defense: "Will", damage: { amount: "2d10+5", type: "cold" },
                        //                            effects: [ { name: "immobilized", saveEnds: true } ],
                        keywords: [ "ranged" ]
                    }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);