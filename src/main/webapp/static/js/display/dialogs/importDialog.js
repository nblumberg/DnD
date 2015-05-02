(function() {
    "use strict";

    DnD.define(
        "Display.Dialog.Import",
        [ "Display.Dialog", "out" ],
        function(Dialog, out) {
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

            ImportDialog.prototype.show = function(params) {
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


            // NON-PUBLIC METHODS

            ImportDialog.prototype._doImport = function() {
                var data;
                try {
                    data = JSON.parse(this.$import.val());
                }
                catch (e) {
                    out.console.error(e.toString());
                }

                this.import(data);
                this.hide();
            };

            return ImportDialog;
        },
        true
    );

})();