(function() {
    "use strict";

    DnD.define(
        "party.level",
        [],
        function() {
            return 17;
        },
        false
    );

    DnD.define(
        "creatures.party",
        [
            // start dependencies
            "Amyria",
            "Apparatus_of_Kwalish",
            "Babou",
            "Balugh",
            "Barases",
            "Bierdon",
            "Bin",
            "Camulos",
            "Cassian",
            "Dart",
            "Festivus",
            "Kallista",
            "Karrion",
            "Killtr",
            "Kitara",
            "Lechonero",
            "Melvin",
            "Oomooroo",
            "Patrin",
            "Purple",
            "Ringo",
            "Smack",
            "Smudge",
            "Sypheria",
            "Tokk_it",
            "Vader",
            "Venomous_Scorpion",
            // end dependencies
            "jQuery"
        ],
        function() {
            var party, i;
            party = {};
            for (i = 0; i < arguments.length; i++) {
                if (typeof arguments[ i ] === "object" && typeof arguments[ i ].name === "string") {
                    party[ arguments[ i ].name ] = arguments[ i ];
                }
            }
            return party;
        },
        false
    );
})();
