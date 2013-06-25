var Test = {};

Test.isObject = function(object, description) {
	it(description ? description + " is an Object" : "an Object", (function(obj) {
		expect(typeof(obj)).toEqual("object");
	}).bind(this, object));
};

Test.nonEmptyObject = function(object, description) {
	it(description ? description + " is an non-empty Object" : "a non-empty Object", (function(obj) {
		expect(typeof(obj)).toEqual("object");
		expect(Object.keys(obj).length).not.toEqual(0);
	}).bind(this, object));
};

Test.isArray = function(object, description) {
	it(description ? description + " is an Array" : "an Array", (function(obj) {
		expect(typeof(obj)).toEqual("object");
		expect(obj.constructor).toEqual(Array);
	}).bind(this, object));
};

Test.nonEmptyArray = function(object, description) {
	it(description ? description + " is a non-empty Array" : "a non-empty Array", (function(obj) {
		expect(typeof(obj)).toEqual("object");
		expect(obj.constructor).toEqual(Array);
		expect(obj.length).not.toEqual(0);
	}).bind(this, object));
};

Test.isString = function(object, description) {
	it(description ? description + " is a String" : "a String", (function(obj) {
		expect(typeof(obj)).toEqual("string");
	}).bind(this, object));
};

Test.nonEmptyString = function(object, description) {
	it(description ? description + " is a non-empty String" : "a non-empty String", (function(obj) {
		expect(typeof(obj)).toEqual("string");
		expect(obj.length).not.toEqual(0);
	}).bind(this, object));
};

Test.isNumber = function(object, description) {
	it(description ? description + " is a Number" : "a Number", (function(obj) {
		expect(typeof(obj)).toEqual("number");
	}).bind(this, object));
};

Test.positiveNumber = function(object, description) {
	it(description ? description + ": 1 <= Number" : "1 <= Number", (function(obj) {
		expect(typeof(obj)).toEqual("number");
		expect(obj >= 1).toEqual(true);
	}).bind(this, object));
};

Test.minMaxNumber = function(object, min, max, description) {
	it((description ? description + ": " : "") + (min + " <= Number <= " + max), (function(obj) {
		expect(typeof(obj)).toEqual("number");
		expect(obj >= min).toEqual(true);
		expect(obj <= max).toEqual(true);
	}).bind(this, object));
};

Test.hasObjectProperty = function(object, property, extra) {
	it(property + ": Object [" + extra + "]", (function(obj, prop) {
		expect(obj.hasOwnProperty(prop)).toEqual(true);
		expect(typeof(obj[ prop ])).toEqual("object");
	}).bind(this, object, property));
};

Test.hasNonEmptyObjectProperty = function(object, property, extra) {
	it(property + ": non-empty Object [" + extra + "]", (function(obj, prop) {
		expect(obj.hasOwnProperty(prop)).toEqual(true);
		expect(typeof(obj[ prop ])).toEqual("object");
		expect(Object.keys(obj[ prop ]).length).not.toEqual(0);
	}).bind(this, object, property));
};

Test.hasArrayProperty = function(object, property, extra) {
	it(property + ": Array [" + extra + "]", (function(obj, prop) {
		expect(obj.hasOwnProperty(prop)).toEqual(true);
		expect(typeof(obj[ prop ])).toEqual("object");
		expect(obj[ prop ].constructor).toEqual(Array);
	}).bind(this, object, property));
};

Test.hasNonEmptyArrayProperty = function(object, property, extra) {
	it(property + ": non-empty Array [" + extra + "]", (function(obj, prop) {
		expect(obj.hasOwnProperty(prop)).toEqual(true);
		expect(typeof(obj[ prop ])).toEqual("object");
		expect(obj[ prop ].constructor).toEqual(Array);
		expect(obj[ prop ].length).not.toEqual(0);
	}).bind(this, object, property));
};

Test.hasStringProperty = function(object, property, extra) {
	it(property + ": String [" + extra + "]", (function(obj, prop) {
		expect(obj.hasOwnProperty(prop)).toEqual(true);
		expect(typeof(obj[ prop ])).toEqual("string");
	}).bind(this, object, property));
};

Test.hasNonEmptyStringProperty = function(object, property, extra) {
	it(property + ": non-empty String [" + extra + "]", (function(obj, prop) {
		expect(obj.hasOwnProperty(prop)).toEqual(true);
		expect(typeof(obj[ prop ])).toEqual("string");
		expect(obj[ prop ].length).not.toEqual(0);
	}).bind(this, object, property));
};

Test.hasNumberProperty = function(object, property, extra) {
	it(property + ": Number [" + extra + "]", (function(obj, prop) {
		expect(obj.hasOwnProperty(prop)).toEqual(true);
		expect(typeof(obj[ prop ])).toEqual("number");
	}).bind(this, object, property));
};

Test.hasPositiveNumberProperty = function(object, property, extra) {
	it(property + ": 1 <= Number [" + extra + "]", (function(obj, prop) {
		expect(obj.hasOwnProperty(prop)).toEqual(true);
		expect(typeof(obj[ prop ])).toEqual("number");
		expect(obj[ prop ] >= 1).toEqual(true);
	}).bind(this, object, property));
};

Test.hasMinMaxNumberProperty = function(object, property, min, max, extra) {
	it(property + ": " + min + " <= Number <= " + max + " [" + extra + "]", (function(obj, prop) {
		expect(obj.hasOwnProperty(prop)).toEqual(true);
		expect(typeof(obj[ prop ])).toEqual("number");
		expect(obj[ prop ] >= min).toEqual(true);
		expect(obj[ prop ] <= max).toEqual(true);
	}).bind(this, object, property));
};

Test.hasBooleanProperty = function(object, property, extra) {
	it(property + ": Boolean [" + extra + "]", (function(obj, prop) {
		expect(obj.hasOwnProperty(prop)).toEqual(true);
		expect(typeof(obj[ prop ])).toEqual("boolean");
	}).bind(this, object, property));
};

Test.hasValidSpeed = function(object, extra) {
	if (typeof(object.speed) === "number") {
		Test.hasNumberProperty(object, "speed", extra);
	}
	else {
		Test.hasNonEmptyObjectProperty(object, "speed", extra);
		describe("speed: Object of the form", function() {
			var j;
			for (j in object.speed) {
				Test.hasPositiveNumberProperty(object.speed, j, extra);
			}
		});
	}
};

Test.damageRegEx = /^(\d+(d\d+|\[W\]))?([+/^-]?(STR|CON|DEX|INT|WIS|CHA|\d+)?)*$/;

Test.hasValidDamage = function(object, extra) {
	var i;
	if (typeof(object.damage) === "object" && object.damage.constructor === Array) {
		for (i = 0; i < object.damage.length; i++) {
			Test.hasValidDamage({ damage: object.damage[ i ] });
		}
	}
	else if (typeof(object.damage) === "string") {
		Test.hasNonEmptyStringProperty(object, "damage", extra);
		it("damage: \"{valid expression}\" [" + extra + "]", (function(o) {
			expect(Test.damageRegEx.test(o.damage)).toEqual(true);
		}).bind(this, object));
	}
	else {
		Test.hasNonEmptyObjectProperty(object, "damage", extra);
		describe("damage: Object of the form", function() {
			Test.hasNonEmptyStringProperty(object.damage, "amount", extra);
			it("amount: \"{valid expression}\" [" + extra + "]", (function(d) {
				expect(Test.damageRegEx.test(d.amount)).toEqual(true);
			}).bind(this, object.damage));
		});
	}
};

Test.hasValidEffects = function(object, required, extra) {
	if (required || object.hasOwnProperty("effects")) {
		Test.hasNonEmptyArrayProperty(object, "effects", extra);
		describe("effects: Array of String or Object of the form", function() {
			var i, effect;
			for (i = 0; i < object.effects.length; i++) {
				effect = object.effects[ i ];
				if (typeof(effect) === "string") {
					Test.nonEmptyString(effect);
				}
				else {
					Test.hasNonEmptyStringProperty(effect, "name", extra);
					if (effect.hasOwnProperty("amount")) {
						if (typeof(effect.amount) === "string") {
							it("amount: \"{valid expression}\" [" + extra + "]", (function(e) {
								expect(Test.damageRegEx.test(e.amount)).toEqual(true);
							}).bind(this, effect));
						}
						else {
							Test.hasNumberProperty(effect, "amount", extra);
						}
					}
					if (effect.hasOwnProperty("duration")) {
						Test.hasPositiveNumberProperty(effect, "duration", extra);
					}
					if (effect.hasOwnProperty("saveEnds")) {
						Test.hasBooleanProperty(effect, "saveEnds", extra);
					}
					if (effect.hasOwnProperty("type")) {
						Test.hasNonEmptyStringProperty(effect, "type", extra);
					}
				}
			}
		});
	}
};

Test.hasValidKeywords = function(object, required, extra) {
	if (required || object.hasOwnProperty("keywords")) {
		Test.hasNonEmptyArrayProperty(object, "keywords", extra);
		it("keywords: Array of String [" + extra + "]", (function(o) {
			var j;
			for (j = 0; j < o.keywords.length; j++) {
				expect(o.keywords[ j ].length).not.toEqual(0);
			}
		}).bind(this, object));
	}
};
