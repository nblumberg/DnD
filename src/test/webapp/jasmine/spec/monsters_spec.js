(function(module) {
    "use strict";

    describe("monsters.js", function() {
        describe("When the \"creatures.monsters\" module is instantiated it should return ", function() {
            Test.isValidCreatureMap(module.create(), false);
        });
    });

})(DnD.modules[ "creatures.monsters" ]);

