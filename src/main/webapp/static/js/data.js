(function() {
    "use strict";

    DnD.define(
        "data",
        [ "Effect" ],
        function(Effect) {
            var o = {};

            o.randEffect = function() {
                var effects, i;
                effects = Object.keys(Effect.CONDITIONS);
                i = Math.floor(Math.random() * effects.length);
                return { name: effects[ i ] };
            };

            o.randEffects = function() {
                var effects = [];
                if (Math.random() > 0.25) {
                    return effects;
                }
                while (Math.random() > 0.25) {
                    effects.push(o.randEffect());
                }
                return effects;
            }

            o.loadInitiative = function() {
                return {
                    actors: [
                        "Barases",
                        "Bin",
                        "Festivus",
                        "Kallista",
                        "Karrion",
                        "Kitara",
                        "Lechonero",
                        "Banshrae Dartswarmer",
                        "Slystone Dwarf Ruffian",
                        "Slystone Dwarf Ruffian",
                        "Slystone Dwarf Ruffian",
                        "Slystone Dwarf Ruffian",
                        "Hethralga",
                        "Cyclops Guard",
                        "Cyclops Guard",
                        "Cyclops Guard",
                        "Cyclops Guard",
                        "Dragonborn Gladiator",
                        "Dragonborn Gladiator"
                    ]
                };
            };

            return o;
        },
        true
    );

})();
