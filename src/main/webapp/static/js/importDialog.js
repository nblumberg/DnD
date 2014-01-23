/* global define */
/* exported DnD.Dialog.Import */
(function() {
    "use strict";

    define({
        name: "Dialog.Import",
        dependencyNames: [ "Dialog", "console" ],
        factory: function(Dialog, console) {

            // CONSTRUCTOR & INITIALIZATION METHODS

            function ImportDialog(params) {
                this.import = params.import;
                this.$import = null;
                this.buttons = {
                    $import: null
                };
                this._init(params);
            }

            ImportDialog.prototype = new Dialog("importDialog", "/html/partials/importDialog.html");

            // OVERRIDDEN METHODS

            ImportDialog.prototype.show = function() {
                Dialog.prototype.show.call(this);
            };

            ImportDialog.prototype._onReady = function() {
                this.$import = this.$dialog.find("#importText");
                this.buttons.$import = this.$dialog.find(".importBtn").on({ click: this._doImport.bind(this) });
                this._onOkButtonClick = this._doImport.bind(this);
            };

            ImportDialog.prototype._onShow = function() {
                this.$import.val();
            };


            // PRIVATE METHODS

            ImportDialog.prototype._doImport = function() {
                var data = null;
                try {
                    data = JSON.parse(this.$import.val());
                }
                catch (e) {
                    console.error(e.toString());
                }

                this.import(data);
                this.hide();
            };


            return ImportDialog;
        },
        includeInNamespace: true,
        namespace: "DnD"
    });

})();