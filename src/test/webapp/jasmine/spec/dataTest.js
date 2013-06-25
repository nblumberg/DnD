describe("data.js", function() {
	var randEffectTest = function() {
		var i, effect;
		for (i = 0; i < 1; i++) {
	    	effect = randEffect();
		    it("Object", function() {
		        expect(typeof(effect)).toEqual("object");
		    });
		    it("Object of the form { name: String }", function() {
		        expect(effect.hasOwnProperty("name")).toEqual(true);
		        expect(typeof(effect.name)).toEqual("string");
		    });
		    it("Object of the form { name: String } where the value of name is a property of Effect.CONDITIONS", function() {
		    	expect(Effect.CONDITIONS.hasOwnProperty(effect.name)).toEqual(true);
		    });
		}
	};
	
	describe("When randEffect() is invoked it should return an it should return an", randEffectTest);

	describe("When randEffects() is invoked it should return an", function() {
		var i, effects;
		for (i = 0; i < 10; i++) {
	    	effects = randEffects();
		    it("Array", function() {
		        expect(typeof(effects)).toEqual("object");
		        expect(effects.constructor).toEqual(Array);
		    });
		    if (effects && effects.length) {
		    	describe("of", function() {
			    	for (var j = 0; j < effects.length; j++) {
			    		randEffectTest(effects[ j ]);
			    	}
		    	});
		    }
		}
	});
	
	describe("When loadInitiative() is invoked it should return an", function() {
		var result;
		result = loadInitiative();
		it("Object", function() {
	        expect(typeof(result)).toEqual("object");
	    });
	    it("Object of the form { actors: Array[String] } where actors is not empty", function() {
	    	var i;
	        expect(result.hasOwnProperty("actors")).toEqual(true);
	        expect(typeof(result.actors)).toEqual("object");
	        expect(result.actors.constructor).toEqual(Array);
	        expect(result.actors.length).not.toEqual(0);
	        actors = result.actors;
	        for (i = 0; i < result.actors.length; i++) {
		        expect(typeof(result.actors[ i ])).toEqual("string");
	        }
	    });
	    
	    // TODO
//	    it("Object of the form { actors: Array[String] } where each item is the name of a Creature.creatures entry", function() {
//	    	var i, msg;
//	        for (i = 0; i < result.actors.length; i++) {
//	        	msg = result.actors[ i ] + (Creature.creatures.hasOwnProperty(result.actors[ i ]) ? " is a Creature" : " is not a Creature")
//		        expect(msg).toEqual(result.actors[ i ] + " is a Creature");
//	        }
//	    });
	});
});
