/* global jasmine, define, beforeEach, afterEach, it, expect */
/* exported */
(function() {
    "use strict";

    describe("Recharge", function() {
        var recharge = null;
        beforeEach(function() {
            recharge = new DnD.Roll.Recharge({ attack: { name: "testAttack", usage: { frequency: "Recharge", recharge: 3 } } });
        });
        describe("toString()", function() {
            it("should return Recharge", function() {
                expect(recharge.toString()).toEqual("Recharge");
            });
        });
        describe("anchor()", function() {
            it("should return Recharged ...", function() {
                recharge.min();
                expect(recharge.anchor()).toEqual("<a href=\"javascript:void(0);\" title=\"[Recharge] 1 &lt;= 3\">Recharged testAttack</a>");
            });
            it("should return Failed to recharge ...", function() {
                recharge.max();
                expect(recharge.anchor()).toEqual("<a href=\"javascript:void(0);\" title=\"[Recharge] 6 &lt;= 3\">Failed to recharge testAttack</a>");
            });
        });
    });


})();