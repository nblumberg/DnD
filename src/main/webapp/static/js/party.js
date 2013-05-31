function loadParty() {
    return { 
        Barases: { 
             name: "Barases", isPC: true, level: 11, image: "../images/portraits/barases.jpg", // "http://images5.fanpop.com/image/photos/31000000/Satyr-fantasy-31060204-283-400.jpg",  
             abilities: { STR: 12, CON: 19, DEX: 11, INT: 11, WIS: 21, CHA: 11 },
             skills: { acrobatics: 4, arcana: 7, athletics: 14, bluff: 10, diplomacy: 5, dungeoneering: 10, endurance: 8, heal: 10, history: 5, insight: 10, intimidate: 5, nature: 17, perception: 15, religion: 5, stealth: 6, streetwise: 5, thievery: 6 },
             hp: { total: 91 },
             surges: { perDay: 11, current: 11 },
             defenses: { ac: 24, fort: 26, ref: 20, will: 25 },
             init: 5, speed: 6,
             weapons: [ 
                       { name: "Vicious Quarterstaff +2", isMelee: true, enhancement: 2, proficiency: 2, damage: { amount: "1d12", crit: "2d12" } },
                       { name: "Distance Sling +1", isMelee: false, enhancement: 1, proficiency: 2, damage: { amount: "1d6", crit: "0" } }
                        ],
             "implements": [
                           { name: "Staff", enhancement: 0, crit: "0" }
                            ],
             attacks: [
                       { name: "Melee Basic", type: "At-Will", toHit: "STR", defense: "AC", damage: "1[W]+STR", keywords: [ "weapon", "melee", "basic" ] },
                       { name: "Ranged Basic", type: "At-Will", toHit: "DEX", defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "ranged", "basic" ] },
                       { name: "Tending Strike", type: "At-Will", toHit: "WIS", defense: "AC", damage: "1[W]+WIS", keywords: [ "weapon", "melee", "primal" ] },
                       { name: "Combined Attack", type: "Encounter", toHit: "WIS", defense: "AC", damage: "1[W]+WIS", keywords: [ "weapon", "melee", "primal" ] },
                       { name: "Combined Attack (beast)", type: "At-Will", toHit: 15, defense: "AC", damage: "1d12+9", crit: "", keywords: [ "melee", "primal", "beast" ] },
                       { name: "Redfang Prophecy", type: "Encounter", target: { range: 5 }, toHit: "WIS", defense: "Will", damage: "2d8+WIS", effects: [ { name: "vulnerable summoned creature", amount: 5, duration: 1 } ], keywords: [ "implement", "primal", "psychic" ] },
                       { name: "Spirit's Shield", type: "Encounter", target: { range: 1, area: "spirit" }, toHit: "WIS", defense: "Ref", damage: "WIS", keywords: [ "healing", "implement", "spirit", "primal" ] },
                       { name: "Vexing Overgrowth", type: "Daily", target: { area: "close burst", size: 1 }, toHit: "WIS", defense: "AC", damage: "2[W]+WIS", miss: { halfDamage: true }, keywords: [ "weapon", "primal" ] },
                       { name: "Life Blood Harvest", type: "Daily", toHit: "WIS", defense: "AC", damage: "3[W]+WIS", miss: { halfDamage: true }, keywords: [ "weapon", "melee", "primal", "healing" ] },
                       { name: "Bear Beast", type: "At-Will", range: 5, toHit: 15, defense: "AC", damage: "1d12+9", crit: "", keywords: [ "implement", "primal", "summoning" ] },
                       { name: "Crocodile Beast", type: "At-Will", toHit: 10, defense: "AC", damage: "1d8+WIS", crit: "", keywords: [ "weapon", "melee", "beast" ] }
                       ],
               effects: []
         },
         Smack: { 
             name: "Smack", isPC: true, level: 11, image: "../images/portraits/smack.jpg", // http://www.lpzoo.org/sites/default/files/imagesfacts/black_bear.jpg?1331759862  
             abilities: { STR: 20, CON: 17, DEX: 12, INT: 2, WIS: 16, CHA: 6 },
             skills: { acrobatics: 4, arcana: 7, athletics: 14, bluff: 10, diplomacy: 5, dungeoneering: 10, endurance: 8, heal: 10, history: 5, insight: 10, intimidate: 5, nature: 17, perception: 15, religion: 5, stealth: 6, streetwise: 5, thievery: 6 },
             hp: { total: 45 },
             surges: { perDay: 0, current: 0 },
             defenses: { ac: 24, fort: 26, ref: 22, will: 26 },
             init: 5, speed: 6,
             weapons: [],
             "implements": [],
             attacks: [
                       { name: "Animal Attack", type: "At-Will", toHit: 15, defense: "AC", damage: "1d12+9", keywords: [ "melee", "beast", "basic" ] }
                      ],
             effects: []
         },
         Oomooroo: { 
             name: "Oomooroo", isPC: true, level: 11, image: "../images/portraits/owlbear.jpg", // http://www.lpzoo.org/sites/default/files/imagesfacts/black_bear.jpg?1331759862  
             abilities: { STR: 20, CON: 17, DEX: 12, INT: 2, WIS: 16, CHA: 6 },
             skills: { acrobatics: 4, arcana: 7, athletics: 14, bluff: 10, diplomacy: 5, dungeoneering: 10, endurance: 8, heal: 10, history: 5, insight: 10, intimidate: 5, nature: 17, perception: 15, religion: 5, stealth: 6, streetwise: 5, thievery: 6 },
             hp: { total: 45 },
             surges: { perDay: 0, current: 0 },
             defenses: { ac: 24, fort: 26, ref: 22, will: 26 },
             init: 5, speed: 6,
             weapons: [],
             "implements": [],
             attacks: [
                       { name: "Claw", type: "At-Will", toHit: 16, defense: "AC", damage: "1d12+5", keywords: [ "melee", "beast", "basic" ] }
                      ],
             effects: []
         },
         Bin: { 
             name: "Bin", isPC: true, level: 11, image: "../images/portraits/bin.jpg", // "http://wizards.com/dnd/images/386_wr_changeling.jpg", 
             abilities: { STR: 15, CON: 18, DEX: 16, INT: 22, WIS: 19, CHA: 12 },
             skills: { acrobatics: 8, arcana: 16, athletics: 7, bluff: 8, diplomacy: 6, dungeoneering: 14, endurance: 11, heal: 9, history: 16, insight: 11, intimidate: 6, nature: 9, perception: 14, religion: 11, stealth: 10, streetwise: 6, thievery: 13 },
             hp: { total: 80 },
             surges: { perDay: 10, current: 10 },
             defenses: { ac: 25, fort: 21, ref: 22, will: 22 },
             init: 8, speed: 6,
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
                       { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: "STR", defense: "AC", damage: "1[W]+STR", keywords: [ "weapon", "melee", "basic" ] },
                       { name: "Ranged Basic", type: "At-Will", toHit: "DEX", defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "ranged", "basic" ] },
                       { name: "Magic Weapon", type: "At-Will", toHit: "INT+1", defense: "AC", damage: "1d8+7", crit: "2d8" },
                       { name: "Thundering Armor", type: "At-Will", toHit: "INT", defense: "Fort", damage: "1d8+8", crit: "2d8" },
                       { name: "Stone Panoply", type: "Encounter", toHit: "INT", defense: "AC", damage: "1d8+7", crit: "2d8" },
                       { name: "Shielding Cube", type: "Encounter", toHit: "INT", defense: "Ref", damage: "2d6+8", crit: "2d8" },
                       { name: "Lightning Sphere", type: "Encounter", toHit: "INT", defense: "Fort", damage: "1d8+8", crit: "2d8" },
                       { name: "Vampiric Weapons", type: "Encounter", toHit: "INT", defense: "AC", damage: "1d8+6", crit: "2d8" },
                       { name: "Elemental Cascade", type: "Encounter", toHit: "INT", defense: "Ref", damage: "2d10+6", crit: "2d8" },
                       { name: "Caustic Rampart", type: "Daily", toHit: "automatic", defense: "AC", damage: "1d6+5", crit: "" },
                       { name: "Lightning Motes", type: "Daily", toHit: "INT", defense: "Ref", damage: "2d6+8", crit: "2d8" }
                       ],
             effects: []
         },
         Camulos: { 
             name: "Camulos", isPC: true, level: 10, image: "../images/portraits/camulos.png", 
             abilities: { STR: 23, CON: 19, DEX: 12, INT: 11, WIS: 11, CHA: 9 },
             skills: { acrobatics: 6, arcana: 5, athletics: 18, bluff: 4, diplomacy: 4, dungeoneering: 5, endurance: 14, heal: 10, history: 5, insight: 7, intimidate: 4, nature: 7, perception: 7, religion: 5, stealth: 6, streetwise: 4, thievery: 6 },
             hp: { total: 94 },
             surges: { perDay: 13, current: 13 },
             defenses: { ac: 28, fort: 25, ref: 20, will: 18 },
             init: 10, speed: 6,
             weapons: [ 
                       { name: "Defensive Warhammer +2", isMelee: true, enhancement: 2, proficiency: 2, damage: { amount: "1d10", crit: "2d6" } }
                        ],
             "implements": [
                            ],
            attackBonuses: [ 
                            { name: "Battle Wrath", keywords: [ "Battle Wrath" ], damage: 3 }, 
                            { name: "Defend the Line", keywords: [ "Defend the Line" ], effects: [ { name: "Slowed", duration: 1 } ] } 
                        ],
             attacks: [
                       { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: "STR", defense: "AC", damage: "1[W]+STR", miss: { damage: "CON" }, keywords: [ "weapon", "melee", "basic" ] },
                       { name: "Ranged Basic", type: "At-Will", toHit: "DEX", defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "ranged", "basic" ] },
                       { name: "Battle Guardian", type: "At-Will", isMelee: true, toHit: "STR", defense: "AC", damage: "1[W]+STR", miss: { damage: "STR" }, keywords: [ "weapon", "melee", "basic" ] },
                       { name: "Hammer Rhythm", type: "At-Will", toHit: "automatic", defense: "AC", damage: "CON", keywords: [ "martial", "melee" ] },
                       { name: "Power Strike", type: "Encounter", toHit: "automatic", defense: "AC", damage: "1[W]", keywords: [ "martial", "weapon", "melee" ] },
                       { name: "Come and Get It", type: "Encounter", target: { area: "close", size: 3 }, toHit: "STR", defense: "Will", damage: "1[W]", miss: { damage: "CON" }, keywords: [ "psionic", "melee" ] },
                       
                       { name: "Melee Basic (Battle Wrath)", type: "At-Will", isMelee: true, toHit: "STR", defense: "AC", damage: "1[W]+STR", miss: { damage: "CON" }, keywords: [ "weapon", "melee", "basic", "Battle Wrath" ] },
                       { name: "Ranged Basic (Battle Wrath)", type: "At-Will", toHit: "DEX", defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "ranged", "basic", "Battle Wrath" ] },
                       { name: "Battle Guardian (Battle Wrath)", type: "At-Will", isMelee: true, toHit: "STR", defense: "AC", damage: "1[W]+STR", miss: { damage: "STR" }, keywords: [ "weapon", "melee", "basic", "Battle Wrath" ] },
                       { name: "Hammer Rhythm (Battle Wrath)", type: "At-Will", toHit: "automatic", defense: "AC", damage: "CON", keywords: [ "martial", "melee", "Battle Wrath" ] },
                       { name: "Power Strike (Battle Wrath)", type: "Encounter", toHit: "automatic", defense: "AC", damage: "1[W]", keywords: [ "martial", "weapon", "melee", "Battle Wrath" ] },
                       { name: "Come and Get It (Battle Wrath)", type: "Encounter", target: { area: "close", size: 3 }, toHit: "STR", defense: "Will", damage: "1[W]", miss: { damage: "CON" }, keywords: [ "psionic", "melee", "Battle Wrath" ] },

                       { name: "Melee Basic (Defend the Line)", type: "At-Will", isMelee: true, toHit: "STR", defense: "AC", damage: "1[W]+STR", miss: { damage: "CON" }, keywords: [ "weapon", "melee", "basic", "Defend the Line" ] },
                       { name: "Ranged Basic (Defend the Line)", type: "At-Will", toHit: "DEX", defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "ranged", "basic", "Defend the Line" ] },
                       { name: "Battle Guardian (Defend the Line)", type: "At-Will", isMelee: true, toHit: "STR", defense: "AC", damage: "1[W]+STR", miss: { damage: "STR" }, keywords: [ "weapon", "melee", "basic", "Defend the Line" ] },
                       { name: "Hammer Rhythm (Defend the Line)", type: "At-Will", toHit: "automatic", defense: "AC", damage: "CON", keywords: [ "martial", "melee", "Defend the Line" ] },
                       { name: "Power Strike (Defend the Line)", type: "Encounter", toHit: "automatic", defense: "AC", damage: "1[W]", keywords: [ "martial", "weapon", "melee", "Defend the Line" ] },
                       { name: "Come and Get It (Defend the Line)", type: "Encounter", target: { area: "close", size: 3 }, toHit: "STR", defense: "Will", damage: "1[W]", miss: { damage: "CON" }, keywords: [ "psionic", "melee", "Defend the Line" ] }
                       ],
           effects: []
        },
        Festivus: { 
             name: "Festivus", isPC: true, level: 11, image: "../images/portraits/festivus.jpg", // "http://www.worldofazolin.com/wiki/images/8/8d/Dragsorc.jpg",
             abilities: { STR: 19, CON: 17, DEX: 11, INT: 17, WIS: 11, CHA: 21 },
             skills: { acrobatics: 9, arcana: 15, athletics: 13, bluff: 16, diplomacy: 15, dungeoneering: 9, endurance: 12, heal: 9, history: 17, insight: 9, intimidate: 16, nature: 9, perception: 10, religion: 15, stealth: 9, streetwise: 17, thievery: 10 },
             hp: { total: 79 },
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
                       { name: "Dragon's Wrath", type: "Encounter", toHit: "STR^CON^DEX+4", defense: "Ref", damage: { amount: "3d6+CON", type: "psychic", crit: "1d8" }, keywords: [ "acid" ] },
                       { name: "Stirring Shout", type: "Daily", toHit: "CHA", defense: "Will", damage: { amount: "2d6+9", type: "psychic", crit: "1d8" }, keywords: [ "arcane", "healing", "implement", "psychic" ] },
                       { name: "Reeling Torment", type: "Daily", toHit: "CHA", defense: "Will", damage: { amount: "3d8+13", type: "psychic", crit: "1d8" }, keywords: [ "arcane", "charm", "implement", "psychic" ] },
                       { name: "Counterpoint", type: "Daily", toHit: "CHA", defense: "Will", damage: { amount: "2d8+8", crit: "1d8" }, keywords: [ "arcane", "implement" ] },
                       { name: "Dragon Breath", type: "Encounter", toHit: "STR^CON^DEX+2", defense: "Ref", damage: { amount: "1d6+3", type: "acid" }, keywords: [ "acid" ] }
                       ],
             effects: []
         },
         Kallista: { 
             name: "Kallista", isPC: true, level: 11, image: "../images/portraits/kallista.jpg", // "http://www.wizards.com/dnd/images/Dragon_373/11.jpg", 
             abilities: { STR: 15, CON: 13, DEX: 21, INT: 15, WIS: 13, CHA: 23 },
             skills: { acrobatics: 21, arcana: 7, athletics: 18, bluff: 19, diplomacy: 11, dungeoneering: 6, endurance: 6, heal: 6, history: 7, insight: 6, intimidate: 13, nature: 6, perception: 13, religion: 7, stealth: 18, streetwise: 11, thievery: 15 },
             hp: { total: 75 },
             surges: { perDay: 8, current: 8 },
             defenses: { ac: 23, fort: 18, ref: 23, will: 22, resistances: { fire: 11 } },
             resistances: { fire: 11 },
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
                       { name: "Hell's Ram", type: "Encounter", toHit: "STR^DEX+4", defense: "Fort", damage: "0", effects: [ { name: "dazed", duration: 1 } ], keywords: [ "martial" ] },
                       { name: "Bloodbath", type: "Daily", toHit: "DEX", defense: "Fort", damage: "1[W]+DEX", effects: [ { name: "ongoing damage", amount: "2d6" } ], keywords: [ "weapon", "martial" ] },
                       { name: "Burst Fire", type: "Daily", toHit: "DEX", defense: "Ref", damage: "2[W]+DEX", keywords: [ "weapon", "martial", "ranged" ] },
                       { name: "Duelists Prowess", type: "At-Will", action: "Immediate Interrupt", toHit: "DEX", defense: "Ref", damage: "1[W]+DEX", keywords: [ "weapon", "martial", "melee" ] },
                       { name: "Sneak Attack", type: "At-Will", toHit: "automatic", defense: "AC", damage: "2d8" }
                       ],
             effects: []
         },
         Karrion: { 
             name: "Karrion", isPC: true, level: 11, image: "../images/portraits/karrion.jpg", // "http://rogueartfx.com/images/tiefling03.jpg",  
             abilities: { STR: 20, CON: 17, DEX: 20, INT: 19, WIS: 17, CHA: 17 },
             skills: { acrobatics: 16, arcana: 9, athletics: 15, bluff: 10, diplomacy: 8, dungeoneering: 13, endurance: 8, heal: 8, history: 9, insight: 8, intimidate: 8, nature: 14, perception: 14, religion: 9, stealth: 17, streetwise: 8, thievery: 10 },
             hp: { total: 79 },
             surges: { perDay: 9, current: 9 },
             defenses: { ac: 24, fort: 22, ref: 22, will: 19, resistances: { fire: 11 } },
             resistances: { fire: 11 },
             init: 12, speed: 6,
             weapons: [ 
                       { name: "Withering Spiked Chain +3", isMelee: true, enhancement: 3, proficiency: 3, damage: { amount: "2d4", crit: "3d6" } },
                       { name: "Sid Vicious Longbow +1", isMelee: false, enhancement: 1, proficiency: 2, damage: { amount: "1d10", crit: "1d12" } },
                       { name: "Lightning Spiked Chain +1", isMelee: true, enhancement: 1, proficiency: 3, damage: { amount: "2d4", crit: "1d6" } }
                        ],
             "implements": [
                            { name: "Totem", enhancement: 0, crit: "0" },
                            ],
             attackBonuses: [ 
                            { name: "Bloodhunt", foeStatus: [ "bloodied" ], toHit: 1 }/*, 
                            { name: "Hunter's Quarry", foeStatus: [ "hunter's quarry" ], damage: "1d8", oncePerRound: true }*/
                       ],
             attacks: [
                       { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: "STR", defense: "AC", damage: "1[W]+STR", keywords: [ "weapon", "melee", "basic" ] },
                       { name: "Ranged Basic", type: "At-Will", toHit: "DEX", defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "ranged", "basic" ] },
                       { name: "Marauder's Rush", type: "At-Will", toHit: "STR", defense: "AC", damage: "1[W]+STR+WIS", keywords: [ "weapon", "martial", "melee" ] },
                       { name: "Twin Strike", type: "At-Will", toHit: "STR/DEX", defense: "AC", damage: "1[W]", keywords: [ "weapon", "martial" ] },
                       { name: "Dire Wolverine Strike", type: "Encounter", toHit: "STR", defense: "AC", damage: "1[W]+STR", keywords: [ "weapon", "martial", "melee" ] },
                       { name: "Thundertusk Boar Strike", type: "Encounter", toHit: "STR/DEX", defense: "AC", damage: "1[W]+STR/DEX", keywords: [ "weapon", "martial" ] },
                       { name: "Sweeping Whirlwind", type: "Encounter", isMelee: true, toHit: "STR", defense: "AC", damage: "1[W]+STR", keywords: [ "weapon", "martial", "melee" ] },
                       { name: "Your Doom Awaits", type: "Encounter", target: { area: "burst", size: 5 }, toHit: "STR", defense: "Will", damage: "3d10+STR", effects: [ { name: "dazed", duration: 1 } ], keywords: [ "fear", "implement", "primal", "psychic" ] },
                       { name: "Boar Assault", type: "Daily", toHit: "STR/DEX", defense: "AC", damage: "2[W]+STR/DEX", keywords: [ "weapon", "martial" ] },
                       { name: "Invigorating Assault", type: "Daily", toHit: "DEX", defense: "AC", damage: "3[W]+DEX", miss: { halfDamage: true }, keywords: [ "weapon", "martial", "ranged" ] },
                       { name: "Infernal Wrath", type: "Encounter", toHit: "automatic", defense: "AC", damage: "1d6+INT^CHA", keywords: [ "fire" ] },
                       { name: "Spirit Fangs", type: "Encounter", toHit: "WIS", defense: "Ref", damage: "1d10+WIS", keywords: [ "implement", "primal", "spirit" ] },
                       { name: "Hunter's Thorn Trap", type: "Encounter", toHit: "automatic", defense: "AC", damage: "5+WIS", keywords: [ "primal", "zone" ] },
                       { name: "Hunter's Quarry", type: "At-Will", toHit: "automatic", defense: "AC", damage: "1d8" },
                       { name: "Your Doom Awaits", type: "Encounter", target: { area: "close burst", size: 3 }, toHit: "STR^WIS", defense: "Will", damage: "3d10+STR", keywords: [ "fear", "implement", "primal", "psychic" ] }
                       ],
             effects: []
         },
         Kitara: { 
             name: "Kitara", isPC: true, level: 11, image: "../images/portraits/kitara.jpg", // "http://www.deviantart.com/download/46708270/Maiden_of_the_Mirthless_Smile_by_UdonCrew.jpg", 
             abilities: { STR: 17, CON: 15, DEX: 21, INT: 23, WIS: 17, CHA: 17 },
             skills: { acrobatics: 12, arcana: 16, athletics: 8, bluff: 10, diplomacy: 13, dungeoneering: 8, endurance: 7, heal: 8, history: 11, insight: 8, intimidate: 10, nature: 8, perception: 13, religion: 11, stealth: 13, streetwise: 8, thievery: 15 },
             hp: { total: 77 },
             surges: { perDay: 9, current: 9 },
             defenses: { ac: 26, fort: 21, ref: 22, will: 21 },
             init: 11, speed: 7,
             weapons: [ 
                        { name: "Supremely Vicious Bastard Sword +2", isMelee: true, enhancement: 2, proficiency: 2, damage: { amount: "1d10", crit: "2d8" } }
                        ],
             "implements": [ 
                             { name: "Supremely Vicious Bastard Sword +2", enhancement: 2, crit: "2d8" },
                             { name: "Orb of Nimble Thoughts +1", enhancement: 1, crit: "1d6" }
                             ],
             attackBonuses: [ 
                             { name: "Dual Implement Spellcaster", status: [ "implement" ], damage: 1 }
                         ],
             attacks: [
                       { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: "STR", defense: "AC", damage: "1[W]+STR", keywords: [ "weapon", "melee", "basic" ] },
                       { name: "Ranged Basic", type: "At-Will", toHit: "automatic", defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "ranged", "basic" ] },
                       { name: "Magic Missile", type: "At-Will", toHit: "automatic", defense: "AC", damage: { amount: "2+INT", type: "force" }, keywords: [ "arcane", "evocation", "force", "implement" ] },
                       { name: "Lightning Ring", type: "At-Will", toHit: "automatic", defense: "AC", damage: { amount: "5", type: "lightning" }, keywords: [ "arcane", "bladespell", "lightning" ] },
                       { name: "Lightning Ring (secondary)", type: "At-Will", toHit: "automatic", defense: "AC", damage: { amount: "5", type: "lightning" }, keywords: [ "arcane", "bladespell", "lightning" ] },
                       { name: "Shadow Sever", type: "At-Will", toHit: "automatic", defense: "AC", damage: { amount: "5", type: "necrotic" }, effects: [ { name: "Prone" } ], keywords: [ "arcane", "bladespell", "necrotic" ] },
                       { name: "Unseen Hand", type: "At-Will", toHit: 12, defense: "AC", damage: { amount: "5", type: "force" }, keywords: [ "arcane", "bladespell", "force" ] },
                       { name: "Gaze of the Evil Eye", type: "At-Will", toHit: "automatic", defense: "AC", damage: { amount: "2", type: "psychic" }, keywords: [ "arcane", "psychic" ] },
                       { name: "Orbmaster's Incendiary Detonation", target: { area: "burst", size: 1, range: 10 }, type: "Encounter", toHit: "INT", defense: "Ref", damage: { amount: "1d6+INT", type: "force" }, effects: [ "Prone" ], keywords: [ "arcane", "evocation", "fire", "implement", "force", "zone" ] },
                       { name: "Orbmaster's Incendiary Detonation (zone)", type: "Encounter", target: { area: "burst", size: 1, range: 10 }, toHit: "automatic", defense: "Ref", damage: { amount: "2", type: "fire" }, effects: [ "Prone" ], keywords: [ "arcane", "evocation", "fire", "force", "zone" ] },
                       { name: "Force Orb", type: "Encounter", toHit: "INT", defense: "Ref", damage: { amount: "2d8+INT", type: "force" }, keywords: [ "arcane", "evocation", "force", "implement" ] },
                       { name: "Force Orb (secondary)", type: "Encounter", target: { area: "burst", size: 1, range: 20 }, toHit: "INT", defense: "Ref", damage: { amount: "1d10+INT", type: "force" }, keywords: [ "arcane", "evocation", "force", "implement" ] },
                       { name: "Burning Hands", type: "Encounter", target: { area: "close blast", size: 5 }, toHit: "INT", defense: "Ref", damage: { amount: "2d6+INT", type: "fire" }, miss: { halfDamage: true }, keywords: [ "arcane", "evocation", "fire", "implement" ] },
                       { name: "Skewering Spikes", type: "Encounter", target: { range: 5 }, toHit: "INT", defense: "Ref", damage: "1d8+INT", keywords: [ "arcane", "evocation", "implement" ] },
                       { name: "Skewering Spikes (single target)", type: "Encounter", target: { range: 5 }, toHit: "INT", defense: "Ref", damage: "2d8+INT", keywords: [ "arcane", "evocation", "implement" ] },
                       { name: "Glorious Presence", type: "Encounter", target: { area: "close burst", size: 2 }, toHit: "INT", range: 2, defense: "Will", damage: { amount: "2d6+INT", type: "radiant" }, keywords: [ "arcane", "charm", "echantment", "implement", "radiant", "close burst" ] },
                       { name: "Ray of Enfeeblement", type: "Encounter", toHit: "INT", target: { range: 10 }, defense: "Fort", damage: { amount: "1d10+INT", type: "necrotic" }, effects: [ { name: "Weakened", duration: 1 } ], keywords: [ "arcane", "implement", "necromancy", "necrotic", "ranged" ] },
                       { name: "Grim Shadow", type: "Encounter", toHit: "INT", target: { area: "close blast", size: 3 }, defense: "Will", damage: { amount: "2d8+INT", type: "necrotic" }, effects: [ { name: "Attack penalty", amount: -2, duration: 1 }, { name: "Will penalty", amount: -2, duration: 1 } ], keywords: [ "arcane", "fear", "implement", "necromancy", "necrotic", "close blast" ] },
                       { name: "Icy Rays", type: "Encounter", target: { range: 10 }, toHit: "INT", defense: "Ref", damage: { amount: "1d10+INT", type: "cold" }, effects: [ { name: "immobilized", duration: 1 } ], miss: { effects: [ { name: "slowed", duration: 1 } ] }, keywords: [ "arcane", "evocation", "cold", "implement", "ranged" ] },
                       { name: "Pinioning Vortex", type: "Encounter", toHit: "INT", target: { range: 10 }, defense: "Fort", damage: "2d6+INT", effects: [ { name: "immobilized", duration: 1 }, { name: "dazed", duration: 1 } ], keywords: [ "arcane", "evocation", "implement", "ranged" ] },
                       { name: "Lightning Bolt", type: "Encounter", toHit: "INT", target: { range: 10 }, defense: "Ref", damage: { amount: "2d6+INT", type: "lightning" }, miss: { halfDamage: true }, keywords: [ "arcane", "evocation", "implement", "ranged", "lightning" ] },
                       { name: "Phantom Chasm", type: "Daily", target: { area: "burst", size: 1, range: 10 }, toHit: "INT", defense: "Will", damage: { amount: "2d6+INT", type: "psychic" }, effects: [ "Prone", { name: "immobilized", duration: 1 } ], miss: { halfDamage: true, effects: [ "Prone" ] }, keywords: [ "arcane", "illusion", "psychic", "implement", "zone" ] },
                       { name: "Phantom Chasm (zone)", type: "Daily", target: { area: "burst", size: 1, range: 10 }, toHit: "automatic", defense: "Will", damage: "0", effects: [ "Prone" ], keywords: [ "arcane", "illusion", "psychic", "zone" ] },
                       { name: "Fountain of Flame", type: "Daily", target: { area: "burst", size: 1, range: 10 }, toHit: "INT", defense: "Ref", damage: { amount: "3d8+INT", type: "fire" }, miss: { halfDamage: true }, keywords: [ "arcane", "evocation", "fire", "implement", "zone" ] },
                       { name: "Fountain of Flame (zone)", type: "Daily", target: { area: "burst", size: 1, range: 10 }, toHit: "automatic", defense: "Ref", damage: { amount: "5", type: "fire" }, keywords: [ "arcane", "evocation", "fire", "zone" ] },
                       { name: "Slimy Transmutation", type: "Daily", target: { range: 10 }, toHit: "INT", defense: "Fort", damage: "0", effects: [ { name: "Polymorph (Tiny Toad)", saveEnds: true } ], miss: { effects: [ { name: "Polymorph (Tiny Toad)", duration: 1 } ] }, keywords: [ "arcane", "implement", "polymorph", "transmutation" ] },
                       { name: "Acid Arrow", type: "Daily", target: { range: 20 }, toHit: "INT", defense: "Ref", damage: { amount: "2d8+INT", type: "acid" }, effects: [ { name: "ongoing damage", type: "acid", amount: 5, saveEnds: true } ], miss: { halfDamage: true, effects: [ { name: "ongoing damage", type: "acid", amount: 2, saveEnds: true } ] }, keywords: [ "arcane", "evocation", "acid", "implement" ] },
                       { name: "Acid Arrow (secondary)", type: "Daily", target: { area: "burst", size: 1, range: 20 }, toHit: "INT", defense: "Ref", damage: { amount: "1d8+INT", type: "acid" }, effects: [ { name: "ongoing damage", type: "acid", amount: 5, saveEnds: true } ], keywords: [ "arcane", "evocation", "acid", "implement" ] },
                       { name: "Rolling Thunder", type: "Daily", target: { range: 10 }, toHit: "INT", defense: "Ref", damage: { amount: "3d6+INT", type: "thunder" }, miss: { halfDamage: true }, keywords: [ "arcane", "conjuration", "evocation", "implement", "thunder" ] },
                       { name: "Rolling Thunder (secondary)", type: "Daily", target: { range: 10 }, toHit: "INT", defense: "Ref", damage: { amount: "5", type: "thunder" }, keywords: [ "arcane", "conjuration", "evocation", "thunder" ] },
                       { name: "Fireball", type: "Daily", target: { area: "burst", size: 3, range: 20 }, toHit: "INT", defense: "Ref", damage: { amount: "4d6+INT", type: "fire" }, miss: { halfDamage: true }, keywords: [ "arcane", "evocation", "implement", "fire" ] },
                       { name: "Grasp of the Grave", type: "Daily", target: { area: "burst", size: 2, range: 20, enemiesOnly: true }, toHit: "INT", defense: "Ref", damage: { amount: "1d10+INT", type: "necrotic" }, effects: [ { name: "Dazed", duration: 1 } ], miss: { damage: { amount: "1d10+INT", type: "necrotic" } }, keywords: [ "arcane", "implement", "necromancy", "necrotic" ] },
                       { name: "Grasp of the Grave (zone)", type: "Daily", target: { area: "burst", size: 2, range: 20, enemiesOnly: true }, toHit: "automatic", defense: "Ref", damage: { amount: "5", type: "necrotic" }, keywords: [ "arcane", "necromancy", "necrotic" ] },
                       { name: "Scattering Shock", type: "Daily", target: { area: "burst", size: 3, range: 10 }, toHit: "INT", defense: "Fort", damage: "0", keywords: [ "arcane", "evocation", "implement", "lightning" ] },
                       { name: "Scattering Shock (secondary)", type: "Daily", target: { area: "creature", size: 1 }, toHit: "INT", defense: "Ref", damage: { amount: "2d8+INT", type: "lightning" }, miss: { halfDamage: true }, keywords: [ "arcane", "evocation", "implement", "lightning" ] }
                       ],
             effects: []
         },
         Lechonero: { 
             name: "Lechonero", isPC: true, level: 11, image: "../images/portraits/lechonero.jpg", // "http://www.critical-hits.com/wp-content/uploads/2007/12/elf.jpg", 
             abilities: { STR: 17, CON: 15, DEX: 22, INT: 15, WIS: 16, CHA: 11 },
             skills: { acrobatics: 11, arcana: 7, athletics: 15, bluff: 5, diplomacy: 5, dungeoneering: 8, endurance: 12, heal: 13, history: 7, insight: 8, intimidate: 5, nature: 17, perception: 17, religion: 7, stealth: 13, streetwise: 10, thievery: 11 },
             hp: { total: 77 },
             surges: { perDay: 8, current: 8 },
             defenses: { ac: 25, fort: 21, ref: 24, will: 20 },
             init: 13, speed: 7,
             weapons: [ 
                       { name: "Longbow of Speed +2", isMelee: false, enhancement: 2, proficiency: 2, damage: { amount: "1d10", crit: "2d8" } },
                       { name: "Sentinel Marshall Honorblade +1", isMelee: true, enhancement: 1, proficiency: 3, damage: { amount: "1d8", crit: "1d8" } },
                       { name: "Duelist's Longbow +1", isMelee: false, enhancement: 1, proficiency: 2, damage: { amount: "1d10", crit: "1d6" } }
                        ],
             "implements": [
                            ],
             attacks: [
                       { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: "STR", defense: "AC", damage: "1[W]+STR", keywords: [ "weapon", "melee", "basic" ] },
                       { name: "Ranged Basic", type: "At-Will", toHit: "DEX", defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "ranged", "basic" ] },
                       { name: "Rapid Shot", type: "At-Will", toHit: "DEX", defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "martial", "ranged" ] },
                       { name: "Twin Strike", type: "At-Will", toHit: "STR/DEX", defense: "AC", damage: "1[W]", keywords: [ "weapon", "martial" ] },
                       { name: "Hindering Shot", type: "Encounter", toHit: "DEX", defense: "AC", damage: "2[W]+DEX", effects: [ { name: "slowed", duration: 1 } ], keywords: [ "weapon", "martial", "ranged" ] },
                       { name: "Covering Volley", type: "Encounter", toHit: "DEX", defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "martial", "ranged" ] },
                       { name: "Covering Volley (secondary)", type: "Encounter", toHit: "automatic", defense: "AC", damage: "5", keywords: [ "martial", "ranged" ] },
                       { name: "Spikes of the Manticore", type: "Encounter", toHit: "DEX", defense: "AC", damage: "2[W]+DEX", keywords: [ "weapon", "martial", "ranged" ] },
                       { name: "Spikes of the Manticore (secondary)", type: "Encounter", toHit: "DEX", defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "martial", "ranged" ] },
                       { name: "Shaft Splitter", type: "Encounter", toHit: "DEX", defense: "Ref", damage: "2[W]+DEX", keywords: [ "weapon", "martial", "ranged" ] },
                       { name: "Sure Shot", type: "Daily", toHit: "DEX", defense: "AC", damage: "3[W]+DEX", keywords: [ "weapon", "martial", "ranged" ] },
                       { name: "Flying Steel", type: "Daily", toHit: "DEX", defense: "AC", damage: "2[W]+DEX", keywords: [ "weapon", "martial", "ranged" ] },
                       { name: "Marked for Death", type: "Daily", toHit: "DEX", defense: "AC", damage: "3[W]+STR/DEX", effects: [ { name: "marked", duration: 1 } ], keywords: [ "weapon", "martial" ] },
                       { name: "Hunter's Quarry", type: "At-Will", toHit: "automatic", defense: "AC", damage: "1d8" }
                       ],
           effects: []
        },
        Balugh: { 
            name: "Balugh", isPC: true, level: 11, image: "../images/portraits/balugh.jpg", // http://images3.wikia.nocookie.net/__cb20100421223543/dndawokenheroes/images/9/93/Redspawn_Firebelcher.png
            hp: { total: 116 },
            surges: { perDay: 0, current: 0 },
            abilities: { STR: 16, CON: 14, DEX: 12, INT: 6, WIS: 12, CHA: 6 },
            skills: { acrobatics: 11, arcana: 7, athletics: 15, bluff: 5, diplomacy: 5, dungeoneering: 8, endurance: 12, heal: 13, history: 7, insight: 8, intimidate: 5, nature: 17, perception: 17, religion: 7, stealth: 13, streetwise: 10, thievery: 11 },
            defenses: { ac: 22, fort: 24, ref: 20, will: 22 },
            init: 12, speed: 5,
            attacks: [
                      { name: "Beast Melee Basic", type: "At-Will", toHit: 12, defense: "AC", damage: "1d12+3", keywords: [ "beast", "melee", "basic" ] }
              ]
        },
        Ringo: { 
            name: "Ringo", isPC: true, level: 5, image: "../images/portraits/ringo.jpg", // http://beta.ditzie.com/gallery/main.php?g2_view=core.DownloadItem&g2_itemId=14896&g2_serialNumber=1
            hp: { total: 62 },
            surges: { perDay: 0, current: 0 },
            abilities: { STR: 18, CON: 10, DEX: 14, INT: 1, WIS: 12, CHA: 8 },
            skills: { acrobatics: 4, arcana: -3, athletics: 6, bluff: 1, diplomacy: 3, dungeoneering: -3, endurance: 2, heal: 3, history: -3, insight: 3, intimidate: 1, nature: 3, perception: 3, religion: 3, stealth: 4, streetwise: 1, thievery: 4 },
            defenses: { ac: 19, fort: 17, ref: 13, will: 14 },
            init: 2, speed: 6,
            attacks: [
                      { name: "Bite", type: "At-Will", range: "reach", toHit: 10, defense: "AC", damage: "1d10+4", keywords: [ "melee", "basic" ] },
                      { name: "Entangling Spittle", type: "Recharge", target: { range: 5 }, recharge: 4, toHit: 8, defense: "Ref", damage: "0", effects: [ { name: "immobilized", aveEnds: true } ], keywords: [ "ranged" ] }
              ]
        },
        Smudge: { 
            name: "Smudge", isPC: true, level: 12, image: "../images/portraits/redspawn_firebelcher.png", // http://images3.wikia.nocookie.net/__cb20100421223543/dndawokenheroes/images/9/93/Redspawn_Firebelcher.png
            hp: { total: 97 },
            surges: { perDay: 0, current: 0 },
            abilities: { STR: 18, CON: 13, DEX: 19, INT: 2, WIS: 13, CHA: 8 },
            skills: { acrobatics: 10, arcana: 2, athletics: 10, bluff: 5, diplomacy: 7, dungeoneering: 2, endurance: 7, heal: 7, history: 2, insight: 7, intimidate: 5, nature: 7, perception: 6, religion: 7, stealth: 10, streetwise: 5, thievery: 10 },
            defenses: { ac: 25, fort: 25, ref: 22, will: 21 },
            init: 7, speed: 4,
            attacks: [
                      { name: "Bite", type: "At-Will", range: "melee", toHit: 16, defense: "AC", damage: { amount: "1d10+4", type: "fire" }, effects: [ { name: "ongoing damage", amount: 5, type: "fire", saveEnds: true } ], keywords: [ "melee", "fire", "basic" ] },
                      { name: "Fire Belch", type: "At-Will", target: { range: 12 }, toHit: 15, defense: "Ref", damage: { amount: "2d6+1", type: "fire" }, effects: [ { name: "ongoing damage", amount: 5, type: "fire", saveEnds: true } ], keywords: [ "ranged", "fire", "basic" ] },
                      { name: "Fire Burst", type: "Recharge", target: { area: "burst", size: 2, range: 10 }, recharge: 5, toHit: 15, defense: "Ref", damage: { amount: "3d6+1", type: "fire" }, effects: [ { name: "ongoing damage", amount: 5, type: "fire", saveEnds: true } ], miss: { halfDamage: true }, keywords: [ "ranged", "fire" ] }
              ]
        },
        Melvin: { 
            name: "Melvin", isPC: true, level: 10, image: "../images/portraits/melvin.jpg", 
            abilities: { STR: 18, CON: 18, DEX: 19, INT: 14, WIS: 19, CHA: 14 },
            skills: { acrobatics: 16, arcana: 7, athletics: 16, bluff: 7, diplomacy: 7, dungeoneering: 9, endurance: 9, heal: 9, history: 7, insight: 10, intimidate: 7, nature: 11, perception: 19, religion: 7, stealth: 14, streetwise: 7, thievery: 9 },
            hp: { total: 75 },
            surges: { perDay: 12, current: 12 },
            defenses: { ac: 24, fort: 24, ref: 23, will: 23 },
            init: 9, speed: 7,
            weapons: [ 
                      { name: "Monk unarmed strike (Iron Body Ki Focus +2)", isMelee: true, enhancement: 2, proficiency: 0, damage: { amount: "1d8", crit: "2d10" } },
                      { name: "Monk unarmed strike (Abduction Ki Focus +1)", isMelee: true, enhancement: 1, proficiency: 0, damage: { amount: "1d8", crit: "1d6" } },
                      { name: "Rhythm Blade Dagger +1", isMelee: true, enhancement: 1, proficiency: 2, damage: { amount: "1d4", crit: "1d6" } }
                       ],
            "implements": [
                           { name: "Iron Body Ki Focus +2", enhancement: 2, crit: "2d10" },
                           { name: "Abduction Ki Focus +1", enhancement: 1, crit: "1d6" } 
                           ],
            attacks: [
                      { name: "Melee Basic", type: "At-Will", isMelee: true, toHit: "STR", defense: "AC", damage: "1[W]+STR", keywords: [ "weapon", "melee", "basic" ] },
                      { name: "Ranged Basic", type: "At-Will", toHit: "DEX", defense: "AC", damage: "1[W]+DEX", keywords: [ "weapon", "ranged", "basic" ] },
                      { name: "Dancing Cobra", type: "At-Will", toHit: "DEX", defense: "Ref", damage: "1d10+DEX", keywords: [ "full discipline", "implement", "psionic", "melee" ] },
                      { name: "Five Storms", type: "At-Will", toHit: "DEX", defense: "Ref", damage: "1d8+DEX", keywords: [ "full discipline", "implement", "psionic", "melee", "close burst" ] },
                      { name: "Centered Flurry of Blows", type: "At-Will", toHit: "automatic", defense: "AC", damage: "2+WIS", keywords: [ "psionic", "melee" ] },
                      { name: "Drunken Monkey", type: "Encounter", toHit: "DEX", defense: "Will", damage: "1d8+DEX", keywords: [ "full discipline", "implement", "psionic", "melee" ] },
                      { name: "Eternal Mountain", type: "Encounter", toHit: "DEX", defense: "Will", damage: "2d8+DEX", effects: [ "Prone" ], keywords: [ "full discipline", "implement", "psionic", "melee", "close burst" ] },
                      { name: "Wind Fury Assault", type: "Encounter", isMelee: true, toHit: "DEX", defense: "AC", damage: "1[W]+WIS", keywords: [ "elemental", "melee", "weapon" ] },
                      { name: "Arc of the Flashing Storm", type: "Encounter", toHit: "DEX", defense: "Ref", damage: "2d10+DEX", effects: [ { name: "attack penalty", amount: -2, duration: 1 } ], keywords: [ "full discipline", "implement", "psionic", "melee", "lightning", "teleportation" ] },
                      { name: "Goring Charge", type: "Encounter", toHit: "DEX+4", defense: "AC", damage: "1d6+DEX", effects: [ "Prone" ], keywords: [ "racial", "melee", "basic" ] },
                      { name: "Masterful Spiral", type: "Daily", toHit: "DEX", defense: "Ref", damage: { amount: "3d8+DEX", type: "force" }, keywords: [ "force", "implement", "psionic", "melee", "close burst", "miss half", "stance" ] },
                      { name: "One Hundred Leaves", type: "Daily", toHit: "DEX", defense: "Ref", damage: "3d8+DEX", keywords: [ "implement", "psionic", "melee", "close blast", "miss half" ] },
                      { name: "Strength to Weakness", type: "Daily", toHit: "DEX", defense: "Ref", damage: "0", effects: [ { name: "ongoing damage", amount: "15+DEX" } ], keywords: [ "implement", "psionic", "melee" ] }
                      ],
          effects: []
       }
    };
}