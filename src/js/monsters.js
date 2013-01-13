function loadMonsters() {
    return { 
        monsters: { 
            "Banshrae Dartswarmer": { 
                name: "Banshrae Dartswarmer", image: "images/portraits/banshrae_dartswarmer.jpg",
                hp: { total: 89 },
                defenses: { ac: 23, fort: 20, ref: 23, will: 22 },
                init: 11, speed: 8,
                attacks: [
                          { name: "Slam", type: "At-Will", range: "melee", toHit: 13, defense: "AC", damage: "1d8+3", keywords: [ "melee" ] },
                          { name: "Blowgun Dart", type: "At-Will", range: 5, toHit: 16, defense: "AC", targeting: "blast 5", damage: "1d10+6", effects: [ { name: "Dazed", saveEnds: true } ], keywords: [ "ranged" ] },
                          { name: "Dart Flurry", type: "Recharge", recharge: 4, range: "blast 5", toHit: 16, defense: "AC", targeting: "blast 5", damage: "1d10+6", effects: [ 
                            { name: "multiple effects", saveEnds: true, children: [
                                    { name: "Dazed" }, 
                                    { name: "Attack penalty", amount: -2 } 
                                ] }
                            ], keywords: [ "ranged" ] }
                  ]
            },
            "Slystone Dwarf Ruffian": { 
                name: "Slystone Dwarf Ruffian", image: "images/portraits/slystone_dwarf.jpg",
                hp: { total: 104 },
                defenses: { ac: 26, fort: 23, ref: 22, will: 21 },
                init: 12, speed: 6,
                attacks: [
                          { name: "Hammer", type: "At-Will", range: "melee", toHit: 17, defense: "AC", damage: "2d6+5", effects: [ "Marked" ], keywords: [ "melee" ] },
                          { name: "Hammer (charge)", type: "At-Will", range: "melee", toHit: 17, defense: "AC", damage: "2d6+5", effects: [ "Marked", "Prone" ], keywords: [ "melee" ] },
                          { name: "Mighty Strike", type: "Recharge", recharge: 5, range: "melee", toHit: 17, defense: "AC", damage: "3d8+5", keywords: [ "melee" ] },
                          { name: "Mighty Strike (charge)", type: "Recharge", recharge: 5, range: "melee", toHit: 17, defense: "AC", damage: "3d8+5", effects: [ "Prone" ], keywords: [ "melee" ] }
                  ]
            },
            "Hethralga": { 
                name: "Hethralga", image: "images/portraits/night_hag.jpg",
                hp: { total: 126 },
                defenses: { ac: 26, fort: 25, ref: 24, will: 23 },
                init: 11, speed: 6,
                attacks: [
                          { name: "Quarterstaff", type: "At-Will", range: "melee", toHit: 15, defense: "AC", damage: "1d10+5", keywords: [ "melee" ] },
                          { name: "Howl", type: "At-Will", range: "blast 3", toHit: 16, defense: "Fort", damage: { amount: "1d6+6", type: "thunder" }, keywords: [ "ranged" ] },
                          { name: "Shriek of Pain", type: "Encounter", range: "blast 5", toHit: 16, defense: "Fort", damage: { amount: "3d6+6", type: "thunder" }, keywords: [ "ranged", "miss half" ] },
                          { name: "Shriek of Pain (bloodied)", type: "Encounter", range: "blast 5", toHit: 16, defense: "Fort", damage: { amount: "3d6+11", type: "thunder" }, keywords: [ "ranged", "miss half" ] }
                  ]
            },
            "Cyclops Guard": { 
                name: "Cyclops Guard", image: "images/portraits/cyclops.jpg",
                hp: { total: 1 },
                defenses: { ac: 27, fort: 26, ref: 23, will: 23 },
                init: 8, speed: 6,
                attacks: [ { name: "Battleaxe", type: "At-Will", range: "2", toHit: 17, defense: "AC", damage: "7", keywords: [ "melee" ] } ]
            },
            "Dragonborn Gladiator": { 
                name: "Dragonborn Gladiator", image: "images/portraits/dragonborn_gladiator.jpg", // "http://img213.imageshack.us/img213/2721/dragonborn29441748300x3.jpg",
                hp: { total: 106 },
                defenses: { ac: 24, fort: 23, ref: 20, will: 21 },
                init: 9, speed: 5,
                attacks: [
                          { name: "Bastard Sword", type: "At-Will", range: "melee", toHit: 15, defense: "AC", damage: "1d10+5", keywords: [ "melee" ] },
                          { name: "Bastard Sword (bloodied)", type: "At-Will", range: "melee", toHit: 16, defense: "AC", damage: "1d10+5", keywords: [ "melee" ] },
                          { name: "Bastard Sword (lone fighter)", type: "At-Will", range: "melee", toHit: 17, defense: "AC", damage: "1d10+5", keywords: [ "melee" ] },
                          { name: "Bastard Sword (bloodied, lone fighter)", type: "At-Will", range: "melee", toHit: 18, defense: "AC", damage: "1d10+5", keywords: [ "melee" ] },
                          { name: "Finishing Blow", type: "At-Will", range: "melee", toHit: 15, defense: "AC", damage: "1d10+5", keywords: [ "melee" ] },
                          { name: "Finishing Blow (bloodied)", type: "At-Will", range: "melee", toHit: 16, defense: "AC", damage: "1d10+5", keywords: [ "melee" ] },
                          { name: "Finishing Blow (lone fighter)", type: "At-Will", range: "melee", toHit: 17, defense: "AC", damage: "1d10+5", keywords: [ "melee" ] },
                          { name: "Finishing Blow (bloodied, lone fighter)", type: "At-Will", range: "melee", toHit: 18, defense: "AC", damage: "1d10+5", keywords: [ "melee" ] },
                          { name: "Howl", type: "At-Will", range: "blast 3", toHit: 16, defense: "Fort", damage: { amount: "1d6+6", type: "thunder" }, keywords: [ "ranged" ] },
                          { name: "Shriek of Pain", type: "Encounter", range: "blast 5", toHit: 16, defense: "Fort", damage: { amount: "3d6+6", type: "thunder" }, miss: "half damage", keywords: [ "ranged" ] },
                          { name: "Shriek of Pain (bloodied)", type: "Encounter", range: "blast 5", toHit: 16, defense: "Fort", damage: { amount: "3d6+11", type: "thunder" }, miss: "half damage", keywords: [ "ranged" ] }
                  ]
            },
            "Dragonborn Raider": { 
                name: "Dragonborn Raider", image: "images/portraits/dragonborn_raider.jpg", // "http://1-media-cdn.foolz.us/ffuuka/board/tg/image/1336/87/1336876770629.jpg
                hp: { total: 129 },
                defenses: { ac: 27, fort: 23, ref: 24, will: 21 },
                init: 13, speed: 7,
                attacks: [
                          { name: "Katar", type: "At-Will", range: "melee", toHit: 19, defense: "AC", damage: "1d6+4", keywords: [ "melee" ] },
                          { name: "Katar (combat advantage)", type: "At-Will", range: "melee", toHit: 19, defense: "AC", damage: "2d6+4", keywords: [ "melee", "combat advantage" ] },
                          { name: "Katar (bloodied)", type: "At-Will", range: "melee", toHit: 20, defense: "AC", damage: "1d6+4", keywords: [ "melee", "bloodied" ] },
                          { name: "Katar (bloodied, combat advantage)", type: "At-Will", range: "melee", toHit: 20, defense: "AC", damage: "2d6+4", keywords: [ "melee", "bloodied", "combat advantage" ] },
                          { name: "Dragon Breath", type: "At-Will", range: 3, toHit: 14, defense: "Ref", damage: { amount: "1d6+3", type: "fire" }, keywords: [ "close blast" ] },
                          { name: "Dragon Breath (bloodied)", type: "At-Will", range: 3, toHit: 15, defense: "Ref", damage: { amount: "1d6+3", type: "fire" }, keywords: [ "close blast" ] }
                  ]
            },
            "Eidolon": { 
                name: "Eidolon", image: "images/portraits/eidolon.png", // "http://gallery.rptools.net/d/12751-1/Rogue+Eidolon+_L_.png",
                hp: { total: 132 },
                defenses: { ac: 28, fort: 26, ref: 22, will: 23 },
                init: 8, speed: 5,
                attacks: [
                          { name: "Slam", type: "At-Will", range: "reach", toHit: 19, defense: "AC", damage: "2d8+6", keywords: [ "melee" ] },
                          { name: "Divine Retribution", type: "At-Will", range: "20", toHit: 17, defense: "Ref", damage: { amount: "2d8+5", type: "radiant" }, keywords: [ "ranged", "miss half" ] },
                          { name: "Vengeful Flames", type: "At-Will", range: "20", toHit: 17, defense: "Ref", damage: { amount: "1d8+5", type: "fire" }, effects: [ { name: "ongoing_fire", amount: 5, saveEnds: true } ], keywords: [ "ranged", "miss half" ] },
                          { name: "Hallowed Stance", type: "At-Will", range: "ranged", toHit: 99, defense: "AC", damage: { amount: "1d8", type: "radiant" } }
                  ]
            },
            "Spitting Troll": { 
                name: "Spitting Troll", image: "images/portraits/spitting_troll.jpg", // "http://www.wizards.com/dnd/images/dx20050907a_91226.jpg",
                hp: { total: 106, regeneration: 10 },
                defenses: { ac: 26, fort: 22, ref: 22, will: 23 },
                init: 12, speed: { walk: 6, climb: 4 },
                attacks: [
                          { name: "Claw", type: "At-Will", range: "melee", toHit: 17, defense: "AC", damage: { amount: "2d6+5", type: "poison" }, keywords: [ "melee" ] },
                          { name: "Javelin", type: "At-Will", range: "ranged", toHit: 17, defense: "AC", damage: { amount: "2d6+5", type: "poison" }, keywords: [ "ranged" ] },
                          { name: "Acid Spit", type: "At-Will", range: "ranged", toHit: 15, defense: "Ref", damage: { amount: "1d6", type: "acid" }, keywords: [ "ranged" ] }
                  ]
            },
            "Streetwise Thug": { 
                name: "Streetwise Thug", image: "images/portraits/streetwise_thug.gif", // "http://images.community.wizards.com/community.wizards.com/user/grawln/party_pics/characters/0ff3a392aa7b3d1450c59c8f0cb9552c.gif?v=196240",
                hp: { total: 1 },
                defenses: { ac: 21, fort: 19, ref: 16, will: 16 },
                init: 3, speed: 6,
                attacks: [
                          { name: "Longsword", type: "At-Will", range: "melee", toHit: 14, defense: "AC", damage: "6", keywords: [ "melee" ] },
                          { name: "Crossbow", type: "At-Will", range: "ranged", toHit: 13, defense: "AC", damage: 6, keywords: [ "ranged" ] }
                  ]
            },
            "Troll": { 
                name: "Troll", image: "images/portraits/troll.jpg", // "http://www.wizards.com/dnd/images/MM35_gallery/MM35_PG248a.jpg",
                hp: { total: 100, regeneration: 10 },
                defenses: { ac: 20, fort: 21, ref: 18, will: 17 },
                init: 7, speed: 8,
                attacks: [
                          { name: "Claw", type: "At-Will", range: "reach", toHit: 13, defense: "AC", damage: "2d6+6", keywords: [ "melee" ] }
                  ]
            },
            "Two-Headed Troll": { 
                name: "Two-Headed Troll", image: "images/portraits/two_headed_troll.jpg",
                hp: { total: 264, regeneration: 10 },
                defenses: { ac: 25, fort: 27, ref: 19, will: 20 },
                savingThrows: 2,
                init: 5, speed: 6,
                attacks: [
                          { name: "Claw", type: "At-Will", range: "reach", toHit: 13, defense: "AC", damage: "3d6+7", keywords: [ "melee" ] },
                          { name: "Smackdown", type: "At-Will", range: "reach", toHit: 11, defense: "Fort", damage: "0", effects: [ "Prone" ], keywords: [ "melee" ] }
                  ]
            },
            "War Troll": { 
                name: "War Troll", image: "images/portraits/war_troll.jpg", // http://www.wizards.com/dnd/images/iw_war_troll.jpg
                hp: { total: 110, regeneration: 10 },
                defenses: { ac: 30, fort: 29, ref: 25, will: 25 },
                init: 12, speed: 7,
                attacks: [
                          { name: "Greatsword", type: "At-Will", range: "reach", toHit: 20, defense: "AC", damage: "1d12+7", effects: [ { name: "Marked", duration: 1 } ], keywords: [ "melee" ] },
                          { name: "Claw", type: "At-Will", range: "reach", toHit: 20, defense: "AC", damage: "2d6+7", keywords: [ "melee" ] },
                          { name: "Longbow", type: "At-Will", range: 20, toHit: 20, defense: "AC", damage: "1d12+3", keywords: [ "ranged" ] },
                          { name: "Sweeping Strike", type: "At-Will", range: 2, toHit: 20, defense: "AC", damage: "1d12+7", effects: [ "Prone" ], keywords: [ "melee", "close blast" ] }
                  ]
            },
            "Redspawn Firebelcher": { 
                name: "Redspawn Firebelcher", image: "images/portraits/redspawn_firebelcher.png", // http://images3.wikia.nocookie.net/__cb20100421223543/dndawokenheroes/images/9/93/Redspawn_Firebelcher.png
                hp: { total: 97 },
                defenses: { ac: 25, fort: 25, ref: 22, will: 21 },
                init: 7, speed: 4,
                attacks: [
                          { name: "Bite", type: "At-Will", range: "melee", toHit: 16, defense: "AC", damage: { amount: "1d10+4", type: "fire" }, effects: [ { name: "ongoing damage", amount: 5, type: "fire", saveEnds: true } ], keywords: [ "melee", "fire" ] },
                          { name: "Fire Belch", type: "At-Will", target: { range: 12 }, toHit: 15, defense: "Ref", damage: { amount: "2d6+1", type: "fire" }, effects: [ { name: "ongoing damage", amount: 5, type: "fire", saveEnds: true } ], keywords: [ "ranged", "fire" ] },
                          { name: "Fire Burst", type: "recharge", target: { area: "burst", size: 2, range: 10 }, recharge: 5, toHit: 15, defense: "Ref", damage: { amount: "3d6+1", type: "fire" }, effects: [ { name: "ongoing damage", amount: 5, type: "fire", saveEnds: true } ], miss: { halfDamage: true }, keywords: [ "ranged", "fire" ] }
                  ]
            },
            "Berbalang": { 
                name: "Berbalang", image: "images/portraits/berbalang.jpg", // http://www.rpgblog.net/wp-content/berbalang.jpg
                hp: { total: 408 },
                defenses: { ac: 25, fort: 22, ref: 25, will: 21 },
                savingThrows: 5,
                init: 13, speed: { walk: 6, fly: 8 },
                attacks: [
                          { name: "Claw", type: "At-Will", range: "melee", toHit: 14, defense: "AC", damage: "1d8+6", keywords: [ "melee" ] },
                          { name: "Claw (sneak attack)", type: "At-Will", range: "melee", toHit: 14, defense: "AC", damage: "2d8+6", keywords: [ "melee", "requires combat advantage" ] },
                          { name: "Sacrifice", type: "At-Will", range: 1, toHit: 11, defense: "Fort", damage: "2d6+6", effects: [ { name: "Dazed", saveEnds: true } ], keywords: [ "close burst", "effects on miss" ] }
                  ]
            },
            "Zithiruun, the Broken General": { 
                name: "Zithiruun, the Broken General", image: "images/portraits/zithiruun.jpg", // http://cdn.obsidianportal.com/images/145622/zith.jpg
                hp: { total: 280 },
                defenses: { ac: 30, fort: 26, ref: 29, will: 28 },
                savingThrows: { general: 2, charm: 4 },
                init: 15, speed: { walk: 6, fly: 5 },
                attacks: [
                          { name: "Silver Saber", type: "At-Will", range: "melee", toHit: 19, defense: "AC", damage: { amount: "2d8+6", type: "psychic" }, keywords: [ "melee", "psychic", "weapon" ] },
                          { name: "Thrown Saber", type: "At-Will", range: 5, toHit: 19, defense: "AC", damage: { amount: "2d8+6", type: "psychic" }, keywords: [ "ranged", "thrown", "psychic", "weapon" ] },
                          { name: "Silver Flurry", type: "recharge", recharge: 5, range: "melee", toHit: 19, defense: "AC", damage: { amount: "4d8+6", type: "psychic" }, keywords: [ "melee", "psychic", "weapon" ] }
                  ]
            },
            "Rathoraiax": { 
                name: "Rathoraiax", image: "images/portraits/zombie_dragon.jpg", // http://4.bp.blogspot.com/-rclvSPUh9iM/ToBowVvsz_I/AAAAAAAADKI/wwQ5VTfwAeU/s1600/02-The-Dragons_Zombie-Dragon.jpg
                hp: { total: 328 },
                defenses: { ac: 27, fort: 29, ref: 22, will: 24 },
                resistances: { necrotic: 15 },
                vulnerabilities: { radiant: 15 },
                immunities: [ "disease", "poison" ],
                savingThrows: 2,
                init: 5, speed: { walk: 4, fly: 8 },
                attacks: [
                          { name: "Claw", type: "At-Will", range: "reach", toHit: 16, defense: "AC", damage: "2d10+6", effects: [ "Prone"], keywords: [ "melee" ] },
                          { name: "Tail Crush", type: "At-Will", range: "reach", toHit: 14, defense: "Fort", damage: "3d8+6", keywords: [ "melee", "prone" ] },
                          { name: "Breath of the Grave", type: "Encounter", range: 5, toHit: 14, defense: "Fort", damage: { amount: "4d10+6", type: [ "poison", "necrotic" ] }, effects: [ { name: "multiple", saveEnds: true, children: [ { name: "Ongoing necrotic", amount: 10 }, "Weakened" ] } ], keywords: [ "close blast", "necrotic", "poison" ] },
                          { name: "Loose stones", type: "At-Will", range: 1, toHit: 14, defense: "Ref", damage: "2d6+10", effects: [ "Prone" ], keywords: [ "burst" ] }
                  ]
            },
            "Slaad Tadpole": { 
                name: "Slaad Tadpole", image: "images/portraits/slaad_tadpole.jpg",
                hp: { total: 44 },
                defenses: { ac: 21, fort: 18, ref: 20, will: 18 },
                init: 7, speed: 4,
                attacks: [
                          { name: "Bite", type: "At-Will", range: "melee", toHit: 10, defense: "AC", damage: "1d8", keywords: [ "melee" ] }
                  ]
            },
            "Slaad Midwife": { 
                name: "Slaad Midwife", image: "images/portraits/slaad_midwife.jpg",
                hp: { total: 70 },
                defenses: { ac: 20, fort: 19, ref: 17, will: 17 },
                init: 7, speed: 5,
                attacks: [
                          { name: "Claw", type: "At-Will", range: "melee", toHit: 11, defense: "AC", damage: "1d6+10", keywords: [ "melee" ] },
                          { name: "Fiery Spines", type: "Recharge", recharge: 5, range: "close blast 5", toHit: 9, defense: "Ref", damage: { amount: "2d8+8", type: "fire" }, effects: [ { name: "Ongoing poison", amount: 5, type: "poison", saveEnds: true } ], keywords: [ "close blast" ] }
                  ]
            },
            "Flux Slaad": { 
                name: "Flux Slaad", image: "images/portraits/flux_slaad.jpg",
                hp: { total: 98 },
                defenses: { ac: 23, fort: 23, ref: 21, will: 21 },
                init: 8, speed: { walk: 7, teleport: 2 },
                attacks: [
                          { name: "Claw Slash", type: "At-Will", range: "melee", toHit: 14, defense: "AC", damage: "2d8+3", keywords: [ "melee" ] }
                  ]
            },
            "Slaad Guard": { 
                name: "Slaad Guard", image: "images/portraits/flux_slaad.jpg",
                hp: { total: 98 },
                defenses: { ac: 23, fort: 23, ref: 21, will: 21 },
                init: 8, speed: { walk: 7, teleport: 2 },
                attacks: [
                          { name: "Claw Slash", type: "At-Will", range: "melee", toHit: 14, defense: "AC", damage: "2d8+3", keywords: [ "melee" ] }
                  ]
            }
            
        }
    };
}