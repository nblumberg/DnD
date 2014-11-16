/**
 * Created by nblumberg on 10/12/14.
 */

(function (SavingThrow) {
    "use strict";

    describe("SavingThrow", function() {
        var st;
        beforeEach(function() {
            st = new SavingThrow({ effect: { toString: function() { return "testeffect"; } } });
        });
        describe("toString()", function() {
            it("should return Saving Throw", function() {
                expect(st.toString()).toEqual("Saving Throw");
            });
        });
        describe("anchor()", function() {
            it("should return Saves against ...", function() {
                st.max();
                expect(st.anchor()).toEqual("<a href=\"javascript:void(0);\" title=\"[Saving Throw] 20\">Saves against testeffect</a>");
            });
            it("should return Fails to save against ...", function() {
                st.min();
                expect(st.anchor()).toEqual("<a href=\"javascript:void(0);\" title=\"[Saving Throw] 1\">Fails to save against testeffect</a>");
            });
        });
    });

})(DnD.SavingThrow);