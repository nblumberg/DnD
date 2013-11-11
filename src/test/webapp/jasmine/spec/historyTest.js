describe("DnD.History", function() {
    var history;
    describe("is instantiated", function() {
        // TODO: come back to this when we can figure out how to work singletons into karma jasmine tests
        xdescribe("the first time", function() {
            it("it should initialize the History singleton", function() {
                var jQueryDocument = {};
                jQueryDocument.on = jasmine.createSpy("on").andReturn(jQueryDocument);
                spyOn(window, "jQuery").andReturn(jQueryDocument);
                expect(DnD.History.hasOwnProperty("initialized")).toEqual(true);
                expect(DnD.History.initialized).toEqual(false);
                history = new DnD.History();
                expect(DnD.History.initialized).toEqual(true);
                expect(window.jQuery).toHaveBeenCalledWith(document);
                expect(jQueryDocument.on).toHaveBeenCalledWith("click", "button.expandCollapseAll", jasmine.any(Function));
                expect(jQueryDocument.on).toHaveBeenCalledWith("click", "li.round", jasmine.any(Function));
                expect(jQueryDocument.on).toHaveBeenCalledWith("click", "li.entry", jasmine.any(Function));
            });
        });

        describe("with no parameters", function() {
            var areTemplatesReady;
            beforeEach(function() {
                areTemplatesReady = spyOn(DnD.History, "_areTemplatesReady").andReturn(false);
                history = new DnD.History();
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
            // TODO: how to set a spy on a method mid-constructor?
            it("it should not call addToPage", function() {
                expect(areTemplatesReady).not.toHaveBeenCalled();
            });
        });

        describe("with parameters", function() {
            var params, areTemplatesReady;
            beforeEach(function() {
                areTemplatesReady = spyOn(DnD.History, "_areTemplatesReady").andReturn(false);
                params = {
                        _entries: [ "testEntry" ],
                        _round: 7,
                        _roundTimes: { 1: 12, 2: 24, 3: 68, 4: 83, 5: 75, 6: 110 },
                        _includeSubject: "testSubject",
                        $parent: { length: 1 }
                };
                history = new DnD.History(params);
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
            // TODO: how to set a spy on a method mid-constructor?
            it("it should call addToPage", function() {
                expect(areTemplatesReady).toHaveBeenCalled();
            });

        });
    });


    describe("methods", function() {
        beforeEach(function() {
            history = new DnD.History();
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
            var areTemplatesReady, validParent = { length: 1, test: true };
            describe("with an invalid $parent parameter", function() {
                it("it should do nothing", function() {
                    areTemplatesReady = spyOn(DnD.History, "_areTemplatesReady").andReturn(false);
                    history.$parent = "testParent";
                    history.addToPage();
                    expect(history.$parent).toEqual("testParent");
                    expect(areTemplatesReady).not.toHaveBeenCalled();

                    history.addToPage({ length: 0 });
                    expect(history.$parent).toEqual("testParent");
                    expect(areTemplatesReady).not.toHaveBeenCalled();
                });
            });
            describe("with a valid $parent parameter", function() {
                var templatesReady = false;
                beforeEach(function() {
                    DnD.History._waitingOnTemplates = [];
                    areTemplatesReady = spyOn(DnD.History, "_areTemplatesReady").andCallFake(function() { return templatesReady; });
                    spyOn(history, "_create");
                });
                it("it should set this.$parent to the passed $parent", function() {
                    history.$parent = "testParent";
                    history.addToPage(validParent);
                    expect(history.$parent).toEqual(validParent);
                });
                it("it should check that the HTML templates are ready", function() {
                    history.addToPage(validParent);
                    expect(areTemplatesReady).toHaveBeenCalled();
                });
                describe("if the HTML templates are not ready", function() {
                    it("it should add this History instance to the History._waitingOnTemplates Array", function() {
                        templatesReady = false;
                        history.addToPage(validParent);
                        expect(history._create).not.toHaveBeenCalled();
                        expect(DnD.History._waitingOnTemplates.indexOf(history)).not.toEqual(-1);
                    });
                });
                describe("if the HTML templates are ready", function() {
                    it("it should call _create()", function() {
                        templatesReady = true;
                        history.addToPage(validParent);
                        expect(history._create).toHaveBeenCalled();
                        expect(DnD.History._waitingOnTemplates.indexOf(history)).toEqual(-1);
                    });
                });
            });
        });


        describe("add()", function() {
            var entry;
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
                var addToRound, getRound, centralAdd;
                beforeEach(function() {
                    entry = new DnD.History.Entry();
                    addToRound = spyOn(entry, "_addToRound");
                    getRound = spyOn(history, "_getRound").andReturn("testRound");
                    DnD.History.central = jasmine.createSpyObj("central", [ "add" ]);
                });
                afterEach(function() {
                    DnD.History.central = null;
                });

                it("it should set the entry.round to this._round if not already set", function() {
                    history.add(entry);
                    expect(entry.hasOwnProperty("round")).toEqual(true);
                    expect(entry.round).toEqual(history._round);
                });
                describe("if there's an Entry with the same id already present", function() {
                    it("it should not add the entry to this._entries", function() {
                        history._entries.push(entry.id);
                        history.add(entry);
                        expect(history._entries.length).toEqual(1);
                        expect(getRound).not.toHaveBeenCalled();
                        expect(addToRound).not.toHaveBeenCalled();
                        expect(DnD.History.central.add).not.toHaveBeenCalled();
                    });
                });
                describe("if there's no Entry with the same id already present", function() {
                    it("it should add the entry to this._entries", function() {
                        history.add(entry);
                        expect(history._entries.length).toEqual(1);
                        expect(history._entries.indexOf(entry.id)).not.toEqual(-1);
                    });
                    it("it should add call _getRound() to find/create the parent HTML, then call entry._addToRound()", function() {
                        history.add(entry);
                        expect(getRound).toHaveBeenCalledWith(entry, true);
                        expect(addToRound).toHaveBeenCalledWith("testRound", history._includeSubject);
                        expect(DnD.History.central.add).toHaveBeenCalled();
                    });
                    describe("if this History instance is not History.central", function() {
                        it("it should call History.central.add() with the same entry", function() {
                            history.add(entry);
                            expect(DnD.History.central.add).toHaveBeenCalledWith(entry);
                        });
                    });
                });
            });
        });

        describe("update()", function() {
            var entry;
            beforeEach(function() {
                entry = new DnD.History.Entry();
                spyOn(entry, "_render");
                history.$html = { find: jasmine.createSpy("find").andReturn("testHtml") };
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
                    expect(entry._render).toHaveBeenCalledWith("testHtml", history._includeSubject);
                });
            });
        });

        describe("remove()", function() {
            var entry, $entry;
            beforeEach(function() {
                entry = new DnD.History.Entry();
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
                var $html, $ulHistory, $liRound, $ulRound, $entry;
                beforeEach(function() {
                    var $tmp;
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
                        var $round;
                        // Has more than 1 round
                        $round = jQuery("<li class=\"round\"></li>").appendTo($ulHistory);
                        history.remove(entry);
                        expect($entry.parent().length).toEqual(0);
                        expect($liRound.parent().length).toEqual(0);
                        expect(history._noHistory).not.toHaveBeenCalled();
                    });
                });
                describe("when this History has only 1 round", function() {
                    describe("and more than 1 entry", function() {
                        it("it should find the parent HTML and remove the entry HTML", function() {
                            var $entry2;
                            // Has more than 1 entry
                            $entry2 = jQuery("<li class=\"entry\"/>").appendTo($ulRound);
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
                DnD.History.Entry.entries = {};
                for (i = 0; i < 3; i++) {
                    entry = new DnD.History.Entry();
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
            var $ul, $span;
            beforeEach(function() {
                var $div;
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
                DnD.History.Entry.entries = {};
                for (i = 0; i < 3; i++) {
                    entry = new DnD.History.Entry({ round: i });
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
                    var i;
                    for (i in DnD.History.Entry.entries) {
                        if (DnD.History.Entry.entries.hasOwnProperty(i)) {
                            entry = DnD.History.Entry.entries[ i ];
                            history._entries.push(entry.id);
                        }
                    }
                });

                it("it should call _createHtml()", function() {
                    var i;
                    history._create();
                    expect(history._noHistory).not.toHaveBeenCalled();
                    expect(history._createHtml).toHaveBeenCalled();
                    for (i in DnD.History.Entry.entries) {
                        if (DnD.History.Entry.entries.hasOwnProperty(i)) {
                            entry = DnD.History.Entry.entries[ i ];
                            expect(history._getRound).toHaveBeenCalledWith(entry, true);
                            expect(entry._addToRound).toHaveBeenCalledWith("testRound", history._includeSubject);
                        }
                    }
                });
            });
        });

        describe("_createHtml()", function() {
            var $history;
            beforeEach(function() {
                var i, entry;
                $history = DnD.History.$history;
                history.$parent = jQuery("<div class=\"parent\"/></div>");
                DnD.History.histories = [];
                DnD.History.$history = jQuery("<div class=\"test\"/></div>");
                spyOn(DnD.History.$history, "clone").andCallThrough();
            });
            afterEach(function() {
                DnD.History.$history = $history;
            });

            it("it should clone the History.$history template", function() {
                history._createHtml();
                expect(DnD.History.$history.clone).toHaveBeenCalled();
            });
            describe("is called on a History instance with no existing $html", function() {
                it("it should append the clone to this.$parent", function() {
                    expect(history.$parent.children().length).toEqual(0);
                    history._createHtml();
                    expect(history.$parent.children().length).toEqual(1);
                    expect(history.$parent.html()).toEqual("<div class=\"test\" data-history-id=\"0\"></div>");
                });
            });
            describe("is called on a History instance with existing $html", function() {
                it("it should remove the existing this.$html and append the clone to this.$parent in its stead", function() {
                    var $html = jQuery("<div class=\"html\"/></div>").appendTo(history.$parent);
                    history.$html = $html;
                    expect($html.parent().length).toEqual(1);
                    expect(history.$parent.children().length).toEqual(1);
                    history._createHtml();
                    expect(history.$parent.children().length).toEqual(1);
                    expect(history.$parent.html()).toEqual("<div class=\"test\" data-history-id=\"0\"></div>");
                    expect($html.parent().length).toEqual(0);
                });
            });
        });

        describe("_noHistory()", function() {
            beforeEach(function() {
                var i, entry;
                history.$parent = jQuery("<div class=\"parent\"/></div>");
                DnD.History.histories = [];
            });

            describe("is called on a History instance with no existing $html", function() {
                it("it should append <span>No history</span> to this.$parent", function() {
                    expect(history.$parent.children().length).toEqual(0);
                    history._noHistory();
                    expect(history.$parent.children().length).toEqual(1);
                    expect(history.$parent.html()).toEqual("<span data-history-id=\"0\">No history</span>");
                });
            });
            describe("is called on a History instance with existing $html", function() {
                it("it should remove the existing this.$html and append <span>No history</span> to this.$parent in its stead", function() {
                    var $html = jQuery("<div class=\"html\"/></div>").appendTo(history.$parent);
                    history.$html = $html;
                    expect($html.parent().length).toEqual(1);
                    expect(history.$parent.children().length).toEqual(1);
                    history._noHistory();
                    expect(history.$parent.children().length).toEqual(1);
                    expect(history.$parent.html()).toEqual("<span data-history-id=\"0\">No history</span>");
                    expect($html.parent().length).toEqual(0);
                });
            });
        });

        describe("_getRound()", function() {
            describe("is called on a History instance with no existing $html", function() {
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
                    history._createHtml();
                    history._count = 1; // TODO: what does _count really mean?
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
                        spyOn(DnD.History.$round, "clone").andCallThrough();
                        children = jasmine.createSpy("children").andReturn({ length: 0 });
                        spyOn(history.$html, "children").andReturn({ children: children });
                        r = history._getRound(1, false);
                        expect(DnD.History.$round.clone).not.toHaveBeenCalled();
                        expect(r).toEqual(null);
                    });
                    describe("if passed create === true,", function() {
                        var r, $cloneLi, $cloneUl, children;
                        beforeEach(function() {
                            $cloneLi = jQuery("<li><span class=\"roundLabel\"><span class=\"round\"></span><span class=\"time\"></span></span></li>");
                            $cloneUl = jQuery("<ul class=\"entries\"></ul>").appendTo($cloneLi);
                            spyOn(DnD.History.$round, "clone").andReturn($cloneLi);
                            spyOn(history, "_setRoundTime");
                            children = jasmine.createSpy("children").andReturn({ length: 0 });
                            spyOn(history.$html, "children").andReturn({ children: children });
                            r = history._getRound(1, true);
                        });
                        it("it should clone History.$round and append it to $html", function() {
                            expect(DnD.History.$round.clone).toHaveBeenCalled();
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
            var $time;
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
                    historyEntries: Serializable.prototype.rawObj(DnD.History.Entry.entries),
                    history: history.raw()

            };
            jsonIn = JSON.stringify(rawIn);
            window.sessionStorage.setItem("test", jsonIn);
            jsonOut = window.sessionStorage.getItem("test");
            try {
                rawOut = JSON.parse(jsonOut);
            }
            finally {}

            DnD.History.Entry.init(rawOut.historyEntries); // NOTE: must come before this.actors is initialized because Creature.history references it
            history2 = new DnD.History(rawOut.history); // NOTE: must come after this.actors is initialized because of _includeSubject

            expect(history2._entries.length).toEqual(history._entries.length);
            expect(history2._round).toEqual(history._round);
            expect(history2._count).toEqual(history._count);
            expect(history2._roundTimes).toEqual(history._roundTimes);
            expect(history2._includeSubject).toEqual(history._includeSubject);

        });
    });

});