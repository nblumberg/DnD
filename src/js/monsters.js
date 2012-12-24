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
            }
        }
    };
}