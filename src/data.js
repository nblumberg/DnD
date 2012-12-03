function generateName() {
	var i, NAMES = [
"Bagn",
"Bas",
"Bseman",
"Bsunm",
"Dgax",
"Gkotex",
"Gnebx",
"Gukr",
"Kexabg",
"Mkagon",
"Mkasun",
"Mrozx",
"Nmagur",
"Nsemuk",
"Ran",
"Sekunx",
"Tarumg",
"Tuz",
"Xgaz",
"Xum",
"Zek",
"Zmadeb",
"Zsebon",
"Zurx",
"Zxotem"
	             ];
    i = Math.floor(Math.random() * NAMES.length);
    return NAMES[ i ];
}

function randEffect() {
    var i, EFFECTS = [
                   "-2 attacks",                      
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
    return EFFECTS[ i ];
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
                  "Cyclops Guard"
	              ],
		creatures: { 
		    Barases: { 
            	 name: "Barases", image: "http://images5.fanpop.com/image/photos/31000000/Satyr-fantasy-31060204-283-400.jpg", isPC: true, 
            	 hp: { total: 80, current: Math.floor(Math.random() * 80), temp: 3 },
            	 surges: { perDay: 11, current: 11 },
            	 defenses: { ac: 24, fort: 23, ref: 17, will: 22 },
            	 init: 5, speed: 6,
            	 attacks: [
            	           { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: 10, defense: "AC", damage: "1d12+2", crit: "2d12" },
            	           { name: "Ranged Basic", type: "At-Will", toHit: 8, defense: "AC", damage: "1d6+1", crit: "" },
            	           { name: "Tending Strike", type: "At-Will", toHit: 15, defense: "AC", damage: "1d12+7", crit: "2d12" },
            	           { name: "Combined Attack", type: "Encounter", toHit: 15, defense: "AC", damage: "1d12+7", crit: "2d12" },
            	           { name: "Vexing Overgrowth", type: "Daily", toHit: 15, defense: "AC", damage: "2d12+7", crit: "2d12" },
            	           { name: "Life Blood Harvest", type: "Daily", toHit: 15, defense: "AC", damage: "3d12+7", crit: "2d12" },
            	           { name: "Bear Beast", type: "At-Will", isMelee: true, toHit: 15, defense: "AC", damage: "1d12+9", crit: "" },
            	           { name: "Crocodile Beast", type: "At-Will", isMelee: true, toHit: 10, defense: "AC", damage: "1d8+7", crit: "" }
            	           ],
    	           effects: randEffects()
             },
             Bin: { 
            	 name: "Bin", image: "http://wizards.com/dnd/images/386_wr_changeling.jpg", isPC: true,
            	 hp: { total: 74, current: Math.floor(Math.random() * 74) },
            	 surges: { perDay: 9, current: 9 },
            	 defenses: { ac: 24, fort: 20, ref: 21, will: 22 },
            	 init: 7, speed: 6,
            	 attacks: [
            	           { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: 11, defense: "AC", damage: "1d8+3", crit: "2d8" },
            	           { name: "Ranged Basic", type: "At-Will", toHit: 11, defense: "AC", damage: "1d8+3", crit: "1d6" },
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
            	 name: "Festivus", image: "http://www.worldofazolin.com/wiki/images/8/8d/Dragsorc.jpg", isPC: true,
            	 hp: { total: 73, current: Math.floor(Math.random() * 73) },
            	 surges: { perDay: 9, current: 9 },
            	 defenses: { ac: 21, fort: 20, ref: 19, will: 23 },
            	 init: 5, speed: 6,
            	 attacks: [
            	           { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: 14, defense: "AC", damage: "1d8+5", crit: "1d6" },
            	           { name: "Ranged Basic", type: "At-Will", toHit: 8, defense: "AC", damage: "1d10", crit: "" },
            	           { name: "Blazing Starfall", type: "At-Will", toHit: 12, defense: "Ref", damage: "1d4+10", crit: "1d8" },
            	           { name: "Vicious Mockery", type: "At-Will", toHit: 12, defense: "Will", damage: "1d6+9", crit: "1d8" },
            	           { name: "Explosive Pyre", type: "Encounter", toHit: 12, defense: "Ref", damage: "2d8+10", crit: "1d8" },
            	           { name: "Eyebite", type: "Encounter", toHit: 12, defense: "Will", damage: "1d6+9", crit: "1d8" },
            	           { name: "Dissonant Strain", type: "Encounter", toHit: 12, defense: "Will", damage: "2d6+9", crit: "1d8" },
            	           { name: "Chaos Ray", type: "Encounter", toHit: 12, defense: "Will", damage: "2d8+13", crit: "1d8" },
            	           { name: "Stirring Shout", type: "Daily", toHit: 12, defense: "Will", damage: "2d6+9", crit: "1d8" },
            	           { name: "Reeling Torment", type: "Daily", toHit: 12, defense: "Will", damage: "3d8+13", crit: "1d8" },
            	           { name: "Counterpoint", type: "Daily", toHit: 12, defense: "Will", damage: "2d8+8", crit: "1d8" },
            	           { name: "Dragon Breath", type: "Encounter", toHit: 11, defense: "Ref", damage: "1d6+3", crit: "" }
            	           ],
                 effects: randEffects()
             },
             Kallista: { 
            	 name: "Kallista", image: "http://www.wizards.com/dnd/images/Dragon_373/11.jpg", isPC: true, 
            	 hp: { total: 69, current: Math.floor(Math.random() * 69) },
            	 surges: { perDay: 7, current: 7 },
            	 defenses: { ac: 23, fort: 18, ref: 23, will: 22 },
            	 init: 10, speed: 6,
            	 attacks: [
            	           { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: 14, defense: "AC", damage: "1d8+6", crit: "3d8" },
            	           { name: "Ranged Basic", type: "At-Will", toHit: 16, defense: "AC", damage: "1d6+7", crit: "1d6" },
            	           { name: "Duelist's Flurry", type: "At-Will", toHit: 17, defense: "AC", damage: "0d0+5", crit: "3d8" },
            	           { name: "Sly Flourish", type: "At-Will", toHit: 17, defense: "AC", damage: "1d8+15", crit: "3d8" },
            	           { name: "Demonic Frenzy", type: "Encounter", toHit: 99, defense: "AC", damage: "1d6", crit: "" },
            	           { name: "Acrobat's Blade Trick", type: "Encounter", toHit: 17, defense: "AC", damage: "1d8+9", crit: "3d8" },
            	           { name: "Flailing Shove", type: "Encounter", toHit: 17, defense: "AC", damage: "1d8+9", crit: "3d8" },
            	           { name: "Cloud of Steel", type: "Encounter", toHit: 16, defense: "AC", damage: "1d6+7", crit: "1d6" },
            	           { name: "Bloodbath", type: "Daily", toHit: 17, defense: "Fort", damage: "1d8+9", crit: "3d8" },
            	           { name: "Burst Fire", type: "Daily", toHit: 16, defense: "Ref", damage: "2d6+7", crit: "1d6" },
            	           { name: "Duelists Prowess", type: "Immediate Interrupt", toHit: 17, defense: "Ref", damage: "1d8+9", crit: "3d8" },
            	           { name: "Sneak Attack", type: "At-Will", toHit: 99, defense: "AC", damage: "1d8", crit: "" }
            	           ],
                 effects: randEffects()
             },
			 Karrion: { 
            	 name: "Karrion", image: "http://rogueartfx.com/images/tiefling03.jpg", isPC: true, 
            	 hp: { total: 73, current: Math.floor(Math.random() * 73) },
            	 surges: { perDay: 9, current: 9 },
            	 defenses: { ac: 23, fort: 21, ref: 21, will: 19 },
            	 init: 11, speed: 6,
            	 attacks: [
            	           { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: 14, defense: "AC", damage: "2d4+5", crit: "1d6" },
            	           { name: "Ranged Basic", type: "At-Will", toHit: 13, defense: "AC", damage: "1d10+5", crit: "1d6" },
            	           { name: "Marauder's Rush", type: "At-Will", toHit: 14, defense: "AC", damage: "2d4+8", crit: "1d6" },
            	           { name: "Twin Strike", type: "At-Will", toHit: 14, defense: "AC", damage: "2d4+4", crit: "1d6" },
            	           { name: "Thundertusk Boar Strike", type: "Encounter", toHit: 14, defense: "AC", damage: "2d4+5", crit: "" },
            	           { name: "Sweeping Whirlwind", type: "Encounter", isMelee: true, toHit: 14, defense: "AC", damage: "2d4+4", crit: "" },
            	           { name: "Boar Assault", type: "Daily", toHit: 14, defense: "AC", damage: "4d4+5", crit: "" },
            	           { name: "Invigorating Assault", type: "Daily", toHit: 13, defense: "AC", damage: "3d10+5", crit: "" },
            	           { name: "Infernal Wrath", type: "Encounter", toHit: 99, defense: "AC", damage: "1d6+4", crit: "" },
            	           { name: "Spirit Fangs", type: "Encounter", toHit: 8, defense: "Ref", damage: "1d10+3", crit: "" },
            	           { name: "Hunter's Thorn Trap", type: "Encounter", toHit: 99, defense: "AC", damage: "0d0+8", crit: "" },
            	           { name: "Hunter's Quarry", type: "At-Will", toHit: 99, defense: "AC", damage: "1d8", crit: "" }
            	           ],
                 effects: randEffects()
             },
             Kitara: { 
            	 name: "Kitara", image: "http://www.deviantart.com/download/46708270/Maiden_of_the_Mirthless_Smile_by_UdonCrew.jpg", isPC: true,
            	 hp: { total: 71, current: Math.floor(Math.random() * 71) },
            	 surges: { perDay: 9, current: 9 },
            	 defenses: { ac: 26, fort: 21, ref: 22, will: 21 },
            	 init: 11, speed: 7,
            	 attacks: [
            	           { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: 16, defense: "AC", damage: "1d10+8", crit: "2d8" },
            	           { name: "Ranged Basic", type: "At-Will", toHit: 99, defense: "AC", damage: "10", crit: "" },
            	           { name: "Magic Missile", type: "At-Will", toHit: 99, defense: "AC", damage: "10", damageType: "force", crit: "" },
            	           { name: "Lightning Ring", type: "At-Will", toHit: 99, defense: "AC", damage: "5", damageType: "lightning", crit: "" },
            	           { name: "Lightning Ring (secondary)", type: "At-Will", toHit: 99, defense: "AC", damage: "5", damageType: "lightning", crit: "" },
            	           { name: "Shadow Sever", type: "At-Will", toHit: 99, defense: "AC", damage: "5", damageType: "necrotic", crit: "", effects: [ { name: "prone" }] },
            	           { name: "Unseen Hand", type: "At-Will", toHit: 14, defense: "AC", damage: "5", damageType: "force", crit: "2d8" },
            	           { name: "Gaze of the Evil Eye", type: "At-Will", toHit: 99, defense: "AC", damage: "2", damageType: "psychic", crit: "" },
            	           { name: "Burning Hands", type: "Encounter", toHit: 14, defense: "Ref", damage: "2d6+9", damageType: "fire", crit: "2d8" },
            	           { name: "Icy Rays", type: "Encounter", toHit: 14, defense: "Ref", damage: "1d10+6", damageType: "cold", crit: "2d8" },
            	           { name: "Pinioning Vortex", type: "Encounter", toHit: 14, defense: "Fort", damage: "2d6+6", crit: "2d8", effects: [ { name: "immobilized", duration: 1 }, { name: "dazed", duration: 1 } ] },
            	           { name: "Acid Arrow", type: "Daily", toHit: 14, defense: "Ref", damage: "2d8+6", damageType: "acid", crit: "2d8" },
            	           { name: "Acid Arrow, secondary", type: "Daily", toHit: 14, defense: "Ref", damage: "1d8+6", damageType: "acid", crit: "2d8" },
            	           { name: "Fountain of Flame", type: "Daily", toHit: 14, defense: "Ref", damage: "3d8+6", damageType: "fire", crit: "2d8" },
            	           { name: "Phantom Chasm", type: "Daily", toHit: 14, defense: "Will", damage: "2d6+6", crit: "2d8", effects: [ { name: "prone", duration: 1 } ] },
            	           { name: "Rolling Thunder", type: "Daily", toHit: 14, defense: "Ref", damage: "3d6+6", damageType: "thunder", crit: "2d8" }
            	           // TODO: What are Kitara's other powers?
            	           ],
                 effects: randEffects()
             },
   		  	 Lechonero: { 
            	 name: "Lechonero", image: "http://www.critical-hits.com/wp-content/uploads/2007/12/elf.jpg", isPC: true, 
            	 hp: { total: 71, current: Math.floor(Math.random() * 71) },
            	 surges: { perDay: 8, current: 8 },
            	 defenses: { ac: 24, fort: 21, ref: 23, will: 19 },
            	 init: 12, speed: 7,
            	 attacks: [
            	           { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: 12, defense: "AC", damage: "1d8+4", crit: "1d8" },
            	           { name: "Ranged Basic", type: "At-Will", toHit: 15, defense: "AC", damage: "1d10+9", crit: "2d8" },
            	           { name: "Rapid Shot", type: "At-Will", toHit: 13, defense: "AC", damage: "1d10+9", crit: "2d8" },
            	           { name: "Twin Strike", type: "At-Will", toHit: 15, defense: "AC", damage: "1d10+2", crit: "2d8" },
            	           { name: "Hindering Shot", type: "Encounter", toHit: 15, defense: "AC", damage: "2d10+7", crit: "2d8" },
            	           { name: "Covering Volley", type: "Encounter", toHit: 15, defense: "AC", damage: "1d10+7", crit: "2d8" },
            	           { name: "Spikes of the Manticore", type: "Encounter", toHit: 15, defense: "AC", damage: "2d10+7", crit: "2d8" },
            	           { name: "Spikes of the Manticore, secondary", type: "Encounter", toHit: 15, defense: "AC", damage: "1d10+7", crit: "2d8" },
            	           { name: "Sure Shot", type: "Daily", toHit: 15, defense: "AC", damage: "3d10+7", crit: "2d8" },
            	           { name: "Flying Steel", type: "Daily", toHit: 15, defense: "AC", damage: "2d10+7", crit: "2d8" },
            	           { name: "Marked for Death", type: "Daily", toHit: 15, defense: "AC", damage: "3d10+7", crit: "2d8" },
            	           { name: "Beast Melee Basic", type: "At-Will", toHit: 12, defense: "AC", damage: "1d12+3", crit: "" },
            	           { name: "Hunter's Quarry", type: "At-Will", toHit: 99, defense: "AC", damage: "1d8", crit: "" },
            	           { name: "Hunter's Thorn Trap", type: "Encounter", toHit: 99, defense: "AC", damage: "0d0+8", crit: "" },
            	           { name: "Hunter's Quarry", type: "At-Will", toHit: 99, defense: "AC", damage: "1d8", crit: "" }
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
                                                                                                                                                                              { name: "Dazed", saveEnds: "all" }, 
                                                                                                                                                                              { name: "-2 attacks", saveEnds: "all" } 
                                                                                                                                                                              ]
                          }
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
            }
		}
    };
}
