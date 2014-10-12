// constants.js

/**
 * @module K
 * @main DnD
 * @author Nathaniel Blumberg
 */

/* exported DnD.K */

(function() {
    "use strict";

    /* global DnD */

    /**
     * Namespace of DnD constants
     * @namespace K
     * @memberof DnD
     * @example
     * DnD.K
     */

    DnD.define(
        "K",
        [],

        /**
         * Initializes the DnD.K instance
         * @method _init
         * @memberof DnD.K
         * @static
         * @private
         */
            function () {
            var k = {};

            /**
             * Utility "javascript:" declaration
             * broken up like this since jshint scripturl relaxer comment doesn't appear to work
             * @constant JS_URL
             * @memberof DnD.K
             * @public
             * @static
             * @type String
             * @default "javascript:"
             */
            k.JS_URL = "javascript";
            k.JS_URL += ":";

            /**
             * Utility "javascript:void(0);" declaration
             * broken up like this since jshint scripturl relaxer comment doesn't appear to work
             * @constant NO_URL
             * @memberof DnD.K
             * @public
             * @static
             * @type String
             * @default "javascript:void(0);"
             */
            k.NO_URL = k.JS_URL + "void(0);";

            /**
             * Utility no op function reference
             * @constant NO_OP
             * @memberof DnD.K
             * @public
             * @static
             * @type Function
             * @default function() {}
             */
            k.NO_OP = function() {};

            /**
             * Collection of all symbolic debugging levels
             * @namespace DEBUG_LEVEL
             * @memberof DnD.K
             * @example
             * DnD.K.DEBUG_LEVEL
             */
            k.DEBUG_LEVEL = {};

            /**
             * The default debugging level
             * @constant DEFAULT
             * @memberof DnD.K.DEBUG_LEVEL
             * @public
             * @static
             * @type Number
             * @default 3
             * @example
             * DnD.K.DEBUG_LEVEL.DEFAULT
             */
            k.DEBUG_LEVEL.DEFAULT = 3;

            return k;
        },

        true // assign to namespace as DnD.K
    );


})();