/* global safeConsole */
/* exported define */
(function(console) {
    "use strict";

    if (window.define) {
        return;
    }


    /**
     * Defines a javascript module
     * @param {Object} params
     * @param {String} params.name The name of this module
     * @param {Array} params.dependencyNames An Array of the names of other modules this module is dependent on
     * @param {Function} params.factory A factory Function to call (with instances of its dependencies as parameters in the order they are declared in dependencyNames) to call to instantiate this module
     * @param {Boolean} params.includeInNamespace Whether to add an instance of this module to the namespace once it is fully defined
     * @param {String} params.namespace The name of the namespace this module is a part of
     */
    function define(params) {
        if (!params || !params.name || typeof(params.name) !== "string" || typeof(params.factory) !== "function") {
            return;
        }
        if (define.modules.hasOwnProperty(params.name)) {
            console.warn("Module " + params.name + " is already defined");
            return;
        }
        else {
            console.log("Defining module " + params.name);
        }
        define.modules[ params.name ] = params;
        define.checkDependencies();
    }


    define.modules = {};


    /**
     * Checks if all of the given module's dependencies are met, and if so sets up a create method
     * on the module that invokes its factory with all its dependencies. If the module is flagged
     * includeInNamespace == true it invokes define.injectIntoNamespace().
     * @param {String} name The name of the module to check
     */
    define.checkDependencies = function(name) {
        var p, module, fullyDefined, i, dependencyName, args;
        p = null;

        if (!name) {
            for (p in define.modules) {
                if (define.modules.hasOwnProperty(p)) {
                    if (define.checkDependencies(p)) {
                        return true;
                    }
                }
            }
            return true;
        }

        if (!define.modules.hasOwnProperty(name) || define.modules[ name ].instance) {
            return false;
        }
        module = define.modules[ name ];
        fullyDefined = true;
        module.dependencies = [];
        for (i = 0; module.dependencyNames && i < module.dependencyNames.length; i++) {
            dependencyName = module.dependencyNames[ i ];
            if (define.modules.hasOwnProperty(dependencyName) && define.modules[ dependencyName ].instance) {
                module.dependencies.push(define.modules[ dependencyName ].instance);
            }
            else {
                fullyDefined = false;
                module.dependencies.push(dependencyName);
            }
        }
        if (fullyDefined) {
            console.log("Instantiating module " + name);

            args = [];
            for (i = 0; i < module.dependencies.length; i++) {
                args.push(module.dependencies[ i ]);
            }
            module.instance = module.factory.apply(window, args) || true;

            if (module.includeInNamespace) {
                define.injectIntoNamespace(module);
            }

            define.checkDependencies();

            return true;
        }
        return false;
    };


    /**
     * Creates an instance of a module with all it's dependencies and sets it as a member of the given namespace.
     * @param {Object} module An Object describing a module as created by define() and define.checkDependencies()
     */
    define.injectIntoNamespace = function(module) {
        var _init, container, parts, i;
        if (!module || !module.name || !module.instance) {
            return false;
        }
        if (!window[ module.namespace ]) {
            window[ module.namespace ] = {};
        }
        _init = function() {
            module.factory.apply(window, module.dependencies);
        };
        container = window[ module.namespace ];
        parts = module.name.split(".");
        for (i = 0; i < parts.length; i++) {
            if (i === parts.length - 1) {
                container[ parts[ i ] ] = module.instance;
                container[ parts[ i ] ]._init = _init;
            }
            else {
                if (!container.hasOwnProperty(parts[ i ])) {
                    container[ parts[ i ] ] = {};
                }
                container = container[ parts[ i ] ];
            }
        }
        return true;
    };


    window.setTimeout(function() {
        var p, dependencies, i, error;
        p = error = null;
        for (p in define.modules) {
            if (define.modules.hasOwnProperty(p) && !define.modules[ p ].instance) {
                dependencies = [];
                for (i = 0; i < define.modules[ p ].dependencies.length; i++) {
                    if (typeof(define.modules[ p ].dependencies[ i ]) === "string") {
                        dependencies.push(define.modules[ p ].dependencies[ i ]);
                    }
                }
                if (!error) {
                    error = "The following javascript modules are missing dependencies:\n";
                }

                error += "\t" + p + ": [" + dependencies.join(", ") + "]\n";
            }
        }
        if (error) {
            console.error(error);
        }
    }, 5000);


    if (window.jQuery) {
        define({
            name: "jQuery",
            factory: function() {
                return window.jQuery;
            },
            includeInNamespace: false
        });
    }
    if (console) {
        define({
            name: "console",
            factory: function() {
                return console;
            },
            includeInNamespace: false
        });
    }


    window.define = define;
})(safeConsole());