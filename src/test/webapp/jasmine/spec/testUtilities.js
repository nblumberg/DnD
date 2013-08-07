var Test;
if (!Test) {
    Test = {};
}


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

Test.hasProperty = function(object, property, extra) {
    it(property + ": [" + extra + "]", (function(obj, prop) {
        expect(obj.hasOwnProperty(prop)).toEqual(true);
    }).bind(this, object, property));
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

Test.propertyToEqual = function(object, property, value, extra) {
    it(property + ": " + (typeof(value) === "string" ? "\"" : "") + value + (typeof(value) === "string" ? "\"" : "") + " [" + extra + "]", (function(obj, prop, values) {
        expect(obj.hasOwnProperty(prop)).toEqual(true);
        expect(obj[ prop ]).toEqual(value);
    }).bind(this, object, property, value));
};

Test.isOneOf = function(object, property, values, extra) {
    it(property + ": " + values.join(" | ") + " [" + extra + "]", (function(obj, prop, values) {
        expect(obj.hasOwnProperty(prop)).toEqual(true);
        expect(values.indexOf(obj[ prop ])).not.toEqual(-1);
    }).bind(this, object, property, values));
};

