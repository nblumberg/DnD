/* global jasmine, describe, beforeEach, it, expect, DnD */
/* exported */
(function() {
    "use strict";

    describe("When a Proxy object", function() {
        var p = null;
        describe("is instantiated", function() {
            beforeEach(function() {
                p = new DnD.Proxy();
                p.proxy();
            });
            it("it should have the expected properties", function() {
                expect(Object.keys(p).length).toBe(11);
            });
            describe("it should have the expected properties", function() {
                it("addGetter", function() {
                    expect(typeof(p.addGetter)).toBe("function");
                });
                it("addListener", function() {
                    expect(typeof(p.addListener)).toBe("function");
                });
                it("addSetter", function() {
                    expect(typeof(p.addSetter)).toBe("function");
                });
                it("get", function() {
                    expect(typeof(p.get)).toBe("function");
                });
                it("getObject", function() {
                    expect(typeof(p.getObject)).toBe("function");
                });
                it("getValues", function() {
                    expect(typeof(p.getValues)).toBe("function");
                });
                it("removeGetter", function() {
                    expect(typeof(p.removeGetter)).toBe("function");
                });
                it("removeListener", function() {
                    expect(typeof(p.removeListener)).toBe("function");
                });
                it("removeSetter", function() {
                    expect(typeof(p.removeSetter)).toBe("function");
                });
                it("set", function() {
                    expect(typeof(p.set)).toBe("function");
                });
                it("setMultiple", function() {
                    expect(typeof(p.set)).toBe("function");
                });
            });
            describe("as a wrapper", function() {
                beforeEach(function() {
                    p = new DnD.Proxy();
                    p.proxy({ isWrapper: true });
                });
                it("it should get all members from a wrapper Object other than itself", function() {
                    p.test = "wrapper";
                    p.set("test", "wrapped");
                    expect(p.test).toEqual("wrapper");
                    expect(p.get("test")).toEqual("wrapped");
                });
                it("it should set all members on a wrapper Object other than itself", function() {
                    p.set("test", "wrapped");
                    expect(p.test).not.toBeDefined();
                    expect(p.get("test")).toEqual("wrapped");
                });

                describe("of an explicitly passed Object", function() {
                    var obj = null;
                    beforeEach(function() {
                        obj = { test: "testValue" };
                        p = new DnD.Proxy();
                        p.proxy({ object: obj });
                    });
                    it("it should get all members from that Object", function() {
                        expect(p.get("test")).toEqual(obj.test);
                    });
                    it("it should set all members on that Object", function() {
                        p.set("property", "test");
                        expect(obj.property).toEqual("test");
                    });
                });
            });
        });

        describe("get() is called", function() {
            it("it should return the specified member value", function() {
                p = new DnD.Proxy();
                p.proxy({});
                p.test = "testValue";
                expect(p.get("test")).toEqual("testValue");
            });
            describe("with a proxy method defined for the specified member", function() {
                it("it should invoke the proxy method and return it's return value", function() {
                    p = new DnD.Proxy();
                    p.proxy({ getters: { "test": function(obj, property) { return obj[ property ] + "2"; } } });
                    p.test = "testValue";
                    expect(p.get("test")).toEqual("testValue2");
                });
            });
        });

        describe("set() is called", function() {
            it("it should set the specified member value", function() {
                p = new DnD.Proxy();
                p.proxy({});
                p.test = "testValue";
                p.set("test", "setValue");
                expect(p.test).toEqual("setValue");
                expect(p.get("test")).toEqual("setValue");
            });
            describe("with a proxy method defined for the specified member", function() {
                it("it should invoke the proxy method", function() {
                    p = new DnD.Proxy();
                    p.proxy({ setters: { "test": function(obj, property, value) { obj[ property ] = obj[ property ] + (value + 1); } } });
                    p.test = "testValue";
                    p.set("test", 1);
                    expect(p.test).toEqual("testValue2");
                    expect(p.get("test")).toEqual("testValue2");
                });
            });
            describe("if the call changes the member value", function() {
                it("it should invoke all listeners", function() {
                    var i, spies;
                    spies = [];
                    for (i = 0; i < 3; i++) {
                        spies.push(jasmine.createSpy("" + i));
                    }
                    p = new DnD.Proxy();
                    p.proxy({ listeners: spies });
                    p.test = "testValue";
                    p.set("test", "setValue");
                    for (i = 0; i < spies.length; i++) {
                        expect(spies[ i ]).toHaveBeenCalledWith(p, "test", "testValue", "setValue");
                    }
                });
            });
        });

        describe("addGetter() is called", function() {
            it("it should add the getter to the map of getters", function() {
                var spy = jasmine.createSpy("getter");
                p = new DnD.Proxy();
                p.proxy({});
                p.addGetter("test", spy);
                p.get("test");
                expect(spy).toHaveBeenCalledWith(p, "test");
            });
        });

        describe("addListener() is called", function() {
            it("it should add the listener to the list of change listeners", function() {
                var spy = jasmine.createSpy("listener");
                p = new DnD.Proxy();
                p.proxy({});
                p.test = "testValue";
                p.addListener(spy);
                p.set("test", "setValue");
                expect(spy).toHaveBeenCalledWith(p, "test", "testValue", "setValue");
            });
        });

        describe("addSetter() is called", function() {
            it("it should add the setter to the map of setters", function() {
                var spy = jasmine.createSpy("setter");
                p = new DnD.Proxy();
                p.proxy({});
                p.addSetter("test", spy);
                p.set("test", "setValue");
                expect(spy).toHaveBeenCalledWith(p, "test", "setValue");
            });
        });

        describe("removeGetter() is called", function() {
            it("it should remove the getter from the map of getters", function() {
                var spy = jasmine.createSpy("getter");
                p = new DnD.Proxy();
                p.proxy({ getters: { "test": spy } });
                p.removeGetter("test");
                p.get("test");
                expect(spy).not.toHaveBeenCalled();

                p.addGetter("test", spy);
                p.get("test");
                expect(spy).toHaveBeenCalledWith(p, "test");

                spy.reset();
                p.removeGetter("test");
                p.get("test");
                expect(spy).not.toHaveBeenCalled();
            });
        });

        describe("removeListener() is called", function() {
            it("it should remove the listener from the list of change listeners", function() {
                var spy = jasmine.createSpy("listener");
                p = new DnD.Proxy();
                p.proxy({ listeners: [ spy ] });
                p.test = "testValue";
                p.removeListener(spy);
                p.set("test", "setValue");
                expect(spy).not.toHaveBeenCalled();

                p.test = "testValue";
                p.addListener(spy);
                p.set("test", "setValue");
                expect(spy).toHaveBeenCalledWith(p, "test", "testValue", "setValue");

                spy.reset();
                p.removeListener(spy);
                p.test = "testValue";
                p.set("test", "setValue");
                expect(spy).not.toHaveBeenCalled();
            });
        });

        describe("removeSetter() is called", function() {
            it("it should remove the setter from the map of setters", function() {
                var spy = jasmine.createSpy("setter");
                p = new DnD.Proxy();
                p.proxy({ setters: { "test": spy } });
                p.removeSetter("test");
                p.set("test", "setValue");
                expect(spy).not.toHaveBeenCalled();

                p.addSetter("test", spy);
                p.set("test", "setValue");
                expect(spy).toHaveBeenCalledWith(p, "test", "setValue");

                spy.reset();
                p.removeSetter("test");
                p.set("test", "setValue");
                expect(spy).not.toHaveBeenCalled();
            });
        });

    });

})();