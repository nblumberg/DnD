(function(modules) {
    "use strict";

    describe("monsters.js", function() {
	    var p;
	    for (p in modules) {
	    	if (modules.hasOwnProperty(p) && p.indexOf("creatures.monsters.") === 0 && p.indexOf("creatures.monsters.base") === -1) {
		        describe("When the \"" + p + "\" module is instantiated it should return ", function() {
		            Test.isValidCreature(modules[ p ].create(), false);
		        });
	    	}
	    }
    });

})(DnD.modules);

