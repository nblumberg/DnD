function loadParty() {
    return { 
        party: { 
            Barases: { 
                 name: "Barases", isPC: true, level: 10, image: "images/portraits/barases.jpg", // "http://images5.fanpop.com/image/photos/31000000/Satyr-fantasy-31060204-283-400.jpg",  
                 abilities: { STR: 11, CON: 18, DEX: 10, INT: 10, WIS: 20, CHA: 10 },
                 hp: { total: 80 },
                 surges: { perDay: 11, current: 11 },
                 defenses: { ac: 24, fort: 23, ref: 17, will: 22 },
                 init: 5, speed: 6,
                 weapons: [ 
                           { name: "Vicious Quarterstaff +2", isMelee: true, enhancement: 2, proficiency: 2, damage: { amount: "1d12", crit: "2d12" } },
                           { name: "Distance Sling +1", isMelee: false, enhancement: 1, damage: "1d6" }
                            ],
                 "implements": [
                               { name: "Staff", enhancement: 0, crit: "" }
                                ],
                 attacks: [
                           { name: "Melee Basic", type: "At-Will", toHit: 10, defense: "AC", damage: "1[W]+STR", keywords: [ "weapon", "melee", "basic" ] },
                           { name: "Ranged Basic", type: "At-Will", toHit: 8, defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "ranged", "basic" ] },
                           { name: "Tending Strike", type: "At-Will", toHit: 11, defense: "AC", damage: "1[W]+WIS", keywords: [ "weapon", "melee", "primal" ] },
                           { name: "Combined Attack", type: "Encounter", toHit: 11, defense: "AC", damage: "1[W]+WIS", keywords: [ "weapon", "melee", "primal" ] },
                           { name: "Combined Attack (beast)", type: "At-Will", toHit: 15, defense: "AC", damage: "1d12+9", crit: "", keywords: [ "melee", "primal", "beast" ] },
                           { name: "Vexing Overgrowth", type: "Daily", target: { area: "close burst", size: 1 }, toHit: 11, defense: "AC", damage: "2[W]+WIS", miss: { halfDamage: true }, keywords: [ "weapon", "primal" ] },
                           { name: "Life Blood Harvest", type: "Daily", toHit: 15, defense: "AC", damage: "3[W]+WIS", miss: { halfDamage: true }, keywords: [ "weapon", "melee", "primal", "healing" ] },
                           { name: "Bear Beast", type: "At-Will", range: 5, toHit: 15, defense: "AC", damage: "1d12+9", crit: "", keywords: [ "implement", "primal", "summoning" ] },
                           { name: "Crocodile Beast", type: "At-Will", toHit: 10, defense: "AC", damage: "1d8+WIS", crit: "", keywords: [ "weapon", "melee", "beast" ] }
                           ],
                   effects: []
             },
             Smack: { 
                 name: "Smack", isPC: true, level: 10, image: "images/portraits/smack.jpg", // http://www.lpzoo.org/sites/default/files/imagesfacts/black_bear.jpg?1331759862  
                 abilities: { STR: 20, CON: 17, DEX: 12, INT: 2, WIS: 16, CHA: 6 },
                 hp: { total: 40 },
                 surges: { perDay: 0, current: 0 },
                 defenses: { ac: 13, fort: 15, ref: 11, will: 15 },
                 init: 5, speed: 6,
                 weapons: [],
                 "implements": [],
                 attacks: [
                           { name: "Animal Attack", type: "At-Will", toHit: 15, defense: "AC", damage: "1d12+9", keywords: [ "melee", "beast", "basic" ] }
                          ],
                 effects: []
             },
             Bin: { 
                 name: "Bin", isPC: true, level: 10, image: "images/portraits/bin.jpg", // "http://wizards.com/dnd/images/386_wr_changeling.jpg", 
                 abilities: { STR: 14, CON: 17, DEX: 15, INT: 21, WIS: 18, CHA: 11 },
                 hp: { total: 74 },
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
                           { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: 11, defense: "AC", damage: "1[W]+STR", keywords: [ "weapon", "melee", "basic" ] },
                           { name: "Ranged Basic", type: "At-Will", toHit: 11, defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "ranged", "basic" ] },
                           { name: "Magic Weapon", type: "At-Will", toHit: 15, defense: "AC", damage: "1d8+7", crit: "2d8" },
                           { name: "Thundering Armor", type: "At-Will", toHit: 13, defense: "Fort", damage: "1d8+8", crit: "2d8" },
                           { name: "Stone Panoply", type: "Encounter", toHit: 14, defense: "AC", damage: "1d8+7", crit: "2d8" },
                           { name: "Shielding Cube", type: "Encounter", toHit: 13, defense: "Ref", damage: "2d6+8", crit: "2d8" },
                           { name: "Lightning Sphere", type: "Encounter", toHit: 13, defense: "Fort", damage: "1d8+8", crit: "2d8" },
                           { name: "Vampiric Weapons", type: "Encounter", toHit: 15, defense: "AC", damage: "1d8+6", crit: "2d8" },
                           { name: "Caustic Rampart", type: "Daily", toHit: "automatic", defense: "AC", damage: "1d6+5", crit: "" },
                           { name: "Lightning Motes", type: "Daily", toHit: 13, defense: "Ref", damage: "2d6+8", crit: "2d8" }
                           ],
                 effects: []
             },
             Festivus: { 
                 name: "Festivus", isPC: true, level: 10, image: "images/portraits/festivus.jpg", // "http://www.worldofazolin.com/wiki/images/8/8d/Dragsorc.jpg",
                 abilities: { STR: 18, CON: 16, DEX: 10, INT: 16, WIS: 10, CHA: 20 },
                 hp: { total: 73 },
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
                 attackBonuses: [ 
                                  { name: "Dragonborn Fury", status: [ "bloodied" ], toHit: 1 }, 
                                  { name: "White Lotus Dueling Expertise", keywords: [ "basic" ], toHit: 1 }, 
                                  { name: "White Lotus Dueling Expertise", keywords: [ "implement" ], toHit: 1 },  
                                  { name: "White Lotus Dueling Expertise", keywords: [ "implement" ], toHit: 1 },  
                                  { name: "Wand of Psychic Ravaging", keywords: [ "implement", "psychic" ], damage: 1 },  
                                  { name: "Resplendent Gloves", defense: "Will", damage: 2 }  
                              ],
                 attacks: [
                           { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: "STR", defense: "AC", damage: "1[W]+5", keywords: [ "weapon", "melee", "basic" ]  },
                           { name: "Ranged Basic", type: "At-Will", toHit: "DEX", defense: "AC", damage: "1[W]", keywords: [ "weapon", "ranged", "basic" ]  },
                           { name: "Blazing Starfall", type: "At-Will", toHit: "CHA", defense: "Ref", damage: { amount: "1d4+10", type: "radiant", crit: "1d8" }, keywords: [ "arcane", "fire", "implement", "radiant", "zone" ] },
                           { name: "Vicious Mockery", type: "At-Will", toHit: "CHA", defense: "Will", damage: { amount: "1d6+9", type: "psychic", crit: "1d8" }, keywords: [ "arcane", "charm", "implement", "psychic" ] },
                           { name: "Explosive Pyre", type: "Encounter", toHit: "CHA", defense: "Ref", damage: { amount: "2d8+10", type: "fire", crit: "1d8" }, keywords: [ "arcane", "fire", "implement" ] },
                           { name: "Explosive Pyre (secondary)", type: "Encounter", toHit: "CHA", defense: "Ref", damage: { amount: "2d8+10", type: "fire", crit: "1d8" }, keywords: [ "arcane", "fire", "implement" ] },
                           { name: "Eyebite", type: "Encounter", toHit: "CHA", defense: "Will", damage: { amount: "1d6+9", type: "psychic", crit: "1d8" }, keywords: [ "arcane", "charm", "implement", "psychic" ] },
                           { name: "Dissonant Strain", type: "Encounter", toHit: "CHA", defense: "Will", damage: { amount: "2d6+9", type: "psychic", crit: "1d8" }, keywords: [ "arcane", "implement", "psychic" ] },
                           { name: "Chaos Ray", type: "Encounter", toHit: "CHA", defense: "Will", damage: { amount: "2d8+13", type: "psychic", crit: "1d8" }, keywords: [ "arcane", "implement", "psychic", "teleportation" ] },
                           { name: "Stirring Shout", type: "Daily", toHit: "CHA", defense: "Will", damage: { amount: "2d6+9", type: "psychic", crit: "1d8" }, keywords: [ "arcane", "healing", "implement", "psychic" ] },
                           { name: "Reeling Torment", type: "Daily", toHit: "CHA", defense: "Will", damage: { amount: "3d8+13", type: "psychic", crit: "1d8" }, keywords: [ "arcane", "charm", "implement", "psychic" ] },
                           { name: "Counterpoint", type: "Daily", toHit: "CHA", defense: "Will", damage: { amount: "2d8+8", crit: "1d8" }, keywords: [ "arcane", "implement" ] },
                           { name: "Dragon Breath", type: "Encounter", toHit: "STR^CON^DEX+2", defense: "Ref", damage: { amount: "1d6+3", type: "acid" }, keywords: [ "acid" ] }
                           ],
                 effects: []
             },
             Kallista: { 
                 name: "Kallista", isPC: true, level: 10, image: "images/portraits/kallista.jpg", // "http://www.wizards.com/dnd/images/Dragon_373/11.jpg", 
                 abilities: { STR: 14, CON: 12, DEX: 20, INT: 14, WIS: 12, CHA: 22 },
                 hp: { total: 69 },
                 surges: { perDay: 7, current: 7 },
                 defenses: { ac: 23, fort: 18, ref: 23, will: 22, resistances: { fire: 10 } },
                 resistances: { fire: 10 },
                 init: 10, speed: 6,
                 weapons: [ 
                           { name: "Wicked Fang Longsword +3", isMelee: true, enhancement: 3, proficiency: 3, damage: { amount: "1d8", crit: "3d8" } },
                           { name: "Rebounding Hand Crossbow +2", isMelee: false, enhancement: 2, proficiency: 2, damage: { amount: "1d6", crit: "2d6" } }
                            ],
                 "implements": [
                                ],
                 attackBonuses: [ 
                                 { name: "Bloodhunt", foeStatus: [ "bloodied" ], toHit: 1 }, 
                                 { name: "Master at Arms", keywords: [ "weapon" ], toHit: 1 }, 
                                 { name: "Sneak Attack", foeStatus: [ "combat advantage" ], damage: "2d8+2", oncePerRound: true }
                            ],
                 attacks: [
                           { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: "STR", defense: "AC", damage: "1[W]+STR", keywords: [ "weapon", "melee", "basic" ] },
                           { name: "Ranged Basic", type: "At-Will", toHit: "DEX", defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "ranged", "basic" ] },
                           { name: "Duelist's Flurry", type: "At-Will", toHit: "DEX", defense: "AC", damage: "DEX", keywords: [ "weapon", "martial", "melee" ] },
                           { name: "Sly Flourish", type: "At-Will", toHit: "DEX", defense: "AC", damage: "1[W]+DEX+CHA", keywords: [ "weapon", "martial" ] },
                           { name: "Demonic Frenzy", type: "Encounter", toHit: "automatic", defense: "AC", damage: "1d6", keywords: [ "elemental" ] },
                           { name: "Acrobat's Blade Trick", type: "Encounter", toHit: "DEX", defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "martial", "melee" ] },
                           { name: "Flailing Shove", type: "Encounter", toHit: "DEX", defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "martial", "melee" ] },
                           { name: "Flailing Shove (secondary)", type: "Encounter", toHit: "automatic", defense: "AC", damage: "2+STR", keywords: [ "weapon", "martial", "melee" ] },
                           { name: "Cloud of Steel", type: "Encounter", toHit: "DEX", defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "martial", "ranged" ] },
                           { name: "Bloodbath", type: "Daily", toHit: "DEX", defense: "Fort", damage: "1[W]+DEX", effects: [ { name: "ongoing damage", amount: "2d6" } ], keywords: [ "weapon", "martial" ] },
                           { name: "Burst Fire", type: "Daily", toHit: "DEX", defense: "Ref", damage: "2[W]+DEX", keywords: [ "weapon", "martial", "ranged" ] },
                           { name: "Duelists Prowess", type: "Immediate Interrupt", toHit: "DEX", defense: "Ref", damage: "1[W]+DEX", keywords: [ "weapon", "martial", "melee" ] },
                           { name: "Sneak Attack", type: "At-Will", toHit: "automatic", defense: "AC", damage: "2d8" }
                           ],
                 effects: []
             },
             Karrion: { 
                 name: "Karrion", isPC: true, level: 10, image: "images/portraits/karrion.jpg", // "http://rogueartfx.com/images/tiefling03.jpg",  
                 abilities: { STR: 19, CON: 16, DEX: 19, INT: 18, WIS: 16, CHA: 16 },
                 hp: { total: 73 },
                 surges: { perDay: 9, current: 9 },
                 defenses: { ac: 23, fort: 21, ref: 21, will: 19, resistances: { fire: 10 } },
                 resistances: { fire: 10 },
                 init: 11, speed: 6,
                 weapons: [ 
                           { name: "Lightning Spiked Chain +1", isMelee: true, enhancement: 1, proficiency: 3, damage: "2d4", crit: "1d6" },
                           { name: "Sid Vicious Longbow +1", isMelee: false, enhancement: 1, proficiency: 2, damage: "1d10", crit: "1d12" }
                            ],
                 "implements": [
                                { name: "Totem", enhancement: 0 },
                                ],
                 attackBonuses: [ 
                                { name: "Bloodhunt", foeStatus: [ "bloodied" ], toHit: 1 }, 
                                { name: "Hunter's Quarry", foeStatus: [ "hunter's quarry" ], damage: "1d8", oncePerRound: true }
                           ],
                 attacks: [
                           { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: 14, defense: "AC", damage: "1[W]+STR", keywords: [ "weapon", "melee", "basic" ] },
                           { name: "Ranged Basic", type: "At-Will", toHit: 13, defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "ranged", "basic" ] },
                           { name: "Marauder's Rush", type: "At-Will", toHit: 14, defense: "AC", damage: "1[W]+STR+WIS", keywords: [ "weapon", "martial", "melee" ] },
                           { name: "Twin Strike", type: "At-Will", toHit: 14, defense: "AC", damage: "1[W]", keywords: [ "weapon", "martial" ] },
                           { name: "Dire Wolverine Strike", type: "Encounter", toHit: 14, defense: "AC", damage: "1[W]+STR", keywords: [ "weapon", "martial", "melee" ] },
                           { name: "Thundertusk Boar Strike", type: "Encounter", toHit: 14, defense: "AC", damage: "1[W]+STR/DEX", keywords: [ "weapon", "martial" ] },
                           { name: "Sweeping Whirlwind", type: "Encounter", isMelee: true, toHit: 14, defense: "AC", damage: "1[W]+STR", keywords: [ "weapon", "martial", "melee" ] },
                           { name: "Boar Assault", type: "Daily", toHit: 14, defense: "AC", damage: "2[W]+STR/DEX", keywords: [ "weapon", "martial" ] },
                           { name: "Invigorating Assault", type: "Daily", toHit: 13, defense: "AC", damage: "3[W]+DEX", miss: { halfDamage: true }, keywords: [ "weapon", "martial", "ranged" ] },
                           { name: "Infernal Wrath", type: "Encounter", toHit: "automatic", defense: "AC", damage: "1d6+INT^CHA", keywords: [ "fire" ] },
                           { name: "Spirit Fangs", type: "Encounter", toHit: 8, defense: "Ref", damage: "1d10+WIS", keywords: [ "implement", "primal", "spirit" ] },
                           { name: "Hunter's Thorn Trap", type: "Encounter", toHit: "automatic", defense: "AC", damage: "5+WIS", keywords: [ "primal", "zone" ] },
                           { name: "Hunter's Quarry", type: "At-Will", toHit: "automatic", defense: "AC", damage: "1d8" }
                           ],
                 effects: []
             },
             Kitara: { 
                 name: "Kitara", isPC: true, level: 10, image: "images/portraits/kitara.jpg", // "http://www.deviantart.com/download/46708270/Maiden_of_the_Mirthless_Smile_by_UdonCrew.jpg", 
                 abilities: { STR: 16, CON: 14, DEX: 20, INT: 22, WIS: 16, CHA: 16 },
                 hp: { total: 71 },
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
                           { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: 16, defense: "AC", damage: "1[W]+STR", keywords: [ "weapon", "melee", "basic" ] },
                           { name: "Ranged Basic", type: "At-Will", toHit: "automatic", defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "ranged", "basic" ] },
                           { name: "Magic Missile", type: "At-Will", toHit: "automatic", defense: "AC", damage: { amount: "2+INT", type: "force" }, keywords: [ "arcane", "evocation", "force", "implement" ] },
                           { name: "Lightning Ring", type: "At-Will", toHit: "automatic", defense: "AC", damage: { amount: "5", type: "lightning" }, keywords: [ "arcane", "bladespell", "lightning" ] },
                           { name: "Lightning Ring (secondary)", type: "At-Will", toHit: "automatic", defense: "AC", damage: { amount: "5", type: "lightning" }, keywords: [ "arcane", "bladespell", "lightning" ] },
                           { name: "Shadow Sever", type: "At-Will", toHit: "automatic", defense: "AC", damage: { amount: "5", type: "necrotic" }, effects: [ { name: "Prone" } ], keywords: [ "arcane", "bladespell", "necrotic" ] },
                           { name: "Unseen Hand", type: "At-Will", toHit: 12, defense: "AC", damage: { amount: "5", type: "force" }, keywords: [ "arcane", "bladespell", "force" ] },
                           { name: "Gaze of the Evil Eye", type: "At-Will", toHit: "automatic", defense: "AC", damage: { amount: "2", type: "psychic" }, keywords: [ "arcane", "psychic" ] },
                           { name: "Orbmaster's Incendiary Detonation", target: { area: "burst", size: 1, range: 10 }, type: "Encounter", toHit: 14, defense: "Ref", damage: { amount: "1d6+INT", type: "force" }, effects: [ "Prone" ], keywords: [ "arcane", "evocation", "fire", "implement", "force", "zone" ] },
                           { name: "Orbmaster's Incendiary Detonation (zone)", type: "Encounter", target: { area: "burst", size: 1, range: 10 }, toHit: "automatic", defense: "Ref", damage: { amount: "2", type: "fire" }, effects: [ "Prone" ], keywords: [ "arcane", "evocation", "fire", "force", "zone" ] },
                           { name: "Force Orb", type: "Encounter", toHit: 14, defense: "Ref", damage: { amount: "2d8+INT", type: "force" }, keywords: [ "arcane", "evocation", "force", "implement" ] },
                           { name: "Force Orb (secondary)", type: "Encounter", target: { area: "burst", size: 1, range: 20 }, toHit: 14, defense: "Ref", damage: { amount: "1d10+INT", type: "force" }, keywords: [ "arcane", "evocation", "force", "implement" ] },
                           { name: "Burning Hands", type: "Encounter", target: { area: "close blast", size: 5 }, toHit: 12, defense: "Ref", damage: { amount: "2d6+INT", type: "fire" }, miss: { halfDamage: true }, keywords: [ "arcane", "evocation", "fire", "implement" ] },
                           { name: "Skewering Spikes", type: "Encounter", target: { range: 5 }, toHit: 12, defense: "Ref", damage: "1d8+INT", keywords: [ "arcane", "evocation", "implement" ] },
                           { name: "Skewering Spikes (single target)", type: "Encounter", target: { range: 5 }, toHit: 12, defense: "Ref", damage: "2d8+INT", keywords: [ "arcane", "evocation", "implement" ] },
                           { name: "Glorious Presence", type: "Encounter", target: { area: "close burst", size: 2 }, toHit: 12, range: 2, defense: "Will", damage: { amount: "2d6+INT", type: "radiant" }, keywords: [ "arcane", "charm", "echantment", "implement", "radiant", "close burst" ] },
                           { name: "Ray of Enfeeblement", type: "Encounter", toHit: 12, target: { range: 10 }, defense: "Fort", damage: { amount: "1d10+INT", type: "necrotic" }, effects: [ { name: "Weakened", duration: 1 } ], keywords: [ "arcane", "implement", "necromancy", "necrotic", "ranged" ] },
                           { name: "Grim Shadow", type: "Encounter", toHit: 12, target: { area: "close blast", size: 3 }, defense: "Will", damage: { amount: "2d8+INT", type: "necrotic" }, effects: [ { name: "Attack penalty", amount: -2, duration: 1 }, { name: "Will penalty", amount: -2, duration: 1 } ], keywords: [ "arcane", "fear", "implement", "necromancy", "necrotic", "close blast" ] },
                           { name: "Icy Rays", type: "Encounter", target: { range: 10 }, toHit: 12, defense: "Ref", damage: { amount: "1d10+INT", type: "cold" }, effects: [ { name: "immobilized", duration: 1 } ], miss: { effects: [ { name: "slowed", duration: 1 } ] }, keywords: [ "arcane", "evocation", "cold", "implement", "ranged" ] },
                           { name: "Pinioning Vortex", type: "Encounter", toHit: 12, target: { range: 10 }, defense: "Fort", damage: "2d6+INT", effects: [ { name: "immobilized", duration: 1 }, { name: "dazed", duration: 1 } ], keywords: [ "arcane", "evocation", "implement", "ranged" ] },
                           { name: "Phantom Chasm", type: "Daily", target: { area: "burst", size: 1, range: 10 }, toHit: 12, defense: "Will", damage: { amount: "2d6+INT", type: "psychic" }, effects: [ "Prone", { name: "immobilized", duration: 1 } ], miss: { halfDamage: true, effects: [ "Prone" ] }, keywords: [ "arcane", "illusion", "psychic", "implement", "zone" ] },
                           { name: "Phantom Chasm (zone)", type: "Daily", target: { area: "burst", size: 1, range: 10 }, toHit: "automatic", defense: "Will", damage: "0", effects: [ "Prone" ], keywords: [ "arcane", "illusion", "psychic", "zone" ] },
                           { name: "Fountain of Flame", type: "Daily", target: { area: "burst", size: 1, range: 10 }, toHit: 12, defense: "Ref", damage: { amount: "3d8+INT", type: "fire" }, miss: { halfDamage: true }, keywords: [ "arcane", "evocation", "fire", "implement", "zone" ] },
                           { name: "Fountain of Flame (zone)", type: "Daily", target: { area: "burst", size: 1, range: 10 }, toHit: "automatic", defense: "Ref", damage: { amount: "5", type: "fire" }, keywords: [ "arcane", "evocation", "fire", "zone" ] },
                           { name: "Slimy Transmutation", type: "Daily", target: { range: 10 }, toHit: 12, defense: "Fort", damage: "0", effects: [ { name: "Polymorph (Tiny Toad)", saveEnds: true } ], miss: { effects: [ { name: "Polymorph (Tiny Toad)", duration: 1 } ] }, keywords: [ "arcane", "implement", "polymorph", "transmutation" ] },
                           { name: "Acid Arrow", type: "Daily", target: { range: 20 }, toHit: 12, defense: "Ref", damage: { amount: "2d8+INT", type: "acid" }, effects: [ { name: "ongoing damage", type: "acid", amount: 5, saveEnds: true } ], miss: { halfDamage: true, effects: [ { name: "ongoing damage", type: "acid", amount: 2, saveEnds: true } ] }, keywords: [ "arcane", "evocation", "acid", "implement" ] },
                           { name: "Acid Arrow (secondary)", type: "Daily", target: { area: "burst", size: 1, range: 20 }, toHit: 12, defense: "Ref", damage: { amount: "1d8+INT", type: "acid" }, effects: [ { name: "ongoing damage", type: "acid", amount: 5, saveEnds: true } ], keywords: [ "arcane", "evocation", "acid", "implement" ] },
                           { name: "Rolling Thunder", type: "Daily", target: { range: 10 }, toHit: 12, defense: "Ref", damage: { amount: "3d6+INT", type: "thunder" }, miss: { halfDamage: true }, keywords: [ "arcane", "conjuration", "evocation", "implement", "thunder" ] },
                           { name: "Rolling Thunder (secondary)", type: "Daily", target: { range: 10 }, toHit: 12, defense: "Ref", damage: { amount: "5", type: "thunder" }, keywords: [ "arcane", "conjuration", "evocation", "thunder" ] },
                           { name: "Fireball", type: "Daily", target: { area: "burst", size: 3, range: 20 }, toHit: 12, defense: "Ref", damage: { amount: "4d6+INT", type: "fire" }, miss: { halfDamage: true }, keywords: [ "arcane", "evocation", "implement", "fire" ] },
                           { name: "Grasp of the Grave", type: "Daily", target: { area: "burst", size: 2, range: 20, enemiesOnly: true }, toHit: 12, defense: "Ref", damage: { amount: "1d10+INT", type: "necrotic" }, effects: [ { name: "Dazed", duration: 1 } ], miss: { damage: { amount: "1d10+INT", type: "necrotic" } }, keywords: [ "arcane", "implement", "necromancy", "necrotic" ] },
                           { name: "Grasp of the Grave (zone)", type: "Daily", target: { area: "burst", size: 2, range: 20, enemiesOnly: true }, toHit: "automatic", defense: "Ref", damage: { amount: "5", type: "necrotic" }, keywords: [ "arcane", "necromancy", "necrotic" ] },
                           { name: "Scattering Shock", type: "Daily", target: { area: "burst", size: 3, range: 10 }, toHit: 12, defense: "Fort", damage: "0", keywords: [ "arcane", "evocation", "implement", "lightning" ] },
                           { name: "Scattering Shock (secondary)", type: "Daily", target: { area: "creature", size: 1 }, toHit: 12, defense: "Ref", damage: { amount: "2d8+INT", type: "lightning" }, miss: { halfDamage: true }, keywords: [ "arcane", "evocation", "implement", "lightning" ] }
                           ],
                 effects: []
             },
             Lechonero: { 
                 name: "Lechonero", isPC: true, level: 10, image: "images/portraits/lechonero.jpg", // "http://www.critical-hits.com/wp-content/uploads/2007/12/elf.jpg", 
                 abilities: { STR: 16, CON: 14, DEX: 21, INT: 14, WIS: 15, CHA: 10 },
                 hp: { total: 71 },
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
                           { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: 12, defense: "AC", damage: "1[W]+STR", keywords: [ "weapon", "melee", "basic" ] },
                           { name: "Ranged Basic", type: "At-Will", toHit: 15, defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "ranged", "basic" ] },
                           { name: "Rapid Shot", type: "At-Will", toHit: 13, defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "martial", "ranged" ] },
                           { name: "Twin Strike", type: "At-Will", toHit: 15, defense: "AC", damage: "1[W]", keywords: [ "weapon", "martial" ] },
                           { name: "Hindering Shot", type: "Encounter", toHit: 15, defense: "AC", damage: "2[W]+DEX", effects: [ { name: "slowed", duration: 1 } ], keywords: [ "weapon", "martial", "ranged" ] },
                           { name: "Covering Volley", type: "Encounter", toHit: 15, defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "martial", "ranged" ] },
                           { name: "Covering Volley (secondary)", type: "Encounter", toHit: "automatic", defense: "AC", damage: "5", keywords: [ "martial", "ranged" ] },
                           { name: "Spikes of the Manticore", type: "Encounter", toHit: 15, defense: "AC", damage: "2[W]+DEX", keywords: [ "weapon", "martial", "ranged" ] },
                           { name: "Spikes of the Manticore (secondary)", type: "Encounter", toHit: 15, defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "martial", "ranged" ] },
                           { name: "Sure Shot", type: "Daily", toHit: 15, defense: "AC", damage: "3[W]+DEX", keywords: [ "weapon", "martial", "ranged" ] },
                           { name: "Flying Steel", type: "Daily", toHit: 15, defense: "AC", damage: "2[W]+DEX", keywords: [ "weapon", "martial", "ranged" ] },
                           { name: "Marked for Death", type: "Daily", toHit: 15, defense: "AC", damage: "3[W]+STR/DEX", effects: [ { name: "marked", duration: 1 } ], keywords: [ "weapon", "martial" ] },
                           { name: "Hunter's Quarry", type: "At-Will", toHit: "automatic", defense: "AC", damage: "1d8" }
                           ],
               effects: []
            },
            Balugh: { 
                name: "Balugh", isPC: true, image: "images/portraits/balugh.jpg", // http://images3.wikia.nocookie.net/__cb20100421223543/dndawokenheroes/images/9/93/Redspawn_Firebelcher.png
                hp: { total: 116 },
                abilities: { STR: 16, CON: 14, DEX: 12, INT: 6, WIS: 12, CHA: 6 },
                defenses: { ac: 22, fort: 24, ref: 20, will: 22 },
                init: 12, speed: 5,
                attacks: [
                          { name: "Beast Melee Basic", type: "At-Will", toHit: 12, defense: "AC", damage: "1d12+3", keywords: [ "beast", "melee", "basic" ] }
                  ]
            },
            Ringo: { 
                name: "Ringo", isPC: true, image: "images/portraits/ringo.jpg", // http://beta.ditzie.com/gallery/main.php?g2_view=core.DownloadItem&g2_itemId=14896&g2_serialNumber=1
                hp: { total: 62 },
                defenses: { ac: 19, fort: 17, ref: 13, will: 14 },
                init: 2, speed: 6,
                attacks: [
                          { name: "Bite", type: "At-Will", range: "reach", toHit: 10, defense: "AC", damage: "1d10+4", keywords: [ "melee" ] },
                          { name: "Entangling Spittle", type: "recharge", target: { range: 5 }, recharge: 4, toHit: 8, defense: "Ref", damage: "0", effects: [ { name: "immobilized", aveEnds: true } ], keywords: [ "ranged" ] }
                  ]
            },
            Smudge: { 
                name: "Smudge", isPC: true, image: "images/portraits/redspawn_firebelcher.png", // http://images3.wikia.nocookie.net/__cb20100421223543/dndawokenheroes/images/9/93/Redspawn_Firebelcher.png
                hp: { total: 97 },
                defenses: { ac: 25, fort: 25, ref: 22, will: 21 },
                init: 7, speed: 4,
                attacks: [
                          { name: "Bite", type: "At-Will", range: "melee", toHit: 16, defense: "AC", damage: { amount: "1d10+4", type: "fire" }, effects: [ { name: "ongoing damage", amount: 5, type: "fire", saveEnds: true } ], keywords: [ "melee", "fire" ] },
                          { name: "Fire Belch", type: "At-Will", target: { range: 12 }, toHit: 15, defense: "Ref", damage: { amount: "2d6+1", type: "fire" }, effects: [ { name: "ongoing damage", amount: 5, type: "fire", saveEnds: true } ], keywords: [ "ranged", "fire" ] },
                          { name: "Fire Burst", type: "recharge", target: { area: "burst", size: 2, range: 10 }, recharge: 5, toHit: 15, defense: "Ref", damage: { amount: "3d6+1", type: "fire" }, effects: [ { name: "ongoing damage", amount: 5, type: "fire", saveEnds: true } ], miss: { halfDamage: true }, keywords: [ "ranged", "fire" ] }
                  ]
            },
            Melvin: { 
                 name: "Melvin", isPC: true, level: 9, image: "images/portraits/melvin.jpg", 
                 abilities: { STR: 18, CON: 18, DEX: 19, INT: 14, WIS: 19, CHA: 14 },
                 hp: { total: 70, current: 62 },
                 surges: { perDay: 12, current: 9 },
                 defenses: { ac: 23, fort: 23, ref: 22, will: 22 },
                 init: 8, speed: 7,
                 weapons: [ 
                           { name: "Monk unarmed strike (Iron Body Ki Focus +2)", isMelee: true, enhancement: 2, proficiency: 0, damage: "1d8", crit: "2d10" },
                           { name: "Monk unarmed strike (Abduction Ki Focus +1)", isMelee: true, enhancement: 1, proficiency: 0, damage: "1d8", crit: "1d6" },
                           { name: "Rhythm Blade Dagger +1", isMelee: true, enhancement: 1, proficiency: 2, damage: "1d4", crit: "1d6" }
                            ],
                 "implements": [
                                { name: "Iron Body Ki Focus +2", enhancement: 2, crit: "2d10" },
                                { name: "Abduction Ki Focus +1", enhancement: 1, crit: "1d6" } 
                                ],
                 attacks: [
                           { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: 11, defense: "AC", damage: "1[W]+STR", keywords: [ "weapon", "melee", "basic" ] },
                           { name: "Ranged Basic", type: "At-Will", toHit: 11, defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "ranged", "basic" ] },
                           { name: "Dancing Cobra", type: "At-Will", toHit: 11, defense: "Ref", damage: "1d10+DEX", keywords: [ "full discipline", "implement", "psionic", "melee" ] },
                           { name: "Five Storms", type: "At-Will", toHit: 11, defense: "Ref", damage: "1d8+DEX", keywords: [ "full discipline", "implement", "psionic", "melee", "close burst" ] },
                           { name: "Centered Flurry of Blows", type: "At-Will", toHit: "automatic", defense: "AC", damage: "2+WIS", keywords: [ "psionic", "melee" ] },
                           { name: "Drunken Monkey", type: "Encounter", toHit: 11, defense: "Will", damage: "1d8+DEX", keywords: [ "full discipline", "implement", "psionic", "melee" ] },
                           { name: "Eternal Mountain", type: "Encounter", toHit: 11, defense: "Will", damage: "2d8+DEX", effects: [ "Prone" ], keywords: [ "full discipline", "implement", "psionic", "melee", "close burst" ] },
                           { name: "Wind Fury Assault", type: "Encounter", isMelee: true, toHit: 11, defense: "AC", damage: "1[W]+WIS", keywords: [ "elemental", "melee", "weapon" ] },
                           { name: "Arc of the Flashing Storm", type: "Encounter", toHit: 11, defense: "Ref", damage: "2d10+DEX", effects: [ { name: "attack penalty", amount: -2, duration: 1 } ], keywords: [ "full discipline", "implement", "psionic", "melee", "lightning", "teleportation" ] },
                           { name: "Goring Charge", type: "Encounter", toHit: 15, defense: "AC", damage: "1d6+DEX", effects: [ "Prone" ], keywords: [ "racial", "melee", "basic" ] },
                           { name: "Masterful Spiral", type: "Daily", toHit: 11, defense: "Ref", damage: { amount: "3d8+DEX", type: "force" }, keywords: [ "force", "implement", "psionic", "melee", "close burst", "miss half", "stance" ] },
                           { name: "One Hundred Leaves", type: "Daily", toHit: 11, defense: "Ref", damage: "3d8+DEX", keywords: [ "implement", "psionic", "melee", "close blast", "miss half" ] },
                           { name: "Strength to Weakness", type: "Daily", toHit: 11, defense: "Ref", damage: "0", effects: [ { name: "ongoing damage", amount: "15+DEX" } ], keywords: [ "implement", "psionic", "melee" ] }
                           ],
               effects: []
            }
        }
    };
}