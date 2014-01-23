/* global define */
/* exported */
(function() {
    "use strict";

    define({
        name: "Admin",
        dependencyNames: [ "Initiative" ],
        factory: function(Initiative) {
            new Initiative();
            return true;
        },
        includeInNamespace: false,
        namespace: "DnD"
    });
})();
