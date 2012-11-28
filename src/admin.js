//(function() {
	var data, i, name, initiative;
	data = loadData();
	for (i = 0; i < data.actors.length; i++) {
	    data.actors[ i ] = typeof(data.actors[ i ]) === "string" ? new Creature(data.creatures[ data.actors[ i ] ]) : new Creature(data.actors[ i ]);
	}
	initiative = new Initiative(data);
//})();
