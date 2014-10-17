/**
 * Created by nblumberg on 10/12/14.
 */

(function() {
    "use strict";

    /* global jasmine, beforeEach, afterEach, describe, xdescribe, it, spyOn, expect, runs, waits, DistUI, DistUiUtils */

    describe("When DnD.out", function() {
        var o, API;
        API = [
            "assert",
            "clear",
            "count",
            "debug",
            "dir",
            "dirxml",
            "error",
            "exception",
            "group",
            "groupCollapsed",
            "groupEnd",
            "info",
            "log",
            "profile",
            "profileEnd",
            "table",
            "time",
            "timeEnd",
            "timeStamp",
            "trace",
            "warn"
        ];
        beforeEach(function() {
            var i;
            if (window.console) {
                for (i = 0; i < API.length; i++) {
                    if (window.console[ API[ i ] ]) {
                        spyOn(window.console, API[ i ]);
                    }
                }
            }
            o = DnD.modules.out.create();
        });

        describe("is created", function() {
            it("it should be an Object", function() {
                expect(typeof(o)).toBe("object");
            });
            describe("it should have the expected properties", function() {
                var expected, itTest, i;
                expected = [
                    { prop: "real", value: window.console },
                    { prop: "console", instance: Object }
                ];
                for (i = 0; i < API.length; i++) {
                    expected.push({ prop: API[ i ], instance: Function });
                }
                itTest = function(p) {
                    expect(o.hasOwnProperty(p.prop)).toBe(true);
                    if (p.hasOwnProperty("value")) {
                        expect(o[ p.prop ]).toEqual(p.value);
                    }
                    if (p.hasOwnProperty("instance")) {
                        expect(o[ p.prop ] instanceof p.instance).toBe(true);
                    }
                };
                for (i = 0; i < expected.length; i++) {
                    it("[" + expected[ i ].prop + "]", itTest.bind(this, expected[ i ]));
                }
            });
        });

//        describe("assert is called", function() {
//            it("it should call console.error if the test evaluates as true", function() {
//                spyOn(o.console.error);
//                o.console.assert(false, "testMessage");
//                expect(o.console.error).not.toHaveBeenCalled();
//                o.console.assert(true, "testMessage");
//                expect(o.console.error).toHaveBeenCalledWith("testMessage");
//            });
//        });

        describe("createConsole is called", function() {
            var sc;
            beforeEach(function() {
                sc = o.createConsole();
            });
            it("it should return an Object", function() {
                expect(typeof(sc)).toEqual("object");
            });
            describe("it should return an Object", function() {
                describe("with all the methods of the console API", function() {
                    var i, itTest = function(p) {
                        expect(sc.hasOwnProperty(p)).toEqual(true);
                        expect(typeof(sc[ p ])).toEqual("function");
                    };
                    for (i = 0; i < API.length; i++) {
                        it("[" + API[ i ] + "]", itTest.bind(this, API[ i ]));
                    }
                });
                describe("with the expected properties", function() {
                    var expected, itTest, i;
                    expected = [
                        { prop: "_prefix", value: "" },
                        { prop: "debugEnabled", value: false },
                        { prop: "debugLevel", value: DnD.K.DEBUG_LEVEL.DEFAULT }
                    ];
                    itTest = function(p) {
                        expect(sc.hasOwnProperty(p.prop)).toBe(true);
                        if (p.hasOwnProperty("value")) {
                            expect(sc[ p.prop ]).toEqual(p.value);
                        }
                        if (p.hasOwnProperty("instance")) {
                            expect(sc[ p.prop ] instanceof p.instance).toBe(true);
                        }
                    };
                    for (i = 0; i < expected.length; i++) {
                        it("[" + expected[ i ].prop + "]", itTest.bind(this, expected[ i ]));
                    }
                });
                it("with the debugFilter method", function() {
                    expect(sc.hasOwnProperty("debugFilter")).toBe(true);
                    expect(typeof(sc.debugFilter)).toBe("function");
                });
            });
            describe("calling each method on the resulting Object should not throw an exception", function() {
                var i, itTest = function(p) {
                    expect(function() { sc[ p ]("DistUiUtils.createConsole() test"); }).not.toThrow();
                };
                for (i = 0; i < API.length; i++) {
                    it("[" + API[ i ] + "]", itTest.bind(this, API[ i ]));
                }
            });
            describe("calling each method on the resulting Object should prepend the prefix to the passed message", function() {
                var fauxConsole, multi, itTest, i;
                multi = [ "debug", "error", "info", "log", "warn" ];
                beforeEach(function() {
                    if (window.console) {
                        fauxConsole = false;
                    }
                    else {
                        fauxConsole = true;
                        window.console = jasmine.createSpyObj("console", [ "debug", "error", "info", "log", "warn" ]);
                    }
                    sc = o.createConsole("prefix");
                });
                afterEach(function() {
                    if (fauxConsole) {
                        window.console = undefined;
                    }
                });
                itTest = function(method) {
                    sc[ method ]("msg");
                    expect(window.console[ method ]).toHaveBeenCalledWith("prefix", "msg");
                };
                for (i = 0; i < multi.length; i++) {
                    it("[" + multi[ i ] + "]", itTest.bind(this, multi[ i ]));
                }
            });

            describe("calling debugFilter on the Object", function() {
                var isNoOp, callback, allFn, allTrueFalse;
                callback = function(ino) {
                    isNoOp = ino;
                };
                allFn = function() {
                    expect(typeof(sc.debugFilter())).toEqual("function");
                    expect(typeof(sc.debugFilter(DnD.K.DEBUG_LEVEL.DEFAULT))).toEqual("function");
                };
                allTrueFalse = function(bool) {
                    sc.debugFilter(undefined, callback);
                    expect(isNoOp).toBe(bool);
                    sc.debugFilter(DnD.K.DEBUG_LEVEL.DEFAULT, callback);
                    expect(isNoOp).toBe(bool);
                };
                it("it should always return a Function", function() {
                    sc.debugEnabled = false;
                    allFn();
                    sc.debugEnabled = true;
                    sc.debugLevel = 1;
                    allFn();
                });
                describe("when debugging is disabled", function() {
                    it("it should always return a no op Function", function() {
                        sc.debugEnabled = false;
                        allTrueFalse(true);
                    });
                });
                describe("when debugging is enabled", function() {
                    beforeEach(function() {
                        sc.debugEnabled = true;
                    });
                    describe("and the debug level is <= the current debug level", function() {
                        beforeEach(function() {
                            sc.debugLevel = 10;
                        });
                        it("it should return a bound reference to window.console.log", function() {
                            allTrueFalse(false);
                        });
                    });
                    describe("and the debug level is <= the current debug level", function() {
                        beforeEach(function() {
                            sc.debugLevel = 0;
                        });
                        it("it should return a no op Function", function() {
                            allTrueFalse(true);
                        });
                    });
                });
            });
        });

        describe("objectToString is called", function() {
            var i, testObj, output, testObjs, propPerLine, indent, itTest1, itTest2;
            testObjs = [
                { obj: undefined, output: "undefined" },
                { obj: null, output: "null" },
                { obj: true, output: "true" },
                { obj: false, output: "false" },
                { obj: 0, output: "0" },
                { obj: 1, output: "1" },
                { obj: "", output: "\"\"" },
                { obj: "testString", output: "\"testString\"" },
                { obj: [], output: "[]", isArray: true },
                { obj: [ "testString1", "testString2" ], output: "[ \"testString1\", \"testString2\" ]", isArray: true },
                { obj: {}, output: "{}", isObject: true },
                { obj: { testProp1: "testString1", testProp2: "testString2" }, output: "{ testProp1: \"testString1\", testProp2: \"testString2\" }", isObject: true },
                { obj: function() {}, output: "[function]" }
            ];
            itTest1 = function(i) {
                var r;
                testObj = testObjs[i].obj;
                output = testObjs[i].output;
                o.console.debugEnabled = true;

                r = o.objectToString(testObj, propPerLine, indent);

                expect(r).toBeDefined();
                expect(r).toEqual((indent ? indent : "") + output);
            };
            itTest2 = function(i) {
                var r;
                testObj = testObjs[i].obj;
                output = testObjs[i].output;
                if (testObjs[i].isArray) {
                    output = "[array]";
                }
                if (testObjs[i].isObject) {
                    output = "[object]";
                }
                o.console.debugEnabled = false;

                r = o.objectToString(testObj, propPerLine, indent);

                expect(r).toBeDefined();
                expect(r).toEqual((indent ? indent : "") + output);
            };
            for (i = 0; i < testObjs.length; i++) {
                testObj = testObjs[i].obj;
                output = testObjs[i].output;
                it(", when debugging is enabled and passes " + testObj + " it should return " + output, itTest1.bind(this, i));
                if (testObjs[i].isArray) {
                    output = "[array]";
                }
                if (testObjs[i].isObject) {
                    output = "[object]";
                }
                it(", when debugging is disabled and passes " + testObj + " it should return " + output, itTest2.bind(this, i));
            }
        });

    });
})();