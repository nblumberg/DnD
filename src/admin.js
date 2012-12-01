//(function() {
	var data, i, isNew, initiative;
	data = loadData();
	for (i = 0; i < data.actors.length; i++) {
		isNew = typeof(data.actors[ i ]) === "string";
	    data.actors[ i ] = isNew ? new Creature(data.creatures[ data.actors[ i ] ]) : new Creature(data.actors[ i ]);
	    if (isNew && !data.actors[ i ].isPC) {
	    	data.actors[ i ].name = generateName();
	    }
	}
	initiative = new Initiative(data);
//})();
