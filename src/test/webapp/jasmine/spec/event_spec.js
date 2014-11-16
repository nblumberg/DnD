(function(EventDispatcher) {
    "use strict";

    describe("event.js", function() {
        describe("EventDispatcher", function() {
            var eventDispatcher, event, callback, count, spyObj;

            beforeEach(function() {
                eventDispatcher = new EventDispatcher();
                event = { type: "test" };
                callback = function() {};
            });
            it("should initialize with no listeners", function() {
                expect(eventDispatcher.getListeners()).toEqual([]);
                expect(eventDispatcher.getEventTypes()).toEqual({});
            });
            it("shouldn't serialize out any of its members", function() {
                expect(eventDispatcher.raw()).toEqual({});
            });

            describe("addEventListener()", function() {
                describe("for a specific eventType", function() {
                    beforeEach(function() {
                        eventDispatcher.addEventListener("test", callback);
                    });
                    it("should be reflected in getListeners()", function() {
                        expect(eventDispatcher.getListeners()).toEqual([ { type: "test", callback: callback } ]);
                    });
                    it("should be reflected in getEventTypes()", function() {
                        expect(eventDispatcher.getEventTypes()).toEqual({ test: [ callback ] });
                    });
                    it("should be reflected in getListenersByType()", function() {
                        expect(eventDispatcher.getListenersByType("test")).toEqual([ callback ]);
                    });
                    it("should be reflected in getCallbackIndices()", function() {
                        expect(eventDispatcher.getCallbackIndices(callback)).toEqual([ 0 ]);
                    });
                    it("should be reflected in getListenerIndex() provided the eventType", function() {
                        expect(eventDispatcher.getListenerIndex("test", callback)).toEqual(0);
                    });
                    it("should not be reflected in getListenerIndex() without the eventType", function() {
                        expect(eventDispatcher.getListenerIndex(null, callback)).toEqual(-1);
                    });
                    it("should be reflected in hasListener() provided the eventType", function() {
                        expect(eventDispatcher.hasListener("test", callback)).toEqual(true);
                    });
                    it("should not be reflected in hasListener() without the eventType", function() {
                        expect(eventDispatcher.hasListener(null, callback)).toEqual(false);
                    });
                    it("called multiple times with identical parameters should not add a new listener", function() {
                        count = eventDispatcher.getListeners().length;
                        eventDispatcher.addEventListener("test", callback);
                        expect(eventDispatcher.getListeners().length).toEqual(count);
                    });
                });
                describe("for a non-specific eventType", function() {
                    beforeEach(function() {
                        eventDispatcher.addEventListener(null, callback);
                    });
                    it("should be reflected in getListeners()", function() {
                        expect(eventDispatcher.getListeners()).toEqual([ { type: null, callback: callback } ]);
                    });
                    it("should be not be reflected in getEventTypes()", function() {
                        expect(eventDispatcher.getEventTypes()).toEqual({});
                    });
                    it("should be not be reflected in getListenersByType()", function() {
                        expect(eventDispatcher.getListenersByType(null)).toEqual(undefined);
                    });
                    it("should be reflected in getCallbackIndices()", function() {
                        expect(eventDispatcher.getCallbackIndices(callback)).toEqual([ 0 ]);
                    });
                    it("should not be reflected in getListenerIndex() provided an eventType", function() {
                        expect(eventDispatcher.getListenerIndex("test", callback)).toEqual(-1);
                    });
                    it("should be reflected in getListenerIndex() without the eventType", function() {
                        expect(eventDispatcher.getListenerIndex(null, callback)).toEqual(0);
                    });
                    it("should be reflected in hasListener() provided an eventType", function() {
                        expect(eventDispatcher.hasListener("test", callback)).toEqual(false);
                    });
                    it("should not be reflected in hasListener() without the eventType", function() {
                        expect(eventDispatcher.hasListener(null, callback)).toEqual(true);
                    });
                    it("called multiple times with identical parameters should not add a new listener", function() {
                        count = eventDispatcher.getListeners().length;
                        eventDispatcher.addEventListener(null, callback);
                        expect(eventDispatcher.getListeners().length).toEqual(count);
                    });
                });
            });

            describe("on()", function() {
                describe("for a specific eventType", function() {
                    beforeEach(function() {
                        eventDispatcher.on("test", callback);
                    });
                    it("should be reflected in getListeners()", function() {
                        expect(eventDispatcher.getListeners()).toEqual([ { type: "test", callback: callback } ]);
                    });
                    it("should be reflected in getEventTypes()", function() {
                        expect(eventDispatcher.getEventTypes()).toEqual({ test: [ callback ] });
                    });
                    it("should be reflected in getListenersByType()", function() {
                        expect(eventDispatcher.getListenersByType("test")).toEqual([ callback ]);
                    });
                    it("should be reflected in getCallbackIndices()", function() {
                        expect(eventDispatcher.getCallbackIndices(callback)).toEqual([ 0 ]);
                    });
                    it("should be reflected in getListenerIndex() provided the eventType", function() {
                        expect(eventDispatcher.getListenerIndex("test", callback)).toEqual(0);
                    });
                    it("should not be reflected in getListenerIndex() without the eventType", function() {
                        expect(eventDispatcher.getListenerIndex(null, callback)).toEqual(-1);
                    });
                    it("should be reflected in hasListener() provided the eventType", function() {
                        expect(eventDispatcher.hasListener("test", callback)).toEqual(true);
                    });
                    it("should not be reflected in hasListener() without the eventType", function() {
                        expect(eventDispatcher.hasListener(null, callback)).toEqual(false);
                    });
                    it("called multiple times with identical parameters should not add a new listener", function() {
                        count = eventDispatcher.getListeners().length;
                        eventDispatcher.on("test", callback);
                        expect(eventDispatcher.getListeners().length).toEqual(count);
                    });
                });
                describe("for a non-specific eventType", function() {
                    beforeEach(function() {
                        eventDispatcher.on(null, callback);
                    });
                    it("should be reflected in getListeners()", function() {
                        expect(eventDispatcher.getListeners()).toEqual([ { type: null, callback: callback } ]);
                    });
                    it("should be not be reflected in getEventTypes()", function() {
                        expect(eventDispatcher.getEventTypes()).toEqual({});
                    });
                    it("should be not be reflected in getListenersByType()", function() {
                        expect(eventDispatcher.getListenersByType(null)).toEqual(undefined);
                    });
                    it("should be reflected in getCallbackIndices()", function() {
                        expect(eventDispatcher.getCallbackIndices(callback)).toEqual([ 0 ]);
                    });
                    it("should not be reflected in getListenerIndex() provided an eventType", function() {
                        expect(eventDispatcher.getListenerIndex("test", callback)).toEqual(-1);
                    });
                    it("should be reflected in getListenerIndex() without the eventType", function() {
                        expect(eventDispatcher.getListenerIndex(null, callback)).toEqual(0);
                    });
                    it("should be reflected in hasListener() provided an eventType", function() {
                        expect(eventDispatcher.hasListener("test", callback)).toEqual(false);
                    });
                    it("should not be reflected in hasListener() without the eventType", function() {
                        expect(eventDispatcher.hasListener(null, callback)).toEqual(true);
                    });
                    it("called multiple times with identical parameters should not add a new listener", function() {
                        count = eventDispatcher.getListeners().length;
                        eventDispatcher.on(null, callback);
                        expect(eventDispatcher.getListeners().length).toEqual(count);
                    });
                });
            });

            describe("removeEventListener()", function() {
                describe("for a specific eventType", function() {
                    beforeEach(function() {
                        eventDispatcher.addEventListener(null, callback);
                        eventDispatcher.addEventListener("test", callback);
                        count = eventDispatcher.removeEventListener("test", callback);
                    });
                    it("should return the number of listeners removed", function() {
                        expect(count).toEqual(1);
                    });
                    it("should return 0 if no listeners were removed", function() {
                        count = eventDispatcher.removeEventListener("test", callback);
                        expect(count).toEqual(0);
                    });
                    it("should be reflected in getListeners()", function() {
                        expect(eventDispatcher.getListeners()).toEqual([ { type: null, callback: callback } ]);
                    });
                    it("should be reflected in getEventTypes()", function() {
                        expect(eventDispatcher.getEventTypes()).toEqual({ test: [] });
                    });
                    it("should be reflected in getListenersByType()", function() {
                        expect(eventDispatcher.getListenersByType("test")).toEqual([]);
                    });
                    it("should be reflected in getCallbackIndices()", function() {
                        expect(eventDispatcher.getCallbackIndices(callback)).toEqual([ 0 ]);
                    });
                    it("should be reflected in getListenerIndex() provided the eventType", function() {
                        expect(eventDispatcher.getListenerIndex("test", callback)).toEqual(-1);
                    });
                    it("should not be reflected in getListenerIndex() without the eventType", function() {
                        expect(eventDispatcher.getListenerIndex(null, callback)).toEqual(0);
                    });
                    it("should be reflected in hasListener() provided the eventType", function() {
                        expect(eventDispatcher.hasListener("test", callback)).toEqual(false);
                    });
                    it("should not be reflected in hasListener() without the eventType", function() {
                        expect(eventDispatcher.hasListener(null, callback)).toEqual(true);
                    });
                });
                describe("for a non-specific eventType", function() {
                    beforeEach(function() {
                        eventDispatcher.addEventListener(null, callback);
                        eventDispatcher.addEventListener("test", callback);
                        count = eventDispatcher.removeEventListener(null, callback);
                    });
                    it("should return the number of listeners removed", function() {
                        expect(count).toEqual(2);
                    });
                    it("should return 0 if no listeners were removed", function() {
                        count = eventDispatcher.removeEventListener(null, callback);
                        expect(count).toEqual(0);
                    });
                    it("should be reflected in getListeners()", function() {
                        expect(eventDispatcher.getListeners()).toEqual([]);
                    });
                    it("should be not be reflected in getEventTypes()", function() {
                        expect(eventDispatcher.getEventTypes()).toEqual({ test: [] });
                    });
                    it("should be not be reflected in getListenersByType()", function() {
                        expect(eventDispatcher.getListenersByType("test")).toEqual([]);
                    });
                    it("should be reflected in getCallbackIndices()", function() {
                        expect(eventDispatcher.getCallbackIndices(callback)).toEqual([]);
                    });
                    it("should not be reflected in getListenerIndex() provided an eventType", function() {
                        expect(eventDispatcher.getListenerIndex("test", callback)).toEqual(-1);
                    });
                    it("should be reflected in getListenerIndex() without the eventType", function() {
                        expect(eventDispatcher.getListenerIndex(null, callback)).toEqual(-1);
                    });
                    it("should be reflected in hasListener() provided an eventType", function() {
                        expect(eventDispatcher.hasListener("test", callback)).toEqual(false);
                    });
                    it("should not be reflected in hasListener() without the eventType", function() {
                        expect(eventDispatcher.hasListener(null, callback)).toEqual(false);
                    });
                });
            });

            describe("off()", function() {
                describe("for a specific eventType", function() {
                    beforeEach(function() {
                        eventDispatcher.addEventListener(null, callback);
                        eventDispatcher.addEventListener("test", callback);
                        count = eventDispatcher.off("test", callback);
                    });
                    it("should return the number of listeners removed", function() {
                        expect(count).toEqual(1);
                    });
                    it("should return 0 if no listeners were removed", function() {
                        count = eventDispatcher.off("test", callback);
                        expect(count).toEqual(0);
                    });
                    it("should be reflected in getListeners()", function() {
                        expect(eventDispatcher.getListeners()).toEqual([ { type: null, callback: callback } ]);
                    });
                    it("should be reflected in getEventTypes()", function() {
                        expect(eventDispatcher.getEventTypes()).toEqual({ test: [] });
                    });
                    it("should be reflected in getListenersByType()", function() {
                        expect(eventDispatcher.getListenersByType("test")).toEqual([]);
                    });
                    it("should be reflected in getCallbackIndices()", function() {
                        expect(eventDispatcher.getCallbackIndices(callback)).toEqual([ 0 ]);
                    });
                    it("should be reflected in getListenerIndex() provided the eventType", function() {
                        expect(eventDispatcher.getListenerIndex("test", callback)).toEqual(-1);
                    });
                    it("should not be reflected in getListenerIndex() without the eventType", function() {
                        expect(eventDispatcher.getListenerIndex(null, callback)).toEqual(0);
                    });
                    it("should be reflected in hasListener() provided the eventType", function() {
                        expect(eventDispatcher.hasListener("test", callback)).toEqual(false);
                    });
                    it("should not be reflected in hasListener() without the eventType", function() {
                        expect(eventDispatcher.hasListener(null, callback)).toEqual(true);
                    });
                });
                describe("for a non-specific eventType", function() {
                    beforeEach(function() {
                        eventDispatcher.addEventListener(null, callback);
                        eventDispatcher.addEventListener("test", callback);
                        count = eventDispatcher.off(null, callback);
                    });
                    it("should return the number of listeners removed", function() {
                        expect(count).toEqual(2);
                    });
                    it("should return 0 if no listeners were removed", function() {
                        count = eventDispatcher.off(null, callback);
                        expect(count).toEqual(0);
                    });
                    it("should be reflected in getListeners()", function() {
                        expect(eventDispatcher.getListeners()).toEqual([]);
                    });
                    it("should be not be reflected in getEventTypes()", function() {
                        expect(eventDispatcher.getEventTypes()).toEqual({ test: [] });
                    });
                    it("should be not be reflected in getListenersByType()", function() {
                        expect(eventDispatcher.getListenersByType("test")).toEqual([]);
                    });
                    it("should be reflected in getCallbackIndices()", function() {
                        expect(eventDispatcher.getCallbackIndices(callback)).toEqual([]);
                    });
                    it("should not be reflected in getListenerIndex() provided an eventType", function() {
                        expect(eventDispatcher.getListenerIndex("test", callback)).toEqual(-1);
                    });
                    it("should be reflected in getListenerIndex() without the eventType", function() {
                        expect(eventDispatcher.getListenerIndex(null, callback)).toEqual(-1);
                    });
                    it("should be reflected in hasListener() provided an eventType", function() {
                        expect(eventDispatcher.hasListener("test", callback)).toEqual(false);
                    });
                    it("should not be reflected in hasListener() without the eventType", function() {
                        expect(eventDispatcher.hasListener(null, callback)).toEqual(false);
                    });
                });
            });

            describe("dispatchEvent()", function() {
                beforeEach(function() {
                    spyObj = jasmine.createSpyObj("callbacks", [ "generic", "specific" ]);
                    eventDispatcher.addEventListener(null, spyObj.generic);
                    eventDispatcher.addEventListener("test", spyObj.specific);
                    count = eventDispatcher.dispatchEvent("stringTest");
                    count += eventDispatcher.dispatchEvent(event);
                });
                it("should return the number of callbacks invoked", function() {
                    expect(count).toEqual(3);
                });
                it("should increment the event id counter for each dispatched event", function() {
                    expect(EventDispatcher.id).toEqual(3);
                });
                it("should invoke the generic callback for all events", function() {
                    expect(spyObj.generic).toHaveBeenCalledWith({ type: "stringTest", id: "stringTest1", target: eventDispatcher, stopPropagation: jasmine.any(Function), _stopPropagation: false });
                    expect(spyObj.generic).toHaveBeenCalledWith({ type: "test", id: "test2", target: eventDispatcher, stopPropagation: jasmine.any(Function), _stopPropagation: false });
                });
                it("should invoke the specific callback for only matching events", function() {
                    expect(spyObj.specific).not.toHaveBeenCalledWith({ type: "stringTest", id: "stringTest1", target: eventDispatcher, stopPropagation: jasmine.any(Function), _stopPropagation: false });
                    expect(spyObj.specific).toHaveBeenCalledWith({ type: "test", id: "test2", target: eventDispatcher, stopPropagation: jasmine.any(Function), _stopPropagation: false });
                });
                afterEach(function() {
                    EventDispatcher.id = 1;
                });
            });

            describe("trigger()", function() {
                beforeEach(function() {
                    spyObj = jasmine.createSpyObj("callbacks", [ "generic", "specific" ]);
                    eventDispatcher.addEventListener(null, spyObj.generic);
                    eventDispatcher.addEventListener("test", spyObj.specific);
                    count = eventDispatcher.trigger("stringTest");
                    count += eventDispatcher.trigger(event);
                });
                it("should return the number of callbacks invoked", function() {
                    expect(count).toEqual(3);
                });
                it("should increment the event id counter for each dispatched event", function() {
                    expect(EventDispatcher.id).toEqual(3);
                });
                it("should invoke the generic callback for all events", function() {
                    expect(spyObj.generic).toHaveBeenCalledWith({ type: "stringTest", id: "stringTest1", target: eventDispatcher, stopPropagation: jasmine.any(Function), _stopPropagation: false });
                    expect(spyObj.generic).toHaveBeenCalledWith({ type: "test", id: "test2", target: eventDispatcher, stopPropagation: jasmine.any(Function), _stopPropagation: false });
                });
                it("should invoke the specific callback for only matching events", function() {
                    expect(spyObj.specific).not.toHaveBeenCalledWith({ type: "stringTest", id: "stringTest1", target: eventDispatcher, stopPropagation: jasmine.any(Function), _stopPropagation: false });
                    expect(spyObj.specific).toHaveBeenCalledWith({ type: "test", id: "test2", target: eventDispatcher, stopPropagation: jasmine.any(Function), _stopPropagation: false });
                });
                afterEach(function() {
                    EventDispatcher.id = 1;
                });
            });

            describe("event.stopPropagation()", function() {
                beforeEach(function() {
                    spyObj = jasmine.createSpyObj("callbacks", [ "one", "two" ]);
                    spyObj.one.andCallFake(function(event) {
                        event.stopPropagation();
                    });
                    eventDispatcher.addEventListener(null, spyObj.one);
                    eventDispatcher.addEventListener(null, spyObj.two);
                    count = eventDispatcher.dispatchEvent(event);
                });
                it("should return the number of callbacks invoked", function() {
                    expect(count).toEqual(1);
                });
                it("should invoke matching listener callback until one stops event propagation", function() {
                    expect(spyObj.one).toHaveBeenCalled();
                    expect(spyObj.two).not.toHaveBeenCalled();
                });
                afterEach(function() {
                    EventDispatcher.id = 1;
                });
            });

        });
    });

})(DnD.EventDispatcher);

