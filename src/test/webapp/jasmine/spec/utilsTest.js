describe("When a DistUiUtils instance", function() {
    var utils, console, overrides;
    
    (function() {
        utils = new DistUiUtils();
        utils.assert(true, "initialize window.console.assert");
        utils.debugEnabled = true;
        utils.debug("initialize window.console.debug");
        utils = null;
    })();
    
    overrides = {
            name: "testName", 
            namesExcludes: "testName1|testName2",
            url: "testUrl", 
            getItem: null, 
            setItem: null, 
            removeItem: null, 
            beforeEach: function(exists, exclusive) {
                this.namesIncludes = "testName1|testName2|" + this.name;
                this.getItem = spyOn(utils, "_getFromLocalStorage").andCallFake((function(name) {
                    if (name === "distuiSandbox") {
                        if (exists) {
                            return exclusive ? this.name : this.namesIncludes;
                        }
                        else {
                            return exclusive ? null : this.namesExcludes;
                        }
                    }
                    else {
                        return exists ? this.url : null; 
                    }
                }).bind(this));
                this.setItem = spyOn(utils, "_setInLocalStorage");
                this.removeItem = spyOn(utils, "_removeFromLocalStorage");
            },
            afterEach: function() {
                this.getItem = null; 
                this.setItem = null; 
                this.removeItem = null; 
            }
    };
    
    
    beforeEach(function() {
        utils = new DistUiUtils();
        if (typeof(window.console) !== "undefined") {
            console = {};
            console.log = spyOn(window.console, "log");
            console.debug = spyOn(window.console, "debug");
            console.info = spyOn(window.console, "info");
            console.warn = spyOn(window.console, "warn");
            console.error = spyOn(window.console, "error");
            console.assert = spyOn(window.console, "assert");
            console.clear = window.console.clear ? spyOn(window.console, "clear") : jasmine.createSpy("clear");
        }
        else {
            console = jasmine.createSpyObj("console", [ "log", "debug", "info", "warn", "error"]);
            window.console = console;
        }
    });
    
    afterEach(function() {
        window.testMethod = null;
    });

    
    describe("calls isTop", function() {
        it("it should return true", function() {
            var r;
            
            r = utils.isTop();
            
            expect(r).toEqual(true);
        });
    });
    
    describe("calls getEnv", function() {
        var i, env, url, sampleUrls = [ 
                { env: "d1", url: "https://ui.d1.constantcontact.com/rnavmap/distui/v1/refapp" },
                { env: "f1", url: "https://distui.nblumbergmac1.f1.constantcontact.com/dev/distui/js/member.js" },
                { env: "l1", url: "https://deals_ui.l1.constantcontact.com/report" },
                { env: "f2", url: "https://contacts.f2.constantcontact.com/1234567890/transmissions" },
                { env: "s1", url: "https://smm.s1.constantcontact.com/scui-main/" },
                { env: "", url: "https://ui.constantcontact.com/rnavmap/distui/v1/refapp" },
                { env: "" }
        ];
        for (i = 0; i < sampleUrls.length; i++) {
            env = sampleUrls[i].env;
            url = sampleUrls[i].url;
            it("with " + url + " it should return \"" + env + "\"", (function(i) {
                var r;
                env = sampleUrls[i].env;
                url = sampleUrls[i].url;
                
                r = utils.getEnv(url);
                
                expect(r).toEqual(env);
            }).bind(this, i));
        }
    });
    
    describe("calls console", function() {
        var i, testMessage = "testMessage", method, methods = [ "log", "debug", "info", "warn", "error", "assert", "clear" ];
        for (i = 0; i < methods.length; i++) {
            method = methods[i];
            it("with method " + method + " it should call window.console." + method + " (if supported by the browser) and return the output, otherwise return false", (function(i) {
                var r;
                method = methods[i];
                
                r = utils.console(method, testMessage);
                
                if (window.console && window.console[ method ]) {
                    expect(console[ method ]).toHaveBeenCalledWith(testMessage);
                    expect(r).toBeDefined();
                    expect(r.indexOf(testMessage)).not.toEqual(-1);
                }
                else {
                    expect(r).toEqual(false);
                }
            }).bind(this, i));
        }
    });    
    
    describe("calls assert", function() {
        var testResult = true, testMessage = "testMessage";
        it("it should call window.console.assert (if supported by the browser) and return the test result, otherwise return false", function() {
            var r;
            
            r = utils.assert(testResult, testMessage);
            
            if (window.console && window.console.assert) {
                expect(console.assert).toHaveBeenCalledWith(testResult, testMessage);
                expect(r).toEqual(testResult);
            }
            else {
                expect(r).toEqual(false);
            }
        });
    });
    
    describe("calls debug", function() {
        var testMessage = "testMessage", testLevel = 5, utilsConsole, debugEnabledStates = [ true, false ], debugEnabled, levelComparisons = [ -1, 0, 1 ], levelComparison, outcome, i, j, prep, getState;
        prep = function(enabled, level) {
            utilsConsole = spyOn(utils, "console").andCallThrough();
            utils.debugEnabled = enabled;
            utils.debugLevel = 5;
        };
        getState = function(i, j) {
            debugEnabled = debugEnabledStates[i];
            switch(levelComparisons[j]) {
                case -1: {
                    levelComparison = "<";
                    testLevel = 4;
                    break;
                }
                case 0: {
                    levelComparison = "===";
                    testLevel = 5;
                    break;
                }
                case 1: {
                    levelComparison = ">";
                    testLevel = 6;
                    break;
                }
            }
            outcome = debugEnabled && levelComparison !== ">" ? "call DistUiUtils.console('debug') and return the message" : "not call DistUiUtils.console('debug') and return false";
        };
        for (i = 0; i < debugEnabledStates.length; i++) {
            for (j = 0; j < levelComparisons.length; j++) {
                getState(i, j);
                it(", when debugging is " + (debugEnabled ? "enabled" : "disabled") + " and the passed level is " + levelComparison + " the debug level it should " + outcome, (function(i, j) {
                    var r;
                    getState(i, j);
                    prep(debugEnabled);

                    r = utils.debug(testMessage, testLevel);
                    
                    expect(r).toBeDefined();
                    if (debugEnabled && levelComparison !== ">") {
                        expect(utilsConsole).toHaveBeenCalledWith("debug", testMessage);
                        expect(r.indexOf(testMessage)).not.toEqual(-1);
                    }
                    else {
                        expect(utilsConsole).not.toHaveBeenCalled();
                        expect(r).toEqual(false);
                    }
                }).bind(this, i, j));
            }
        }
    });
    
    describe("calls objectToString", function() {
        var i, testObj, output, testObjs, propPerLine, indent;
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
        for (i = 0; i < testObjs.length; i++) {
            testObj = testObjs[i].obj;
            output = testObjs[i].output;
            it(", when debugging is enabled and passes " + testObj + " it should return " + output, (function(i) {
                var r;
                testObj = testObjs[i].obj;
                output = testObjs[i].output;
                utils.debugEnabled = true;

                r = utils.objectToString(testObj, propPerLine, indent);
                
                expect(r).toBeDefined();
                expect(r).toEqual((indent ? indent : "") + output);
            }).bind(this, i));
            if (testObjs[i].isArray) {
                output = "[array]";
            }
            if (testObjs[i].isObject) {
                output = "[object]";
            }
            it(", when debugging is disabled and passes " + testObj + " it should return " + output, (function(i) {
                var r;
                testObj = testObjs[i].obj;
                output = testObjs[i].output;
                if (testObjs[i].isArray) {
                    output = "[array]";
                }
                if (testObjs[i].isObject) {
                    output = "[object]";
                }
                utils.debugEnabled = false;

                r = utils.objectToString(testObj, propPerLine, indent);
                
                expect(r).toBeDefined();
                expect(r).toEqual((indent ? indent : "") + output);
            }).bind(this, i));
        }
    });
    
    describe("calls getParam", function() {
        var i, testCase, testCases = [
                         { url: "http://test.com/base/path?testParam=testValue", name: "testParam", value: "testValue" },
                         { url: "http://test.com/base/path?testParam=testValue#", name: "testParam", value: "testValue" },
                         { url: "http://test.com/base/path?&testParam=testValue", name: "testParam", value: "testValue" },
                         { url: "http://test.com/base/path?&testParam=testValue#", name: "testParam", value: "testValue" },
                         { url: "http://test.com/base/path?test=test&testParam=testValue", name: "testParam", value: "testValue" },
                         { url: "http://test.com/base/path?test=test&testParam=testValue#", name: "testParam", value: "testValue" },
                         { url: "http://test.com/base/path?testParam1=test&testParam=testValue", name: "testParam", value: "testValue" },
                         { url: "http://test.com/base/path?testParam1=test&testParam=testValue&testParam2=test", name: "testParam", value: "testValue" },
                         { url: "http://test.com/base/path?testParam1=test&testParam2=test", name: "testParam", value: "" }
                         ];
        for (i = 0; i < testCases.length; i++) {
            it(testCases[i].name + " when the URL is " + testCases[i].url + ", it should return the expected URL parameter value " + testCases[i].value, (function(i) {
                var r, getUrl = spyOn(utils, "_getUrl").andCallFake(function() { return testCases[i].url; });
                
                r = utils.getParam(testCases[i].name);
                
                expect(r).toEqual(testCases[i].value);
            }).bind(this, i));
        }
    });
    
    describe("calls writeCookie", function() {
        // name + "=" + escape(value) + (!expirationDate ? "" : "; expires=" + expirationDate.toUTCString());
        var r, name = "testName", value = "testValue", expirationDate = new Date(), testCookie = name + "=" + escape(value), setCookie;
        it("without an expiration date, it should call DistUiUtils._setCookie with the expected value and return that value", (function(expirationDate, testCookie) {
            setCookie = spyOn(utils, "_setCookie").andCallFake(function(c) { return c; }); 
            
            r = utils.writeCookie(name, value, expirationDate);
            
            expect(setCookie).toHaveBeenCalledWith(testCookie);
            expect(r).toEqual(testCookie);
        }).bind(this, undefined, testCookie));
        it("with an expiration date, it should call DistUiUtils._setCookie with the expected value and return that value", (function(expirationDate, testCookie) {
            setCookie = spyOn(utils, "_setCookie").andCallFake(function(c) { return c; }); 
            
            r = utils.writeCookie(name, value, expirationDate);
            
            expect(setCookie).toHaveBeenCalledWith(testCookie);
            expect(r).toEqual(testCookie);
        }).bind(this, expirationDate, testCookie + "; expires=" + expirationDate.toUTCString()));
    });
    
    describe("calls deleteCookie", function() {
        var r, name = "testName", testCookie = encodeURIComponent(name) + "=; expires=expires=Thu, 01 Jan 1970 00:00:00 GMT", setCookie;
        it("it should call DistUiUtils._setCookie with the expected value and return that value", function() {
            setCookie = spyOn(utils, "_setCookie").andCallFake(function(c) { return c; }); 
            
            r = utils.deleteCookie(name);
            
            expect(setCookie).toHaveBeenCalledWith(testCookie);
            expect(r).toEqual(testCookie);
        });
    });
    
    describe("calls readCookie", function() {
        var r, name = "testName", value = "testValue";
        it("it should return the expected value", function() {
            utils.writeCookie(name, value); 
            
            r = utils.readCookie(name);
            
            expect(r).toEqual(value);
            
            utils.deleteCookie(name); 
        });
    });
    
    describe("calls saveOverride", function() {
        it("when no overrides exist, it should call localStorage.getItem('distuiSandbox') to get all the existing override names and localStorage.setItem('distuiSandbox', ...) to add it to the list, then localStorage.setItem('distuiSandbox_name', value)", function() {
            var r, exists = false, exclusive = true;
            overrides.beforeEach(exists, exclusive);
            
            r = utils.saveOverride(overrides.name, overrides.url);
            
            expect(overrides.getItem).toHaveBeenCalledWith("distuiSandbox");
            expect(overrides.setItem).toHaveBeenCalledWith("distuiSandbox", overrides.name);
            expect(overrides.setItem).toHaveBeenCalledWith("distuiSandbox_" + overrides.name, overrides.url);
            expect(r).toEqual(true);
        });
        it("when the override does not exist, it should call localStorage.getItem('distuiSandbox') to get all the existing override names and localStorage.setItem('distuiSandbox', ...) to add it to the list, then localStorage.setItem('distuiSandbox_name', value)", function() {
            var r, exists = false, exclusive = false;
            overrides.beforeEach(exists, exclusive);
            
            r = utils.saveOverride(overrides.name, overrides.url);
            
            expect(overrides.getItem).toHaveBeenCalledWith("distuiSandbox");
            expect(overrides.setItem).toHaveBeenCalledWith("distuiSandbox", overrides.namesIncludes);
            expect(overrides.setItem).toHaveBeenCalledWith("distuiSandbox_" + overrides.name, overrides.url);
            expect(r).toEqual(true);
        });
        it("when the override does exist, it should call localStorage.getItem('distuiSandbox') to get all the existing override names, then localStorage.setItem('distuiSandbox_name', value)", function() {
            var r, exists = true, exclusive = false;
            overrides.beforeEach(exists, exclusive);
            
            r = utils.saveOverride(overrides.name, overrides.url);
            
            expect(overrides.getItem).toHaveBeenCalledWith("distuiSandbox");
            expect(overrides.setItem).not.toHaveBeenCalledWith("distuiSandbox", overrides.name);
            expect(overrides.setItem).toHaveBeenCalledWith("distuiSandbox_" + overrides.name, overrides.url);
            expect(r).toEqual(true);
        });
    });
    
    describe("calls deleteOverride", function() {
        it("when the override does not exist, it should call localStorage.getItem('distuiSandbox') to get all the existing override names and return false", function() {
            var r, exists = false, exclusive = false;
            overrides.beforeEach(exists, exclusive);
            
            r = utils.deleteOverride(overrides.name);
            
            expect(overrides.getItem).toHaveBeenCalledWith("distuiSandbox");
            expect(overrides.setItem).not.toHaveBeenCalledWith("distuiSandbox", jasmine.any(String));
            expect(overrides.removeItem).not.toHaveBeenCalledWith("distuiSandbox");
            expect(overrides.removeItem).not.toHaveBeenCalledWith("distuiSandbox_" + overrides.name);
            expect(r).toEqual(false);
        });
        it("when the override does exist but is the only one, it should call localStorage.getItem('distuiSandbox') to get all the existing override names, then localStorage.removeItem('distuiSandbox_name') and localStorage.removeItem('distuiSandbox') and return true", function() {
            var r, exists = true, exclusive = true;
            overrides.beforeEach(exists, exclusive);
            
            r = utils.deleteOverride(overrides.name);
            
            expect(overrides.getItem).toHaveBeenCalledWith("distuiSandbox");
            expect(overrides.setItem).not.toHaveBeenCalledWith("distuiSandbox", overrides.namesIncludes);
            expect(overrides.removeItem).toHaveBeenCalledWith("distuiSandbox");
            expect(overrides.removeItem).toHaveBeenCalledWith("distuiSandbox_" + overrides.name);
            expect(r).toEqual(true);
        });
        it("when the override does exist but is not the only one, it should call localStorage.getItem('distuiSandbox') to get all the existing override names, then localStorage.removeItem('distuiSandbox_name') and localStorage.setItem('distuiSandbox', ...) and return true", function() {
            var r, exists = true, exclusive = false;
            overrides.beforeEach(exists, exclusive);
            
            r = utils.deleteOverride(overrides.name);
            
            expect(overrides.getItem).toHaveBeenCalledWith("distuiSandbox");
            expect(overrides.setItem).toHaveBeenCalledWith("distuiSandbox", overrides.namesExcludes);
            expect(overrides.removeItem).toHaveBeenCalledWith("distuiSandbox_" + overrides.name);
            expect(r).toEqual(true);
        });
    });
    
    describe("calls getOverride", function() {
        var r, name = "testName", value = "testValue";
        it("and the override exists, it should return the expected value", function() {
            utils.saveOverride(name, value); 
            
            r = utils.getOverride(name);
            
            expect(r).toEqual(value);
            
            utils.deleteOverride(name); 
        });
        it("and the override does not exist, it should return null", function() {
            r = utils.getOverride(name);
            
            expect(r).toEqual(null);
        });
    });
    
    describe("calls getOverrides", function() {
        var r, name = "testName", url = "testValue", value = [ { name: name, url: url } ];
        it("and overrides exist, it should return an array of the overrides", function() {
            utils.saveOverride(name, url); 
            
            r = utils.getOverrides();
            
            expect(r).toEqual(value);
            
            utils.deleteOverride(name); 
        });
        it("and no overrides exist, it should return null", function() {
            r = utils.getOverrides();
            
            expect(r).toEqual(null);
        });
    });
    
    describe("calls isSandboxed", function() {
        var test = function(itText, overridesExist, duiHostSS, duiUseUiSS, duiVersionSS, duiHostLS, duiUseUiLS, duiVersionLS) {
            it(itText, function() {
                var r, name = "testName", url = "testValue", value = [ { name: name, url: url } ], getOverrides, getItemSS, getItemLS, prep;
                getOverrides = spyOn(utils, "getOverrides").andCallFake(function() {
                    return overridesExist ? [ { name: name, url: url } ] : null;
                });
                getItemSS = spyOn(utils, "_getFromSessionStorage").andCallFake(function(name) {
                    if (name === "duiHost") {
                        return duiHostSS;
                    }
                    else if (name === "duiHostUseUI") {
                        return duiUseUiSS;
                    }
                    else if (name === "duiVersion") {
                        return duiVersionSS;
                    }
                    return null;
                });
                getItemLS = spyOn(utils, "_getFromLocalStorage").andCallFake(function(name) {
                    if (name === "duiHost") {
                        return duiHostLS;
                    }
                    else if (name === "duiHostUseUI") {
                        return duiUseUiLS;
                    }
                    else if (name === "duiVersion") {
                        return duiVersionLS;
                    }
                    return null;
                });
                
                r = utils.isSandboxed();
                
                if (overridesExist || duiHostSS || duiUseUiSS || duiVersionSS || duiHostLS || duiUseUiLS || duiVersionLS) {
                    expect(r).toEqual(true);
                }
                else {
                    expect(r).toEqual(false);
                }
                expect(getOverrides).toHaveBeenCalled();
                expect(getItemSS).toHaveBeenCalledWith("duiHost");
                expect(getItemSS).toHaveBeenCalledWith("duiHostUseUI");
                expect(getItemSS).toHaveBeenCalledWith("duiVersion");
                expect(getItemLS).toHaveBeenCalledWith("duiHost");
                expect(getItemLS).toHaveBeenCalledWith("duiHostUseUI");
                expect(getItemLS).toHaveBeenCalledWith("duiVersion");
            });
        };
        test("and overrides exist, it should return true", true, null, null, null, null, null, null);
        test("and duiHost is set in sessionStorage, it should return true", false, "test", null, null, null, null, null);
        test("and duiHostUseUI is set in sessionStorage, it should return true", false, null, true, null, null, null, null);
        test("and duiVersion is set in sessionStorage, it should return true", false, null, null, "dev", null, null, null);
        test("and duiHost is set in localStorage, it should return true", false, null, null, null, "test", null, null);
        test("and duiHostUseUI is set in localStorage, it should return true", false, null, null, null, null, true, null);
        test("and duiVersion is set in localStorage, it should return true", false, null, null, null, null, null, "dev");
        test("and no overrides exist and duiHost/duiVersion are not set, it should return false", false, null, null, null, null, null, null);
    });
    
    describe("calls writeContract", function() {
        var i, j, r, requiredParams, allParams, getParam, failGetParam, writeContractValue;
        requiredParams = [ "duiid", "duiparenturl", "duitopurl", "duiscripturl", "dcb" ];
        allParams = requiredParams.concat([ "duidebug" ]);
        for (i = 0; i <= requiredParams.length; i++) {
            it("it should getParam() for each required contract property [ " + requiredParams.slice(0, i + 1).join(", ") + " ] to check that they exist, and " + (i < requiredParams.length ? "when they don't it should return false" : " when they do it should call _writeContract() for each of them and return true"), (function(i) {
                failGetParam = false;
                getParam = spyOn(utils, "getParam").andCallFake(function(name, escaped) {
                    if (name === requiredParams[i]) {
                        failGetParam = true;
                    }
                    return failGetParam ? null : "test";
                });
                writeContractValue = spyOn(utils, "_writeContractValue").andCallFake(function(key) { return "test"; });
                
                r = utils.writeContract();
                
                for (j = 0; j <= i && j < requiredParams.length; j++) {
                    expect(getParam).toHaveBeenCalledWith(requiredParams[j]);
                }
                
                if (i < requiredParams.length) {
                    expect(r).toEqual(false);
                    expect(writeContractValue).not.toHaveBeenCalled();
                }
                else {
                    expect(r).toEqual(true);
                    for (j = 0; j < allParams.length; j++) {
                        expect(writeContractValue).toHaveBeenCalledWith(allParams[j]);
                    }
                }
            }).bind(this, i));
        }
    });
    
    describe("calls readContract", function() {
        var test = function(itText, hasParam, hasContractObj, unescaped) {
            it(itText, function() {
                var r, name = "test", paramValue = "test%20param%20value", sessionStorageValue = "test%20session%20storage%20value", requestAttributeValue = "test%20request%20attribute%20value", escaped, getParam, getContractObject, parsePath, prep;
                getParam = spyOn(utils, "getParam").andCallFake(function(name, escaped) {
                    if (hasParam) {
                        return escaped ? unescape(paramValue) : paramValue;
                    } 
                    return null;
                });
                getContractObject = spyOn(utils, "getContractObject").andCallFake(function(name) {
                    if (hasContractObj) {
                        var obj = {};
                        utils._addToContractObject(obj, sessionStorageValue, utils._parsePath());
                        return obj;
                    } 
                    return null;
                });
                
                r = utils.readContract(name, requestAttributeValue, unescaped);
                
                expect(getParam).toHaveBeenCalledWith(name, unescaped);
                if (hasParam) {
                    expect(getContractObject).not.toHaveBeenCalled();
                    if (unescaped) {
                        expect(r).toEqual(unescape(paramValue));
                    }
                    else {
                        expect(r).toEqual(paramValue);
                    }
                }
                else {
                    expect(getContractObject).toHaveBeenCalledWith(name);
                    if (hasContractObj) {
                        if (unescaped) {
                            expect(r).toEqual(unescape(sessionStorageValue));
                        }
                        else {
                            expect(r).toEqual(sessionStorageValue);
                        }
                    }
                    else if (unescaped) {
                        expect(r).toEqual(unescape(requestAttributeValue));
                    }
                    else {
                        expect(r).toEqual(requestAttributeValue);
                    }
                }
            });
        };
        test("it should getParam() for the value, and if it exists return that", true, true, false);
        test("it should getParam() for the value, and if it exists return that unescaped", true, true, true);
        test("it should getParam() for the value, and if it doesn't exist call getContractObject() and return that", false, true, false);
        test("it should getParam() for the value, and if it doesn't exist call getContractObject() and return that unescaped", false, true, true);
        test("it should getParam() and getContractObj() for the value, and if neither exists return the passed-in requestAttributeValue", false, false, false);
        test("it should getParam() and getContractObj() for the value, and if neither exists return the passed-in requestAttributeValue unescaped", false, false, true);
    });

    describe("calls _writeContractValue", function() {
        var test = function(itText, exists) {
            it(itText, function() {
                var r, name = "test", value = "test%20value", readContract, writeToSessionStorage;
                readContract = spyOn(utils, "readContract").andCallFake(function(name, requestAttribute, escaped) {
                    if (exists) {
                        return escaped ? unescape(value) : value;
                    } 
                    return null;
                });
                writeToSessionStorage = spyOn(utils, "writeToSessionStorage").andCallFake(function(name, value, escaped) { return escaped ? unescape(value) : value; });

                r = utils._writeContractValue(name);
                
                expect(readContract).toHaveBeenCalledWith(name, "", true);
                if (exists) {
                    expect(writeToSessionStorage).toHaveBeenCalledWith(name, unescape(value), true);
                    expect(r).toEqual(unescape(value));
                }
                else {
                    expect(writeToSessionStorage).not.toHaveBeenCalled();
                    expect(r).toEqual(null);
                }
            });
        };
        test("it should readContract(name, '', true) for the value, and if it doesn't exist return false", false);
        test("it should readContract(name, '', true) for the value, and if it exists call writeToSessionStorage() and return the value", true);
    });
    
    describe("calls writeToSessionStorage", function() {
        var test = function(itText, exists, value, namespaceByPath) {
            it(itText, function() {
                var r, name = "test", contractObj = { test: "contractObj" }, _getFromSessionStorage, _removeFromSessionStorage, getContractObject, _addToContractObject, _storeContractObject, _setInSessionStorage;
                _getFromSessionStorage = spyOn(utils, "_getFromSessionStorage").andCallFake(function(name) {
                    if (exists) {
                        return "test%20value";
                    } 
                    return null;
                });
                _removeFromSessionStorage = spyOn(utils, "_removeFromSessionStorage");
                getContractObject = spyOn(utils, "getContractObject").andCallFake(function(name) { return contractObj; });
                _addToContractObject = spyOn(utils, "_addToContractObject");
                _storeContractObject = spyOn(utils, "_storeContractObject");
                _setInSessionStorage = spyOn(utils, "_setInSessionStorage");
                
                r = utils.writeToSessionStorage(name, value, namespaceByPath);
                
                if (!value) {
                    expect(_getFromSessionStorage).toHaveBeenCalledWith(name);
                }
                if (!value && exists) {
                    // Erase
                    expect(_removeFromSessionStorage).toHaveBeenCalledWith(name);
                }
                else {
                    expect(_removeFromSessionStorage).not.toHaveBeenCalledWith(name);
                }
                if (!value || !namespaceByPath) {
                    // Erase or namespaceByPath === false
                    expect(getContractObject).not.toHaveBeenCalled();
                    expect(_addToContractObject).not.toHaveBeenCalled();
                    expect(_storeContractObject).not.toHaveBeenCalled();
                    if (value) {
                        // namespaceByPath === false
                        expect(_setInSessionStorage).toHaveBeenCalledWith(name, value);
                        expect(r).toEqual(value);
                    }
                    else {
                        // Erase
                        expect(_setInSessionStorage).not.toHaveBeenCalled();
                        expect(r).toEqual(null);
                    }
                }
                else {
                    // Valid value, namespaceByPath === true
                    expect(getContractObject).toHaveBeenCalledWith(name);
                    expect(_addToContractObject).toHaveBeenCalledWith(contractObj, value, jasmine.any(Object));
                    expect(_storeContractObject).toHaveBeenCalledWith(name, jasmine.any(Object));
                    expect(_setInSessionStorage).not.toHaveBeenCalled();
                    expect(r).toEqual(value);
                }
            });
        };
        test("with a null value and there is a value stored for the name in sessionStorage, remove it and return null", true, null, true);
        test("with an undefined value and there is a value stored for the name in sessionStorage, remove it and return null", true, undefined, true);
        test("with a null value and there is a value stored for the name in sessionStorage, return null", false, null, true);
        test("with an undefined value and there is a value stored for the name in sessionStorage, return null", false, undefined, true);
        test("with a valid value and namespaceByPath === false it should call _setInSessionStorage() with the raw value and return the value", true, "test value 2", false);
        test("with a valid value and namespaceByPath === true it should call getContractObject(), _addToContractObject(), and _storeContractObject() and return the value", true, "test value 2", true);
    });
    
    describe("calls _parsePath", function() {
        var test, args, i;
        test = function(itText, path, paths) {
            it(itText, function() {
               var r, _getPath;
               _getPath = spyOn(utils, "_getPath").andCallFake(function() { return path; });
               
               r = utils._parsePath();
               
               expect(r).toEqual(paths);
            });
        };
        args = [
                { path: "/", paths: [ "/" ] },
                { path: "/test", paths: [ "/test", "/" ] },
                { path: "/test/", paths: [ "/test", "/" ] },
                { path: "/test/path", paths: [ "/test/path", "/test", "/" ] },
                { path: "/test/path/", paths: [ "/test/path", "/test", "/" ] }
                ];
        for (i = 0; i < args.length; i++) {
            test("when window.location.path === \"" + args[i].path + "\", return [\"" + args[i].paths.join("\", \"") + "\"]", args[i].path, args[i].paths);
        }
    });
    
    describe("calls _addToContractObject", function() {
        var r, obj, value = "test", paths = [ "/test/path", "/test", "/" ];
        it("it should map the value to the paths in the object and return true", function() {
            obj = {};
            
            r = utils._addToContractObject(obj, value, paths);
            
            expect(r).toEqual(true);
            expect(obj.hasOwnProperty(value)).toEqual(true);
            expect(obj[ value ]).toEqual(paths);
        });
        it("it should map the value to the paths in the object, remove the paths from other values, and return true", function() {
            obj = { test2: [ "/test/path", "/test", "/" ] };
            
            r = utils._addToContractObject(obj, value, paths);
            
            expect(r).toEqual(true);
            expect(obj.hasOwnProperty(value)).toEqual(true);
            expect(obj[ value ]).toEqual(paths);
            expect(obj.test2).toEqual([]);
        });
    });
    
    describe("calls getContractObject", function() {
        var r, name = "test", obj, value = "testValue", paths = [ "/test/path", "/test", "/" ], _getFromSessionStorage;
        it("with nothing stored in sessionStorage, it should return {}", function() {
            obj = {};
            _getFromSessionStorage = spyOn(utils, "_getFromSessionStorage").andCallThrough();
            
            r = utils.getContractObject(name);
            
            expect(r).toEqual({});
            expect(_getFromSessionStorage).toHaveBeenCalledWith(name);
        });
        it("with something stored in sessionStorage, it should return the expected object", function() {
            obj = {};
            utils._addToContractObject(obj, value, paths);
            utils._storeContractObject(name, obj);
            _getFromSessionStorage = spyOn(utils, "_getFromSessionStorage").andCallThrough();
            
            r = utils.getContractObject(name);
            
            expect(r).toEqual(obj);
            expect(_getFromSessionStorage).toHaveBeenCalledWith(name);
            
            utils._removeFromSessionStorage(name);
        });
    });
    
    describe("calls _storeContractObject", function() {
        var r, name = "test", value = "testValue", paths = [ "/test/path", "/test", "/" ], obj = { testValue: paths }, str, _setInSessionStorage;
        it("it should call _setInSessionStorage() with the expected value and return true", function() {
            str = value + utils.VALUE_PATH_DELIMITER + paths.join(utils.PATH_DELIMITER) + utils.VALUE_DELIMITER;
            _setInSessionStorage = spyOn(utils, "_setInSessionStorage");
            
            r = utils._storeContractObject(name, obj);
            
            expect(r).toEqual(true);
            expect(_setInSessionStorage).toHaveBeenCalledWith(name, str);
        });
    });
    
    describe("calls loadScripts", function() {
        var test = function(itText, scriptTests) {
            it(itText, function() {
                var r, i, testPasses = [], scriptProps = [], callback, callbackInvoked, callbackSuccess, callbackScriptParam, callbackSuccessParam, loadScript, utilsConsole;
//                window.loadScripts = [];
                for (i = 0; i < scriptTests.length; i++) {
                    testPasses.push(scriptTests[i].initiallyPasses);
                    scriptProps.push({
                                       id: "testId" + i,
                                       src: "http://test" + i + ".url.zap/",
                                       test: (function(i) {
                                           return testPasses[i];
                                       }).bind(this, i),
                                       passes: scriptTests[i]
                                   });
                }
                callbackInvoked = false;
                callbackSuccess = false;
                loadScript = spyOn(utils, "loadScript").andCallFake(function(scriptArgs, callback, debugLevel) {
                    if (callback) {
                        callback(scriptArgs, scriptArgs.passes.initiallyPasses || !scriptArgs.passes.timesOut);
                    }
                });
                utilsConsole = spyOn(utils, "console");
                callback = function(success) {
//                    window.loadScripts.push("callback invoked");
                    callbackInvoked = true;
                    callbackSuccess = success;
                };
                
                runs(function() {
//                    window.loadScripts.push("starting run");
                    r = utils.loadScripts(scriptProps, callback, 5);
                    expect(r).toEqual(true);
                    
                    for (i = 0; i < scriptTests.length; i++) {
                        if (!scriptTests[i].timesOut) {
                            setTimeout((function(i) { 
//                                window.loadScripts.push("setTimeout called, setting testPasses[" + i + "] = true");
                                testPasses[i] = true; 
                            }).bind(this, i), Math.ceil(Math.random() * 300));
                        }
                    }
                });
                
                waitsFor(function() {
                    return callbackInvoked;
                }, "the callback to be invoked", 3100);
                
                runs(function() {
                    var allInitiallyPass = true, noTimeOuts = true;
//                    window.loadScripts.push("ending run");
                    for (i = 0; i < scriptTests.length; i++) {
                        expect(loadScript).toHaveBeenCalledWith(scriptProps[i], jasmine.any(Function), 5);
                        allInitiallyPass = allInitiallyPass && scriptTests[i].initiallyPasses;
                        noTimeOuts = noTimeOuts && !scriptTests[i].timesOut;
                        if (scriptTests[i].timesOut) {
                            expect(utilsConsole).toHaveBeenCalledWith("error", "Failed to load script " + scriptProps[i].id + " at " + scriptProps[i].src + ". Load timed out");
                        }
                        else {
                            expect(utilsConsole).not.toHaveBeenCalledWith("error", "Failed to load script " + scriptProps[i].id + " at " + scriptProps[i].src + ". Load timed out");
                        }
                    }
                    if (allInitiallyPass || noTimeOuts) {
                        expect(callbackSuccess).toEqual(true);
                    }
                    else if (!noTimeOuts) {
                        expect(callbackSuccess).toEqual(false);
                    }
                    expect(callbackInvoked).toEqual(true);
                });
            });
        };
        test("it should call loadScript() for each script in the list and return true, and when all loads succeed, it should call the callback and pass it true", [ { initiallyPasses: false, timesOut: false }, { initiallyPasses: false, timesOut: false }, { initiallyPasses: false, timesOut: false } ]);
        test("it should call loadScript() for each script in the list and return true, and when all loads succeed or timeout, it should call the callback, pass it false and log a console error for those that timed out", [ { initiallyPasses: false, timesOut: false }, { initiallyPasses: false, timesOut: true }, { initiallyPasses: false, timesOut: false } ]);
    });
    
    
});
