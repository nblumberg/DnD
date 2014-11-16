(function(Serializable) {
    "use strict";

    describe("serializable.js", function() {
        var serializer, testArray, rawArray, TestObject, testObject, rawObject, jsonObject, result;
        serializer = new Serializable();
        testArray = [ "a", "b", "c", [ 1, 2, 3 ], undefined, null, function() {} ];
        rawArray = [ "a", "b", "c", [ 1, 2, 3 ], null, null, null ];
        TestObject = function() {
            this.x = "x";
            this.array = testArray.concat({ baby: "you", me: this });
            this.$public = "jQueryPublicMember";
            this._$private = "jQueryPrivateMember";
            this.method = function() {};
            this.circular = this;
        };
        rawObject = { x: "x", array: rawArray.concat({ baby: "you", me: null }), circular: null };
        jsonObject = "{\n  \"x\": \"x\",\n  \"array\": [\n    \"a\",\n    \"b\",\n    \"c\",\n    [\n      1,\n      2,\n      3\n    ],\n    null,\n    null,\n    null,\n    {\n      \"baby\": \"you\",\n      \"me\": null\n    }\n  ],\n  \"circular\": null\n}";

        describe("When Serializable.rawObj() is invoked on", function() {
            it("undefined, it should return null", function() {
                result = serializer.rawObj(undefined);
                expect(result).toEqual(null);
            });
            it("null, it should return null", function() {
                result = serializer.rawObj(null);
                expect(result).toEqual(null);
            });
            it("a Function, it should return null", function() {
                result = serializer.rawObj(null);
                expect(result).toEqual(null);
            });
            it("a Boolean, it should return the value directly", function() {
                result = serializer.rawObj(true);
                expect(result).toEqual(true);
                result = serializer.rawObj(false);
                expect(result).toEqual(false);
            });
            it("a Number, it should return the value directly", function() {
                result = serializer.rawObj(1);
                expect(result).toEqual(1);
                result = serializer.rawObj(-1);
                expect(result).toEqual(-1);
                result = serializer.rawObj(1.5);
                expect(result).toEqual(1.5);
            });
            it("a String, it should return the value directly", function() {
                result = serializer.rawObj("string");
                expect(result).toEqual("string");
            });

            describe("a simple Object", function() {
                testObject = new TestObject();
                result = serializer.rawObj(testObject);

                it("it should return an Object", (function(r) {
                    expect(typeof(r)).toEqual("object");
                }).bind(this, result));
                it("it should return an Object with normal property values matching the source", (function(r) {
                    expect(r.x).toEqual("x");
                }).bind(this, result));
                it("it should return an Object with normal property Array values duplicating the source", (function(r) {
                    expect(r.array).toEqual(rawArray.concat({ baby: "you", me: null }));
                }).bind(this, result));
                it("it should return an Object without public jQuery collection reference members from the source", (function(r) {
                    expect(r.hasOwnProperty("$public")).toEqual(false);
                }).bind(this, result));
                it("it should return an Object without private jQuery collection reference members from the source", (function(r) {
                    expect(r.hasOwnProperty("_$private")).toEqual(false);
                }).bind(this, result));
                it("it should return an Object without methods from the source", (function(r) {
                    expect(r.hasOwnProperty("method")).toEqual(false);
                }).bind(this, result));
                it("it should return an Object with circular references in the source set to null", (function(r) {
                    expect(r.circular).toEqual(null);
                    expect(r.array).toEqual(rawArray.concat({ baby: "you", me: null }));
                }).bind(this, result));
            });

            describe("an Object implementing raw()", function() {
                TestObject.prototype = new Serializable();
                testObject = new TestObject();
                result = serializer.rawObj(testObject);

                it("it should return an Object", (function(r) {
                    expect(typeof(r)).toEqual("object");
                }).bind(this, result));
                it("it should return an Object with normal property values matching the source", (function(r) {
                    expect(r.x).toEqual("x");
                }).bind(this, result));
                it("it should return an Object with normal property Array values duplicating the source", (function(r) {
                    expect(r.array).toEqual(rawArray.concat({ baby: "you", me: null }));
                }).bind(this, result));
                it("it should return an Object without public jQuery collection reference members from the source", (function(r) {
                    expect(r.hasOwnProperty("$public")).toEqual(false);
                }).bind(this, result));
                it("it should return an Object without private jQuery collection reference members from the source", (function(r) {
                    expect(r.hasOwnProperty("_$private")).toEqual(false);
                }).bind(this, result));
                it("it should return an Object without methods from the source", (function(r) {
                    expect(r.hasOwnProperty("method")).toEqual(false);
                }).bind(this, result));
                it("it should return an Object with circular references in the source set to null", (function(r) {
                    expect(r.circular).toEqual(null);
                    expect(r.array).toEqual(rawArray.concat({ baby: "you", me: null }));
                }).bind(this, result));

                it("it should return the result of the raw() method, passing in an empty Array", function() {
                    spyOn(Serializable.prototype, "raw").andReturn("rawResult");
                    testObject = new TestObject();
                    result = testObject.rawObj(testObject);
                    expect(result).toEqual("rawResult");
                    expect(Serializable.prototype.raw).toHaveBeenCalledWith([]);
                });
            });
        });

        describe("When Serializable.rawArray() is invoked on", function() {
            it("undefined, it should return null", function() {
                result = serializer.rawArray(undefined);
                expect(result).toEqual(null);
            });
            it("null, it should return null", function() {
                result = serializer.rawArray(null);
                expect(result).toEqual(null);
            });
            it("a Function, it should return null", function() {
                result = serializer.rawArray(null);
                expect(result).toEqual(null);
            });
            it("a Boolean, it should return null", function() {
                result = serializer.rawArray(true);
                expect(result).toEqual(null);
                result = serializer.rawArray(false);
                expect(result).toEqual(null);
            });
            it("a Number, it should return null", function() {
                result = serializer.rawArray(1);
                expect(result).toEqual(null);
                result = serializer.rawArray(-1);
                expect(result).toEqual(null);
                result = serializer.rawArray(1.5);
                expect(result).toEqual(null);
            });
            it("a String, it should return null", function() {
                result = serializer.rawArray("string");
                expect(result).toEqual(null);
            });
            it("a non-Array Object, it should return null", function() {
                result = serializer.rawArray({ array: false });
                expect(result).toEqual(null);
            });

            describe("an Array containing simple items", function() {
                var tmpArray = testArray.concat([]);
                tmpArray.push({ baby: "you", me: tmpArray });
                result = serializer.rawArray(tmpArray);

                it("it should return an Array of the same length", (function(r) {
                    expect(typeof(r)).toEqual("object");
                    expect(r.constructor).toEqual(Array);
                    expect(r.length).toEqual(tmpArray.length);
                }).bind(this, result));
                it("it should return an Array with the same defined, non-Function and non-circular-reference items as the source", (function(r) {
                    expect(r).toEqual(rawArray.concat({ baby: "you", me: null }));
                }).bind(this, result));
            });

            describe("an Array containing Objects implementing raw()", function() {
                var tmpArray = testArray.concat([]);
                testObject = new TestObject();
                tmpArray.push(testObject);
                result = serializer.rawArray(tmpArray);

                it("it should return an Array of the same length", (function(r) {
                    expect(typeof(r)).toEqual("object");
                    expect(r.constructor).toEqual(Array);
                    expect(r.length).toEqual(tmpArray.length);
                }).bind(this, result));
                it("it should return an Array with the same defined, non-Function and non-circular-reference items as the source", (function(r) {
                    var tmpRawArray = rawArray.concat([]);
                    tmpRawArray.push(rawObject);
                    expect(r).toEqual(tmpRawArray);
                }).bind(this, result));
                it("it should return an Array including the result of the raw() method for each item, passing in an Array containing the top Array", function() {
                    spyOn(Serializable.prototype, "raw").andReturn("rawResult");

                    result = serializer.rawArray(tmpArray);
                    expect(result).toEqual(rawArray.concat("rawResult"));
                    expect(Serializable.prototype.raw).toHaveBeenCalled(); // TODO: can't do .toHaveBeenCalledWith(tmpArray) since jasmine seems to lose it's reference to tmpArray when doing this evaluation since I'm seeing the correct value passed into the spy during debugging
                });
            });
        });

        describe("When an Object with prototype Serializable invokes its raw() method", function() {
            TestObject.prototype = new Serializable();
            testObject = new TestObject();
            result = testObject.raw();

            it("it should return an Object", (function(r) {
                expect(typeof(r)).toEqual("object");
            }).bind(this, result));
            it("it should return an Object with normal property values matching the source", (function(r) {
                expect(r.x).toEqual("x");
            }).bind(this, result));
            it("it should return an Object with normal property Array values duplicating the source", (function(r) {
                expect(r.array).toEqual(rawArray.concat({ baby: "you", me: null }));
            }).bind(this, result));
            it("it should return an Object without public jQuery collection reference members from the source", (function(r) {
                expect(r.hasOwnProperty("$public")).toEqual(false);
            }).bind(this, result));
            it("it should return an Object without private jQuery collection reference members from the source", (function(r) {
                expect(r.hasOwnProperty("_$private")).toEqual(false);
            }).bind(this, result));
            it("it should return an Object without methods from the source", (function(r) {
                expect(r.hasOwnProperty("method")).toEqual(false);
            }).bind(this, result));
            it("it should return an Object with circular references in the source set to null", (function(r) {
                expect(r.circular).toEqual(null);
                expect(r.array).toEqual(rawArray.concat({ baby: "you", me: null }));
            }).bind(this, result));
        });

        describe("When an Object with prototype Serializable invokes its toJSON() method", function() {
            TestObject.prototype = new Serializable();
            testObject = new TestObject();
            result = testObject.toJSON();

            it("it should return a String", (function(r) {
                expect(typeof(r)).toEqual("string");
            }).bind(this, result));
            it("it should return a JSON representation of the Object without methods, public or private jQuery collection reference members, or circular references", (function(r) {
                expect(r).toEqual(jsonObject);
            }).bind(this, result));
            it("it should return the result of the raw() method, passing in nothing", function() {
                spyOn(Serializable.prototype, "raw").andReturn("rawResult");
                testObject = new TestObject();
                result = testObject.toJSON();
                expect(result).toEqual("\"rawResult\"");
                expect(Serializable.prototype.raw).toHaveBeenCalledWith();
            });
        });
    });

})(DnD.modules.Serializable.create());
