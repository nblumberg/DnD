(function() {
	var data, i, isNew;
    window.initiative = new Initiative();
	if (!window.initiative.initFromLocalStorage()) {
		window.initiative.loadInitFromJs();
	}
})();
