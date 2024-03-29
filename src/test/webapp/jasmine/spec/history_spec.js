(function(History, HistoryEntry, Serializable) {
    "use strict";

    describe("DnD.History", function() {
        var history = null, $parent = null;
        beforeEach(function() {
            var fixtures, $fixtures, path;
            fixtures = jasmine.getFixtures();

            path = "/src";
            if (typeof(window.__karma__) !== "undefined") {
                path = "/base" + path;
            }

            fixtures.fixturesPath = path + "/main/webapp/static/html/partials/";
            fixtures.load("history.html", "historyRound.html", "historyEntry.html");
            History.$history = jQuery("div.history");
            History.$round = jQuery("li.round");
            History.$entry = jQuery("li.entry");

            fixtures.fixturesPath = path + "/test/webapp/jasmine/spec/javascripts/fixtures/";
            fixtures.load("historyFixture.html");
            $parent = jQuery("#historyParent");
        });

        describe("it should initialize delegated event handlers", function() {
            var $button = null, event = null, $entries = null;
            beforeEach(function() {
                history = new History({
                    $parent: $parent
                });
                history.add(new History.Entry({ subjectName: "test", message: "test" }));
                $button = history.$html.find("button.expandCollapseAll");
                event = jQuery.Event("click");
                $entries = history.$html.find("ul.entries");
            });
            describe("where clicking the button.expandCollapseAll", function() {
                it("should toggle the visibility of all that history's ul.entries", function() {
                    $button.trigger(event);
                    expect($entries).toBeHidden();
                    $button.trigger(event);
                    expect($entries).toBeVisible();
                });
                it("should toggle the button.expandCollapseAll class", function() {
                    $button.trigger(event);
                    expect($button).toBeMatchedBy(".collapsed");
                    $button.trigger(event);
                    expect($button).toBeMatchedBy(".expanded");
                });
            });
        });

        describe("is instantiated", function() {
            // TODO: come back to this when we can figure out how to work singletons into karma jasmine tests
            xdescribe("the first time", function() {
                it("it should initialize the History singleton", function() {
                    var jQueryDocument = {};
                    jQueryDocument.on = jasmine.createSpy("on").andReturn(jQueryDocument);
                    spyOn(window, "jQuery").andReturn(jQueryDocument);
                    expect(History.hasOwnProperty("initialized")).toEqual(true);
                    expect(History.initialized).toEqual(false);
                    history = new History();
                    expect(History.initialized).toEqual(true);
                    expect(window.jQuery).toHaveBeenCalledWith(document);
                    expect(jQueryDocument.on).toHaveBeenCalledWith("click", "button.expandCollapseAll", jasmine.any(Function));
                    expect(jQueryDocument.on).toHaveBeenCalledWith("click", "li.round", jasmine.any(Function));
                    expect(jQueryDocument.on).toHaveBeenCalledWith("click", "li.entry", jasmine.any(Function));
                });
            });

            describe("with no parameters", function() {
                beforeEach(function() {
                    spyOn(History.prototype, "addToPage");
                    history = new History();
                });

                describe("it should initialize", function() {
                    it("this.__params === {}", function() {
                        expect(history.__params).toEqual({});
                    });
                    it("this._entries === []", function() {
                        expect(history._entries).toEqual([]);
                    });
                    it("this._round === 1", function() {
                        expect(history._round).toEqual(1);
                    });
                    it("this._count === 0", function() {
                        expect(history._count).toEqual(0);
                    });
                    it("this._roundTimes === {}", function() {
                        expect(history._roundTimes).toEqual({});
                    });
                    it("this._includeSubject === false", function() {
                        expect(history._includeSubject).toEqual(false);
                    });
                });
                it("it should not call addToPage", function() {
                    expect(History.prototype.addToPage).not.toHaveBeenCalled();
                });
            });

            describe("with parameters", function() {
                var params = null;
                beforeEach(function() {
                    spyOn(History.prototype, "addToPage").andReturn(false);
                    params = {
                        _entries: [ "testEntry" ],
                        _round: 7,
                        _roundTimes: { 1: 12, 2: 24, 3: 68, 4: 83, 5: 75, 6: 110 },
                        _includeSubject: "testSubject",
                        $parent: $parent
                    };
                    history = new History(params);
                });

                describe("it should initialize", function() {
                    it("this.__params === params", function() {
                        expect(history.__params).toEqual(params);
                    });
                    it("this._entries === params._entries", function() {
                        expect(history._entries).toEqual(params._entries);
                    });
                    it("this._round === params._round", function() {
                        expect(history._round).toEqual(params._round);
                    });
                    it("this._count === 0", function() {
                        expect(history._count).toEqual(0);
                    });
                    it("this._roundTimes === params._roundTimes", function() {
                        expect(history._roundTimes).toEqual(params._roundTimes);
                    });
                    it("this._includeSubject === true", function() {
                        expect(history._includeSubject).toEqual(true);
                    });
                });
                it("it should call addToPage", function() {
                    expect(History.prototype.addToPage).toHaveBeenCalledWith($parent);
                });

            });
        });


        describe("methods", function() {
            beforeEach(function() {
                history = new History({
                    $parent: $parent
                });
            });


            describe("toString()", function() {
                it("should return \"[History\"]", function() {
                    expect(history.toString()).toEqual("[History]");
                });
            });


            describe("toJSON()", function() {
                it("should call JSON.stringify() on the output of raw()", function() {
                    spyOn(history, "raw").andReturn("testRaw");
                    spyOn(JSON, "stringify").andReturn("testJSON");
                    expect(history.toJSON()).toEqual("testJSON");
                    expect(history.raw).toHaveBeenCalled();
                    expect(JSON.stringify).toHaveBeenCalledWith("testRaw", null, "  ");
                });
            });


            describe("addToPage()", function() {
                describe("with an invalid $parent parameter", function() {
                    it("it should do nothing", function() {
                        spyOn(History, "_areTemplatesReady").andReturn(false);
                        history.$parent = "testParent";
                        history.addToPage();
                        expect(history.$parent).toEqual("testParent");
                        expect(History._areTemplatesReady).not.toHaveBeenCalled();

                        history.addToPage({ length: 0 });
                        expect(history.$parent).toEqual("testParent");
                        expect(History._areTemplatesReady).not.toHaveBeenCalled();
                    });
                });
                describe("with a valid $parent parameter", function() {
                    var templatesReady = false;
                    beforeEach(function() {
                        History._waitingOnTemplates = [];
                        spyOn(History, "_areTemplatesReady").andCallFake(function() { return templatesReady; });
                        spyOn(history, "_create");
                    });
                    it("it should set this.$parent to the passed $parent", function() {
                        history.$parent = "testParent";
                        history.addToPage($parent);
                        expect(history.$parent).toEqual($parent);
                    });
                    it("it should check that the HTML templates are ready", function() {
                        history.addToPage($parent);
                        expect(History._areTemplatesReady).toHaveBeenCalled();
                    });
                    describe("if the HTML templates are not ready", function() {
                        it("it should add this History instance to the History._waitingOnTemplates Array", function() {
                            templatesReady = false;
                            history.addToPage($parent);
                            expect(history._create).not.toHaveBeenCalled();
                            expect(History._waitingOnTemplates.indexOf(history)).not.toEqual(-1);
                        });
                    });
                    describe("if the HTML templates are ready", function() {
                        it("it should call _create()", function() {
                            templatesReady = true;
                            history.addToPage($parent);
                            expect(history._create).toHaveBeenCalled();
                            expect(History._waitingOnTemplates.indexOf(history)).toEqual(-1);
                        });
                    });
                });
            });


            describe("add()", function() {
                var entry = null;
                describe("is called with an invalid entry parameter", function() {
                    it("it should do nothing", function() {
                        history.add(undefined);
                        history.add(null);
                        history.add(1);
                        history.add(true);
                        entry = [];
                        history.add(entry);
                        expect(entry.hasOwnProperty("round")).toEqual(false);
                        entry = {};
                        history.add(entry);
                        expect(entry.hasOwnProperty("round")).toEqual(false);
                    });
                });
                describe("is called with a valid entry parameter", function() {
                    beforeEach(function() {
                        entry = new HistoryEntry();
                        spyOn(entry, "_addToRound");
                        spyOn(history, "_getRound").andReturn("testRound");
                        History.central = jasmine.createSpyObj("central", [ "add" ]);
                    });
                    afterEach(function() {
                        History.central = null;
                    });

                    it("it should set the entry.round to history._round if not already set", function() {
                        history.add(entry);
                        expect(entry.hasOwnProperty("round")).toEqual(true);
                        expect(entry.round).toEqual(history._round);
                    });
                    describe("if there's an Entry with the same id already present", function() {
                        it("it should not add the entry to history._entries", function() {
                            history._entries.push(entry.id);
                            history.add(entry);
                            expect(history._entries.length).toEqual(1);
                            expect(history._getRound).not.toHaveBeenCalled();
                            expect(entry._addToRound).not.toHaveBeenCalled();
                            expect(History.central.add).not.toHaveBeenCalled();
                        });
                    });
                    describe("if there's no Entry with the same id already present", function() {
                        it("it should add the entry to history._entries", function() {
                            history.add(entry);
                            expect(history._entries.length).toEqual(1);
                            expect(history._entries.indexOf(entry.id)).not.toEqual(-1);
                        });
                        it("it should add call _getRound() to find/create the parent HTML, then call entry._addToRound()", function() {
                            history.add(entry);
                            expect(history._getRound).toHaveBeenCalledWith(entry, true);
                            expect(entry._addToRound).toHaveBeenCalledWith("testRound", history._includeSubject);
                            expect(History.central.add).toHaveBeenCalled();
                        });
                        describe("if this History instance is not History.central", function() {
                            it("it should call History.central.add() with the same entry", function() {
                                history.add(entry);
                                expect(History.central.add).toHaveBeenCalledWith(entry);
                            });
                        });
                    });
                });
            });

            describe("update()", function() {
                var entry, testHtml;
                entry = testHtml = null;
                beforeEach(function() {
                    entry = new HistoryEntry();
                    spyOn(entry, "_render");
                    testHtml = jasmine.createSpyObj("testHtml", [ "data" ]);
                    testHtml.data.andReturn("entryInstance");
                    history.$html = { find: jasmine.createSpy("find").andReturn(testHtml) };
                });

                describe("is called with an invalid entry parameter", function() {
                    it("it should do nothing", function() {
                        history.update(undefined);
                        history.update(null);
                        history.update(1);
                        history.update(true);
                        entry = [];
                        history.update(entry);
                        expect(history.$html.find).not.toHaveBeenCalled();
                        entry = {};
                        history.update(entry);
                        expect(history.$html.find).not.toHaveBeenCalled();
                    });
                });
                describe("is called with a valid entry parameter", function() {
                    it("it should find the parent HTML and call entry._render()", function() {
                        history.update(entry);
                        expect(history.$html.find).toHaveBeenCalledWith("li.entry" + entry.id);
                        expect(testHtml.data).toHaveBeenCalledWith("instance");
                        expect(entry._render).toHaveBeenCalledWith("entryInstance", history._includeSubject);
                    });
                });
            });

            describe("remove()", function() {
                var entry = null, $entry = null;
                beforeEach(function() {
                    entry = new HistoryEntry();
                    history.$html = { find: jasmine.createSpy("find").andCallFake(function() { return $entry; }) };
                });

                describe("is called with an invalid entry parameter", function() {
                    it("it should do nothing", function() {
                        history.remove(undefined);
                        history.remove(null);
                        history.remove(1);
                        history.remove(true);
                        entry = [];
                        history.remove(entry);
                        expect(history.$html.find).not.toHaveBeenCalled();
                        entry = {};
                        history.remove(entry);
                        expect(history.$html.find).not.toHaveBeenCalled();
                    });
                });
                describe("is called with a valid entry parameter", function() {
                    var $html = null, $ulHistory = null, $liRound = null, $ulRound = null, $entry = null;
                    beforeEach(function() {
                        $html = jQuery("<div class=\"history\"></div>");
                        $ulHistory = jQuery("<ul class=\"history\"></ul>").appendTo($html);
                        $liRound = jQuery("<li class=\"round\"></li>").appendTo($ulHistory);
                        $ulRound = jQuery("<ul class=\"entries round\"></ul>").appendTo($liRound);
                        $entry = jQuery("<li class=\"entry\"/>").addClass("entry" + entry.id).appendTo($ulRound);
                        history.$html = $html;
                        spyOn(history, "_noHistory");
                    });

                    describe("when this History has more than 1 round", function() {
                        it("it should find the parent HTML and remove the entry and round HTML", function() {
                            // Has more than 1 round
                            jQuery("<li class=\"round\"></li>").appendTo($ulHistory);
                            history.remove(entry);
                            expect($entry.parent().length).toEqual(0);
                            expect($liRound.parent().length).toEqual(0);
                            expect(history._noHistory).not.toHaveBeenCalled();
                        });
                    });
                    describe("when this History has only 1 round", function() {
                        describe("and more than 1 entry", function() {
                            it("it should find the parent HTML and remove the entry HTML", function() {
                                // Has more than 1 entry
                                jQuery("<li class=\"entry\"/>").appendTo($ulRound);
                                history.remove(entry);
                                expect($entry.parent().length).toEqual(0);
                                expect($liRound.parent().length).toEqual(1);
                                expect(history._noHistory).not.toHaveBeenCalled();
                            });
                        });
                        describe("and only that entry", function() {
                            it("it should find the parent HTML and remove the entire History HTML", function() {
                                history.remove(entry);
                                expect($entry.parent().length).toEqual(0);
                                expect($ulRound.parent().length).toEqual(0);
                                expect($liRound.parent().length).toEqual(0);
                                expect($html.parent().length).toEqual(0);
                                expect(history._noHistory).toHaveBeenCalled();
                            });
                        });
                    });
                });
            });


            describe("clear()", function() {
                it("it should then reset its members and call noHistory()", function() {
                    var entries, i, entry;
                    entries = [];
                    HistoryEntry.entries = {};
                    for (i = 0; i < 3; i++) {
                        entry = new HistoryEntry();
                        entries.push(entry);
                        history._entries.push(entry.id);
                    }
                    spyOn(history, "_noHistory");
                    history.clear();
                    expect(history._noHistory).toHaveBeenCalled();
                    expect(history._entries).toEqual([]);
                    expect(history._round).toEqual(1);
                    expect(history._count).toEqual(0);
                });
            });

            describe("setRoundTime()", function() {
                var $ul;
                beforeEach(function() {
                    var $div, $span;
                    $div = jQuery("<div/>");
                    $ul = jQuery("<ul/>").appendTo($div);
                    $span = jQuery("<span/>").addClass("time").appendTo($div);
                    spyOn(history, "_getRound").andReturn($ul);
                    spyOn(history, "_setRoundTime");
                });
                describe("is called with no round parameter", function() {
                    it("it should use the History's current _round", function() {
                        history._round = 22;
                        expect(history.setRoundTime(10000)).toEqual(false);
                        expect(history._roundTimes.hasOwnProperty(22)).toEqual(true);
                        expect(history._roundTimes[ 22 ]).toEqual(10000);
                    });
                });
                describe("is called with a round parameter", function() {
                    it("it should use the passed round", function() {
                        expect(history.setRoundTime(10000, 23)).toEqual(false);
                        expect(history._roundTimes.hasOwnProperty(23)).toEqual(true);
                        expect(history._roundTimes[ 23 ]).toEqual(10000);
                    });
                });
                describe("is called when the History instance has no $html", function() {
                    it("it should set the round time and do nothing else", function() {
                        expect(history.setRoundTime(10000, 24)).toEqual(false);
                        expect(history._roundTimes.hasOwnProperty(24)).toEqual(true);
                        expect(history._roundTimes[ 24 ]).toEqual(10000);
                        expect(history._getRound).not.toHaveBeenCalled();
                        expect(history._setRoundTime).not.toHaveBeenCalled();
                    });
                });
                describe("is called when the History instance has $html", function() {
                    it("it should set the round time, get the time $span and call _setRoundTime()", function() {
                        history._count = 1;
                        expect(history.setRoundTime(10000, 25)).toEqual(true);
                        expect(history._roundTimes.hasOwnProperty(25)).toEqual(true);
                        expect(history._roundTimes[ 25 ]).toEqual(10000);
                        expect(history._getRound).toHaveBeenCalledWith(25, true);
                        expect(history._setRoundTime).toHaveBeenCalledWith(jasmine.any(Object), 10000); // NOTE: using matcher since jQuery returns a different Object than the cached $span
                    });
                });
            });

            describe("_create()", function() {
                beforeEach(function() {
                    var i, entry;
                    spyOn(history, "_createHtml");
                    spyOn(history, "_noHistory");
                    spyOn(history, "_getRound").andReturn("testRound");
                    HistoryEntry.entries = {};
                    for (i = 0; i < 3; i++) {
                        entry = new HistoryEntry({ round: i });
                        spyOn(entry, "_addToRound");
                    }
                });

                describe("is called on a History instance with no _entries", function() {
                    it("it should call _noHistory()", function() {
                        history._create();
                        expect(history._noHistory).toHaveBeenCalled();
                        expect(history._createHtml).not.toHaveBeenCalled();
                    });
                });
                describe("is called on a History instance with _entries", function() {
                    beforeEach(function() {
                        var i, entry;
                        i = null;
                        for (i in HistoryEntry.entries) {
                            if (HistoryEntry.entries.hasOwnProperty(i)) {
                                entry = HistoryEntry.entries[ i ];
                                history._entries.push(entry.id);
                            }
                        }
                    });

                    it("it should call _createHtml()", function() {
                        var i, entry;
                        i = null;
                        history._create();
                        expect(history._noHistory).not.toHaveBeenCalled();
                        expect(history._createHtml).toHaveBeenCalled();
                        for (i in HistoryEntry.entries) {
                            if (HistoryEntry.entries.hasOwnProperty(i)) {
                                entry = HistoryEntry.entries[ i ];
                                expect(history._getRound).toHaveBeenCalledWith(entry, true);
                                expect(entry._addToRound).toHaveBeenCalledWith("testRound", history._includeSubject);
                            }
                        }
                    });
                });
            });

            describe("_createHtml()", function() {
                var $history = null;
                beforeEach(function() {
                    $history = History.$history;
                    History.histories = [];
                    History.$history = jQuery("<div class=\"test\"/></div>");
                    spyOn(History.$history, "clone").andCallThrough();
                });
                afterEach(function() {
                    History.$history = $history;
                });

                it("it should clone the History.$history template", function() {
                    history._createHtml();
                    expect(History.$history.clone).toHaveBeenCalled();
                });
                describe("is called on a History instance with no existing $html", function() {
                    it("it should append the clone to this.$parent", function() {
                        history.$parent.empty();
                        history.$html = null;
                        history._createHtml();
                        expect(history.$parent.children().length).toEqual(1);
                        expect(history.$parent.html()).toEqual("<div class=\"test\" data-history-id=\"0\"></div>");
                    });
                });
                describe("is called on a History instance with existing $html", function() {
                    it("it should remove the existing this.$html and append the clone to this.$parent in its stead", function() {
                        var $html = history.$html;
                        history.$html.attr("test", "test");
                        history._createHtml();
                        expect(history.$parent.children().length).toEqual(1);
                        expect(history.$parent.html()).toEqual("<div class=\"test\" data-history-id=\"0\"></div>");
                        expect($html.parent().length).toEqual(0);
                    });
                });
            });

            describe("_noHistory()", function() {
                beforeEach(function() {
                    History.histories = [];
                });

                describe("is called on a History instance with no existing $html", function() {
                    it("it should append <span>No history</span> to this.$parent", function() {
                        history.$parent.empty();
                        history.$html = null;
                        history._noHistory();
                        expect(history.$parent.children().length).toEqual(1);
                        expect(history.$parent.html()).toEqual("<span data-history-id=\"0\">No history</span>");
                    });
                });
                describe("is called on a History instance with existing $html", function() {
                    it("it should remove the existing this.$html and append <span>No history</span> to this.$parent in its stead", function() {
                        var $html = history.$html;
                        history.$html.attr("test", "test");
                        history._noHistory();
                        expect(history.$parent.children().length).toEqual(1);
                        expect(history.$parent.html()).toEqual("<span data-history-id=\"0\">No history</span>");
                        expect($html.parent().length).toEqual(0);
                    });
                });
            });

            describe("_getRound()", function() {
                describe("is called on a History instance with no existing $html", function() {
                    beforeEach(function() {
                        history.$parent.empty();
                        history.$html = null;
                    });
                    it("and passed create === false, it should do nothing", function() {
                        spyOn(history, "_createHtml").andCallThrough();
                        history._getRound(1, false);
                        expect(history._createHtml).not.toHaveBeenCalled();
                    });
                    it("and passed create === true, it should call _createHtml()", function() {
                        spyOn(history, "_createHtml").andCallThrough();
                        history._getRound(1, true);
                        expect(history._createHtml).toHaveBeenCalled();
                    });
                });
                describe("is called on a History instance with existing $html", function() {
                    beforeEach(function() {
                        history.add(new HistoryEntry());
                        spyOn(history, "_createHtml").andCallThrough();
                    });

                    it("it should not call _createHtml()", function() {
                        history._getRound(1, true);
                        expect(history._createHtml).not.toHaveBeenCalled();
                    });
                    it("it should search for existing HTML matching the requested round", function() {
                        var children = jasmine.createSpy("children").andReturn({ length: 0 });
                        spyOn(history.$html, "children").andReturn({ children: children });
                        history._getRound(1, true);
                        expect(history.$html.children).toHaveBeenCalledWith(".round1");
                        expect(children).toHaveBeenCalledWith("ul");
                    });
                    it("if HTML matching the requested round exists, it should return that HTML", function() {
                        var $ul, r, children;
                        $ul = jQuery("<ul/>");
                        children = jasmine.createSpy("children").andReturn($ul);
                        spyOn(history.$html, "children").andReturn({ children: children });
                        r = history._getRound(1, true);
                        expect(r).toEqual($ul);
                    });
                    describe("if no HTML matching the requested round exists", function() {
                        it("if passed create === false, it should do nothing and return null", function() {
                            var r, children;
                            spyOn(History.$round, "clone").andCallThrough();
                            children = jasmine.createSpy("children").andReturn({ length: 0 });
                            spyOn(history.$html, "children").andReturn({ children: children });
                            r = history._getRound(1, false);
                            expect(History.$round.clone).not.toHaveBeenCalled();
                            expect(r).toEqual(null);
                        });
                        describe("if passed create === true,", function() {
                            var r = null, $cloneLi = null, $cloneUl = null, children = null;
                            beforeEach(function() {
                                $cloneLi = jQuery("<li><span class=\"roundLabel\"><span class=\"round\"></span><span class=\"time\"></span></span></li>");
                                $cloneUl = jQuery("<ul class=\"entries\"></ul>").appendTo($cloneLi);
                                spyOn(History.$round, "clone").andReturn($cloneLi);
                                spyOn(history, "_setRoundTime");
                                children = jasmine.createSpy("children").andReturn({ length: 0 });
                                spyOn(history.$html, "children").andReturn({ children: children });
                                r = history._getRound(1, true);
                            });
                            it("it should clone History.$round and append it to $html", function() {
                                expect(History.$round.clone).toHaveBeenCalled();
                                expect(r[0]).toEqual($cloneUl[0]);
                                expect($cloneLi.parent()[0]).toEqual(history.$html[0]);
                            });
                            it("it should set the History instance as jQuery data on the clone", function() {
                                expect($cloneLi.data("history")).toEqual(history);
                            });
                            it("it should set the round label HTML to the requested round", function() {
                                expect($cloneLi.find(".roundLabel .round").html()).toEqual("1");
                            });
                            it("it should add the round as a class to the entries <ul/>", function() {
                                expect($cloneUl.hasClass("round1")).toEqual(true);
                            });
                            it("if the History instance has a round time for the requested round, it should call _setRoundTime() on the matching HTML", function() {
                                expect(history._setRoundTime).not.toHaveBeenCalled();
                                history._createHtml();
                                history._roundTimes[ 1 ] = 30000;
                                history._getRound(1, true);
                                expect(history._setRoundTime).toHaveBeenCalledWith(jasmine.any(Object), 30000);
                            });
                        });
                    });
                });
            });

            describe("_setRoundTime()", function() {
                var $time = null;
                beforeEach(function() {
                    $time = jQuery("<span></span>");
                });

                it("is called with an invalid $time, it should fail without error", function() {
                    expect(function() { history._setRoundTime(null, 30000); }).not.toThrow();
                });
                describe("is called with a valid $time, for example", function() {
                    it("0, it should set $time.html() to 00:00", function() {
                        history._setRoundTime($time, 0);
                        expect($time.html()).toEqual("00:00");
                    });
                    it("36000, it should set $time.html() to 00:36", function() {
                        history._setRoundTime($time, 36000);
                        expect($time.html()).toEqual("00:36");
                    });
                    it("62000, it should set $time.html() to 01:02", function() {
                        history._setRoundTime($time, 62000);
                        expect($time.html()).toEqual("01:02");
                    });
                    it("132000, it should set $time.html() to 02:02", function() {
                        history._setRoundTime($time, 132000);
                        expect($time.html()).toEqual("02:12");
                    });
                });
            });

            describe("_editEntry", function() {
                it("it should find the History.Entry from the HTML.data() and call its _edit method", function() {
                    var entry, $entry;
                    entry = { _edit: jasmine.createSpy("_edit") };
                    $entry = jQuery("<div/>").data("entry", entry);
                    history._editEntry($entry, history);
                    expect(entry._edit).toHaveBeenCalledWith($entry, history);
                });
            });

        }); // History methods


        describe("History is serialized, set in storage, read from storage, deserialized and reinitialized", function() {
            it("it should produce identical results", function() {
                var rawIn, jsonIn, jsonOut, rawOut, history2;
                rawIn = {
                    historyEntries: Serializable.prototype.rawObj(HistoryEntry.entries),
                    history: history.raw()

                };
                jsonIn = JSON.stringify(rawIn);
                window.sessionStorage.setItem("test", jsonIn);
                jsonOut = window.sessionStorage.getItem("test");
                try {
                    rawOut = JSON.parse(jsonOut);
                }
                finally {}

                HistoryEntry.init(rawOut.historyEntries); // NOTE: must come before this.actors is initialized because Creature.history references it
                history2 = new History(rawOut.history); // NOTE: must come after this.actors is initialized because of _includeSubject

                expect(history2._entries.length).toEqual(history._entries.length);
                expect(history2._round).toEqual(history._round);
                expect(history2._count).toEqual(history._count);
                expect(history2._roundTimes).toEqual(history._roundTimes);
                expect(history2._includeSubject).toEqual(history._includeSubject);
            });
        });

    });

})(DnD.History, DnD.History.Entry, DnD.modules.Serializable.create());

