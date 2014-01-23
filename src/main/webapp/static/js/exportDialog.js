/* global define */
/* exported DnD.Dialog.Export */
(function() {
    "use strict";

    define({
        name: "Dialog.Export",
        dependencyNames: [ "Dialog" ],
        factory: function(Dialog) {

            // CONSTRUCTOR & INITIALIZATION METHODS

            function ExportDialog(params) {
                this.$export = null;
                this._init(params);
            }

            ExportDialog.prototype = new Dialog("exportDialog", "/html/partials/exportDialog.html");

            // OVERRIDDEN METHODS

            ExportDialog.prototype.show = function(data) {
                this.$export.val(data);
                Dialog.prototype.show.call(this);
            };

            ExportDialog.prototype._onReady = function() {
                this.$export = this.$dialog.find("#exportText");
                this._onOkButtonClick = this.hide.bind(this);
            };

            ExportDialog.prototype._onShow = function() {
            };


            // PRIVATE METHODS

            return ExportDialog;
        },
        includeInNamespace: true,
        namespace: "DnD"
    });

})();