var DnD;

(function() {
    "use strict";
    
    if (!DnD) {
        DnD = {};
    }
    if (!DnD.Dialog) {
        DnD.Dialog = {};
    }
    
    
    // CONSTRUCTOR & INITIALIZATION METHODS
    
    function ExportDialog(params) {
        this.$export = null;
        this._init(params);
    }

    ExportDialog.prototype = new DnD.Dialog("exportDialog", "/html/partials/exportDialog.html");
    
    // OVERRIDDEN METHODS
    
    ExportDialog.prototype.show = function(data) {
        this.$export.val(data);
        DnD.Dialog.prototype.show.call(this);
    };
    
    ExportDialog.prototype._onReady = function() {
        this.$export = this.$dialog.find("#exportText");
    };
    
    ExportDialog.prototype._onShow = function() {
    };
    
    
    // PRIVATE METHODS

    
    DnD.Dialog.Export = ExportDialog;
})();