function generateName() {
	var i, NAMES = [
        "Agongori",
        "Agwet",
        "Bamangwe",
        "Bavalironab",
        "Chatuna",
        "Drini",
        "Drircan",
        "Egorul",
        "Faurg",
        "Gliturcaindu",
        "Grogor",
        "Hirchet",
        "Korodr",
        "Lallka",
        "Latungorothalo",
        "Mincab",
        "Morororo",
        "Ngormm",
        "Onazglog",
        "Ongiro",
        "Rolangu",
        "Ungba",
        "Vanarn",
        "Wethet",
        "Weturondr"
    ];
    i = Math.floor(Math.random() * NAMES.length);
    return NAMES[ i ];
}

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

function loadData() {
//	if (window.localStorage.getItem("initiative")) {
//		return JSON.parse(window.localStorage.getItem("initiative"));
//	}
	return {
		history: { includeSubject: true },
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
	              ],
		creatures: { 
		    Barases: { 
            	 name: "Barases", isPC: true, level: 10, image: "images/portraits/barases.jpg", // "http://images5.fanpop.com/image/photos/31000000/Satyr-fantasy-31060204-283-400.jpg",  
            	 abilities: { STR: 11, CON: 18, DEX: 10, INT: 10, WIS: 20, CHA: 10 },
            	 hp: { total: 80, current: Math.floor(Math.random() * 80), temp: 3 },
            	 surges: { perDay: 11, current: 11 },
            	 defenses: { ac: 24, fort: 23, ref: 17, will: 22 },
            	 init: 5, speed: 6,
            	 weapons: [ 
            	           { name: "Vicious Quarterstaff +2", isMelee: true, enhancement: 2, damage: { amount: "1d12", crit: "2d12" } },
            	           { name: "Distance Sling +1", isMelee: false, enhancement: 1, damage: "1d6" }
            	            ],
            	 "implements": [
                 	           { name: "Staff", enhancement: 0, crit: "" }
            	                ],
            	 attacks: [
            	           { name: "Melee Basic", type: "At-Will", toHit: 10, defense: "AC", damage: "1[W]+STR", keywords: [ "weapon", "melee" ] },
            	           { name: "Ranged Basic", type: "At-Will", toHit: 8, defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "ranged" ] },
            	           { name: "Tending Strike", type: "At-Will", toHit: 15, defense: "AC", damage: "1[W]+WIS", keywords: [ "weapon", "melee", "primal" ] },
            	           { name: "Combined Attack", type: "Encounter", toHit: 15, defense: "AC", damage: "1[W]+WIS", keywords: [ "weapon", "melee", "primal" ] },
            	           { name: "Vexing Overgrowth", type: "Daily", range: 1, toHit: 15, defense: "AC", damage: "2[W]+WIS", keywords: [ "weapon", "primal", "close burst" ] },
            	           { name: "Life Blood Harvest", type: "Daily", toHit: 15, defense: "AC", damage: "3[W]+WIS", keywords: [ "weapon", "melee", "primal", "healing" ] },
            	           { name: "Bear Beast", type: "At-Will", range: 5, toHit: 15, defense: "AC", damage: "1d12+9", crit: "", keywords: [ "implement", "primal", "summoning" ] },
            	           { name: "Crocodile Beast", type: "At-Will", toHit: 10, defense: "AC", damage: "1d8+WIS", crit: "", keywords: [ "weapon", "melee", "beast" ] }
            	           ],
    	           effects: randEffects()
             },
             Bin: { 
            	 name: "Bin", isPC: true, level: 10, image: "images/portraits/bin.jpg", // "http://wizards.com/dnd/images/386_wr_changeling.jpg", 
            	 abilities: { STR: 14, CON: 17, DEX: 15, INT: 21, WIS: 18, CHA: 11 },
            	 hp: { total: 74, current: Math.floor(Math.random() * 74) },
            	 surges: { perDay: 9, current: 9 },
            	 defenses: { ac: 24, fort: 20, ref: 21, will: 22 },
            	 init: 7, speed: 6,
            	 weapons: [ 
            	           { name: "Runic Mace +1", isMelee: true, proficiency: 2, enhancement: 1, damage: { amount: "1d8", crit: "1d6" } },
            	           { name: "Rebounding Hand Crossbow +1", isMelee: false, proficiency: 2, enhancement: 1, damage: { amount: "1d6", crit: "1d6" } },
            	           { name: "Learning Crossbow +1", isMelee: false, proficiency: 2, enhancement: 1, damage: { amount: "1d8", crit: "1d6" } },
            	           { name: "Aversion Staff +2", isMelee: true, proficiency: 0, enhancement: 2, damage: { amount: "1d6", crit: "2d8" } }
            	            ],
            	 "implements": [
                 	           { name: "Aversion Staff +2", enhancement: 2, crit: "2d8" }
            	                ],
            	 attacks: [
            	           { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: 11, defense: "AC", damage: "1[W]+STR" },
            	           { name: "Ranged Basic", type: "At-Will", toHit: 11, defense: "AC", damage: "1[W]+DEX" },
            	           { name: "Magic Weapon", type: "At-Will", toHit: 15, defense: "AC", damage: "1d8+7", crit: "2d8" },
            	           { name: "Thundering Armor", type: "At-Will", toHit: 13, defense: "Fort", damage: "1d8+8", crit: "2d8" },
            	           { name: "Stone Panoply", type: "Encounter", toHit: 14, defense: "AC", damage: "1d8+7", crit: "2d8" },
            	           { name: "Shielding Cube", type: "Encounter", toHit: 13, defense: "Ref", damage: "2d6+8", crit: "2d8" },
            	           { name: "Lightning Sphere", type: "Encounter", toHit: 13, defense: "Fort", damage: "1d8+8", crit: "2d8" },
            	           { name: "Vampiric Weapons", type: "Encounter", toHit: 15, defense: "AC", damage: "1d8+6", crit: "2d8" },
            	           { name: "Caustic Rampart", type: "Daily", toHit: 99, defense: "AC", damage: "1d6+5", crit: "" },
            	           { name: "Lightning Motes", type: "Daily", toHit: 13, defense: "Ref", damage: "2d6+8", crit: "2d8" }
            	           ],
    	         effects: randEffects()
             },
             Festivus: { 
            	 name: "Festivus", isPC: true, level: 10, image: "images/portraits/festivus.jpg", // "http://www.worldofazolin.com/wiki/images/8/8d/Dragsorc.jpg",
            	 abilities: { STR: 18, CON: 16, DEX: 10, INT: 16, WIS: 10, CHA: 20 },
            	 hp: { total: 73, current: Math.floor(Math.random() * 73) },
            	 surges: { perDay: 9, current: 9 },
            	 defenses: { ac: 21, fort: 20, ref: 19, will: 23 },
            	 init: 5, speed: 6,
            	 weapons: [ 
             	           { name: "Harmonic Songblade +1", isMelee: true, enhancement: 1, proficiency: 3, damage: { amount: "1d8", crit: "1d6" } }
            	            ],
            	 "implements": [
                  	           { name: "Wand of Psychic Ravaging +1", enhancement: 1, crit: "1d8" },
                 	           { name: "Harmonic Songblade +1", enhancement: 1, crit: "1d6" }
            	                ],
            	 attacks: [
            	           { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: 14, defense: "AC", damage: "1[W]+5", keywords: [ "weapon", "melee" ]  },
            	           { name: "Ranged Basic", type: "At-Will", toHit: 8, defense: "AC", damage: "1[W]", keywords: [ "weapon", "ranged" ]  },
            	           { name: "Blazing Starfall", type: "At-Will", toHit: 12, defense: "Ref", damage: { amount: "1d4+10", crit: "1d8" }, keywords: [ "arcane", "fire", "implement", "radiant", "zone" ] },
            	           { name: "Vicious Mockery", type: "At-Will", toHit: 12, defense: "Will", damage: { amount: "1d6+9", crit: "1d8" }, keywords: [ "arcane", "charm", "implement", "psychic" ] },
            	           { name: "Explosive Pyre", type: "Encounter", toHit: 12, defense: "Ref", damage: { amount: "2d8+10", crit: "1d8" }, keywords: [ "arcane", "fire", "implement" ] },
            	           { name: "Eyebite", type: "Encounter", toHit: 12, defense: "Will", damage: { amount: "1d6+9", crit: "1d8" }, keywords: [ "arcane", "charm", "implement", "psychic" ] },
            	           { name: "Dissonant Strain", type: "Encounter", toHit: 12, defense: "Will", damage: { amount: "2d6+9", crit: "1d8" }, keywords: [ "arcane", "implement", "psychic" ] },
            	           { name: "Chaos Ray", type: "Encounter", toHit: 12, defense: "Will", damage: { amount: "2d8+13", crit: "1d8" }, keywords: [ "arcane", "implement", "psychic", "teleportation" ] },
            	           { name: "Stirring Shout", type: "Daily", toHit: 12, defense: "Will", damage: { amount: "2d6+9", crit: "1d8" }, keywords: [ "arcane", "healing", "implement", "psychic" ] },
            	           { name: "Reeling Torment", type: "Daily", toHit: 12, defense: "Will", damage: { amount: "3d8+13", crit: "1d8" }, keywords: [ "arcane", "charm", "implement", "psychic" ] },
            	           { name: "Counterpoint", type: "Daily", toHit: 12, defense: "Will", damage: { amount: "2d8+8", crit: "1d8" }, keywords: [ "arcane", "implement" ] },
            	           { name: "Dragon Breath", type: "Encounter", toHit: 11, defense: "Ref", damage: { amount: "1d6+3", crit: "" }, keywords: [ "acid" ] }
            	           ],
                 effects: randEffects()
             },
             Kallista: { 
            	 name: "Kallista", isPC: true, level: 10, image: "images/portraits/kallista.jpg", // "http://www.wizards.com/dnd/images/Dragon_373/11.jpg", 
            	 abilities: { STR: 14, CON: 12, DEX: 20, INT: 14, WIS: 12, CHA: 22 },
            	 hp: { total: 69, current: Math.floor(Math.random() * 69) },
            	 surges: { perDay: 7, current: 7 },
            	 defenses: { ac: 23, fort: 18, ref: 23, will: 22 },
            	 init: 10, speed: 6,
            	 weapons: [ 
             	           { name: "Wicked Fang Longsword +3", isMelee: true, enhancement: 3, proficiency: 3, damage: { amount: "1d8", crit: "3d8" } },
             	           { name: "Rebounding Hand Crossbow +2", isMelee: false, enhancement: 2, proficiency: 2, damage: { amount: "1d6", crit: "2d6" } }
            	            ],
            	 "implements": [
            	                ],
            	 attacks: [
            	           { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: 14, defense: "AC", damage: "1[W]+STR", keywords: [ "weapon", "melee" ] },
            	           { name: "Ranged Basic", type: "At-Will", toHit: 16, defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "ranged" ] },
            	           { name: "Duelist's Flurry", type: "At-Will", toHit: 17, defense: "AC", damage: "DEX", keywords: [ "weapon", "martial", "melee" ] },
            	           { name: "Sly Flourish", type: "At-Will", toHit: 17, defense: "AC", damage: "1[W]+DEX+CHA", keywords: [ "weapon", "martial" ] },
            	           { name: "Demonic Frenzy", type: "Encounter", toHit: 99, defense: "AC", damage: "1d6", keywords: [ "elemental" ] },
            	           { name: "Acrobat's Blade Trick", type: "Encounter", toHit: 17, defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "martial", "melee" ] },
                           { name: "Flailing Shove", type: "Encounter", toHit: 17, defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "martial", "melee" ] },
                           { name: "Flailing Shove (secondary)", type: "Encounter", toHit: 99, defense: "AC", damage: "2+STR", keywords: [ "weapon", "martial", "melee" ] },
            	           { name: "Cloud of Steel", type: "Encounter", toHit: 16, defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "martial", "ranged" ] },
            	           { name: "Bloodbath", type: "Daily", toHit: 17, defense: "Fort", damage: "1[W]+DEX", effects: [ { name: "ongoing damage", amount: "2d6" } ], keywords: [ "weapon", "martial" ] },
            	           { name: "Burst Fire", type: "Daily", toHit: 16, defense: "Ref", damage: "2[W]+DEX", keywords: [ "weapon", "martial", "ranged" ] },
            	           { name: "Duelists Prowess", type: "Immediate Interrupt", toHit: 17, defense: "Ref", damage: "1[W]+DEX", keywords: [ "weapon", "martial", "melee" ] },
            	           { name: "Sneak Attack", type: "At-Will", toHit: 99, defense: "AC", damage: "2d8" }
            	           ],
                 effects: randEffects()
             },
			 Karrion: { 
            	 name: "Karrion", isPC: true, level: 10, image: "images/portraits/karrion.jpg", // "http://rogueartfx.com/images/tiefling03.jpg",  
            	 abilities: { STR: 19, CON: 16, DEX: 19, INT: 18, WIS: 16, CHA: 16 },
            	 hp: { total: 73, current: Math.floor(Math.random() * 73) },
            	 surges: { perDay: 9, current: 9 },
            	 defenses: { ac: 23, fort: 21, ref: 21, will: 19 },
            	 init: 11, speed: 6,
            	 weapons: [ 
             	           { name: "Lightning Spiked Chain +1", isMelee: true, enhancement: 1, proficiency: 3, damage: "2d4", crit: "1d6" },
             	           { name: "Sid Vicious Longbow +1", isMelee: false, enhancement: 1, proficiency: 2, damage: "1d10", crit: "1d12" }
            	            ],
            	 "implements": [
                                { name: "Totem", enhancement: 0 },
            	                ],
            	 attacks: [
            	           { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: 14, defense: "AC", damage: "1[W]+STR", keywords: [ "weapon", "melee" ] },
            	           { name: "Ranged Basic", type: "At-Will", toHit: 13, defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "ranged" ] },
            	           { name: "Marauder's Rush", type: "At-Will", toHit: 14, defense: "AC", damage: "1[W]+STR+WIS", keywords: [ "weapon", "martial", "melee" ] },
            	           { name: "Twin Strike", type: "At-Will", toHit: 14, defense: "AC", damage: "1[W]", keywords: [ "weapon", "martial" ] },
                           { name: "Dire Wolverine Strike", type: "Encounter", toHit: 14, defense: "AC", damage: "1[W]+STR", keywords: [ "weapon", "martial", "melee" ] },
            	           { name: "Thundertusk Boar Strike", type: "Encounter", toHit: 14, defense: "AC", damage: "1[W]+STR/DEX", keywords: [ "weapon", "martial" ] },
            	           { name: "Sweeping Whirlwind", type: "Encounter", isMelee: true, toHit: 14, defense: "AC", damage: "1[W]+STR", keywords: [ "weapon", "martial", "melee" ] },
            	           { name: "Boar Assault", type: "Daily", toHit: 14, defense: "AC", damage: "2[W]+STR/DEX", keywords: [ "weapon", "martial" ] },
            	           { name: "Invigorating Assault", type: "Daily", toHit: 13, defense: "AC", damage: "3[W]+DEX", keywords: [ "weapon", "martial", "ranged", "miss half" ] },
            	           { name: "Infernal Wrath", type: "Encounter", toHit: 99, defense: "AC", damage: "1d6+INT^CHA", keywords: [ "fire" ] },
            	           { name: "Spirit Fangs", type: "Encounter", toHit: 8, defense: "Ref", damage: "1d10+WIS", keywords: [ "implement", "primal", "spirit" ] },
            	           { name: "Hunter's Thorn Trap", type: "Encounter", toHit: 99, defense: "AC", damage: "5+WIS", keywords: [ "primal", "zone" ] },
            	           { name: "Hunter's Quarry", type: "At-Will", toHit: 99, defense: "AC", damage: "1d8" }
            	           ],
                 effects: randEffects()
             },
             Kitara: { 
            	 name: "Kitara", isPC: true, level: 10, image: "images/portraits/kitara.jpg", // "http://www.deviantart.com/download/46708270/Maiden_of_the_Mirthless_Smile_by_UdonCrew.jpg", 
            	 abilities: { STR: 16, CON: 14, DEX: 20, INT: 22, WIS: 16, CHA: 16 },
            	 hp: { total: 71, current: Math.floor(Math.random() * 71) },
            	 surges: { perDay: 9, current: 9 },
            	 defenses: { ac: 26, fort: 21, ref: 22, will: 21 },
            	 init: 11, speed: 7,
            	 weapons: [ 
            	            { name: "Supremely Vicious Bastard Sword +2", isMelee: true, enhancement: 2, proficiency: 2, damage: "1d10", crit: "2d8" }
            	            ],
            	 "implements": [ 
            	                 { name: "Supremely Vicious Bastard Sword +2", enhancement: 2, crit: "2d8" },
                  	             { name: "Orb of Nimble Thoughts +1", enhancement: 1, crit: "1d6" } 
            	                 ],
            	 attacks: [
            	           { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: 16, defense: "AC", damage: "1[W]+STR", keywords: [ "weapon", "melee" ] },
            	           { name: "Ranged Basic", type: "At-Will", toHit: 99, defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "ranged" ] },
            	           { name: "Magic Missile", type: "At-Will", toHit: 99, defense: "AC", damage: { amount: "2+INT", type: "force" }, keywords: [ "arcane", "evocation", "force", "implement" ] },
            	           { name: "Lightning Ring", type: "At-Will", toHit: 99, defense: "AC", damage: { amount: "5", type: "lightning" }, keywords: [ "arcane", "bladespell", "lightning" ] },
            	           { name: "Lightning Ring (secondary)", type: "At-Will", toHit: 99, defense: "AC", damage: { amount: "5", type: "lightning" }, keywords: [ "arcane", "bladespell", "lightning" ] },
            	           { name: "Shadow Sever", type: "At-Will", toHit: 99, defense: "AC", damage: { amount: "5", type: "necrotic" }, effects: [ { name: "prone" } ], keywords: [ "arcane", "bladespell", "necrotic" ] },
            	           { name: "Unseen Hand", type: "At-Will", toHit: 14, defense: "AC", damage: { amount: "5", type: "force" }, keywords: [ "arcane", "bladespell", "force" ] },
            	           { name: "Gaze of the Evil Eye", type: "At-Will", toHit: 99, defense: "AC", damage: { amount: "2", type: "psychic" }, keywords: [ "arcane", "psychic" ] },
            	           { name: "Burning Hands", type: "Encounter", toHit: 14, defense: "Ref", damage: { amount: "2d6+INT", type: "fire" }, keywords: [ "arcane", "evocation", "fire", "implement" ] },
            	           { name: "Icy Rays", type: "Encounter", toHit: 14, defense: "Ref", damage: { amount: "1d10+INT", type: "cold" }, effects: [ { name: "immobilized", duration: 1 } ], keywords: [ "arcane", "evocation", "cold", "implement" ] },
            	           { name: "Pinioning Vortex", type: "Encounter", toHit: 14, defense: "Fort", damage: "2d6+INT", effects: [ { name: "immobilized", duration: 1 }, { name: "dazed", duration: 1 } ], keywords: [ "arcane", "evocation", "implement" ] },
            	           { name: "Acid Arrow", type: "Daily", toHit: 14, defense: "Ref", damage: { amount: "2d8+INT", type: "acid" }, effects: [ { name: "ongoing acid", amount: 5, saveEnds: true } ], keywords: [ "arcane", "evocation", "acid", "implement", "miss half", "miss ongoing half" ] },
            	           { name: "Acid Arrow, secondary", type: "Daily", toHit: 14, defense: "Ref", damage: { amount: "1d8+INT", type: "acid" }, keywords: [ "arcane", "evocation", "acid", "implement" ] },
                           { name: "Fountain of Flame", type: "Daily", toHit: 14, defense: "Ref", damage: { amount: "3d8+INT", type: "fire" }, keywords: [ "arcane", "evocation", "fire", "implement", "zone" ] },
                           { name: "Fountain of Flame (secondary)", type: "Daily", toHit: 99, defense: "Ref", damage: { amount: "5", type: "fire" }, keywords: [ "arcane", "evocation", "fire", "implement", "zone" ] },
                           { name: "Phantom Chasm", type: "Daily", toHit: 14, defense: "Will", damage: { amount: "2d6+INT", type: "psychic" }, effects: [ { name: "immobilized", duration: 1 } ], keywords: [ "arcane", "illusion", "psychic", "implement", "zone", "miss half" ] },
                           { name: "Phantom Chasm (secondary)", type: "Daily", toHit: 99, defense: "Will", damage: "0", effects: [ { name: "prone" } ], keywords: [ "arcane", "illusion", "psychic", "implement", "zone" ] },
                           { name: "Rolling Thunder", type: "Daily", toHit: 14, defense: "Ref", damage: { amount: "3d6+INT", type: "thunder" }, keywords: [ "arcane", "conjuration", "evocation", "implement", "thunder", "miss half" ] },
                           { name: "Rolling Thunder (secondary)", type: "Daily", toHit: 14, defense: "Ref", damage: { amount: "5", type: "thunder" }, keywords: [ "arcane", "conjuration", "evocation", "implement", "thunder", "miss half" ] }
            	           // TODO: What are Kitara's other powers?
            	           ],
                 effects: randEffects()
             },
   		  	 Lechonero: { 
            	 name: "Lechonero", isPC: true, level: 10, image: "images/portraits/lechonero.jpg", // "http://www.critical-hits.com/wp-content/uploads/2007/12/elf.jpg", 
            	 abilities: { STR: 16, CON: 14, DEX: 21, INT: 14, WIS: 15, CHA: 10 },
            	 hp: { total: 71, current: Math.floor(Math.random() * 71) },
            	 surges: { perDay: 8, current: 8 },
            	 defenses: { ac: 24, fort: 21, ref: 23, will: 19 },
            	 init: 12, speed: 7,
            	 weapons: [ 
             	           { name: "Longbow of Speed +2", isMelee: false, enhancement: 2, proficiency: 2, damage: "1d10", crit: "2d8" },
             	           { name: "Sentinel Marshall Honorblade +1", isMelee: true, enhancement: 1, proficiency: 3, damage: "1d8", crit: "1d8" },
             	           { name: "Duelist's Longbow +1", isMelee: false, enhancement: 1, proficiency: 2, damage: "1d10", crit: "1d6" }
            	            ],
            	 "implements": [
            	                ],
            	 attacks: [
            	           { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: 12, defense: "AC", damage: "1[W]+STR", keywords: [ "weapon", "melee" ] },
            	           { name: "Ranged Basic", type: "At-Will", toHit: 15, defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "ranged" ] },
            	           { name: "Rapid Shot", type: "At-Will", toHit: 13, defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "martial", "ranged" ] },
            	           { name: "Twin Strike", type: "At-Will", toHit: 15, defense: "AC", damage: "1[W]", keywords: [ "weapon", "martial" ] },
            	           { name: "Hindering Shot", type: "Encounter", toHit: 15, defense: "AC", damage: "2[W]+DEX", effects: [ { name: "slowed", duration: 1 } ], keywords: [ "weapon", "martial", "ranged" ] },
                           { name: "Covering Volley", type: "Encounter", toHit: 15, defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "martial", "ranged" ] },
                           { name: "Covering Volley (secondary)", type: "Encounter", toHit: 99, defense: "AC", damage: "5", keywords: [ "martial", "ranged" ] },
            	           { name: "Spikes of the Manticore", type: "Encounter", toHit: 15, defense: "AC", damage: "2[W]+DEX", keywords: [ "weapon", "martial", "ranged" ] },
            	           { name: "Spikes of the Manticore (secondary)", type: "Encounter", toHit: 15, defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "martial", "ranged" ] },
            	           { name: "Sure Shot", type: "Daily", toHit: 15, defense: "AC", damage: "3[W]+DEX", keywords: [ "weapon", "martial", "ranged" ] },
            	           { name: "Flying Steel", type: "Daily", toHit: 15, defense: "AC", damage: "2[W]+DEX", keywords: [ "weapon", "martial", "ranged" ] },
            	           { name: "Marked for Death", type: "Daily", toHit: 15, defense: "AC", damage: "3[W]+STR/DEX", effects: [ { name: "marked", duration: 1 } ], keywords: [ "weapon", "martial" ] },
            	           { name: "Beast Melee Basic", type: "At-Will", toHit: 12, defense: "AC", damage: "1d12+3", keywords: [ "beast", "melee" ] },
            	           { name: "Hunter's Quarry", type: "At-Will", toHit: 99, defense: "AC", damage: "1d8" }
            	           ],
               effects: randEffects()
            },
            "Banshrae Dartswarmer": { 
                name: "Banshrae Dartswarmer", image: "images/portraits/banshrae_dartswarmer.jpg",
                hp: { total: 89 },
                defenses: { ac: 23, fort: 20, ref: 23, will: 22 },
                init: 11, speed: 8,
                attacks: [
                          { name: "Slam", type: "At-Will", range: "melee", toHit: 13, defense: "AC", damage: "1d8+3" },
                          { name: "Blowgun Dart", type: "At-Will", range: 5, toHit: 16, defense: "AC", targeting: "blast 5", damage: "1d10+6", effects: [ { name: "Dazed", saveEnds: true } ] },
                          { name: "Dart Flurry", type: "Recharge", recharge: 4, range: "blast 5", toHit: 16, defense: "AC", targeting: "blast 5", damage: "1d10+6", effects: [ 
                            { name: "multiple effects", saveEnds: true, children: [
                                    { name: "Dazed" }, 
                                    { name: "Attack penalty", amount: -2 } 
                                ] }
                            ] }
                  ]
            },
            "Slystone Dwarf Ruffian": { 
                name: "Slystone Dwarf Ruffian", image: "images/portraits/slystone_dwarf.jpg",
                hp: { total: 104 },
                defenses: { ac: 26, fort: 23, ref: 22, will: 21 },
                init: 12, speed: 6,
                attacks: [
                          { name: "Hammer", type: "At-Will", range: "melee", toHit: 17, defense: "AC", damage: "2d6+5", effects: [ "Marked" ] },
                          { name: "Hammer (charge)", type: "At-Will", range: "melee", toHit: 17, defense: "AC", damage: "2d6+5", effects: [ "Marked", "Prone" ] },
                          { name: "Mighty Strike", type: "Recharge", recharge: 5, range: "melee", toHit: 17, defense: "AC", damage: "3d8+5" },
                          { name: "Mighty Strike (charge)", type: "Recharge", recharge: 5, range: "melee", toHit: 17, defense: "AC", damage: "3d8+5", effects: [ "Prone" ] }
                  ]
            },
            "Hethralga": { 
                name: "Hethralga", image: "images/portraits/night_hag.jpg",
                hp: { total: 126 },
                defenses: { ac: 26, fort: 25, ref: 24, will: 23 },
                init: 11, speed: 6,
                attacks: [
                          { name: "Quarterstaff", type: "At-Will", range: "melee", toHit: 15, defense: "AC", damage: "1d10+5" },
                          { name: "Howl", type: "At-Will", range: "blast 3", toHit: 16, defense: "Fort", damage: "1d6+6", damageType: "thunder" },
                          { name: "Shriek of Pain", type: "Encounter", range: "blast 5", toHit: 16, defense: "Fort", damage: "3d6+6", damageType: "thunder", miss: "half damage" },
                          { name: "Shriek of Pain (bloodied)", type: "Encounter", range: "blast 5", toHit: 16, defense: "Fort", damage: "3d6+11", damageType: "thunder", miss: "half damage" }
                  ]
            },
            "Cyclops Guard": { 
                name: "Cyclops Guard", image: "images/portraits/cyclops.jpg",
                hp: { total: 1 },
                defenses: { ac: 27, fort: 26, ref: 23, will: 23 },
                init: 8, speed: 6,
                attacks: [ { name: "Battleaxe", type: "At-Will", range: "2", toHit: 17, defense: "AC", damage: "7" } ]
            },
            "Dragonborn Gladiator": { 
                name: "Dragonborn Gladiator", image: "images/portraits/dragonborn_gladiator.jpg", // "http://img213.imageshack.us/img213/2721/dragonborn29441748300x3.jpg",
                hp: { total: 106 },
                defenses: { ac: 24, fort: 23, ref: 20, will: 21 },
                init: 9, speed: 5,
                attacks: [
                          { name: "Bastard Sword", type: "At-Will", range: "melee", toHit: 15, defense: "AC", damage: "1d10+5" },
                          { name: "Bastard Sword (bloodied)", type: "At-Will", range: "melee", toHit: 16, defense: "AC", damage: "1d10+5" },
                          { name: "Bastard Sword (lone fighter)", type: "At-Will", range: "melee", toHit: 17, defense: "AC", damage: "1d10+5" },
                          { name: "Bastard Sword (bloodied, lone fighter)", type: "At-Will", range: "melee", toHit: 18, defense: "AC", damage: "1d10+5" },
                          { name: "Finishing Blow", type: "At-Will", range: "melee", toHit: 15, defense: "AC", damage: "1d10+5" },
                          { name: "Finishing Blow (bloodied)", type: "At-Will", range: "melee", toHit: 16, defense: "AC", damage: "1d10+5" },
                          { name: "Finishing Blow (lone fighter)", type: "At-Will", range: "melee", toHit: 17, defense: "AC", damage: "1d10+5" },
                          { name: "Finishing Blow (bloodied, lone fighter)", type: "At-Will", range: "melee", toHit: 18, defense: "AC", damage: "1d10+5" },
                          { name: "Howl", type: "At-Will", range: "blast 3", toHit: 16, defense: "Fort", damage: "1d6+6", damageType: "thunder" },
                          { name: "Shriek of Pain", type: "Encounter", range: "blast 5", toHit: 16, defense: "Fort", damage: "3d6+6", damageType: "thunder", miss: "half damage" },
                          { name: "Shriek of Pain (bloodied)", type: "Encounter", range: "blast 5", toHit: 16, defense: "Fort", damage: "3d6+11", damageType: "thunder", miss: "half damage" }
                  ]
            },
		}
    };
}
