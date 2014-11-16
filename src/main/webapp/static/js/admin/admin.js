(function() {
	"use strict";

    DnD.define(
        "admin",
        [ "window", "Initiative" ],
        function(w, Initiative) {
            w.initiative = new Initiative();
        },
        false
    );
})();
