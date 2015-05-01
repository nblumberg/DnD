(function() {
    "use strict";

    DnD.define(
        "Display.Dialog.History",
        [ "Display.Dialog" ],
        function(Dialog) {
            // CONSTRUCTOR & INITIALIZATION METHODS

            function HistoryDialog(params) {
                this.$body = null;
                this._init(params);
            }

            HistoryDialog.prototype = new Dialog("historyDialog", "/html/partials/historyDialog.html");

            // OVERRIDDEN METHODS

            HistoryDialog.prototype.show = function(history) {
                this.$body.html("");
                if (!history.$html) {
                    history.addToPage(this.$body);
                }
                this.$body.append(history.$html);
                Dialog.prototype.show.call(this);
            };

            HistoryDialog.prototype._onReady = function() {
                this.$body = this.$dialog.find(".body");
                this._onOkButtonClick = this.hide.bind(this);
            };

            HistoryDialog.prototype._onShow = function() {
            };

            return HistoryDialog;
        },
        true
    );

})();