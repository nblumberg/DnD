(function basicModulesIIFE(DnD, window) {
    DnD.define("window", [], () => window);
    DnD.define("document", [ "window" ], (window) => window.document);
    DnD.define("Image", [ "window" ], (window) => window.Image);
    DnD.define("Math", [ "window" ], (window) => window.Math);
    DnD.define("parseInt", [ "window" ], (window) => {
        return (number) => {
            return window.parseInt(number, 10);
        };
    });
    DnD.define("Path2D", [ "window" ], (window) => window.Path2D);
    DnD.define("Promise", [ "window" ], (window) => window.Promise);
    DnD.define("setTimeout", [ "window" ], (window) => window.setTimeout);
})(window.DnD, window);