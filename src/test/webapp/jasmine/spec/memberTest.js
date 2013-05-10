describe("When a DistUi member instance", function() {
    var distui, distuiHost, distuiVersion, env, parameters, metrics, postmessage, bubbleApi, invokeApi, utilsConsole, utilsDebug, utilsLoadScripts, makeNested, callbackToKey, setUpCallbackAndInvokeApi, dispatchEventPublish, addEventListenerSubscribe;

    distuiHost = "http://distui.d1.constantcontact.com";
    distuiVersion = "/dev";
    env = "d1.";

    parameters = {
            roster: [],
            topLocations: { testTopLocation: "http://top.test.{env}location.com/{souid}", siteHome: "http://top.test.{env}location.com/{souid}/site/home" },
            souid: 123456789,
            rosterMemberName: "testMemberName",
            id: "testMemberId",
            rootUrl: "https://test." + env + "constantcontact.com/base/path",
            urlParameters: "&test=test",
            topUrl: "https://ui." + env + "constantcontact.com/distui/jasmine/test",
            parentUrl: "https://ui." + env + "constantcontact.com/distui/jasmine/test",
            memberScriptUrl: "../../../main/webapp/js/member.js",
            containerScriptUrl: "../../../main/webapp/js/container.js",
            utilsScriptUrl: "../../../main/webapp/js/utils.js",
            bootstrapScriptUrl: distuiHost + distuiVersion + "/distui/js/{memberName}",
            logInfoAjaxUrl: distuiHost + distuiVersion + "/distui/log",
            logWarningAjaxUrl: distuiHost + distuiVersion + "/distui/warn",
            logErrorAjaxUrl: distuiHost + distuiVersion + "/distui/error",
            rosterAjaxUrl: distuiHost + distuiVersion + "/distui/member/data/{memberName}",
            uiHost: "https://ui." + env + "constantcontact.com",
            webappVersion: "1.5.0",
            apiVersion: "1.0",
            cacheBuster: "1234567890",
            makeMeAContainerCallback: null,
            trackingEnabled: true
    };
    
    metrics = [ { name: "test event", time: 123456789 } ];

    window.DistUiGlobals = { 
            addEvent: jasmine.createSpy(),
            preMetricsEvents: metrics 
        };
    
    makeNested = function() {
        spyOn(distui, "_isTop").andReturn(false);
    };
    
    callbackToKey = function(callback) {
        var key;
        if (!callback) {
            return null;
        }
        if (typeof(callback) === "string") {
            return callback;
        }
        for (key in distui._callbacks) {
            if (distui._callbacks.hasOwnProperty(key) && distui._callbacks[key].fn === callback) {
                return key;
            }
        }
        return null;
    };
    
    
    beforeEach(function() {
        distui = new DistUi(parameters);
        postMessage = spyOn(distui, "_postMessage");
        bubbleApi = spyOn(distui, "_bubbleApi");
        invokeApi = spyOn(distui, "_invokeApi");
        utilsConsole = spyOn(distui._utils, "console");
        utilsDebug = spyOn(distui._utils, "debug");
        utilsLoadScripts = spyOn(distui._utils, "loadScripts");
        utilsLoadScript = spyOn(distui._utils, "loadScript");
    });
    
    afterEach(function() {
        //window.DistUiGlobals = null;
        window.testMethod = null;
    });

    
    setUpCallbackAndInvokeApi = function(api) {
        var test = function(itText, isFunctionReference) {
            it(itText, function() {
                var _addCallback, callback;
                _addCallback = spyOn(distui, "_addCallback").andCallFake(function() { return "testCallbackKey"; });
                callback = !isFunctionReference ? "testMethod" : function(data) { return data; };
                
                distui[ api ](callback);
                
                if (isFunctionReference) {
                    expect(_addCallback).toHaveBeenCalledWith(callback, true);
                    expect(invokeApi).toHaveBeenCalledWith(api, "testCallbackKey");
                }
                else {
                    expect(_addCallback).not.toHaveBeenCalled();
                    expect(invokeApi).toHaveBeenCalledWith(api, callback);
                }
            });
        };
        test("it should call _invokeApi()", false);
        test("it should set up callback and call _invokeApi()", true); 
    };
    
    addEventListenerSubscribe = function(api) {
        var test = function(itText, alreadyExists, isNested, isLocalOnly, isFunctionReference) {
            it(itText, function() {
                var type = "testEventType", handler = !isFunctionReference ? "testMethod" : function(event) { return event; }, _addCallback, key;
                _addCallback = spyOn(distui, "_addCallback").andCallThrough(); 
                window.testMethod = function(event) {};
                if (alreadyExists) {
                    distui[ api ]({ handler: handler, type: type });
                }
                if (isNested) {
                    makeNested();
                }
                
                distui[ api ]({ handler: handler, type: type, localOnly: isLocalOnly });
                
                expect(distui._listeners).not.toEqual(null);
                expect(distui._listeners.length).toEqual(1);
                if (isFunctionReference) {
                    expect(_addCallback).toHaveBeenCalledWith(handler);
                    handler = callbackToKey(handler);
                }
                else {
                    expect(_addCallback).not.toHaveBeenCalled();
                }
                expect(distui._listeners[0].handler).toEqual(handler);
                expect(distui._listeners[0].type).toEqual(type);
                if (isNested && !isLocalOnly) {
                    expect(invokeApi).toHaveBeenCalledWith("addEventListener", { handler: handler, type: type });
                }
                else {
                    expect(invokeApi).not.toHaveBeenCalled();
                }
            });
        };
        test("it should add a listener with matching type and handler", false, false, false, false);
        test("it should add a listener with matching type and handler (even if the handler is a function reference)", false, false, false, true);
        test("unless it already has a listener with matching type and handler for this member", true, false, false, false);
        test("unless it already has a listener with matching type and handler for this member (even if the handler is a function reference)", true, false, false, true);
        test("and it should tell the DistUi instance in window.parent to add the same listener", false, true, false, false);
        test("and it should not tell the DistUi instance in window.parent to add the same listener if it is in window.top", false, false, false, false);
        test("and it should not tell the DistUi instance in window.parent to add the same listener if the parameters set localOnly == true", false, true, true, false);
    };
    
    dispatchEventPublish = function(api) {
        var test = function(itText, isTop, isDescendantsOnly, isValidEventType, isFunctionReference) {
            it(itText, function() {
                var r, type, eventProperties, receiveEvent, callback, callbackInvoked;
                type = isValidEventType ? "testEventType" : null;
                eventProperties = { test: "test" };
                callbackInvoked = false;
                callback = (function(event) {
                    expect(event).not.toEqual(null);
                    expect(event.type).toEqual(type);
                    expect(event.test).toEqual("test");
                    callbackInvoked = true;
                }).bind(this);
                receiveEvent = spyOn(distui, "_receiveEvent").andCallThrough();
                bubbleApi.andCallFake(function(api, event) {
                    expect(api).toEqual("_bubbleEvent");
                    expect(event).not.toEqual(null);
                    expect(event.type).toEqual(type);
                    expect(event.test).toEqual("test");
                });
                if (!isTop) {
                    makeNested();
                }
                if (!isFunctionReference) {
                    // A spy doesn't seem to work here because window.testMethod needs to actually exist
                    window.testMethod = callback;
                }
                distui.addEventListener({ type: type, handler: isFunctionReference ? callback : "testMethod" });
                
                r = distui[ api ](type, eventProperties, isDescendantsOnly);
                
                if (!isTop && !isDescendantsOnly) {
                    expect(bubbleApi).toHaveBeenCalled();
                    expect(receiveEvent).not.toHaveBeenCalled();
                }
                else if (isValidEventType) {
                    expect(bubbleApi).not.toHaveBeenCalled();
                    expect(receiveEvent).toHaveBeenCalled();
                    expect(callbackInvoked).toEqual(true);
                }
                else {
                    expect(bubbleApi).not.toHaveBeenCalled();
                    expect(receiveEvent).not.toHaveBeenCalled();
                }
                expect(r).toEqual(isValidEventType);
            });
        };
        test("it should bubble the event up to window.top and return true", false, false, true, false);
        test("it should bubble the event up to window.top and return true (using function reference)", false, false, true, true);
        test("in window.top it should not bubble the event up and should receive the event directly and return true", true, false, true, false);
        test("in window.top it should not bubble the event up and should receive the event directly and return true (using function reference)", true, false, true, true);
        test("with parameter descendantsOnly == true, it should not bubble the event up and should receive the event directly and return true", false, true, true, false);
        test("with parameter descendantsOnly == true, it should not bubble the event up and should receive the event directly and return true (using function reference)", false, true, true, true);
        test("with an invalid event type parameter, it should return false", false, false, true, false);
        test("in window.top with an invalid event type parameter, it should return false", true, false, false, false);
    };
    
    describe("is created", function() {
        it("it should have all its properties initialized", function() {
            expect(distui.rosterMemberName).toEqual(parameters.rosterMemberName);
            expect(distui.id).toEqual(parameters.id);
            expect(distui.version).toEqual(1.0);
            expect(distui.webappVersion).toEqual(parameters.webappVersion);
            expect(distui.release).toEqual(parameters.apiVersion);
            expect(distui._utils.constructor).toEqual(DistUiUtils);
            expect(distui._debugEnabled).toEqual(distui._utils.debugEnabled);
            expect(distui._debugLevel).toEqual(distui._utils.debugLevel);
            expect(distui._trackingEnabled).toEqual(parameters.trackingEnabled);
            expect(distui._isLocalOnly).toEqual(false);
            expect(distui._params).toEqual(parameters);
            expect(distui._myRootUrl).toEqual(window.location.protocol + "//" + window.location.host + window.location.pathname); // parameters.rootUrl);
            expect(distui._myUrlParameters.toString()).toEqual(parameters.urlParameters);
            expect(distui._myCacheBuster).toEqual(parameters.cacheBuster);
            expect(distui._myUrl).toEqual(distui._myRootUrl + "?" + parameters.urlParameters);
            expect(distui._parentUrl).toEqual(parameters.parentUrl);
            expect(distui._topUrl).toEqual(parameters.topUrl);
            expect(distui._memberScriptUrl).toEqual(parameters.memberScriptUrl);
            expect(distui._containerScriptUrl).toEqual(parameters.containerScriptUrl);
            expect(distui._bootstrapScriptUrl).toEqual(parameters.bootstrapScriptUrl);
            expect(distui._utilsScriptUrl).toEqual(parameters.utilsScriptUrl);
            expect(distui._logInfoAjaxUrl).toEqual(parameters.logInfoAjaxUrl);
            expect(distui._logWarningAjaxUrl).toEqual(parameters.logWarningAjaxUrl);
            expect(distui._logErrorAjaxUrl).toEqual(parameters.logErrorAjaxUrl);
            expect(distui._rosterAjaxUrl).toEqual(parameters.rosterAjaxUrl);
            expect(distui._roster).toEqual(parameters.roster);
            expect(distui._topLocations).toEqual(parameters.topLocations);
            expect(distui._souid).toEqual(parameters.souid);
            expect(distui._listeners).toEqual([]);
            expect(distui._makeMeAContainerCallbacks).toEqual([]);
            expect(distui._becomingAContainer).toEqual(false);
            expect(distui._doMakeMeAContainerCallbacksCount).toEqual(0);
            expect(distui._callbacks).toEqual({});
        });
    });
    
    describe("calls _addCallback", function() {
        var fn, test;
        fn = function() { return "This is a test."; };
        test = function(itText, f) {
            it(itText, function() {
                var r;
                
                r = distui._addCallback(f);
                
                if (f && f.constructor === Function) {
                    expect(distui._callbacks[r].fn).toEqual(f);
                }
                else {
                    expect(r).toEqual(null);
                }
            });
        };
        test("with a Function it should add it to its list of callbacks and return the key pointing to it", fn);
        test("with null it should return null", null);
        test("with undefined it should return null", undefined);
        test("with a non-Function value it should return null", true);
    });
    
    describe("calls _generateCallbackKey", function() {
        it("should return a unique value every time", function() {
            var r, keys = [], i;
            
            for (i = 0; i < 10; i++) {
                r = distui._generateCallbackKey();
                
                expect(keys.indexOf(r)).toEqual(-1);
                keys.push(r);
            }
        });
    });
    
    describe("calls _isCallbackKey", function() {
        it("with a valid callback key it should return true", function() {
            var r, key;
            
            key = distui._generateCallbackKey();
            
            r = distui._isCallbackKey(key);
            
            expect(r).toEqual(true);
        });
        it("with an invalid callback key it should return false", function() {
            var r, key;
            
            key = "not a valid callback key: " + distui._generateCallbackKey();
            
            r = distui._isCallbackKey(key);
            
            expect(r).toEqual(false);
        });
    });
    
    describe("calls _bubbleApi", function() {
        var test = function(itText, fnName, params, members) {
            it(itText, function() {
                var r, newMembers;
                newMembers = members ? ([ distui.id ]).concat(members) : [ distui.id ];
                
                bubbleApi.andCallThrough();
                postMessage.andCallFake(function(clientCallType, data) { return fnName ? true : false; });
                
                r = distui._bubbleApi(fnName, params, members);
                
                expect(postMessage).toHaveBeenCalledWith(distui.BUBBLE_UP_TYPE, { fn: fnName, params: params, members: newMembers, member: distui.id });
                expect(r).toEqual(fnName ? true : false);
            });
        };
        test("with a function name, parameters, and no members, it should call _postmessage() with the expected parameters and return true", "testMethod", { test: "params" }, null);
        test("with a function name, parameters, and members, it should call _postmessage() with the expected parameters and return true", "testMethod", { test: "params" }, [ "testMemberId1", "testMemberId2" ]);
        test("without a function name, it should not call _postmessage() and should return false", "", { test: "params" }, [ "testMemberId1", "testMemberId2" ]);
    });
    
    describe("calls _doMakeMeAContainerCallbacks", function() {
        var test = function(itText) {
            it(itText, function() {
                var r, i, n = 10, callbacksInvoked = 0, callback;
                callback = function() { 
                    callbacksInvoked++; 
                };
                for (i = 0; i < n; i++) {
                    distui._makeMeAContainerAddCallback(callback);
                }
                
                r = distui._doMakeMeAContainerCallbacks();
                
                expect(r).toEqual(true);
                expect(callbacksInvoked).toEqual(n);
            });
        };
        test("it should call each stored callback and return true", "testMethod", { test: "params" }, null);
    });
    
    describe("calls _makeMeAContainerAddCallback", function() {
        var test = function(itText, callback) {
            it(itText, function() {
                var r, _isContainer;
                _isContainer = spyOn(distui, "_isContainer").andCallFake(function() { return false; });
                
                r = distui._makeMeAContainerAddCallback(callback);
                
                if (callback) {
                    expect(_isContainer).toHaveBeenCalled();
                    expect(r).toEqual(true);
                    expect(distui._makeMeAContainerCallbacks).not.toEqual(null);
                    expect(distui._makeMeAContainerCallbacks.indexOf(callback)).not.toEqual(-1);
                }
                else {
                    expect(r).toEqual(false);
                    expect(distui._makeMeAContainerCallbacks).toEqual([]);
                }
            });
        };
        test("it should add the callback to the list and return true", function() { return "test"; });
        test("with a non-Function it should return false", null);
    });
    
    describe("calls _doReceiveEvent", function() {
        var test = function(itText, listener, event) {
            it(itText, function() {
                var _executeFunctionByName = spyOn(distui, "_executeFunctionByName");
                
                r = distui._doReceiveEvent(listener, event);
                
                expect(_executeFunctionByName).toHaveBeenCalledWith(listener.handler, event);
            });
        };
        test("it should call _executeFunctionByName() with the passed listener.handler and event", { handler: "testFunction" }, { type: "testEvent" });
    });
    
    describe("calls _onOverlayButtonClick", function() {
        var test = function(itText, onOverlayButtonClickDefined, onDistUiOverlayButtonClickDefined) {
            it(itText, function() {
                var buttonProps = { id: "testButton" }, callbackKey = "test1234567890", data = { test: "data" }, canClose = true, doCallback, response, onOverlayButtonClick, onDistUiOverlayButtonClick, makeCallback;
                response = { canClose: canClose, data: data, callbackKey: callbackKey, member: distui.id };
                makeCallback = spyOn(distui, "makeCallback");
                doCallback = function(buttonProps, callback) {
                    callback(data, true);
                };
                if (onOverlayButtonClickDefined) {
                    onOverlayButtonClick = jasmine.createSpy().andCallFake(doCallback);
                    distui.onOverlayButtonClick = onOverlayButtonClick;
                }
                if (onDistUiOverlayButtonClickDefined) {
                    onDistUiOverlayButtonClick = jasmine.createSpy().andCallFake(doCallback);
                    window.onDistUiOverlayButtonClick = onDistUiOverlayButtonClick;
                }
                
                r = distui._onOverlayButtonClick(buttonProps, callbackKey);
                
                if (onOverlayButtonClickDefined) {
                    expect(onOverlayButtonClick).toHaveBeenCalledWith(buttonProps, jasmine.any(Function));
                    expect(makeCallback).toHaveBeenCalledWith(callbackKey, response, true);
                    expect(r).toEqual(true);
                }
                else if (onDistUiOverlayButtonClickDefined) {
                    expect(onDistUiOverlayButtonClick).toHaveBeenCalledWith(buttonProps, jasmine.any(Function));
                    expect(makeCallback).toHaveBeenCalledWith(callbackKey, response, true);
                    expect(r).toEqual(true);
                }
                else {
                    expect(r).toEqual(false);
                }
                
                if (onDistUiOverlayButtonClickDefined) {
                    window.onDistUiOverlayButtonClick = null;
                }
            });
        };
        test("if distui.onOverlayButtonClick() is defined it should call it with the buttonProps and a callback function and return true, if the callback is invoked it should call makeCallback() with the passed response", true, true);
        test("if distui.onOverlayButtonClick() is defined it should call it with the buttonProps and a callback function and return true, if the callback is invoked it should call makeCallback() with the passed response", true, false);
        test("if distui.onOverlayButtonClick() is not defined but window.onDistUiOverlayButtonClick is, it should call it with the buttonProps and a callback function and return true, if the callback is invoked it should call makeCallback() with the passed response", false, true);
        test("if neither distui.onOverlayButtonClick() nor window.onDistUiOverlayButtonClick is defined, it return false", false, false);
    });
    
    describe("calls _bubbleExecuteFunctionByKey", function() {
        var test = function(itText, data) {
            it(itText, function() {
                var r, _executeFunctionByKey = spyOn(distui, "_executeFunctionByKey");
                
                r = distui._bubbleExecuteFunctionByKey(data);
                
                if (data) {
                    expect(_executeFunctionByKey).toHaveBeenCalledWith(data.key, data.params, data.deleteCallback);
                }
                else {
                    expect(r).toEqual(false);
                }
            });
        };
        test("it should call _executeFunctionByKey() with the passed data.key, data.params, data.deleteCallback and return the result", { key: "testKey", params: { test: "data" }, deleteCallback: true });
        test("with invalid data it should not call _executeFunctionByKey() and should return false", null);
    });
    
    describe("calls _executeFunctionByKey", function() {
        var test = function(itText, exists, deleteCallback) {
            it(itText, function() {
                var r, callback, key, fnParams = { test: "params" };
                if (exists) {
                    callback = jasmine.createSpy();
                    key = distui._addCallback(callback);
                }
                
                r = distui._executeFunctionByKey(key, fnParams, deleteCallback);
                
                if (exists) {
                    expect(callback).toHaveBeenCalledWith(fnParams);
                    if (deleteCallback) {
                        expect(distui._callbacks.hasOwnProperty(key)).toEqual(false);
                    }
                    else {
                        expect(distui._callbacks.hasOwnProperty(key)).toEqual(true);
                        expect(distui._callbacks[key].fn).toEqual(callback);
                    }
                }
                else {
                    expect(r).toEqual(false);
                }
            });
        };
        test("and the callback key exists, it should invoke the callback with the provided parameters and return true", true, false);
        test("and the callback key exists, it should invoke the callback with the provided parameters, delete it and return true", true, true);
        test("and the callback key doesn't exist, it should return false", false, true);
    });
    
    describe("calls _executeFunctionByName", function() {
        var test = function(itText, exists, deleteCallback) {
            it(itText, function() {
                var r, callback, fnParams = { test: "params" };
                if (exists) {
                    callback = jasmine.createSpy();
                    window.testObj = {};
                    window.testObj.testMethod = callback;
                }
                
                r = distui._executeFunctionByName("testObj.testMethod", fnParams, window);
                
                if (exists) {
                    expect(callback).toHaveBeenCalledWith(fnParams);
                }
                else {
                    expect(r).toEqual(false);
                }

                if (exists) {
                    window.testObj = null;
                }
            });
        };
        test("and the function exists, it should invoke the function with the result", true);
        test("and the function doesn't exist, it should return false", false);
    });
    
    describe("calls _forceMakeMeAContainer", function() {
        var test = function(itText) {
            it(itText, function() {
                var r;
                DistUi.prototype._forceMakeMeAContainerTest = "_forceMakeMeAContainerTest";
                // Either distui._forceMakeMeAContainerTest already exists at this point or _forceMakeMeAContainer() should set it
                
                r = distui._forceMakeMeAContainer(distui);
                
                expect(r).toEqual(true);
                expect(distui._forceMakeMeAContainerTest).toBeDefined();
                expect(distui._forceMakeMeAContainerTest).toEqual("_forceMakeMeAContainerTest");
                
                delete DistUi.prototype._forceMakeMeAContainerTest;
            });
        };
        test("it should copy every property of DistUi.prototype that isn't a property of the passed instance into that instance and return true");
    });
    
    describe("calls _getEnv", function() {
        var test, args, i;
        test = function(itText, url, env) {
            it(itText, function() {
                var r;
                distui._topUrl = url;
                
                r = distui._getEnv();
                
                expect(r).toEqual(env);
            });
        };
        args = [ 
                { url: "https://ui.d1.constantcontact.com", env: "d1" },
                { url: "https://ui.nblumbergvm3.d1.constantcontact.com", env: "d1" },
                { url: "https://ui.f1.constantcontact.com", env: "f1" },
                { url: "https://ui.f2.constantcontact.com", env: "f2" },
                { url: "https://ui.l1.constantcontact.com", env: "l1" },
                { url: "https://ui.s1.constantcontact.com", env: "s1" },
                { url: "https://ui.constantcontact.com", env: "" },
                { url: "https://ui.blah.constantcontact.com", env: "" }
        ];
        for (i = 0; i < args.length; i++) {
            test("when _topUrl == " + args[i].url + " it should return " + args[i].env, args[i].url, args[i].env);
        }
    });
    
    describe("calls _invokeApi", function() {
        var test = function(itText, fnName, params, isTop, isContainer, isDefined) {
            it(itText, function() {
                var r, _isTop, distuiError;
                _isContainer = spyOn(distui, "_isContainer").andCallFake(function() { return isContainer; });
                if (!isTop) {
                    makeNested();
                }
                distuiError = spyOn(distui, "error");
                invokeApi.andCallThrough();
                postMessage.andCallFake(function(clientCallType, data) { return fnName ? true : false; });
                if (isDefined) {
                    distui[ "_c_" + fnName ] = jasmine.createSpy("_c_" + fnName);
                }
                
                r = distui._invokeApi(fnName, params);
                
                if (!fnName || isTop && (!isContainer || !isDefined)) {
                    expect(distuiError).toHaveBeenCalledWith(jasmine.any(String));
                    expect(r).toEqual(false);
                }
                else if (isTop) {
                    expect(postMessage).not.toHaveBeenCalled();
                    if (params) {
                        expect(distui[ "_c_" + fnName ]).toHaveBeenCalledWith([ distui.id ], params);
                    }
                    else {
                        expect(distui[ "_c_" + fnName ]).toHaveBeenCalledWith([ distui.id ]);
                    }
                    expect(r).toEqual(true);
                }
                else {
                    expect(postMessage).toHaveBeenCalledWith(distui.POST_UP_TYPE, { fn: fnName, params: typeof(params) === "undefined" ? null : params, member: distui.id });
                    expect(r).toEqual(true);
                }

                if (isDefined) {
                    delete distui[ "_c_" + fnName ];
                }
            });
        };
        test("not in window.top with a function name and parameters, it should call _postmessage() with the expected parameters and return true", "testMethod", { test: "params" }, false, false, false);
        test("not in window.top with a function name and no parameters, it should call _postmessage() with no parameters and return true", "testMethod", undefined, false, false, false);
        test("not in window.top with no function name and parameters, it should log an error to the console and return false", undefined, { test: "params" }, false, false, false);
        test("in window.top with a function name and parameters, it should call that method internally with the expected parameters and return true", "testMethod", { test: "params" }, true, true, true);
        test("in window.top with a function name and no parameters, it should call that method internally with no parameters and return true", "testMethod", undefined, true, true, true);
        test("in window.top with a function name and parameters but it isn't a container, it should log an error to the console and return false", "testMethod", { test: "params" }, true, false, false);
        test("in window.top with a function name and parameters but it doesn't define the function, it should log an error to the console and return false", "testMethod", { test: "params" }, true, true, false);
    });
    
    describe("calls _isContainer", function() {
        var test = function(itText, isContainer) {
            it(itText, function() {
                var r;
                
                if (!isContainer) {
                    spyOn(distui, "_isContainer").andCallFake(function() { return false; }); 
                }
                
                r = distui._isContainer();
                
                expect(r).toEqual(isContainer);
            });
        };
        test("if container.js isn't loaded it should return false", false);
        test("if container.js is loaded, it should return true", true);
    });
    
    describe("calls _isInit", function() {
        var test = function(itText, id, isTop, parentUrl, topUrl, rootUrl, urlParameters) {
            it(itText, function() {
                var r, distuiWarn, distuiError, pass = id && (isTop || parentUrl) && rootUrl && urlParameters;
                distuiWarn = spyOn(distui, "warn");
                distuiError = spyOn(distui, "error");
                if (!id) {
                    distui.id = null;
                }
                if (!isTop) {
                    spyOn(distui, "_isTop").andCallFake(function() { return false; }); 
                }
                if (!parentUrl) {
                    distui._parentUrl = null;
                }
                if (!topUrl) {
                    distui._topUrl = null;
                }
                if (!rootUrl) {
                    distui._myRootUrl = null;
                }
                if (!urlParameters) {
                    distui._myUrlParameters = null;
                }
                
                r = distui._isInit();
                
                if (pass) {
                    if (!topUrl) {
                        expect(distuiWarn).toHaveBeenCalledWith(jasmine.any(String));
                    }
                    expect(distuiError).not.toHaveBeenCalled();
                }
                else {
                    expect(distuiError).toHaveBeenCalledWith(jasmine.any(String));
                }
                expect(r).toEqual(pass);
            });
        };
        test("if properly initialized it should return true", true, true, true, true, true, true);
        test("if properly initialized it should return true", true, false, true, true, true, true);
        test("if topUrl is not set it should log a warning and return true", true, true, true, false, true, true);
        test("if not properly initialized it should return false", false, true, true, true, true, true);
        test("if not properly initialized it should return false", true, false, false, true, true, true);
        test("if not properly initialized it should return false", true, true, true, true, false, true);
        test("if not properly initialized it should return false", true, true, true, true, true, false);
    });
    
    describe("calls _isTop", function() {
        var test = function(itText, isTop) {
            it(itText, function() {
                var r;
                
                if (!isTop) {
                    spyOn(distui, "_isTop").andCallFake(function() { return false; }); 
                }
                
                r = distui._isTop();
                
                expect(r).toEqual(isTop);
            });
        };
        test("if not run in window.top it should return false", false);
        test("if run in window.top it should return true", true);
    });
    
    describe("calls _logMethod", function() {
        it("it should call debug()", function() {
            var r, distuiDebug, fn = "testMethod", params = [ { test: "param" } ];
            distuiDebug = spyOn(distui, "debug").andCallThrough();
            
            r = distui._logMethod(fn, params);
            
            expect(distuiDebug).toHaveBeenCalledWith("member " + distui.id + " " + fn + "([object])");
            expect(r).toBeDefined();
        });
    });
    
    describe("calls _logApi", function() {
        it("it should call debug()", function() {
            var r, type = "testType", fn = "testMethod", params = { test: "param" };
            
            r = distui._logApi(type, fn, params);
            
            expect(r).toEqual("\"" + type + "\" " + (type === this.OVERLAY_DOWN_TYPE ? "" : fn + "([object])"));
        });
    });
    
    describe("calls objectToString", function() {
        it("it should delegate the call to DistUiUtils", function() {
            var utilsObjectToString, obj = { test: "obj" }, propPerLine = true, indent = "\t";
            utilsObjectToString = spyOn(distui._utils, "objectToString");
            
            distui.objectToString(obj, propPerLine, indent);
            
            expect(utilsObjectToString).toHaveBeenCalledWith(obj, propPerLine, indent);
        });
    });
    
    describe("calls _cloneObject", function() {
        it("it should call return a clone of the passed object", function() {
            var r, obj = {
                    obj: { test: "property" },
                    array: [ "test", { test : "property" } ],
                    num: 67
            };
            
            r = distui._cloneObject(obj);
            
            expect(r).toEqual(obj);
        });
    });
    
    describe("calls _logInvokeApi", function() {
        var test = function(itText, isTop) {
            it(itText, function() {
                var r, type = "testType", fn = "testMethod", params = { test: "param" }, distuiDebug, output;
                distuiDebug = spyOn(distui, "debug").andCallThrough();
                if (!isTop) {
                    spyOn(distui, "_isTop").andCallFake(function() { return false; }); 
                }
                
                r = distui._logInvokeApi(fn, params, type);
                
                if (isTop) {
                    expect(r).toEqual(false);
                    expect(distuiDebug).not.toHaveBeenCalled();
                }
                else {
                    output = "member " + distui.id + " sending message to container: " + "\"" + type + "\" " + (type === this.OVERLAY_DOWN_TYPE ? "" : fn + "([object])");
                    expect(distuiDebug).toHaveBeenCalledWith(output);
//                    expect(r).toEqual(output);
                    expect(r).toEqual(false); // with debugging disabled the result is false, TODO: there's some coverage lacking here with debugging enabled
                }
            });
        };
        test("not in window.top, it should call debug() with the expected parameters and return the result", false);
        test("in window.top, it should not call debug() and return false", true);
    });
    
    describe("calls _postMessage", function() {
        var test = function(itText, isValidData, isInit) {
            it(itText, function() {
                var r, jQueryPostMessage, _isInit, clientCallType = "testType", data = isValidData ? { test: "data" } : null;
                postMessage.andCallThrough();
                jQueryPostMessage = spyOn(jQuery, "distuiPostMessage");
                if (!isInit) {
                    _isInit = spyOn(distui, "_isInit").andCallFake(function() { return false; });
                }
                
                r = distui._postMessage(clientCallType, data);
                
                if (data && isInit) {
                    expect(jQueryPostMessage).toHaveBeenCalledWith(clientCallType, data, distui._parentUrl, window.parent);
                    expect(r).toEqual(true);
                }
                else {
                    expect(jQueryPostMessage).not.toHaveBeenCalled();
                    expect(r).toEqual(false);
                }
            });
        };
        test("with valid data when initialized it should call jQuery.postMessage() with the expected parameters and return true", true, true);
        test("with invalid data when initialized it should not call jQuery.postMessage() and should return false", false, true);
        test("with valid data when not initialized it should not call jQuery.postMessage() and should return false", true, false);
    });
    
    describe("calls _replaceUrlPlaceholders", function() {
        var args, test, i;
        args = [ 
                { url: "alskgudfvbdkbj{env}alkfjsdhaf{souid}alksdjfhasdlf", env: "d1", expected: "alskgudfvbdkbj" + "d1." + "alkfjsdhaf" + parameters.souid + "alksdjfhasdlf" },
                { url: "alskgudfvbdkbj{env}alkfjsdhaf{souid}alksdjfhasdlf", env: "f1", expected: "alskgudfvbdkbj" + "f1." + "alkfjsdhaf" + parameters.souid + "alksdjfhasdlf" },
                { url: "alskgudfvbdkbj{env}alkfjsdhaf{souid}alksdjfhasdlf", env: "f2", expected: "alskgudfvbdkbj" + "f2." + "alkfjsdhaf" + parameters.souid + "alksdjfhasdlf" },
                { url: "alskgudfvbdkbj{env}alkfjsdhaf{souid}alksdjfhasdlf", env: "l1", expected: "alskgudfvbdkbj" + "l1." + "alkfjsdhaf" + parameters.souid + "alksdjfhasdlf" },
                { url: "alskgudfvbdkbj{env}alkfjsdhaf{souid}alksdjfhasdlf", env: "s1", expected: "alskgudfvbdkbj" + "s1." + "alkfjsdhaf" + parameters.souid + "alksdjfhasdlf" },
                { url: "alskgudfvbdkbj{env}alkfjsdhaf{souid}alksdjfhasdlf", env: "", expected: "alskgudfvbdkbj" + "" + "alkfjsdhaf" + parameters.souid + "alksdjfhasdlf" }
        ];
        test = function(itText, url, env, expected) {
            it(itText, function() {
                var r, _getEnv;
                _getEnv = spyOn(distui, "_getEnv").andCallFake(function() { return env; });
                
                r = distui._replaceUrlPlaceholders(url);
                
                expect(r).toEqual(expected);
            });
        };
        for (i = 0; i < args.length; i++) {
            test("with url " + args[i].url + " in env " + args[i].env + " it should return " + args[i].expected, args[i].url, args[i].env, args[i].expected);
            
        }
    });
    
    describe("calls _receiveEvent", function() {
        var args, test, i;
        args = [ 
                { text: "the expected event", event: { type: "testType", token: 123456789 }, success: true, count: 3 },
                { text: "an unexpected event", event: { type: "testType2", token: 123456789 }, success: true, count: 1 },
                { text: "a null event", event: null, success: false, count: 0 },
                { text: "a typeless event", event: { type: "", token: 123456789 }, success: false, count: 0 }
        ];
        test = function(itText, event, success, count) {
            it(itText, function() {
                var r, i, listeners, _doReceiveEvent, _doReceiveEventCount = 0;
                _doReceiveEvent = spyOn(distui, "_doReceiveEvent").andCallFake(function() { _doReceiveEventCount++; });
                listeners = [
                             { type: "testType", handler: "testHandler" }, // match expected
                             { type: "", handler: "testHandler" }, // match all
                             { type: "testType", handler: "" }, // never match
                             { type: "testType1", handler: "testHandler1" },
                             { type: "testType", handler: "testHandler1" } // match expected
                ];
                for (i = 0; listeners && i < listeners.length; i++) {
                    distui.addEventListener(listeners[i]);
                }
                
                r = distui._receiveEvent(null, event);
                distui._receiveEvent(null, event);

                expect(_doReceiveEventCount).toEqual(count);
                expect(r).toEqual(success);
            });
        };
        for (i = 0; i < args.length; i++) {
            test("with " + args[i].text + " it should call _doReceiveEvent() " + args[i].count + " times", args[i].event, args[i].success, args[i].count);
        }
    });
    
    describe("calls _receiveParentEvent", function() {
        it("it should delegate the call to _receiveEvent", function() {
            var _receiveEvent, event = { test: "event" };
            _receiveEvent = spyOn(distui, "_receiveEvent");
            
            distui._receiveParentEvent(event);
            
            expect(_receiveEvent).toHaveBeenCalledWith(null, event);
        });
    });
    
    describe("calls _receiveParentMessage", function() {
        var args, test, i;
        args = [ 
                { text1: "an overlay button click call", text2: "call _onOverlayButtonClick() and return true", params: { isOverlayButtonClick: true, isCallByKey: false, isDeepCallback: false, memberExists: false } },
                { text1: "a deep overlay button click call", text2: "call _getMember() and member.doOverlayButtonClick() and return true", params: { isOverlayButtonClick: true, isCallByKey: false, isDeepCallback: true, memberExists: true } },
                { text1: "a deep overlay button click call to a non-existant member", text2: "call _getMember() and error() and return false", params: { isOverlayButtonClick: true, isCallByKey: false, isDeepCallback: true, memberExists: false } },
                { text1: "a function callback", text2: "call _executeFunctionByName() and return true", params: { isOverlayButtonClick: false, isCallByKey: false, isDeepCallback: false, memberExists: false } },
                { text1: "a deep function callback", text2: "call _getMember() and member.doCallback() and return true", params: { isOverlayButtonClick: false, isCallByKey: false, isDeepCallback: true, memberExists: true } },
                { text1: "a deep function callback to a non-existant member", text2: "call _getMember() and error() and return false", params: { isOverlayButtonClick: false, isCallByKey: false, isDeepCallback: true, memberExists: false } },
                { text1: "a key callback", text2: "call _executeFunctionByKey() and return true", params: { isOverlayButtonClick: false, isCallByKey: true, isDeepCallback: false, memberExists: false } },
                { text1: "a deep key callback", text2: "call _getMember() and member.doCallback() and return true", params: { isOverlayButtonClick: false, isCallByKey: true, isDeepCallback: true, memberExists: true } },
                { text1: "a deep key callback to a non-existant member", text2: "call _getMember() and error() and return false", params: { isOverlayButtonClick: false, isCallByKey: true, isDeepCallback: true, memberExists: false } }
        ];
        test = function(itText, params) {
            it(itText, function() {
                var r, msg, nestedMemberId, memberChain, callbackKey, testMember, _getMember, _executeFunctionByKey, _executeFunctionByName, _onOverlayButtonClick, error;
                msg = { data: {} };
                nestedMemberId = [ "testNestedMemberId" ];
                memberChain = ([ distui.id ]).concat(nestedMemberId);
                callbackKey = distui._generateCallbackKey();
                if (params.isOverlayButtonClick) {
                    msg.data.buttonProps = { button: "props" };
                    msg.data.callbackKey = callbackKey;
                }
                msg.type = params.isOverlayButtonClick ? distui.OVERLAY_DOWN_TYPE : distui.POST_DOWN_TYPE;
                msg.data.fn = params.isCallByKey ? callbackKey : "testFunctionName";
                if (params.isDeepCallback) {
                    msg.data.members = memberChain;
                }
                testMember = params.memberExists ? jasmine.createSpyObj("testMember", [ "doCallback", "doOverlayButtonClick" ]) : null;
                _getMember = spyOn(distui, "_getMember").andCallFake(function() { return testMember; });
                _executeFunctionByKey = spyOn(distui, "_executeFunctionByKey");
                _executeFunctionByName = spyOn(distui, "_executeFunctionByName");
                _onOverlayButtonClick = spyOn(distui, "_onOverlayButtonClick");
                error = spyOn(distui, "error");
                
                r = distui._receiveParentMessage(msg);

                if (params.isDeepCallback) {
                    expect(_getMember).toHaveBeenCalledWith(nestedMemberId[0]);
                    if (params.memberExists) {
                        if (params.isOverlayButtonClick) {
                            expect(testMember.doOverlayButtonClick).toHaveBeenCalledWith(msg.data.buttonProps, nestedMemberId, msg.data.callbackKey);
                            expect(testMember.doCallback).not.toHaveBeenCalled();
                        }
                        else {
                            expect(testMember.doCallback).toHaveBeenCalledWith(msg.data.fn, msg.data.parameters, nestedMemberId);
                            expect(testMember.doOverlayButtonClick).not.toHaveBeenCalled();
                        }
                        expect(r).toEqual(true);
                    }
                    else {
                        expect(error).toHaveBeenCalledWith(jasmine.any(String));
                        expect(r).toEqual(false);
                    }
                }
                else {
                    expect(_getMember).not.toHaveBeenCalled();
                    if (params.isOverlayButtonClick) {
                        expect(_onOverlayButtonClick).toHaveBeenCalledWith(msg.data.buttonProps, msg.data.callbackKey);
                        expect(_executeFunctionByKey).not.toHaveBeenCalled();
                        expect(_executeFunctionByName).not.toHaveBeenCalled();
                    }
                    else if (params.isCallByKey) {
                        expect(_executeFunctionByKey).toHaveBeenCalledWith(msg.data.fn, msg.data.parameters, true);
                        expect(_executeFunctionByName).not.toHaveBeenCalled();
                        expect(_onOverlayButtonClick).not.toHaveBeenCalled();
                    }
                    else {
                        expect(_executeFunctionByName).toHaveBeenCalledWith(msg.data.fn, msg.data.parameters);
                        expect(_executeFunctionByKey).not.toHaveBeenCalled();
                        expect(_onOverlayButtonClick).not.toHaveBeenCalled();
                    }
                    expect(r).toEqual(true);
                }
            });
        };
        for (i = 0; i < args.length; i++) {
            test("with " + args[i].text1 + " it should " + args[i].text2, args[i].params);
        }
    });
    
    describe("calls _removeCallback", function() {
        var test = function(itText, exists) {
            it(itText, function() {
                var r, callback, key;
                callback = jasmine.createSpy("testCallback").andCallFake(function() { return "testCallback"; });
                key = exists ? distui._addCallback(callback) : distui._generateCallbackKey();
                
                r = distui._removeCallback(key);
                
                expect(distui._callbacks.hasOwnProperty(key)).toEqual(false);
                distui.makeCallback(key, null, false);
                expect(r).toEqual(exists);
            });
        };
        test("and the callback exists, it should remove it and return true", true);
        test("and the callback doesn't exist, it should return false", false);
    });
    
    describe("calls doApiMethod", function() {
        it("it should delegate the call to _invokeApi and log a warning", function() {
            var utilsWarn, methodName, parameters;
            methodName = "testMethod";
            parameters = "testMessage";
            utilsWarn = spyOn(distui, "warn");
            
            distui.doApiMethod(methodName, parameters);
            
            expect(utilsWarn).toHaveBeenCalledWith(jasmine.any(String));
            expect(invokeApi).toHaveBeenCalledWith(methodName, parameters);
        });
    });
    
    describe("calls addEventListener", addEventListenerSubscribe.bind(this, "addEventListener"));
    
    describe("calls assert", function() {
        it("it should delegate the call to DistUiUtils", function() {
            var utilsAssert, test, message;
            test = false;
            message = "testMessage";
            utilsAssert = spyOn(distui._utils, "assert");
            
            distui.assert(test, message);
            
            expect(utilsAssert).toHaveBeenCalledWith(test, message);
        });
    });
    
    describe("calls changeOverlayButtons", function() {
        var params;
        params = { 
                buttons: [ 
                           { 
                               id: "testButtonId",
                               disabled: true,
                               text: "testButtonLabel",
                               className: "testButtonClassName",
                               addClass: "testButtonAddClassName",
                               removeClass: "testButtonRemoveClassName",
                               css: {
                                   color: "red"
                               }
                           }
                           ]
        };
        
        it("it should tell the DistUi instance in window.top to change the buttons", function() {
            distui.changeOverlayButtons(params);
            
            expect(invokeApi).toHaveBeenCalledWith("changeOverlayButtons", params);
        });
    });

    describe("calls clear", function(){
        it("it should delegate the call to DistUiUtils", function() {
            distui.clear();
            
            expect(utilsConsole).toHaveBeenCalledWith("clear", undefined);
        });
    });
    
    describe("calls closeOverlay", function(){
        it("it should tell the DistUi instance in window.top to close the overlay", function() {
            var overlayId, callbackData, destroy;
            overlayId = "testOverlayId";
            callbackData = { test: "test" };
            destroy = true;
            
            distui.closeOverlay(overlayId, callbackData, destroy);
            
            expect(invokeApi).toHaveBeenCalledWith("closeOverlay", { id: overlayId, data: callbackData, destroy: destroy });
        });
    });
    
    describe("calls closeVerifyEmailAddressWidget", function(){
        it("it should tell the DistUi instance in window.top to close the verify email address widget overlay and warn that the method has been deprecated", function() {
            distui.closeVerifyEmailAddressWidget();
            
            expect(utilsConsole).toHaveBeenCalledWith("warn", jasmine.any(String));
            expect(invokeApi).toHaveBeenCalledWith("closeVerifyEmailAddressWidget");
        });
    });
    
    describe("calls console", function() {
        it("it should delegate the call to DistUiUtils", function() {
            var type, message;
            type = "testType";
            message = "testMessage";

            distui.console(type, message);
            
            expect(utilsConsole).toHaveBeenCalledWith(type, message);
        });
    });
    
    describe("calls debug", function() {
        var message, level;
        message = "testMessage";
        level = 6;
        describe("with debug disabled", function() {
            it("it should do nothing", function() {
                distui.debug(message, level);
                distui.debug(message);
                
                expect(utilsDebug).wasNotCalled();
            });
        });
        describe("with debug enabled", function() {
            it("with an explicit level it should delegate the call to DistUiUtils", function() {
                distui._debugEnabled = true;
                
                distui.debug(message, level);
                
                expect(utilsDebug).toHaveBeenCalledWith(message, level);
            });
            it("without an explicit level it should delegate the call to DistUiUtils and default to DEBUG_LEVEL_MEMBER", function() {
                distui._debugEnabled = true;
                
                distui.debug(message);
                
                expect(utilsDebug).toHaveBeenCalledWith(message, distui._utils.DEBUG_LEVEL_MEMBER);
            });
        });
    });
    
    describe("calls dispatchEvent", dispatchEventPublish.bind(this, "dispatchEvent"));
    
    describe("calls enableTracking", function() {
        it("it should set _trackingEnabled to true", function() {
            distui.enableTracking(true);
            
            expect(distui._trackingEnabled).toEqual(true);
        });
        it("it should set _trackingEnabled to false", function() {
            distui.enableTracking(false);
            
            expect(distui._trackingEnabled).toEqual(false);
        });
    });
    
    describe("calls error", function() {
        it("it should delegate the call to DistUiUtils", function() {
            var message;
            message = "testMessage";

            distui.error(message);
            
            expect(utilsConsole).toHaveBeenCalledWith("error", message);
        });
    });
    
    describe("calls getMyLocation", setUpCallbackAndInvokeApi.bind(this, "getMyLocation"));
    
    describe("calls getMyOverlay", setUpCallbackAndInvokeApi.bind(this, "getMyOverlay"));
    
    describe("calls getParentDimensions", setUpCallbackAndInvokeApi.bind(this, "getParentDimensions"));
    
    describe("calls getTopRootUrl", function() {
        it("it should return the host portion of _topUrl", function() {
            var r;
            distui._topUrl = "https://ui.l1.constantcontact.com:8445/ui/rnavmap/em/site/home?DEBUG=true#testHash";
            
            r = distui.getTopRootUrl();
            
            expect(r).toEqual("https://ui.l1.constantcontact.com:8445");
        });
    });
    
    describe("calls goTo", function() {
        var urlParameters = "test=test", hash = "testHash";
        var test = function(itText, isValid, urlParameters, hash, expected) {
            it(itText, function() {
                var locationName, _setTopLocation;
                locationName = isValid ? "testTopLocation" : "invalidLocationName";
                _setTopLocation = spyOn(distui, "_setTopLocation");
                
                distui.goTo(locationName, urlParameters, hash);
                
                if (isValid) {
                    expect(_setTopLocation).toHaveBeenCalledWith(expected);
                }
                else {
                    expect(_setTopLocation).not.toHaveBeenCalledWith();
                    expect(utilsConsole).toHaveBeenCalledWith("error", jasmine.any(String));
                }
            });
        };
        test("it should attempt to change window.top.location to the test location, replacing placeholders", true, undefined, undefined, "http://top.test." + env + "location.com/" + parameters.souid);
        test("it should attempt to change window.top.location to the test location, replacing placeholders and appending URL parameters", true, urlParameters, undefined, "http://top.test." + env + "location.com/" + parameters.souid + "?" + urlParameters);
        test("it should attempt to change window.top.location to the test location, replacing placeholders and appending hash", true, undefined, hash, "http://top.test." + env + "location.com/" + parameters.souid + "#" + hash);
        test("it should attempt to change window.top.location to the test location, replacing placeholders and appending URL parameters and hash", true, urlParameters, hash, "http://top.test." + env + "location.com/" + parameters.souid  + "?" + urlParameters + "#" + hash);
        test("unless the location name is invalid, in which case it should log an error", false);
    });
    
    describe("calls gotoSiteHome", function(){
        it("it should attempt to change window.top.location to the CTCT Home page, replace placeholders and warn that the method has been deprecated", function() {
            var setTopLocation = spyOn(distui, "_setTopLocation");

            distui.gotoSiteHome();
            
            expect(setTopLocation).toHaveBeenCalledWith("http://top.test." + env + "location.com/" + parameters.souid + "/site/home");
            expect(utilsConsole).toHaveBeenCalledWith("warn", jasmine.any(String));
            expect(invokeApi).wasNotCalled();
        });
    });
    
    describe("calls info", function() {
        it("it should delegate the call to DistUiUtils", function() {
            var message;
            message = "testMessage";

            distui.info(message);
            
            expect(utilsConsole).toHaveBeenCalledWith("info", message);
        });
    });
    
    describe("calls isEnabled", setUpCallbackAndInvokeApi.bind(this, "isEnabled"));
    
    describe("calls keepAlive", function() {
        it("it should tell the DistUi instance in window.top to keep the session alive", function() {
            distui.keepAlive();
            
            expect(invokeApi).toHaveBeenCalledWith("keepAlive");
        });
    });
    
    describe("calls log", function() {
        it("it should delegate the call to DistUiUtils", function() {
            var message;
            message = "testMessage";

            distui.log(message);
            
            expect(utilsConsole).toHaveBeenCalledWith("log", message);
        });
    });

    describe("calls makeCallback", function() {
        var test = function(itText, isTop, exists, isCallOnlyOnce, deleteCallback) {
            it(itText, function() {
                var r, _isTop, callback, params, key, canContinue = false;
                _isTop = spyOn(distui, "_isTop").andCallFake(function() { return isTop; });
                callback = jasmine.createSpy("testCallback").andCallFake(function() { return "testCallback"; });
                key = exists ? distui._addCallback(callback, isCallOnlyOnce) : distui._generateCallbackKey();
                
                runs(function() {
                    r = distui.makeCallback(key, params, deleteCallback);
                    
                    setTimeout(function() { canContinue = true; }, 5); 
                });
                
                waitsFor(function() {
                    return canContinue;
                }, "test setTimeout() never set flag", 10);
                
                runs(function() {
                    if (exists) {
                        expect(callback).toHaveBeenCalledWith(params);
                        expect(distui._callbacks.hasOwnProperty(key)).toEqual(!(isCallOnlyOnce || deleteCallback));
                    }
                    else {
                        expect(callback).not.toHaveBeenCalled();
                        expect(distui._callbacks.hasOwnProperty(key)).toEqual(false);
                    }
                    expect(r).toEqual(exists || !isTop);
                });
            });
        };
        test("and the callback exists locally and isn't call-only-once, it should call it and return true", true, true, false, false);
        test("and the callback exists locally and is call-only-once, it should delete it, it should call it and return true", true, true, true, false);
        test("and the callback exists locally and isn't call-only-once but we specify deleteCallback == true, it should call it, delete it, and return true", true, true, false, true);
        test("and the callback doesn't exist locally and it's not window.top, it should pass it up a level and return true", false, false, false, false, true);
        test("and the callback doesn't exist locally and it is window.top, it should return false", true, false, false, true);
    });
    
    describe("calls makeMeAContainer", function() {
        it("it should use DistUiUtils.loadScripts() to load in jQuery-ui (if window.top and not already present), ux.overlay.js (if window.top and not already present), and container.js", function() {
            var callbackInvoked = false, _isContainer, isContainer = false;
            utilsLoadScripts.andCallThrough();
            utilsLoadScript.andCallFake(function(scriptArgs, callback, debugLevel) {
                isContainer = true;
                if (callback) {
                    callback(null, true);
                }
            });
            _isContainer = spyOn(distui, "_isContainer").andCallFake(function() { return isContainer; });

            distui.makeMeAContainer(function() {
                callbackInvoked = true;
            });
            
            // The jQuery scripts are perforce loaded in SpecRunner.html so they won't be loaded here
            expect(utilsLoadScripts).toHaveBeenCalledWith([
                                                           { id: "ux.overlay", src: "https://ui." + env + "constantcontact.com/core/js/jquery/1.5.2/plugins/jquery.ux.overlay.js?version=" + distui._myCacheBuster, test: jasmine.any(Function) },
                                                           { id: "distui_container", src: distui._containerScriptUrl, test: jasmine.any(Function) }
                                                           ], jasmine.any(Function), jasmine.any(Number));
            expect(callbackInvoked).toEqual(true);
        });
    });
    
    describe("calls moveTo", function() {
        it("it should tell the DistUi instance in window.parent to move this window's iframe", function() {
            var x = 10, y = 20;
            
            distui.moveTo(x, y);
            
            expect(invokeApi).toHaveBeenCalledWith("resizeTo", { x: x, y: y });
        });
    });
    
    describe("calls ping", function() {
        var test = function(itText, isFunctionReference) {
            it(itText, function() {
                var _addCallback, callback, parameters;
                _addCallback = spyOn(distui, "_addCallback").andCallFake(function() { return "testCallbackKey"; });
                callback = !isFunctionReference ? "testMethod" : function(data) { return data; };
                parameters = { test: "params" };
                
                distui.ping(callback, parameters);
                
                if (isFunctionReference) {
                    expect(_addCallback).toHaveBeenCalledWith(callback, true);
                    expect(invokeApi).toHaveBeenCalledWith("ping", { callback: "testCallbackKey", parameters: parameters });
                }
                else {
                    expect(_addCallback).not.toHaveBeenCalled();
                    expect(invokeApi).toHaveBeenCalledWith("ping", { callback: "testMethod", parameters: parameters });
                }
            });
        };
        test("it should call _invokeApi()", false);
        test("it should set up callback and call _invokeApi()", true); 
    });
    
    describe("calls processing", function() {
        it("it should set the busy cursor/status bar message and tell the DistUi instance in window.parent to do the same", function() {
            var message = "testMessage";
            
            distui.processing(message);
            
            var body = document.getElementsByTagName("body")[0];
            expect(body).not.toEqual(null);
            expect(body.style).not.toEqual(null);
            expect(body.style.cursor).toEqual(distui.CURSOR_PROCESSING);
            expect(invokeApi).toHaveBeenCalledWith("processing", { msg: message });
        });
    });
    
    describe("calls publish", dispatchEventPublish.bind(this, "publish"));
    
    describe("calls ready", function() {
        var test = function(itText, useMessage, useCallback) {
            it(itText, function() {
                var message, callback;
                message = useMessage ? "testMessage" : "Done.";
                callback = useCallback ? "testMessage" : undefined;
                
                if (useMessage) {
                    if (useCallback) {
                        distui.ready(message, callback);
                    }
                    else {
                        distui.ready(message);
                    }
                }
                else {
                    distui.ready();
                }
                
                var body = document.getElementsByTagName("body")[0];
                expect(body).not.toEqual(null);
                expect(body.style).not.toEqual(null);
                expect(body.style.cursor).toEqual(distui.CURSOR_DEFAULT);
                expect(invokeApi).toHaveBeenCalledWith("ready", { msg: message, callbackKey: jasmine.any(String), metrics: metrics });
            });
        };
        test("with no message or callback, it should set the normal cursor/status bar message and call _invokeApi() with the default message, a callback key (to handle roster update), and any recorded metrics", false, false);
        test("with a message and no callback, it should set the normal cursor/status bar message and call _invokeApi() with the message and a callback key (to handle roster update), and any recorded metrics", true, false);
        test("with a message and a callback, it should set the normal cursor/status bar message and call _invokeApi() with the message and a callback key (to handle roster update and invoke the callback), and any recorded metrics", true, true);
    });
    
    describe("calls recordActivity", function() {
        it("it should tell the DistUi instance in window.top to record the activity code", function() {
            var activityCode = 12345;
            
            distui.recordActivity(activityCode);
            
            expect(invokeApi).toHaveBeenCalledWith("recordActivity", activityCode);
        });
    });
    
    describe("calls reload", function() {
        it("it should tell the DistUi instance in window.parent to reload the content in this window's iframe and add the optional extra URL parameters", function() {
            var urlParameters = "&test=test";
            
            distui.reload(urlParameters);
            
            expect(invokeApi).toHaveBeenCalledWith("reload", urlParameters);
        });
    });
    
    describe("calls removeEventListener", function() {
        var type, eventProperties, descendantsOnly, attachListeners, callbackInvoked;
        type = "testEventType";
        eventProperties = { test: "test" };
        descendantsOnly = false;
        callbackInvoked = false;
        attachListeners = function() {
            // A spy doesn't seem to work here because window.testMethod needs to actually exist
            window.testMethod = (function(event) {
                expect(event).not.toEqual(null);
                expect(event.type).toEqual(type);
                expect(event.test).toEqual("test");
                callbackInvoked = true;
            }).bind(this);
            distui.addEventListener({ type: type, handler: "testMethod" });
        };
        it("it should remove its own listeners for the event and then tell the DistUi instance in window.parent to do the same. Subsequent dispatchEvent() calls should not call the removed handler", function() {
            attachListeners();
            
            distui.removeEventListener(type);
            distui.dispatchEvent(type, eventProperties);
            
            expect(invokeApi).toHaveBeenCalledWith("removeEventListener", type);
            expect(callbackInvoked).toEqual(false);
        });
    });
    
    describe("calls removeMemberFromContainer", function() {
        it("it should tell the DistUi instance in window.parent to stop listening to (and potentially remove) this iframe", function() {
            var params = { removeFromDom: true };
            
            distui.removeMemberFromContainer(params);
            
            expect(invokeApi).toHaveBeenCalledWith("removeMemberFromContainer", params);
        });
    });
    
    describe("calls resizeHeight", function() {
        it("it should tell the DistUi instance in window.parent to resize this window's iframe", function() {
            var h = 400;
            
            distui.resizeHeight(h);
            
            expect(invokeApi).toHaveBeenCalledWith("resizeTo", { height: h });
        });
    });
    
    describe("calls resizeTo", function() {
        it("it should tell the DistUi instance in window.parent to resize this window's iframe", function() {
            var params = { x: 10, y: 20, height: 400, width: "100%" };
            
            distui.resizeTo(params);
            
            expect(invokeApi).toHaveBeenCalledWith("resizeTo", params);
        });
    });
    
    describe("calls resizeWidth", function() {
        it("it should tell the DistUi instance in window.parent to resize this window's iframe", function() {
            var w = 400;
            
            distui.resizeWidth(w);
            
            expect(invokeApi).toHaveBeenCalledWith("resizeTo", { width: w });
        });
    });
    
    describe("calls setAddressHash", function() {
        it("it should tell the DistUi instance in window.top to set the address hash", function() {
            var hash = "testHash";
            
            distui.setAddressHash(hash);
            
            expect(invokeApi).toHaveBeenCalledWith("setAddressHash", hash);
        });
    });
    
    describe("calls setFrameHeight", function() {
        var id = parameters.id;
        it("with explicit height it should tell the DistUi instance in window.parent to resize the iframe/overlay for the given id", function() {
            var h = 400;
            
            distui.setFrameHeight(id, h);
            
            expect(invokeApi).toHaveBeenCalledWith("setFrameHeight", { id: id, height: h });
        });
        it("without explicit height it should tell the DistUi instance in window.parent to resize iframe/overlay for the given id to window.document.body.scrollHeight", function() {
            distui.setFrameHeight(id);
            
            expect(invokeApi).toHaveBeenCalledWith("setFrameHeight", { id: id, height: window.document.body.scrollHeight });
        });
    });
    
    describe("calls setMemberFrameHeight", function() {
        it("it should tell the DistUi instance in window.parent to resize this window's iframe and warn that the method has been deprecated", function() {
            var h = 400;
            
            distui.setMemberFrameHeight(h);
            
            expect(utilsConsole).toHaveBeenCalledWith("warn", jasmine.any(String));
            expect(invokeApi).toHaveBeenCalledWith("setMemberFrameHeight", h);
        });
    });
    
    describe("calls setMemberFrameLocation", function() {
        it("it should tell the DistUi instance in window.parent to set this window's iframe.src", function() {
            var src = "testSrc";
            
            distui.setMemberFrameLocation(src);
            
            expect(invokeApi).toHaveBeenCalledWith("setMemberFrameLocation", src);
        });
    });
    
    describe("calls setMemberScrollPosition", function() {
        it("it should tell the DistUi instance in window.parent to scroll its window to the given postition", function() {
            var position = 10, animate = true;
            
            distui.setMemberScrollPosition(position, animate);
            
            expect(utilsConsole).toHaveBeenCalledWith("warn", jasmine.any(String));
            expect(invokeApi).toHaveBeenCalledWith("setContainerScrollPosition", { position: position, animate: animate });
        });
    });
    
    describe("calls setContainerScrollPosition", function() {
        it("it should tell the DistUi instance in window.parent to scroll its window to the given postition", function() {
            var position = 10, animate = true;
            
            distui.setContainerScrollPosition(position, animate);
            
            expect(invokeApi).toHaveBeenCalledWith("setContainerScrollPosition", { position: position, animate: animate });
        });
    });
    
    describe("calls setPageTitle", function() {
        it("it should tell the DistUi instance in window.top to set it's window's document.title", function() {
            var title = "testTitle";
            
            distui.setPageTitle(title);
            
            expect(invokeApi).toHaveBeenCalledWith("setPageTitle", title);
        });
    });
    
    describe("calls setView", function() {
        it("it should tell the DistUi instance in window.top to set it's window's document.title", function() {
            var view, urlParameters, removeExistingUrlParameters, hash, params; 
            view = "testView"; 
            urlParameters = "&test=test"; 
            removeExistingUrlParameters = true; 
            hash = "testHash"; 
            params = { view: "testView", urlParameters: "&test=test", removeExistingUrlParameters: true, hash: "testHash" };
            
            distui.setView(view, urlParameters, removeExistingUrlParameters, hash);
            
            expect(invokeApi).toHaveBeenCalledWith("setView", params);
        });
    });
    
    describe("calls showCallSupport", function() {
        it("it should tell the DistUi instance in window.top to open a new window to '/support/live.jsp' and focus on the new window", function() {
            
            distui.showCallSupport();
            
            expect(invokeApi).toHaveBeenCalledWith("showCallSupport");
        });
    });
    
    describe("calls showComponentOverlay", function() {
        var test = function(itText, withParameters, isFunctionReference) {
            it(itText, function() {
                var params, defaults, _addCallback, callback;
                _addCallback = spyOn(distui, "_addCallback").andCallFake(function(c) { return "testCallbackKey"; });
                callback = function(data) { return data; };
                if (withParameters) {
                    params = {
                        id: "testOverlayId",
                        fullPage: false,
                        url: "testUrl",
                        width: 300,
                        frameHeight: 400,
                        onCloseCallback: !isFunctionReference ? "testMethod" : callback,
                        refresh: false, 
                        test: "extraParam"
                    };
                }
                else {
                    params = { test: "extraParam" }; 
                    defaults = {
                        id: "distui-overlay",
                        fullPage: true,
                        url: "",
                        width: 0,
                        frameHeight: 0,
                        onCloseCallback: null,
                        refresh: true, 
                        test: "extraParam"
                    };
                }
                
                distui.showComponentOverlay(params);
                
                expect(utilsConsole).toHaveBeenCalledWith("warn", jasmine.any(String));
                if (withParameters && isFunctionReference) {
                    expect(_addCallback).toHaveBeenCalledWith(callback, true);
                }
                else {
                    expect(_addCallback).not.toHaveBeenCalled();
                }
                expect(invokeApi).toHaveBeenCalledWith("showComponentOverlay", withParameters ? params : defaults);
            });
        };
        test("without setting the necessary parameters, it should tell the DistUi instance in window.top to open an overlay with the passed parameters plus the defaults and warn that the method is deprecated", false, false);
        test("and sets the necessary parameters, it should tell the DistUi instance in window.top to open an overlay with just the passed parameters and warn that the method is deprecated", true, false);
        test("and sets the necessary parameters (including a function reference), it should set up the callback, tell the DistUi instance in window.top to open an overlay with just the passed parameters and warn that the method is deprecated", true, true);
    });
    
    describe("calls showConfirmation", function() {
        var test = function(itText, useFunctionReferences) {
            it(itText, function() {
                var params, okCallback, cancelCallback, _addCallback, i = 1; 
                params = {
                    id: "testOverlayId",
                    fullPage: false,
                    url: "testUrl",
                    width: 300,
                    frameHeight: 400,
                    onCloseCallback: true,
                    refresh: false,
                    buttons: [
                              { 
                                  text: "OK", 
                                  click: "okCallback",
                                  callBack: "okCallback"
                              },
                              {
                                  text: "Cancel", 
                                  click: "cancelCallback",
                                  callBack: "cancelCallback"
                              }
                              ]
                };
                _addCallback = spyOn(distui, "_addCallback").andCallFake(function(fn) { return "testCallbackKey" + i++; });
                if (useFunctionReferences) {
                    okCallback = function() { return true; };
                    cancelCallback = function() { return false; };
                    params.buttons[0].click = okCallback;
                    params.buttons[1].click = cancelCallback;
                    params.buttons[0].callBack = okCallback;
                    params.buttons[1].callBack = cancelCallback;
                }
                
                distui.showConfirmation(params);
                
                expect(utilsConsole).toHaveBeenCalledWith("warn", jasmine.any(String));
                if (useFunctionReferences) {
                    expect(_addCallback).toHaveBeenCalledWith(okCallback, true);
                    expect(_addCallback).toHaveBeenCalledWith(cancelCallback, true);
                    params.buttons[0].click = "testCallbackKey1";
                    params.buttons[0].callBack = "testCallbackKey1";
                    params.buttons[1].click = "testCallbackKey2";
                    params.buttons[1].callBack = "testCallbackKey2";
                }
                else {
                    expect(_addCallback).not.toHaveBeenCalled();
                }
                expect(invokeApi).toHaveBeenCalledWith("showConfirmation", params);
            });
        };
        test("it should tell the DistUi instance in window.top to open an overlay with the passed parameters and warn that the method is deprecated", false);
        test("with function references, it should set up the callbacks, tell the DistUi instance in window.top to open an overlay with the passed parameters and warn that the method is deprecated", true);
    });
    
    describe("calls showContentOverlay", function() {
        var test = function(itText, isFunctionReference) {
            it(itText, function() {
                var id, width, content, title, btnPrimaryText, btnSecondaryText, onCloseCallback, refresh, destroyOnClose, params, _addCallback, i = 1;
                _addCallback = spyOn(distui, "_addCallback").andCallFake(function(fn) { return "testCallbackKey" + i++; });
                id = "testOverlayId";
                width = 300;
                content = "testContent";
                title = "testTitle";
                btnPrimaryText = "testPrimaryButtonText";
                btnSecondaryText = "testSecondaryButtonText";
                onCloseCallback = isFunctionReference ? function() { return true; } : "testMethod";
                refresh = true;
                destroyOnClose = true;
                params = { id: id, width: width, content: content, title: title, btnPrimaryText: btnPrimaryText, btnSecondaryText: btnSecondaryText, onCloseCallback: onCloseCallback, refresh: refresh, destroyOnClose: destroyOnClose };
                
                distui.showContentOverlay(id, width, content, title, btnPrimaryText, btnSecondaryText, onCloseCallback, refresh, destroyOnClose);
                
                expect(utilsConsole).toHaveBeenCalledWith("warn", jasmine.any(String));
                if (isFunctionReference) {
                    expect(_addCallback).toHaveBeenCalledWith(onCloseCallback, true);
                    params.onCloseCallback = "testCallbackKey1";
                }
                else {
                    expect(_addCallback).not.toHaveBeenCalled();
                }
                expect(invokeApi).toHaveBeenCalledWith("showContentOverlay", params);
            });
        };
        test("it should tell the DistUi instance in window.top to open an overlay with the passed parameters and warn that the method is deprecated", false);
        test("with function references, it should set up the callbacks, tell the DistUi instance in window.top to open an overlay with the passed parameters and warn that the method is deprecated", true);
    });
    
    describe("calls showDistUiMemberInOverlay", function() {
        var test = function(itText, isFunctionReference) {
            it(itText, function() {
                var rosterMemberName, id, urlParameters, initialHeight, initialWidth, onCloseCallback, refresh, title, usage, allowContentScroll, fullScreen, destroyOnClose, params, _addCallback, i = 1;
                _addCallback = spyOn(distui, "_addCallback").andCallFake(function(fn) { return "testCallbackKey" + i++; });
                rosterMemberName = "testRosterMemberName";
                id = "testOverlayId";
                urlParameters = "&test=test";
                initialHeight = 300;
                initialWidth = 400;
                onCloseCallback = isFunctionReference ? function() { return true; } : "testMethod";
                refresh = true;
                title = "testTitle";
                usage = "testUsage";
                allowContentScroll = true;
                isFullScreen = false;
                destroyOnClose = true;
                params = { rosterMemberName: rosterMemberName, id: id, urlParameters: urlParameters, initialHeight: initialHeight, initialWidth: initialWidth, title: title, usage: usage, allowContentScroll: allowContentScroll, onCloseCallback: onCloseCallback, fullScreen: fullScreen, refresh: refresh, destroyOnClose: destroyOnClose };
                
                distui.showDistUiMemberInOverlay(rosterMemberName, id, urlParameters, initialHeight, initialWidth, onCloseCallback, refresh, title, usage, allowContentScroll, fullScreen, destroyOnClose);
                
                expect(utilsConsole).toHaveBeenCalledWith("warn", jasmine.any(String));
                if (isFunctionReference) {
                    expect(_addCallback).toHaveBeenCalledWith(onCloseCallback, true);
                    params.onCloseCallback = "testCallbackKey1";
                }
                else {
                    expect(_addCallback).not.toHaveBeenCalled();
                }
                expect(invokeApi).toHaveBeenCalledWith("showDistUiMemberInOverlay", params);
            });
        };
        test("it should tell the DistUi instance in window.top to open an overlay with the passed parameters and warn that the method is deprecated", false);
        test("with function references, it should set up the callbacks, tell the DistUi instance in window.top to open an overlay with the passed parameters and warn that the method is deprecated", true);
    });
    
    describe("calls showHelpIndex", function() {
        it("it should tell the DistUi instance in window.top to open a new window to '/support/index.jsp' and focus on the new window", function() {
            
            distui.showHelpIndex();
            
            expect(invokeApi).toHaveBeenCalledWith("showHelpIndex");
        });
    });
    
    describe("calls showMessageOverlay", function() {
        var test = function(itText, widthIsSpecified, isFunctionReference) {
            it(itText, function() {
                var type, id, width, content, title, btnPrimaryText, btnSecondaryText, onCloseCallback, refresh, destroyOnClose, params, _addCallback, i = 1;
                _addCallback = spyOn(distui, "_addCallback").andCallFake(function(fn) { return "testCallbackKey" + i++; });
                type = "testType";
                id = "testOverlayId";
                if (widthIsSpecified) {
                    width = 400;
                }
                content = "testContent";
                title = "testTitle";
                btnPrimaryText = "testPrimaryButtonText";
                btnSecondaryText = "testSecondaryButtonText";
                onCloseCallback = isFunctionReference ? function() { return true; } : "testMethod";
                refresh = true;
                destroyOnClose = true;
                params = { usage: type, id: id, width: width, content: content, title: title, btnPrimaryText: btnPrimaryText, btnSecondaryText: btnSecondaryText, onCloseCallback: onCloseCallback, refresh: refresh, destroyOnClose: destroyOnClose };
                
                distui.showMessageOverlay(type, id, width, content, title, btnPrimaryText, btnSecondaryText, onCloseCallback, refresh, destroyOnClose);
                
                expect(utilsConsole).toHaveBeenCalledWith("warn", jasmine.any(String));
                if (isFunctionReference) {
                    expect(_addCallback).toHaveBeenCalledWith(onCloseCallback, true);
                    params.onCloseCallback = "testCallbackKey1";
                }
                else {
                    expect(_addCallback).not.toHaveBeenCalled();
                }
                if (!widthIsSpecified) {
                    params.width = 300;
                }
                expect(invokeApi).toHaveBeenCalledWith("showMessageOverlay", params);
            });
        };
        test("while specifying width, it should tell the DistUi instance in window.top to open an overlay with the passed parameters and warn that the method is deprecated", true, false);
        test("while specifying width and a function reference, it should set up the callback, tell the DistUi instance in window.top to open an overlay with the passed parameters and warn that the method is deprecated", true, true);
        test("while not specifying width it should tell the DistUi instance in window.top to open an overlay with the passed parameters and width == 300 and warn that the method is deprecated", false, false);
        test("while using a function reference and not specifying width, it should set up the callback, tell the DistUi instance in window.top to open an overlay with the passed parameters and width == 300 and warn that the method is deprecated", false, true);
    });
    
    describe("calls showNotificationOverlay", function() {
        var test = function(itText, withParameters, isFunctionReference) {
            it(itText, function() {
                var params, defaults, _addCallback, callback;
                _addCallback = spyOn(distui, "_addCallback").andCallFake(function(c) { return "testCallbackKey"; });
                callback = function(data) { return data; };
                if (withParameters) {
                    params = {
                            type: "testType",
                            id: "testOverlayId",
                            width: 400,
                            content: "testContent",
                            btnPrimaryText: "testPrimaryBtnText",
                            onCloseCallback: isFunctionReference ? callback : "testMethod",
                            refresh: false, 
                            test: "extraParam"
                        };
                }
                else {
                    params = { test: "extraParam" }; 
                    defaults = {
                            type: "none",
                            id: "",
                            width: 300,
                            content: "",
                            btnPrimaryText: "",
                            onCloseCallback: null,
                            refresh: true, 
                            test: "extraParam"
                        };
                }
                
                distui.showNotificationOverlay(params);
                
                expect(utilsConsole).toHaveBeenCalledWith("warn", jasmine.any(String));
                if (withParameters && isFunctionReference) {
                    expect(_addCallback).toHaveBeenCalledWith(callback, true);
                }
                else {
                    expect(_addCallback).not.toHaveBeenCalled();
                }
                expect(invokeApi).toHaveBeenCalledWith("showNotificationOverlay", withParameters ? params : defaults);
            });
        };
        test("without setting the necessary parameters, it should tell the DistUi instance in window.top to open an overlay with the passed parameters plus the defaults and warn that the method is deprecated", false, false);
        test("and sets the necessary parameters, it should tell the DistUi instance in window.top to open an overlay with just the passed parameters and warn that the method is deprecated", true, false);
        test("and sets the necessary parameters (including a function reference), it should set up the callback, tell the DistUi instance in window.top to open an overlay with just the passed parameters and warn that the method is deprecated", true, true);
    });
    
    describe("calls showOverlay", function() {
        var test = function(itText, withParameters, useFunctionReferences) {
            it(itText, function() {
                var params, defaults, fnRefs, _addCallback, i = 1;
                _addCallback = spyOn(distui, "_addCallback").andCallFake(function(fn) { return "testCallbackKey" + i++; });
                if (withParameters) {
                    params = {
                        autoOpen: true,
                        buttons: [],
                        closeOnEscape: false,
                        dialogClass: "testClass",
                        //close: false,
                        draggable: true,
                        id: "testOverlayId",
                        minHeight: 300,
                        modal: false,
                        position: "right",
                        refresh: true,
                        resizable: true,
                        title: "testTitle",
                        subtitle: "testSubtitle",
                        titleBarButton: true,
                        trigger: true,
                        usage: "testUsage",
                        width: 400, 
                        test: "extraParam"
                    };
                    if (useFunctionReferences) {
                        fnRefs = {
                                closeHandler: function(fakeButtonProps, callback) { return true; },
                                closeCallbackHandler: function(closeData) { return true; },
                                buttonClickHandler: function(buttonProps, callback) { return false; },
                                buttonCallbackHandler: function(data) { return false; }
                        };
                        params.closeHandler = fnRefs.closeHandler;
                        params.closeCallbackHandler = fnRefs.closeCallbackHandler;
                        params.buttons.push({ id: "testButton", clickHandler: fnRefs.buttonClickHandler, callbackHandler: fnRefs.buttonCallbackHandler });
                    }
                }
                else {
                    params = { test: "extraParam" };
                    defaults = {
                        autoOpen: false,
                        buttons: false,
                        closeOnEscape: true,
                        dialogClass: false,
                        //close: false,
                        draggable: false,
                        id: (new Date()).getTime().toString(),
                        minHeight: false,
                        modal: true,
                        position: "center",
                        refresh: false,
                        resizable: false,
                        title: null,
                        subtitle: null,
                        titleBarButton: null,
                        trigger: false,
                        usage: false,
                        width: 300, 
                        test: "extraParam"
                    };
                }
                
                distui.showOverlay(params);

                if (withParameters && useFunctionReferences) {
                    expect(_addCallback).toHaveBeenCalledWith(jasmine.any(Function), false); // fnRefs.closeHandler gets bound in another closure
                    expect(_addCallback).toHaveBeenCalledWith(fnRefs.closeCallbackHandler, false);
                    expect(_addCallback).toHaveBeenCalledWith(jasmine.any(Function), false); // fnRefs.buttonClickHandler gets bound in another closure
                    expect(_addCallback).toHaveBeenCalledWith(fnRefs.buttonCallbackHandler, false);
                    params.closeHandler = { handler: "testCallbackKey1", context: "caller" };
                    params.closeCallbackHandler = "testCallbackKey2";
                    params.buttons[0].clickHandler = { handler: "testCallbackKey3", context: "caller" };
                    params.buttons[0].callbackHandler = "testCallbackKey4";
                }
                else {
                    expect(_addCallback).not.toHaveBeenCalled();
                }
                
                expect(invokeApi).toHaveBeenCalledWith("showOverlay", withParameters ? params : defaults);
            });
        };
        test("without setting the necessary parameters, it should tell the DistUi instance in window.top to open an overlay with the passed parameters plus the defaults", false, false);
        test("and sets the necessary parameters, it should tell the DistUi instance in window.top to open an overlay with just the passed parameters", true, false);
        test("and sets the necessary parameters with function references, it should set up the callbacks and tell the DistUi instance in window.top to open an overlay with just the passed parameters", true, true);
    });
    
    describe("calls showTutorial", function() {
        it("it should tell the DistUi instance in window.parent to open a new window to 'http://www.constantcontact.com/display_media.jsp?id=' and focus on the new window", function() {
            var id = "testTutorialId";
            
            distui.showTutorial(id);
            
            expect(invokeApi).toHaveBeenCalledWith("showTutorial", id);
        });
    });
    
    describe("calls showUrlInWindow", function() {
        it("without setting the necessary options, it should tell the DistUi instance in window.parent to open a new window with the passed URL and default options and focus on the new window", function() {
            var url, name, options, defaults, params;
            url = "testUrl";
            name = "testName";
            options = { extraParam: "extraParam" };
            defaults = {
                showToolbar: false,
                showAddressbar: false,
                showStatusbar: false,
                showMenubar: false,
                showScrollbars: false,
                isResizable: false,
                width: 800,
                height: 600,
                offsetTop: 0,
                offsetLeft: 0,
                extraParam: "extraParam"
            };
            params = { url: url, name: name, options: defaults };
            
            distui.showUrlInWindow(url, name, options);
            
            expect(invokeApi).toHaveBeenCalledWith("showUrlInWindow", params);
        });
        it("while setting the necessary options, it should tell the DistUi instance in window.parent to open a new window with the passed URL and options and focus on the new window", function() {
            var url, name, options, params;
            url = "testUrl";
            name = "testName";
            options = {
                showToolbar: true,
                showAddressbar: true,
                showStatusbar: true,
                showMenubar: true,
                showScrollbars: true,
                isResizable: true,
                width: 500,
                height: 400,
                offsetTop: 300,
                offsetLeft: 200,
                extraParam: "extraParam"
            };
            params = { url: url, name: name, options: options };
            
            distui.showUrlInWindow(url, name, options);
            
            expect(invokeApi).toHaveBeenCalledWith("showUrlInWindow", params);
        });
    });
    
    describe("calls showUrlOverlay", function() {
        var test = function(itText, isFunctionReference) {
            it(itText, function() {
                var id, width, url, frameHeight, onCloseCallback, refresh, title, usage, destroyOnClose, params, _addCallback, i = 1;
                _addCallback = spyOn(distui, "_addCallback").andCallFake(function(fn) { return "testCallbackKey" + i++; });
                id = "testOverlayId";
                width = 400;
                url = "testUrl";
                frameHeight = 500;
                onCloseCallback = isFunctionReference ? function() { return true; } : "testMethod";
                refresh = true;
                title = "testTitle";
                usage = "testUsage";
                destroyOnClose = true;
                params = { usage: usage, id: id, fullPage: false, width: width, url: url, title: title, frameHeight: frameHeight, onCloseCallback: onCloseCallback, refresh: refresh, destroyOnClose: destroyOnClose };
                
                distui.showUrlOverlay(id, width, url, frameHeight, onCloseCallback, refresh, title, usage, destroyOnClose);
                
                expect(utilsConsole).toHaveBeenCalledWith("warn", jasmine.any(String));
                if (isFunctionReference) {
                    expect(_addCallback).toHaveBeenCalledWith(onCloseCallback, true);
                    params.onCloseCallback = "testCallbackKey1";
                }
                else {
                    expect(_addCallback).not.toHaveBeenCalled();
                }
                expect(invokeApi).toHaveBeenCalledWith("showComponentOverlay", params);
            });
        };
        test("it should tell the DistUi instance in window.top to open an overlay with the passed parameters and warn that the method is deprecated", false);
        test("with a function reference, it should set up the callback, tell the DistUi instance in window.top to open an overlay with the passed parameters and warn that the method is deprecated", true);
    });
    
    describe("calls showVerifyEmailAddressWidget", function() {
        it("it should tell the DistUi instance in window.top to open the verify email address overlay with the provided callback and warn that the method is deprecated", function() {
            var callback = "testMethod";
            
            distui.showVerifyEmailAddressWidget(callback);
            
            expect(utilsConsole).toHaveBeenCalledWith("warn", jasmine.any(String));
            expect(invokeApi).toHaveBeenCalledWith("showVerifyEmailAddressWidget", callback);
        });
    });
    
    describe("calls subscribe", addEventListenerSubscribe.bind(this, "subscribe"));
    
    describe("calls styleIframe", function() {
        it("it should call _invokeApi and pass in the parameter Object", function() {
            var params = { test: "params" };
            distui.styleIframe(params);
            expect(invokeApi).toHaveBeenCalledWith("styleIframe", params);
        });
    });
    
    describe("calls track", function() {
        var test = function(itText, enabled) {
            it(itText, function() {
                var r, data;
                data = { trackingPageName: "testPageName", action: "testAction" };
                distui.enableTracking(enabled);
    
                r = distui.track(data);
                
                data.members = [ distui.rosterMemberName ];
                if (enabled) {
                    expect(invokeApi).toHaveBeenCalledWith("track", data);
                }
                else {
                    expect(invokeApi).not.toHaveBeenCalled();
                }
                expect(r).toEqual(enabled);
            });
        };
        test("and tracking is enabled it should call _invokeApi, include this rosterMemberName in the data, and return true", true);
        test("and tracking is not enabled it should return false", false);
    });
    
    describe("calls warn", function() {
        it("it should delegate the call to DistUiUtils", function() {
            var message;
            message = "testMessage";

            distui.warn(message);
            
            expect(utilsConsole).toHaveBeenCalledWith("warn", message);
        });
    });
    
    describe("creates a DistUiEvent instance", function() {
        it("it should contain a token, id, target, and type in addition to any other properties passed in, the passed properties should not superceed the default properties, and subsequent calls with the same parameters should produce unique tokens and ids", function() {
            var event, i, n, properties, G;
            properties = {
                    id: "propertyId",
                    type: "propertyType",
                    token: "propertyToken",
                    target: "propertyTarget",
                    prop1: "property1",
                    prop2: "property2",
                    prop3: "property3"
            };
            
            var G;
            if (!window.DistUiGlobals) {
                window.DistUiGlobals = {};
            }
            G = window.DistUiGlobals;
            if (typeof(G.DistUiEventToken) === "undefined") {
                G.DistUiEventToken = 1;
            }
            
            n = G.DistUiEventToken + 3;
            for (i = G.DistUiEventToken; i < n; i++) {
                event = new DistUiEvent(distui, "testType", properties);

                expect(event).toBeDefined();
                expect(event.id).toEqual(distui.id + "_testType_" + i);
                expect(event.target).toEqual({ id: distui.id, url: distui._myUrl, rosterMemberName: distui.rosterMemberName });
                expect(event.token).toEqual(i);
                expect(event.type).toEqual("testType");
                expect(event.prop1).toEqual("property1");
                expect(event.prop2).toEqual("property2");
                expect(event.prop3).toEqual("property3");
            }
        });
    });

    describe("creates a DistUiUrlParameters", function() {
        var urlParameters, queryString, paramsMap, additions, i, args;
        queryString = "test%201=test%201&test%202=test%202&test%203=test%203";
        paramsMap = { "test 1": "test 1", "test 2": "test 2", "test 3": "test 3" };
        additions = [ "test 1", "test 2", "test 3" ];
        
        describe("with", function() {
            var test = function(itText, arg, additions) {
                it(itText, function() {
                    urlParameters = new DistUiUrlParameters(arg);

                    expect(urlParameters).toBeDefined();
                    expect(urlParameters.map).toEqual(paramsMap);
                    expect(urlParameters.getSize()).toEqual(additions.length);

                    for (i = 0; i < additions.length; i++) {
                        expect(urlParameters.contains(additions[i])).toEqual(true);
                        expect(urlParameters.getValue(additions[i])).toEqual(additions[i]);
                    }
                });
            };
            test("a query string with URL-encoded characters it should contain the additions un-unencoded", queryString, additions);
            test("a map it should contain the additions", paramsMap, additions);
        });
        
        describe("and calls it's add() method", function() {
            var test = function(itText, arg, additions) {
                it(itText, function() {
                    var i;
                    urlParameters = new DistUiUrlParameters("test4=test4&test5=test5");

                    if (arg && arg.constructor === Array) {
                        for (i = 0; i < arg.length; i++) {
                            urlParameters.add(encodeURI(arg[i]), encodeURI(arg[i]));
                        }
                    }
                    else {
                        urlParameters.add(arg);
                    }
                    
                    additions = additions.concat([ "test4", "test5" ]);
                    expect(urlParameters).toBeDefined();
                    expect(urlParameters.getSize()).toEqual(additions.length);

                    for (i = 0; i < additions.length; i++) {
                        expect(urlParameters.contains(additions[i])).toEqual(true);
                        expect(urlParameters.getValue(additions[i])).toEqual(additions[i]);
                    }
                });
            };
            test("with a query string it should contain the additions and the previous URL parameters", queryString, additions);
            test("with a map it should contain the additions and the previous URL parameters", paramsMap, additions);
            test("with an encoded name and an encoded value it should contain the unencoded addition and the previous URL parameters", additions, additions);
        });
    
        describe("and calls it's getSize() method", function() {
            var test = function(itText, arg, count) {
                it(itText, function() {
                    urlParameters = new DistUiUrlParameters(arg);
    
                    expect(urlParameters.getSize()).toEqual(count);
                });
            };
            test("it should return 3", queryString, additions.length);
            test("it should return 3", paramsMap, additions.length);
        });

        describe("and calls it's contains() method", function() {
            var test = function(itText, arg) {
                it(itText, function() {
                    urlParameters = new DistUiUrlParameters(arg);
    
                    expect(urlParameters.contains("test4")).toEqual(false);
                    
                    urlParameters.add("test4=test4");
                    
                    expect(urlParameters.contains("test4")).toEqual(true);
                });
            };
            test("it should return false if not added and true if added", queryString);
            test("it should return false if not added and true if added", paramsMap);
        });
        
        describe("and calls it's getValue() method", function() {
            var test = function(itText, arg) {
                it(itText, function() {
                    urlParameters = new DistUiUrlParameters(arg);
    
                    for (i = 0; i < additions.length; i++) {
                        expect(urlParameters.getValue(additions[i])).toEqual(additions[i]);
                    }
                    
                    expect(urlParameters.getValue("test4")).toEqual(null);
                });
            };
            test("it should return null it doesn't exist, otherwise return the value", queryString);
            test("it should return null it doesn't exist, otherwise return the value", paramsMap);
        });

        describe("and calls it's stringToMap() method", function() {
            var test = function(itText) {
                it(itText, function() {
                    urlParameters = new DistUiUrlParameters();
                    
                    expect(urlParameters.stringToMap(queryString)).toEqual(paramsMap);
                    expect(urlParameters.stringToMap("")).toEqual({});
                    expect(urlParameters.stringToMap(null)).toEqual({});
                });
            };
            test("it should return an Object map correctly representing the queryString");
        });

        describe("and calls it's toString() method", function() {
            var test = function(itText, param, expected) {
                it(itText, function(){
                    urlParameters = new DistUiUrlParameters(param);
                    
                    expect(urlParameters.toString()).toEqual("&" + expected);
                    expect(urlParameters.toString("&")).toEqual("&" + expected);
                    expect(urlParameters.toString("?")).toEqual("?" + expected);
                });
            };
            test("it should return a query string correctly representing the Object map", paramsMap, queryString);
            test("it should return a query string correctly representing &x=&y=1", "&x=&y=1", "x=&y=1");
            test("it should return a query string correctly representing x=1&y=", "x=1&y=", "x=1&y=");
            test("it should return a query string correctly representing &x=http%3A//test.url.com/path%3Fy%3D1%26z%3D2", "&x=http%3A//test.url.com/path%3Fy%3D1%26z%3D2", "x=http%3A//test.url.com/path%3Fy%3D1%26z%3D2");
        });
        
        describe("and calls it's insertInto() method", function() {
            var test = function(itText, arg) {
                it(itText, function() {
                    urlParameters = new DistUiUrlParameters(queryString);
                    
                    expect(urlParameters.insertInto(arg.url)).toEqual(arg.expected);

                    urlParameters = new DistUiUrlParameters(paramsMap);
                    
                    expect(urlParameters.insertInto(arg.url)).toEqual(arg.expected);
                });
            };
            args = [ 
                    { url: "", expected: "?" + queryString },
                    { url: null, expected: null },
                    { url: "https://ui.d1.constantcontact.com", expected: "https://ui.d1.constantcontact.com?" + queryString },
                    { url: "https://ui.d1.constantcontact.com/rnavmap/em/site/home", expected: "https://ui.d1.constantcontact.com/rnavmap/em/site/home?" + queryString },
                    { url: "https://ui.d1.constantcontact.com/rnavmap/em/site/home?other=param", expected: "https://ui.d1.constantcontact.com/rnavmap/em/site/home?other=param&" + queryString },
                    { url: "https://ui.d1.constantcontact.com/rnavmap/em/site/home?other=param#testhash", expected: "https://ui.d1.constantcontact.com/rnavmap/em/site/home?other=param&" + queryString + "#testhash" }
                     ];
            for (i = 0; i < args.length; i++) {
                test("on url " + args[i].url + " it should return " + args[i].expected, args[i]);
            }
        });
    });
    
});
