(function(Test) {
    "use strict";

    DnD.define(
        "effectTests",
        [ "Effect" ],
        function(Effect) {
            describe("effect.js", function() {
                var effect;
                describe("is instantiated", function() {
                    describe("with no parameters", function() {
                        describe("it should initialize its members", function() {
                            var extra = "Default Effect";
                            effect = new Effect();

                            Test.nonEmptyObject(effect, extra);
                            Test.hasPositiveNumberProperty(effect, "id", extra);

                            Test.propertyToEqual(effect, "name", "Unknown effect", extra);
                            Test.propertyToEqual(effect, "amount", 0, extra);
                            Test.propertyToEqual(effect, "type", "", extra);
                            Test.propertyToEqual(effect, "duration", null, extra);
                            Test.propertyToEqual(effect, "isNextTurn", false, extra);
                            Test.propertyToEqual(effect, "saveEnds", false, extra);
                            Test.propertyToEqual(effect, "target", undefined, extra);
                            Test.propertyToEqual(effect, "attacker", undefined, extra);
                            Test.propertyToEqual(effect, "startRound", undefined, extra);
                            Test.propertyToEqual(effect, "children", [], extra);
                        });
                    });
                    describe("with a String parameter", function() {
                        describe("it should initialize its members", function() {
                            var params = "String Effect";
                            effect = new Effect(params);

                            Test.nonEmptyObject(effect, params);
                            Test.hasPositiveNumberProperty(effect, "id", params);

                            Test.propertyToEqual(effect, "name", params, params);
                            Test.propertyToEqual(effect, "amount", 0, params);
                            Test.propertyToEqual(effect, "type", "", params);
                            Test.propertyToEqual(effect, "duration", null, params);
                            Test.propertyToEqual(effect, "isNextTurn", false, params);
                            Test.propertyToEqual(effect, "saveEnds", false, params);
                            Test.propertyToEqual(effect, "target", undefined, params);
                            Test.propertyToEqual(effect, "attacker", undefined, params);
                            Test.propertyToEqual(effect, "startRound", undefined, params);
                            Test.propertyToEqual(effect, "children", [], params);
                        });
                    });
                    describe("with a template parameters", function() {
                        describe("it should initialize its members", function() {
                            var params, extra;
                            extra = "Template Effect";
                            params = {
                                noId: true,
                                name: extra,
                                amount: 2,
                                type: "acid",
                                duration: DnD.Effect.DURATION_END_ATTACKER_NEXT,
                                saveEnds: true,
                                target: 12345,
                                attacker: 67890,
                                round: 11,
                                children: [
                                    "Template Effect Child 1",
                                    "Template Effect Child 2",
                                    "Template Effect Child 3"
                                ]
                            };
                            effect = new Effect(params);

                            Test.nonEmptyObject(effect, extra);
                            it("id: undefined [" + extra + "]", (function(effect) {
                                expect(effect.hasOwnProperty("id")).toBe(false);
                            }).bind(this, effect));

                            Test.propertyToEqual(effect, "name", extra, extra);
                            Test.propertyToEqual(effect, "amount", 2, extra);
                            Test.propertyToEqual(effect, "type", "acid", extra);
                            Test.propertyToEqual(effect, "duration", DnD.Effect.DURATION_END_ATTACKER_NEXT, extra);
                            Test.propertyToEqual(effect, "isNextTurn", false, extra);
                            Test.propertyToEqual(effect, "saveEnds", true, extra);
                            Test.propertyToEqual(effect, "target", 12345, extra);
                            Test.propertyToEqual(effect, "attacker", 67890, extra);
                            Test.propertyToEqual(effect, "startRound", 11, extra);

                            Test.hasNonEmptyArrayProperty(effect, "children", extra);
                            it("children: [ \"Template Effect Child 1\", \"Template Effect Child 2\", \"Template Effect Child 3\" ] [" + extra + "]", (function(effect) {
                                var i;
                                expect(effect.children.length).toEqual(3);
                                for (i = 0; i < effect.children.length; i++) {
                                    expect(effect.children[ i ] instanceof DnD.Effect).toBe(true);
                                    expect(effect.children[ i ].name).toEqual("Template Effect Child " + (i + 1));
                                }
                            }).bind(this, effect));
                        });
                    });
                });
            });
        },
        false
    );

})(Test);
