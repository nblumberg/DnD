(function() {
    "use strict";

    DnD.define(
        "party.level",
        [],
        function() {
            return 16;
        },
        false
    );

    DnD.define(
        "creatures.party",
        [
            // start dependencies
            "Amyria",
            "Apparatus_of_Kwalish",
            "Balugh",
            "Barases",
            "Bin",
            "Camulos",
            "Festivus",
            "Kallista",
            "Karrion",
            "Kitara",
            "Lechonero",
            "Melvin",
            "Oomooroo",
            "Purple",
            "Ringo",
            "Smack",
            "Smudge",
            "Tokk_it",
            "Vader",
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
