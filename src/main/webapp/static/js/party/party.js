(function() {
    "use strict";

    DnD.define(
        "creatures.party",
        [
            "Amyria",
            "Apparatus of Kwalish",
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
            "Tokk'it"
        ],
        function() {
            var party, i;
            party = {};
            for (i = 0; i < arguments.length; i++) {
                party[ arguments[ i ].name ] = arguments[ i ];
            }
            return party;
        },
        false
    );
})();
