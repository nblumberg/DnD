(function() {
	var data, name, actor, initiative;
	data = loadData();
	for (name in data.actors) {
		data.actors[ name ] = new Creature(data.actors[ name ]);
	}
	initiative = new Initiative(data);
	jQuery(document).ready(function() { data.actors[ "Kitara" ].createCard(); });
})();
