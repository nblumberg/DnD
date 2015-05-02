(function(module) {
    "use strict";

    describe("party.js", function() {
        describe("When the \"creatures.party\" module is instantiated it should return ", function() {
            Test.isValidCreatureMap(module.create(), true);
        });
    });

})(DnD.modules[ "creatures.party" ]);
