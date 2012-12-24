function randEffect() {
    var i, EFFECTS = [
                   "Attack penalty",                      
                   "Blinded",
                   "Dazed",
                   "Deafened",
                   "Diseased",
                   "Dominated",
                   "Dying",
                   "Dead",
                   "Grabbed",
                   "Helpless",
                   "Immobilized",
                   "Marked",
                   "Ongoing acid",
                   "Ongoing cold",
                   "Ongoing damage",
                   "Ongoing fire",
                   "Ongoing lightning",
                   "Ongoing necrotic",
                   "Ongoing poison",
                   "Ongoing psychic",
                   "Ongoing radiant",
                   "Petrified",
                   "Prone",
                   "Restrained",
                   "Slowed",
                   "Stunned",
                   "Weakened",
                   "Unconscious",
                   "Weakened"
               ];
    i = Math.floor(Math.random() * EFFECTS.length);
    return { name: EFFECTS[ i ] };
}

function randEffects() {
    var effects = [];
    if (Math.random() > 0.25) {
        return effects;
    }
    while (Math.random() > 0.25) {
        effects.push(randEffect());
    }
    return effects;
}

function loadInitiative() {
	return {
	    actors: [ 
	              "Barases", 
	              "Bin", 
	              "Festivus", 
	              "Kallista", 
	              "Karrion", 
	              "Kitara", 
	              "Lechonero", 
	              "Banshrae Dartswarmer",
                  "Slystone Dwarf Ruffian",
                  "Slystone Dwarf Ruffian",
                  "Slystone Dwarf Ruffian",
                  "Slystone Dwarf Ruffian",
                  "Hethralga",
                  "Cyclops Guard",
                  "Cyclops Guard",
                  "Cyclops Guard",
                  "Cyclops Guard",
                  "Dragonborn Gladiator",
                  "Dragonborn Gladiator"
	              ]
		};
}

