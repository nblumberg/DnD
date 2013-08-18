function loadMonsters() {
    /**
        String: {
            name: String, level: Number, image: URL,
            hp: { total: Number },
            defenses: { ac: Number, fort: Number, ref: Number, will: Number },
            [resistances: { "type": Number },]
            [immunities: [ String ],]
            [vulnerabilities: [ String ],]
            [savingThrows: Number,]
            init: Number, 
            speed: Number | { "method": Number },
            abilities: { STR: Number, CON: Number, DEX: Number, INT: Number, WIS: Number, CHA: Number },
            skills: { acrobatics: Number, arcana: Number, athletics: Number, bluff: Number, diplomacy: Number, dungeoneering: Number, endurance: Number, heal: Number, history: Number, insight: Number, intimidate: Number, nature: Number, perception: Number, religion: Number, stealth: Number, streetwise: Number, thievery: Number },
            attacks: [
                {
                    [effects: [
                        { name: String, [amount: Number,][ type: String,][ duration: "startTargetNext" | "endTargetNext" | "endAttackerNext" ] }
                    ]]
                }
            ]
        },
     */
    return { 
        "Adult Pact Dragon": {        
            name: "Adult Pact Dragon", level: 13, image: "../images/portraits/pact_dragon.jpg", // http://www.dandwiki.com/wiki/File:Dragonwarrior.jpg
            hp: { total: 134 },
            defenses: { ac: 27, fort: 26, ref: 25, will: 25 },
            resistances: { fire: 10, psychic: 10 },
            init: 13, speed: { walk: 7, fly: 10 },
            abilities: { STR: 24, CON: 22, DEX: 20, INT: 15, WIS: 18, CHA: 16 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 14, dungeoneering: 0, endurance: 17, heal: 0, history: 0, insight: 15, intimidate: 0, nature: 0, perception: 15, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Bite", usage: { frequency: "At-Will" }, range: "reach", toHit: 18, defense: "AC", damage: "2d6+7", keywords: [ "melee", "basic" ] },
                      { name: "Aggressive Charger", usage: { frequency: "At-Will" }, range: "reach", toHit: 18, defense: "AC", damage: "2d6+7", keywords: [ "melee", "basic" ] },
                      { name: "Skirmish", usage: { frequency: "At-Will" }, range: "melee", toHit: "automatic", defense: "AC", damage: "2d6", keywords: [ "melee", "striker", "skirmish" ] },
                      { name: "Breath Weapon", usage: { frequency: "Recharge", recharge: 5 }, target: { area: "close blast", size: 5 }, toHit: 15, defense: "Ref", damage: { amount: "2d12+12", type: "fire" }, effects: [ { name: "ongoing damage", amount: 5, type: "fire", saveEnds: true } ], keywords: [ "close blast", "fire" ] }
              ]
        },
        "Antharosk": {        
            name: "Antharosk", level:10, image: "../images/portraits/antharosk.jpg",
            hp: { total: 428 },
            defenses: { ac: 26, fort: 23, ref: 24, will: 23 },
            resistances: { poison: 20 },
            savingThrows: 5,
            init: 10, speed: { walk: 8, fly: 12 },
            abilities: { STR: 16, CON: 19, DEX: 20, INT: 16, WIS: 17, CHA: 18 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 19, diplomacy: 14, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 18, intimidate: 14, nature: 0, perception: 13, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Bite", usage: { frequency: "At-Will" }, range: "reach", toHit: 15, defense: "AC", damage: "1d10+5", effects: [ { name: "ongoing damage", amount: 5, type: "poison", saveEnds: true } ], keywords: [ "melee", "basic", "poison" ] },
                      { name: "Claw", usage: { frequency: "At-Will" }, range: "reach", toHit: 15, defense: "AC", damage: "1d8+5", keywords: [ "melee", "basic" ] },
                      { name: "Tail Sweep", usage: { frequency: "At-Will", action: "Immediate Reaction" }, toHit: 13, defense: "Ref", damage: "1d8+5", effects: [ "Prone" ], keywords: [ "melee", "prone" ] },
                      { name: "Breath Weapon", usage: { frequency: "Recharge", recharge: 5 }, target: { area: "close blast", size: 5 }, toHit: 13, defense: "Fort", damage: { amount: "1d10+4", type: "poison" }, effects: [ { name: "multiple", saveEnds: true, children: [ { name: "Ongoing damage", amount: 5 }, "Slowed" ] } ], keywords: [ "close blast", "poison" ] },
                      { name: "Frightful Presence", usage: { frequency: "Encounter" }, target: { area: "close burst", size: 5 }, toHit: 13, defense: "Will", damage: "0", effects: [ { name: "Stunned", duration: "endAttackerNext" } ], keywords: [ "close", "burst" ] }
              ]
        },
        "Arctide Spiralith": {
            name: "Arctide Spiralith", level: 12, image: "../images/portraits/arctide_spiralith.jpg",
            hp: { total: 97 },
            defenses: { ac: 24, fort: 23, ref: 25, will: 23 },
            init: 12, speed: 7,
            abilities: { STR: 15, CON: 19, DEX: 23, INT: 7, WIS: 19, CHA: 12 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 10, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Bite", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: "1d6+5", keywords: [ "melee", "basic" ] },
                      { name: "Arcane Arc", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "Ref", damage: { amount: "1d8+5", type: "lightning" }, keywords: [ "melee", "lightning" ] },
                      { name: "Focused Strike", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 19, defense: "Ref", damage: { amount: "2d8+5", type: "lightning" }, keywords: [ "ranged", "lightning" ] },
                      { name: "Bloodied Shock", usage: { frequency: "Encounter" }, target: { area: "close burst", size: 1, range: 1 }, toHit: 15, defense: "Ref", damage: { amount: "1d8+5", type: "lightning" }, effects: [ { name: "Dazed", saveEnds: true } ], keywords: [ "ranged", "lightning" ] },
                      { name: "Charged Lightning Burst", usage: { frequency: "At-Will" }, target: { area: "burst", size: 2, range: 10 }, toHit: 15, defense: "Ref", damage: { amount: "1d8+5", type: "lightning" }, keywords: [ "ranged", "burst", "lightning" ] }
              ]
        },
        "Banshrae Dartswarmer": { 
            name: "Banshrae Dartswarmer", level: 11, image: "../images/portraits/banshrae_dartswarmer.jpg",
            hp: { total: 89 },
            defenses: { ac: 23, fort: 20, ref: 23, will: 22 },
            init: 11, speed: 8,
            abilities: { STR: 16, CON: 17, DEX: 22, INT: 14, WIS: 15, CHA: 20 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 7, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Slam", usage: { frequency: "At-Will" }, range: "melee", toHit: 13, defense: "AC", damage: "1d8+3", keywords: [ "melee", "basic" ] },
                      { name: "Blowgun Dart", usage: { frequency: "At-Will" }, range: 5, toHit: 16, defense: "AC", targeting: "blast 5", damage: "1d10+6", effects: [ { name: "Dazed", saveEnds: true } ], keywords: [ "ranged" ] },
                      { name: "Dart Flurry", usage: { frequency: "Recharge", recharge: 4 }, range: "blast 5", toHit: 16, defense: "AC", targeting: "blast 5", damage: "1d10+6", effects: [ 
                        { name: "multiple effects", saveEnds: true, children: [
                                { name: "Dazed" }, 
                                { name: "Attack penalty", amount: -2 } 
                            ] }
                        ], keywords: [ "ranged" ] }
              ]
        },
        "Battle Wight Bodyguard": { 
            name: "Battle Wight Bodyguard", level: 11, image: "../images/portraits/battle_wight.png",
            hp: { total: 230 },
            defenses: { ac: 29, fort: 26, ref: 22, will: 23 },
            savingThrows: 2,
            immunities: [ "disease", "poison" ],
            vulnerabilities: { radiant: 5 },
            resistances: { necrotic: 10 },
            actionPoints: 1,
            init: 9, speed: { walk: 5 },
            abilities: { STR: 21, CON: 19, DEX: 14, INT: 12, WIS: 9, CHA: 21 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 15, nature: 0, perception: 4, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Souldraining Longsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "AC", damage: { amount: "1d8+5", type: "necrotic" }, effects: [ { name: "Immobilized", saveEnds: true }, { name: "Marked", duration: "endAttackerNext" } ], keywords: [ "melee", "basic", "necrotic", "weapon" ] }, // TODO: target loses 1 healing surge
                      { name: "Soul Reaping", usage: { frequency: "At-Will" }, range: 5, toHit: 16, defense: "Fort", damage: { amount: "2d8+6", type: "necrotic" }, keywords: [ "ranged", "healing", "necrotic" ] }, // TODO: heals self 10
                      { name: "Chosen Target", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "AC", damage: { amount: "1d8+5", type: "necrotic" }, effects: [ { name: "Immobilized", saveEnds: true }, { name: "Marked", duration: "endAttackerNext" } ], keywords: [ "melee", "basic", "necrotic", "weapon" ] } // TODO: target loses 1 healing surge
              ]
        },
        "Berbalang": { 
            name: "Berbalang", level: 10, image: "../images/portraits/berbalang.jpg", // http://www.rpgblog.net/wp-content/berbalang.jpg
            hp: { total: 408 },
            defenses: { ac: 25, fort: 22, ref: 25, will: 21 },
            savingThrows: 5,
            init: 13, speed: { walk: 6, fly: 8 },
            abilities: { STR: 16, CON: 14, DEX: 22, INT: 14, WIS: 13, CHA: 15 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 6, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Claw", usage: { frequency: "At-Will" }, range: "melee", toHit: 14, defense: "AC", damage: "1d8+6", keywords: [ "melee", "basic" ] },
                      { name: "Claw (sneak attack)", usage: { frequency: "At-Will" }, range: "melee", toHit: 14, defense: "AC", damage: "2d8+6", keywords: [ "melee", "requires combat advantage" ] },
                      { name: "Sacrifice", usage: { frequency: "At-Will" }, range: 1, toHit: 11, defense: "Fort", damage: "2d6+6", effects: [ { name: "Dazed", saveEnds: true } ], keywords: [ "close burst", "effects on miss" ] }
              ]
        },
        "Calaunxin": {        
            name: "Calaunxin", level: 9, image: "../images/portraits/calaunxin.jpg",
            hp: { total: 408 },
            defenses: { ac: 23, fort: 26, ref: 21, will: 22 },
            resistances: { poison: 20 },
            savingThrows: 5,
            init: 5, speed: { walk: 8, fly: 12 },
            abilities: { STR: 20, CON: 22, DEX: 12, INT: 12, WIS: 14, CHA: 10 },
            skills: { acrobatics: 0, arcana: 0, athletics: 19, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 11, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Bite", usage: { frequency: "At-Will" }, range: "reach", toHit: 12, defense: "AC", damage: "1d8+5", effects: [ { name: "ongoing damage", amount: 5, type: "poison", saveEnds: true } ], keywords: [ "melee", "basic", "poison" ] },
                      { name: "Claw", usage: { frequency: "At-Will" }, range: "reach", toHit: 12, defense: "AC", damage: "1d8+5", keywords: [ "melee", "basic" ] },
                      { name: "Luring Glare", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 10, defense: "Will", damage: "0", keywords: [ "melee", "forced movement" ] },
                      { name: "Breath Weapon", usage: { frequency: "Recharge", recharge: 5 }, target: { area: "close blast", size: 5 }, toHit: 10, defense: "Ref", damage: { amount: "2d6+6", type: "poison" }, effects: [ { name: "multiple", saveEnds: true, children: [ "Slowed" ] } ], keywords: [ "close blast", "poison" ] },
                      { name: "Frightful Presence", usage: { frequency: "Encounter" }, target: { area: "close burst", size: 5 }, toHit: 10, defense: "Will", damage: "0", effects: [ { name: "Stunned", duration: "endAttackerNext" } ], keywords: [ "close", "burst" ] }
              ]
        },
        "Centaur Ravager": { 
            name: "Centaur Ravager", level: 12, image: "../images/portraits/centaur_ravager.jpg",
            hp: { total: 150 },
            defenses: { ac: 24, fort: 26, ref: 24, will: 23 },
            init: 10, speed: { walk: 8 },
            abilities: { STR: 22, CON: 20, DEX: 18, INT: 9, WIS: 16, CHA: 10 },
            skills: { acrobatics: 0, arcana: 0, athletics: 17, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 14, perception: 9, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Greatsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 15, defense: "AC", damage: "1d10+6", keywords: [ "melee", "basic" ] },
                      { name: "Greatsword (charge)", usage: { frequency: "At-Will" }, range: "melee", toHit: 15, defense: "AC", damage: "2d10+6", keywords: [ "melee", "basic", "charge" ] },
                      { name: "Quick Kick", usage: { frequency: "At-Will", action: "Immediate Reaction" }, range: "melee", toHit: 14, defense: "AC", damage: "1d6+6", keywords: [ "melee" ] },
                      { name: "Berserk Rush", usage: { frequency: "Encounter" }, range: "melee", toHit: 15, defense: "Fort", damage: "2d10+6", effects: [ { name: "Prone" } ], keywords: [ "melee" ] },
                      { name: "Berserk Rush (charge)", usage: { frequency: "Encounter" }, range: "melee", toHit: 15, defense: "Fort", damage: "3d10+6", effects: [ { name: "Prone" } ], keywords: [ "melee", "charge" ] },
                      { name: "Brash Retaliation", usage: { frequency: "Encounter" }, range: "melee", toHit: 15, defense: "AC", damage: "3d10+6", keywords: [ "melee", "bloodied" ] }
              ]
        },
        "Chaos Mauler": { 
            name: "Chaos Mauler", level: 11, image: "../images/portraits/chaos_mauler.png",
            hp: { total: 1 },
            defenses: { ac: 23, fort: 25, ref: 23, will: 22 },
            init: 9, speed: { walk: 6 },
            abilities: { STR: 23, CON: 16, DEX: 18, INT: 11, WIS: 14, CHA: 16 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 7, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Slam", usage: { frequency: "At-Will" }, range: 2, toHit: 14, defense: "AC", damage: { amount: "8", type: "fire" }, keywords: [ "melee", "basic" ] }
              ]
        },
        "Cyclops Guard": { 
            name: "Cyclops Guard", level: 14, image: "../images/portraits/cyclops.jpg",
            hp: { total: 1 },
            defenses: { ac: 27, fort: 26, ref: 23, will: 23 },
            init: 8, speed: 6,
            abilities: { STR: 22, CON: 20, DEX: 16, INT: 11, WIS: 17, CHA: 11 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 15, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [ { name: "Battleaxe", usage: { frequency: "At-Will" }, range: "2", toHit: 17, defense: "AC", damage: "7", keywords: [ "melee", "basic" ] } ]
        },
        "Dragonborn Gladiator": { 
            name: "Dragonborn Gladiator", level: 10, image: "../images/portraits/dragonborn_gladiator.jpg", // "http://img213.imageshack.us/img213/2721/dragonborn29441748300x3.jpg",
            hp: { total: 106 },
            defenses: { ac: 24, fort: 23, ref: 20, will: 21 },
            init: 9, speed: 5,
            abilities: { STR: 21, CON: 18, DEX: 15, INT: 10, WIS: 12, CHA: 16 },
            skills: { acrobatics: 0, arcana: 0, athletics: 15, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 7, insight: 0, intimidate: 15, nature: 0, perception: 6, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Bastard Sword", usage: { frequency: "At-Will" }, range: "melee", toHit: 15, defense: "AC", damage: "1d10+5", keywords: [ "melee", "basic" ] },
                      { name: "Bastard Sword (bloodied)", usage: { frequency: "At-Will" }, range: "melee", toHit: 16, defense: "AC", damage: "1d10+5", keywords: [ "melee" ] },
                      { name: "Bastard Sword (lone fighter)", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: "1d10+5", keywords: [ "melee" ] },
                      { name: "Bastard Sword (bloodied, lone fighter)", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "AC", damage: "1d10+5", keywords: [ "melee" ] },
                      { name: "Finishing Blow", usage: { frequency: "At-Will" }, range: "melee", toHit: 15, defense: "AC", damage: "1d10+5", keywords: [ "melee" ] },
                      { name: "Finishing Blow (bloodied)", usage: { frequency: "At-Will" }, range: "melee", toHit: 16, defense: "AC", damage: "1d10+5", keywords: [ "melee" ] },
                      { name: "Finishing Blow (lone fighter)", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: "1d10+5", keywords: [ "melee" ] },
                      { name: "Finishing Blow (bloodied, lone fighter)", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "AC", damage: "1d10+5", keywords: [ "melee" ] },
                      { name: "Howl", usage: { frequency: "At-Will" }, range: "blast 3", toHit: 16, defense: "Fort", damage: { amount: "1d6+6", type: "thunder" }, keywords: [ "ranged" ] },
                      { name: "Shriek of Pain", usage: { frequency: "Encounter" }, range: "blast 5", toHit: 16, defense: "Fort", damage: { amount: "3d6+6", type: "thunder" }, miss: { halfDamage: true }, keywords: [ "ranged" ] },
                      { name: "Shriek of Pain (bloodied)", usage: { frequency: "Encounter" }, range: "blast 5", toHit: 16, defense: "Fort", damage: { amount: "3d6+11", type: "thunder" }, miss: { halfDamage: true }, keywords: [ "ranged" ] }
              ]
        },
        "Dragonborn Raider": { 
            name: "Dragonborn Raider", level: 13, image: "../images/portraits/dragonborn_raider.jpg", // "http://1-media-cdn.foolz.us/ffuuka/board/tg/image/1336/87/1336876770629.jpg
            hp: { total: 129 },
            defenses: { ac: 27, fort: 23, ref: 24, will: 21 },
            init: 13, speed: 7,
            abilities: { STR: 18, CON: 17, DEX: 21, INT: 10, WIS: 14, CHA: 12 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 8, insight: 0, intimidate: 9, nature: 0, perception: 13, religion: 0, stealth: 16, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Katar", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: "1d6+4", keywords: [ "melee", "basic" ] },
                      { name: "Katar (combat advantage)", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: "2d6+4", keywords: [ "melee", "combat advantage" ] },
                      { name: "Katar (bloodied)", usage: { frequency: "At-Will" }, range: "melee", toHit: 20, defense: "AC", damage: "1d6+4", keywords: [ "melee", "bloodied" ] },
                      { name: "Katar (bloodied, combat advantage)", usage: { frequency: "At-Will" }, range: "melee", toHit: 20, defense: "AC", damage: "2d6+4", keywords: [ "melee", "bloodied", "combat advantage" ] },
                      { name: "Dragon Breath", usage: { frequency: "At-Will" }, range: 3, toHit: 14, defense: "Ref", damage: { amount: "1d6+3", type: "fire" }, keywords: [ "close blast" ] },
                      { name: "Dragon Breath (bloodied)", usage: { frequency: "At-Will" }, range: 3, toHit: 15, defense: "Ref", damage: { amount: "1d6+3", type: "fire" }, keywords: [ "close blast" ] }
              ]
        },
        "Duergar Hellcaller": { 
            name: "Duergar Hellcaller", level: 12, image: "../images/portraits/duergar_hellcaller.jpg",
            hp: { total: 96 },
            defenses: { ac: 24, fort: 23, ref: 23, will: 25 },
            init: 10, speed: 5,
            abilities: { STR: 14, CON: 18, DEX: 19, INT: 11, WIS: 14, CHA: 22 },
            skills: { acrobatics: 0, arcana: 11, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 13, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 13, religion: 11, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Mace", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: "1d8+5", keywords: [ "melee", "basic" ] },
                      { name: "Infernal Quills", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 19, defense: "AC", damage: { amount: "1d8+3", type: "fire and poison" }, effects: [ { name: "multiple", children: [ { name: "ongoing damage", amount: 5, type: "fire and poison" }, { name: "attack penalty", amount: -2 } ], saveEnds: true } ], keywords: [ "ranged", "poison", "fire" ] },
                      { name: "Quick Quill Strike", usage: { frequency: "Encounter" }, target: { range: 10 }, toHit: 19, defense: "AC", damage: { amount: "1d8+3", type: "fire and poison" }, effects: [ { name: "multiple", children: [ { name: "ongoing damage", amount: 5, type: "fire and poison" }, { name: "attack penalty", amount: -2 } ], saveEnds: true } ], keywords: [ "ranged", "poison", "fire" ] },
                      { name: "Asmodeus' Ruby Curse", usage: { frequency: "Encounter" }, target: { area: "close blast", range: 5 }, toHit: 16, defense: "Will", damage: { amount: "3d8+5", type: "psychic" }, keywords: [ "ranged", "close burst", "fear", "psychic" ] },
                      { name: "Quill Storm", usage: { frequency: "Encounter" }, target: { area: "burst", size: 2, range: 10 }, toHit: 17, defense: "Ref", damage: { amount: "1d8", type: "fire and poison" }, effects: [ { name: "multiple", children: [ { name: "ongoing damage", amount: 10, type: "fire and poison" }, { name: "attack penalty", amount: -2 } ], saveEnds: true } ], keywords: [ "ranged", "poison", "fire" ] }
              ]
        },
        "Eidolon": { 
            name: "Eidolon", level: 13, image: "../images/portraits/eidolon.png", // "http://gallery.rptools.net/d/12751-1/Rogue+Eidolon+_L_.png",
            hp: { total: 132 },
            defenses: { ac: 28, fort: 26, ref: 22, will: 23 },
            init: 8, speed: 5,
            abilities: { STR: 22, CON: 20, DEX: 14, INT: 7, WIS: 16, CHA: 11 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 9, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Slam", usage: { frequency: "At-Will" }, range: "reach", toHit: 19, defense: "AC", damage: "2d8+6", keywords: [ "melee", "basic" ] },
                      { name: "Divine Retribution", usage: { frequency: "At-Will" }, range: "20", toHit: 17, defense: "Ref", damage: { amount: "2d8+5", type: "radiant" }, keywords: [ "ranged", "miss half" ] },
                      { name: "Vengeful Flames", usage: { frequency: "At-Will" }, range: "20", toHit: 17, defense: "Ref", damage: { amount: "1d8+5", type: "fire" }, effects: [ { name: "ongoing damage", amount: 5, saveEnds: true } ], keywords: [ "ranged", "miss half" ] },
                      { name: "Hallowed Stance", usage: { frequency: "At-Will" }, range: "ranged", toHit: 99, defense: "AC", damage: { amount: "1d8", type: "radiant" } }
              ]
        },
        "Elder Troglodyte Curse Chanter": { 
            name: "Elder Troglodyte Curse Chanter", level: 12, image: "../images/portraits/troglodyte_curse_chanter.jpg",
            hp: { total: 127 },
            defenses: { ac: 27, fort: 26, ref: 21, will: 26 },
            init: 7, speed: 5,
            abilities: { STR: 16, CON: 23, DEX: 12, INT: 10, WIS: 19, CHA: 15 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 15, endurance: 17, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 15, religion: 11, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Quarterstaff", usage: { frequency: "At-Will" }, range: "melee", toHit: 16, defense: "AC", damage: "1d8+4", keywords: [ "melee", "basic" ] },
                      { name: "Claw", usage: { frequency: "At-Will" }, range: "melee", toHit: 14, defense: "AC", damage: "1d4+4", keywords: [ "melee", "basic" ] },
                      { name: "Poison Ray", usage: { frequency: "At-Will" }, range: 10, toHit: 15, defense: "Fort", damage: { amount: "1d8+6", type: "poison" }, effects: [ { name: "Weakened", saveEnds: true } ], keywords: [ "ranged", "poison" ] },
                      { name: "Cavern Curse", usage: { frequency: "Recharge", recharge: 3 }, range: 5, toHit: 16, defense: "Fort", damage: "0", effects: [ { name: "multiple", saveEnds: true, children: [ { name: "ongoing damage", amount: 5, type: "necrotic" }, { name: "Slowed" } ] } ], keywords: [ "ranged", "necrotic" ] }
              ]
        },
        "Flame Shard": { 
            name: "Flame Shard", level: 12, image: "../images/portraits/flame_shard.jpg",
            hp: { total: 100 },
            defenses: { ac: 24, fort: 25, ref: 23, will: 23 },
            init: 10, speed: { walk: 4, fly: 4 },
            abilities: { STR: 19, CON: 22, DEX: 19, INT: 7, WIS: 15, CHA: 18 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 8, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Burning Shard", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "Ref", damage: { amount: "1d8+5", type: "fire" }, keywords: [ "melee", "basic", "fire" ] },
                      { name: "Flame Shatter", usage: { frequency: "Encounter" }, target: { range: 2, area: "close burst" }, toHit: 17, defense: "Ref", damage: { amount: "1d8+5", type: "fire" }, effects: [ { name: "ongoing damage", amount: 5, type: "fire", saveEnds: true }], keywords: [ "close burst", "fire" ] },
                      { name: "Flame Burst", usage: { frequency: "At-Will" }, target: { range: 20, size: 2, area: "burst" }, toHit: 17, defense: "Ref", damage: { amount: "1d8+5", type: "fire" }, keywords: [ "close burst", "fire" ] },
                      { name: "Heat Wave (aura)", usage: { frequency: "At-Will", action: "Immediate Reaction" }, target: { range: 2, area: "close burst" }, toHit: "automatic", defense: "AC", damage: { amount: "5", type: "fire" }, keywords: [ "close burst", "fire", "aura" ] }
              ]
        },
        "Flesh Golem": { 
            name: "Flesh Golem", level: 12, image: "../images/portraits/flesh_golem.jpg", // http://www.wizards.com/dnd/images/eo_fleshgolem_med.jpg
            hp: { total: 304 },
            defenses: { ac: 26, fort: 29, ref: 21, will: 22 },
            init: 4, speed: { walk: 6 },
            actionPoints: 1,
            abilities: { STR: 20, CON: 22, DEX: 7, INT: 3, WIS: 8, CHA: 3 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 5, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Slam", usage: { frequency: "At-Will" }, range: "reach", toHit: 16, defense: "AC", damage: "2d8+5", effects: [ { name: "Dazed", saveEnds: true } ], keywords: [ "melee", "basic" ] },
                      { name: "Berserker Attack", usage: { frequency: "At-Will", action: "Immediate Reaction" }, range: "reach", toHit: 16, defense: "AC", damage: "2d8+5", effects: [ { name: "Dazed", saveEnds: true } ], keywords: [ "melee" ] },
                      { name: "Golem Rampage", usage: { frequency: "Recharge", recharge: 5 }, range: "reach", toHit: 16, defense: "AC", damage: "2d8+5", effects: [ { name: "Dazed", saveEnds: true } ], keywords: [ "melee" ] }
              ]
        },
        "Flux Slaad": { 
            name: "Flux Slaad", level: 9, image: "../images/portraits/flux_slaad.jpg",
            hp: { total: 98 },
            defenses: { ac: 23, fort: 23, ref: 21, will: 21 },
            init: 8, speed: { walk: 7, teleport: 2 },
            abilities: { STR: 16, CON: 18, DEX: 15, INT: 7, WIS: 13, CHA: 14 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 10, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Claw Slash", usage: { frequency: "At-Will" }, range: "melee", toHit: 14, defense: "AC", damage: "2d8+3", keywords: [ "melee", "basic" ] }
              ]
        },
        "Foulspawn Seer": { 
            name: "Foulspawn Seer", level: 11, image: "../images/portraits/foulspawn.jpg",
            hp: { total: 86 },
            defenses: { ac: 24, fort: 19, ref: 23, will: 21 },
            init: 7, speed: { walk: 6, teleport: 3 },
            abilities: { STR: 10, CON: 14, DEX: 14, INT: 22, WIS: 8, CHA: 18 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 9, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Twisted Staff", usage: { frequency: "At-Will" }, range: "melee", toHit: 14, defense: "AC", damage: "1d8+6", keywords: [ "melee", "basic" ] },
                      { name: "Warp Orb", usage: { frequency: "At-Will" }, range: "10", toHit: 16, defense: "Ref", damage: "1d8+6", effects: [ { name: "dazed", saveEnds: true } ], keywords: [ "ranged", "basic" ] },
                      { name: "Distortion Blast", usage: { frequency: "Daily" }, range: "blast 5", toHit: 12, defense: "Fort", damage: "2d8+6", effects: [ { name: "dazed", saveEnds: true } ], keywords: [ "ranged" ] }
              ]
        },
        "Gallia": {
            name: "Gallia", level: 11, image: "../images/portraits/gallia.jpg", // http://cdn.obsidianportal.com/images/243287/gith.JPG
            hp: { total: 108 },
            defenses: { ac: 27, fort: 22, ref: 23, will: 23 },
            init: 12, speed: { walk: 7, jump: 5 },
            abilities: { STR: 15, CON: 12, DEX: 17, INT: 10, WIS: 16, CHA: 11 },
            skills: { acrobatics: 15, arcana: 0, athletics: 9, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 13, intimidate: 0, nature: 0, perception: 13, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Unarmed Strike", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: "2d8+3", keywords: [ "melee", "basic" ] },
                      { name: "Stunning Strike", usage: { frequency: "At-Will" }, range: "melee", toHit: 14, defense: "Fort", damage: "1d8+3", effects: [ { name: "Stunned", duration: "endAttackerNext"} ], keywords: [ "melee" ] },
                      { name: "Trace Chance", usage: { frequency: "Recharge", recharge: 6 }, range: 5, toHit: "automatic", defense: "AC", damage: "0", effects: [ { name: "NextMeleeHitIsACrit", duration: "endAttackerNext" } ], keywords: [ "ranged" ] }
              ]
        },
        "Githyanki Lancer": { 
            name: "Githyanki Lancer", level: 14, image: "../images/portraits/githyanki_lancer.jpg", // http://scalesofwar4.webs.com/62githyanki.jpg
            hp: { total: 134 },
            defenses: { ac: 28, fort: 26, ref: 26, will: 25 },
            init: 15, speed: { walk: 5 },
            abilities: { STR: 19, CON: 14, DEX: 18, INT: 15, WIS: 16, CHA: 11 },
            skills: { acrobatics: 16, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 10, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Psychic Lance", usage: { frequency: "At-Will" }, range: "reach", toHit: 19, defense: "AC", damage: { amount: "2d10+5", type: "psychic" }, keywords: [ "melee", "psychic", "basic" ] },
                      { name: "Silver Longsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: [ "1d8+5", { amount: "1d8", type: "psychic" } ], keywords: [ "melee", "psychic", "basic" ] },
                      { name: "Mindslice", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 17, defense: "Will", damage: { amount: "2d8+5", type: "psychic" }, keywords: [ "ranged", "psychic" ] }
              ]
        },
        "Githyanki Mindslicer": { 
            name: "Githyanki Mindslicer", level: 13, image: "../images/portraits/githyanki_mindslicer.jpg", // http://cdn.obsidianportal.com/images/121677/githyanki_2_2.jpg
            hp: { total: 98 },
            defenses: { ac: 27, fort: 24, ref: 25, will: 24 },
            init: 11, speed: { walk: 6, jump: 5 },
            abilities: { STR: 14, CON: 14, DEX: 16, INT: 17, WIS: 12, CHA: 11 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 11, insight: 12, intimidate: 0, nature: 0, perception: 12, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Silver Longsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "AC", damage: [ "1d8+2", { amount: "1d8", type: "psychic" } ], keywords: [ "melee", "psychic", "basic" ] },
                      { name: "Mindslice", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 16, defense: "Will", damage: { amount: "2d8+3", type: "psychic" }, keywords: [ "ranged", "psychic" ] },
                      { name: "Psychic Barrage", usage: { frequency: "Recharge", recharge: 6 }, target: { area: "burst", size: 1, range: 20 }, toHit: 16, defense: "Will", damage: { amount: "1d6+3", type: "psychic" }, effects: [ { name: "ongoing damage", amount: 5, type: "psychic", saveEnds: true } ], keywords: [ "ranged", "psychic" ] }
              ]
        },
        "Githyanki Myrmidons": { 
            name: "Githyanki Myrmidons", level: 12, image: "../images/portraits/githyanki_thug.jpg",
            hp: { total: 1 },
            defenses: { ac: 28, fort: 24, ref: 23, will: 24 },
            init: 12, speed: 5,
            abilities: { STR: 16, CON: 12, DEX: 14, INT: 12, WIS: 16, CHA: 10 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 9, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Silver Short Sword", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: "7", keywords: [ "melee", "psychic", "basic" ] },
                      { name: "Silver Short Sword (immobilized)", usage: { frequency: "At-Will" }, range: "melee", toHit: "automatic", defense: "AC", damage: { amount: "5", type: "psychic" }, keywords: [ "melee", "psychic" ] },
                      { name: "Telekinetic Grasp", usage: { frequency: "Encounter" }, target: { range: 5 }, toHit: 15, defense: "Fort", damage: "0", effects: [ { name: "Immobilized", saveEnds: true } ], keywords: [ "ranged" ] }
              ]
        },
        "Githyanki Thug": { 
            name: "Githyanki Thug", level: 12, image: "../images/portraits/githyanki_thug.jpg", // http://www.worldofazolin.com/wiki/images/1/1d/Githyanki_warrior.jpg
            hp: { total: 1 },
            defenses: { ac: 24, fort: 26, ref: 21, will: 21 },
            init: 6, speed: 5,
            abilities: { STR: 21, CON: 21, DEX: 11, INT: 11, WIS: 11, CHA: 13 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 6, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Silver Greatsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 15, defense: "AC", damage: "5", effects: [ { name: "Immobilized", saveEnds: true } ], keywords: [ "melee", "psychic", "basic" ] }
              ]
        },
        "Githyanki Warrior": { 
            name: "Githyanki Warrior", level: 12, image: "../images/portraits/githyanki.jpg",
            hp: { total: 118 },
            defenses: { ac: 28, fort: 25, ref: 23, will: 22 },
            init: 13, speed: { walk: 5, jump: 5 },
            abilities: { STR: 21, CON: 14, DEX: 17, INT: 12, WIS: 12, CHA: 13 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 9, insight: 12, intimidate: 0, nature: 0, perception: 12, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Silver Greatsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: [ "1d10+5", { amount: "1d6", type: "psychic" } ], keywords: [ "melee", "psychic", "basic" ] },
                      { name: "Silver Greatsword (immobilized)", usage: { frequency: "At-Will" }, range: "melee", toHit: "automatic", defense: "AC", damage: { amount: "3d6", type: "psychic" }, keywords: [ "melee", "psychic" ] },
                      { name: "Telekinetic Grasp", usage: { frequency: "Encounter" }, target: { range: 5 }, toHit: 15, defense: "Fort", damage: "0", effects: [ { name: "Immobilized", saveEnds: true } ], keywords: [ "ranged" ] }
              ]
        },
        "Grimlock Ambusher": { 
            name: "Grimlock Ambusher", level: 11, image: "../images/portraits/grimlock.jpg",
            hp: { total: 110 },
            defenses: { ac: 26, fort: 25, ref: 23, will: 23 },
            init: 9, speed: { walk: 6 },
            abilities: { STR: 20, CON: 14, DEX: 14, INT: 9, WIS: 15, CHA: 9 },
            skills: { acrobatics: 0, arcana: 0, athletics: 15, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 7, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Greataxe", usage: { frequency: "At-Will" }, range: "melee", toHit: 16, defense: "AC", damage: "1d12+5", keywords: [ "melee", "basic" ] }
              ]
        },
        "Hethralga": { 
            name: "Hethralga", level: 12, image: "../images/portraits/night_hag.jpg",
            hp: { total: 126 },
            defenses: { ac: 26, fort: 25, ref: 24, will: 23 },
            init: 11, speed: 6,
            abilities: { STR: 21, CON: 22, DEX: 21, INT: 13, WIS: 18, CHA: 19 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 15, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 15, intimidate: 0, nature: 15, perception: 10, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Quarterstaff", usage: { frequency: "At-Will" }, range: "melee", toHit: 15, defense: "AC", damage: "1d10+5", keywords: [ "melee", "basic" ] },
                      { name: "Howl", usage: { frequency: "At-Will" }, range: "blast 3", toHit: 16, defense: "Fort", damage: { amount: "1d6+6", type: "thunder" }, keywords: [ "ranged" ] },
                      { name: "Shriek of Pain", usage: { frequency: "Encounter" }, range: "blast 5", toHit: 16, defense: "Fort", damage: { amount: "3d6+6", type: "thunder" }, keywords: [ "ranged", "miss half" ] },
                      { name: "Shriek of Pain (bloodied)", usage: { frequency: "Encounter" }, range: "blast 5", toHit: 16, defense: "Fort", damage: { amount: "3d6+11", type: "thunder" }, keywords: [ "ranged", "miss half" ] }
              ]
        },
        "Iquel, Githyanki Captain": { 
            name: "Iquel, Githyanki Captain", level: 13, image: "../images/portraits/iquel.jpg",
            hp: { total: 256 },
            defenses: { ac: 29, fort: 26, ref: 25, will: 25 },
            savingThrows: 2, 
            init: 11, speed: { walk: 6, jump: 8, teleport: 6 },
            abilities: { STR: 21, CON: 16, DEX: 12, INT: 18, WIS: 19, CHA: 16 },
            skills: { acrobatics: 0, arcana: 15, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 17, insight: 0, intimidate: 0, nature: 0, perception: 10, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Silver Greatsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "AC", damage: [ "1d10+6", { amount: "1d10", type: "psychic" } ], keywords: [ "melee", "psychic", "basic" ] },
                      { name: "Silver Greatsword (immobilized)", usage: { frequency: "At-Will" }, range: "melee", toHit: "automatic", defense: "AC", damage: { amount: "2d10", type: "psychic" }, keywords: [ "melee", "psychic" ] },
                      { name: "Mindhook", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 17, defense: "Will", damage: { amount: "2d8+3", type: "psychic" }, effects: [ "Marked" ], keywords: [ "ranged", "psychic", "basic" ] },
                      { name: "Psychic Upheaval", usage: { frequency: "Encounter" }, target: { area: "close burst", size: 3 }, toHit: 16, defense: "Fort", damage: { amount: "2d10+4", type: "psychic" }, effects: [ { name: "Immobilized", saveEnds: true } ], keywords: [ "ranged", "psychic" ] }
              ]
        },
        "Legion Devil Hellguard": { 
            name: "Legion Devil Hellguard", level: 11, image: "../images/portraits/legion_devil.jpg",
            hp: { total: 1 },
            defenses: { ac: 27, fort: 24, ref: 23, will: 21 },
            init: 8, speed: { walk: 6, teleport: 3 },
            abilities: { STR: 14, CON: 14, DEX: 12, INT: 10, WIS: 12, CHA: 12 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 6, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Longsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 16, defense: "AC", damage: "9", keywords: [ "melee", "basic" ] },
                      { name: "Longsword (aftereffect)", usage: { frequency: "At-Will", action: "Immediate Reaction" }, toHit: "automatic", defense: "AC", damage: { amount: "4", type: "fire" }, keywords: [ "fire" ] }
              ]
        },
        "Lingering Spectre": { 
            name: "Lingering Spectre", level: 12, image: "../images/portraits/spectre.jpg", // http://www.wizards.com/dnd/images/dx1003tt_spectre.jpg
            hp: { total: 66 },
            defenses: { ac: 26, fort: 23, ref: 25, will: 23 },
            immunities: [ "poison", "disease" ],
            resistances: { necrotic: 15 },
            vulnerabilities: { radiant: 5 },
            insubstantial: true,
            init: 16, speed: { fly: 6 }, //, flyAgility: "hover", phasing: true },
            abilities: { STR: 19, CON: 16, DEX: 22, INT: 10, WIS: 12, CHA: 19 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 12, religion: 0, stealth: 17, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Spectral Touch", usage: { frequency: "At-Will" }, range: "melee", toHit: 15, defense: "Ref", damage: { amount: "2d8+5", type: "necrotic" }, keywords: [ "melee", "basic", "necrotic" ] },
                      { name: "Spectral Barrage", usage: { frequency: "Recharge", recharge: 5 }, toHit: 15, defense: "Will", damage: { amount: "3d6", type: "psychic" }, effects: [ { name: "Prone" } ], keywords: [ "ranged", "illusion", "psychic" ] }
              ]
        },
        "Mezzodemon": { 
            name: "Mezzodemon", level: 11, image: "../images/portraits/mezzodemon.jpg",
            hp: { total: 113 },
            defenses: { ac: 27, fort: 25, ref: 22, will: 23 },
            init: 9, speed: { walk: 6 },
            abilities: { STR: 20, CON: 17, DEX: 15, INT: 10, WIS: 16, CHA: 13 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 11, nature: 0, perception: 13, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Trident", usage: { frequency: "At-Will" }, range: 2, toHit: 18, defense: "AC", damage: "1d8+5", keywords: [ "melee", "basic" ] },
                      { name: "Skewering Tines", usage: { frequency: "At-Will" }, range: 2, toHit: 18, defense: "AC", damage: "1d8+5", effects: [ { name: "multiple", saveEnds: true, children: [ { name: "Ongoing damage", amount: 5 }, "Restrained" ] } ], keywords: [ "ranged", "basic" ] },
                      { name: "Poison Breath", usage: { frequency: "Recharge", recharge: 5 }, range: "blast 3", toHit: 16, defense: "Fort", damage: { amount: "2d6+3", type: "poison" }, effects: [ { name: "Ongoing damage", type: "poison", amount: 5, saveEnds: true } ], keywords: [ "ranged", "poison" ] }
              ]
        },
        "Redspawn Firebelcher": { 
            name: "Redspawn Firebelcher", level: 12, image: "../images/portraits/redspawn_firebelcher.png", // http://images3.wikia.nocookie.net/__cb20100421223543/dndawokenheroes/images/9/93/Redspawn_Firebelcher.png
            hp: { total: 97 },
            defenses: { ac: 25, fort: 25, ref: 22, will: 21 },
            init: 7, speed: 4,
            abilities: { STR: 18, CON: 13, DEX: 19, INT: 2, WIS: 13, CHA: 8 },
            skills: { acrobatics: 10, arcana: 2, athletics: 10, bluff: 5, diplomacy: 7, dungeoneering: 2, endurance: 7, heal: 7, history: 2, insight: 7, intimidate: 5, nature: 7, perception: 6, religion: 7, stealth: 10, streetwise: 5, thievery: 10 },
            attacks: [
                      { name: "Bite", usage: { frequency: "At-Will" }, range: "melee", toHit: 16, defense: "AC", damage: { amount: "1d10+4", type: "fire" }, effects: [ { name: "ongoing damage", amount: 5, type: "fire", saveEnds: true } ], keywords: [ "melee", "fire", "basic" ] },
                      { name: "Fire Belch", usage: { frequency: "At-Will" }, target: { range: 12 }, toHit: 15, defense: "Ref", damage: { amount: "2d6+1", type: "fire" }, effects: [ { name: "ongoing damage", amount: 5, type: "fire", saveEnds: true } ], keywords: [ "ranged", "fire", "basic" ] },
                      { name: "Fire Burst", usage: { frequency: "Recharge", recharge: 5 }, target: { area: "burst", size: 2, range: 10 }, toHit: 15, defense: "Ref", damage: { amount: "3d6+1", type: "fire" }, effects: [ { name: "ongoing damage", amount: 5, type: "fire", saveEnds: true } ], miss: { halfDamage: true }, keywords: [ "ranged", "fire" ] }
              ]
        },
        "Rathoraiax": { 
            name: "Rathoraiax", level: 13, image: "../images/portraits/zombie_dragon.jpg", // http://4.bp.blogspot.com/-rclvSPUh9iM/ToBowVvsz_I/AAAAAAAADKI/wwQ5VTfwAeU/s1600/02-The-Dragons_Zombie-Dragon.jpg
            hp: { total: 328 },
            defenses: { ac: 27, fort: 29, ref: 22, will: 24 },
            resistances: { necrotic: 15 },
            vulnerabilities: { radiant: 15 },
            immunities: [ "disease", "poison" ],
            savingThrows: 2,
            init: 5, speed: { walk: 4, fly: 8 },
            abilities: { STR: 22, CON: 24, DEX: 9, INT: 1, WIS: 16, CHA: 3 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 9, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Claw", usage: { frequency: "At-Will" }, range: "reach", toHit: 16, defense: "AC", damage: "2d10+6", effects: [ "Prone"], keywords: [ "melee", "basic" ] },
                      { name: "Tail Crush", usage: { frequency: "At-Will" }, range: "reach", toHit: 14, defense: "Fort", damage: "3d8+6", keywords: [ "melee", "prone" ] },
                      { name: "Breath of the Grave", usage: { frequency: "Encounter" }, range: 5, toHit: 14, defense: "Fort", damage: { amount: "4d10+6", type: [ "poison", "necrotic" ] }, effects: [ { name: "multiple", saveEnds: true, children: [ { name: "Ongoing necrotic", amount: 10 }, "Weakened" ] } ], keywords: [ "close blast", "necrotic", "poison" ] },
                      { name: "Loose stones", usage: { frequency: "At-Will" }, range: 1, toHit: 14, defense: "Ref", damage: "2d6+10", effects: [ "Prone" ], keywords: [ "burst" ] }
              ]
        },
        "Scion of Chaos": { 
            name: "Scion of Chaos", level: 11, image: "../images/portraits/scion_of_chaos.jpg",
            hp: { total: 117 },
            defenses: { ac: 25, fort: 24, ref: 23, will: 24 },
            resistances: { acid: 10, fire: 10 },
            init: 9, speed: { walk: 6 },
            abilities: { STR: 17, CON: 21, DEX: 19, INT: 16, WIS: 19, CHA: 21 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 9, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Slam", usage: { frequency: "At-Will" }, range: "melee", toHit: 16, defense: "AC", damage: { amount: "2d8+4", type: "fire" }, keywords: [ "melee", "fire", "basic" ] },
                      { name: "Staggering Strike", usage: { frequency: "At-Will" }, range: 20, toHit: 14, defense: "Fort", damage: "2d6+6", keywords: [ "ranged" ] },
                      { name: "Coils of Immobility", usage: { frequency: "Recharge", recharge: 5 }, target: { area: "burst", size: 2, range: 10 }, toHit: 13, defense: "Ref", damage: "2d8+4", effects: [ { name: "Restrained", saveEnds: true } ], keywords: [ "ranged" ] }
              ]
        },
        "Sarshan": { 
            name: "Sarshan", level: 12, image: "../images/portraits/sarshan.png", // http://www.striemer.org/scales-of-war/images/sarshan.png
            hp: { total: 650 },
            defenses: { ac: 28, fort: 25, ref: 26, will: 25 },
            resistances: { acid: 20 },
            savingThrows: 5,
            init: 10, speed: { walk: 5, teleport: 6 },
            abilities: { STR: 31, CON: 26, DEX: 19, INT: 17, WIS: 18, CHA: 17 },
            skills: { acrobatics: 0, arcana: 23, athletics: 0, bluff: 0, diplomacy: 23, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 15, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Blood Chaos aura", usage: { frequency: "At-Will" }, target: { area: "aura", size: 1 }, toHit: "automatic", defense: "AC", damage: "0", effects: [ { name: "ongoing damage", amount: 10, type: "acid", saveEnds: true } ], keywords: [ "aura" ] },
                      { name: "Katar", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: "1d10+6", effects: [ { name: "ongoing damage", amount: 5, type: "acid", saveEnds: true } ], keywords: [ "melee", "basic" ] },
                      { name: "Shadow Attack", usage: { frequency: "Recharge", recharge: 5 }, range: "melee", toHit: 17, defense: "AC", damage: "1d10+6", effects: [ { name: "ongoing damage", amount: 5, type: "acid", saveEnds: true } ], keywords: [ "melee" ] },
                      { name: "Blood Chaos Flare", usage: { frequency: "At-Will" }, target: { area: "close blast", size: 5 }, toHit: 16, defense: "Fort", damage: "0", effects: [ { name: "ongoing damage", amount: 10, type: "acid", saveEnds: true } ], keywords: [ "acid" ] },
                      { name: "Chaos Nova", usage: { frequency: "Recharge", recharge: 6 }, target: { area: "close burst", size: 1 }, toHit: 15, defense: "Fort", damage: { amount: "4d10+5", type: "acid" }, miss: { halfDamage: true }, keywords: [ "melee" ] },
                      { name: "Chaos Scream", usage: { frequency: "Encounter" }, target: { area: "close blast", size: 5 }, toHit: 16, defense: "Fort", damage: "0", effects: [ { name: "ongoing damage", amount: 10, type: "acid", saveEnds: true } ], keywords: [ "acid" ] }
              ]
        },
        "Shadar-kai Warrior": { 
            name: "Shadar-kai Warrior", level: 8, image: "../images/portraits/shadar_kai_warrior.png",
            hp: { total: 86 },
            defenses: { ac: 24, fort: 19, ref: 20, will: 17 },
            init: 11, speed: { walk: 5, teleport: 3 },
            abilities: { STR: 17, CON: 14, DEX: 20, INT: 12, WIS: 14, CHA: 11 },
            skills: { acrobatics: 15, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 6, religion: 0, stealth: 15, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Katar", usage: { frequency: "At-Will" }, range: "melee", toHit: 13, defense: "AC", damage: "1d6+3", keywords: [ "melee", "basic" ] },
                      { name: "Cage of Gloom", usage: { frequency: "Recharge", recharge: 5 }, range: "melee", toHit: 13, defense: "AC", damage: "1d6+3", keywords: [ "melee" ] },
                      { name: "Cage of Gloom (secondary)", usage: { frequency: "At-Will" }, range: "melee", toHit: 11, defense: "Ref", damage: "0", effects: [ { name: "Restrained", saveEnds: true } ], keywords: [ "melee" ] }
              ]
        },
        "Shadar-kai Witch": { 
            name: "Shadar-kai Witch", level: 13, image: "../images/portraits/shadar_kai_witch.jpg",
            hp: { total: 272 },
            defenses: { ac: 30, fort: 27, ref: 29, will: 25 },
            init: 11, speed: { walk: 6, teleport: 3 },
            abilities: { STR: 13, CON: 13, DEX: 16, INT: 19, WIS: 12, CHA: 17 },
            skills: { acrobatics: 8, arcana: 12, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 4, religion: 12, stealth: 13, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Blackfire Touch", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "Ref", damage: { amount: "2d8+6", type: "fire and necrotic" }, keywords: [ "melee", "fire", "necrotic", "fire and necrotic", "basic" ] },
                      { name: "Beshadowed Mind", usage: { frequency: "Recharge", recharge: 4 }, range: 10, toHit: 18, defense: "Will", damage: { amount: "3d6+6", type: "necrotic" }, effects: [ { name: "blinded", saveEnds: true } ], keywords: [ "melee", "necrotic" ] },
                      { name: "Deep Shadow", usage: { frequency: "At-Will" }, range: 2, toHit: "automatic", defense: "AC", damage: { amount: "5", type: "necrotic" }, keywords: [ "aura", "necrotic" ] },
                      { name: "Ebon Burst", usage: { frequency: "Encounter" }, target: { area: "close burst", size: 2 }, toHit: 18, defense: "Ref", damage: "2d8+6", effects: [ { name: "Slowed", duration: "endAttackerNext" } ], keywords: [ "ranged" ] }
              ]
        },
        "Skulking Terror": { 
            name: "Skulking Terror", level: 11, image: "../images/portraits/skulking_terror.png",
            hp: { total: 83 },
            defenses: { ac: 25, fort: 21, ref: 23, will: 21 },
            init: 13, speed: { walk: 6, fly: 6 },
            abilities: { STR: 14, CON: 11, DEX: 19, INT: 13, WIS: 13, CHA: 12 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 11, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Slam", usage: { frequency: "At-Will" }, range: "melee", toHit: 16, defense: "AC", damage: "2d6+6", keywords: [ "melee", "basic" ] },
                      { name: "Slam [combat advantage]", usage: { frequency: "At-Will" }, range: "melee", toHit: 16, defense: "AC", damage: "4d6+6", keywords: [ "melee", "basic" ] },
                      { name: "Lethargic Countenance", usage: { frequency: "At-Will" }, target: { area: "blast", size: 1 }, toHit: 12, defense: "Will", damage: "0", effects: [ { name: "Slowed", duration: "endAttackerNext" }, { name: "combat advantage", duration: "endAttackerNext" } ], keywords: [ "ranged" ] }
              ]
        },
        "Slaad Guard": { 
            name: "Slaad Guard", level: 8, image: "../images/portraits/flux_slaad.jpg",
            hp: { total: 98 },
            defenses: { ac: 23, fort: 23, ref: 21, will: 21 },
            init: 8, speed: { walk: 7, teleport: 2 },
            abilities: { STR: 16, CON: 18, DEX: 15, INT: 7, WIS: 13, CHA: 14 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 10, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Claw Slash", usage: { frequency: "At-Will" }, range: "melee", toHit: 14, defense: "AC", damage: "2d8+3", keywords: [ "melee", "basic" ] }
              ]
        },
        "Slaad Midwife": { 
            name: "Slaad Midwife", level: 7, image: "../images/portraits/slaad_midwife.jpg",
            hp: { total: 70 },
            defenses: { ac: 20, fort: 19, ref: 17, will: 17 },
            init: 7, speed: 5,
            abilities: { STR: 16, CON: 18, DEX: 15, INT: 7, WIS: 13, CHA: 14 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 10, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Claw", usage: { frequency: "At-Will" }, range: "melee", toHit: 11, defense: "AC", damage: "1d6+10", keywords: [ "melee", "basic" ] },
                      { name: "Fiery Spines", usage: { frequency: "Recharge", recharge: 5 }, range: "close blast 5", toHit: 9, defense: "Ref", damage: { amount: "2d8+8", type: "fire" }, effects: [ { name: "Ongoing poison", amount: 5, type: "poison", saveEnds: true } ], keywords: [ "close blast" ] }
              ]
        },
        "Slaad Tadpole": { 
            name: "Slaad Tadpole", level: 5, image: "../images/portraits/slaad_tadpole.jpg",
            hp: { total: 44 },
            defenses: { ac: 21, fort: 18, ref: 20, will: 18 },
            init: 7, speed: 4,
            abilities: { STR: 6, CON: 8, DEX: 12, INT: 3, WIS: 9, CHA: 7 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 6, religion: 0, stealth: 8, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Bite", usage: { frequency: "At-Will" }, range: "melee", toHit: 10, defense: "AC", damage: "1d8", keywords: [ "melee", "basic" ] }
              ]
        },
        "Skull Lord Servitor": { 
            name: "Skull Lord Servitor", level: 14, image: "../images/portraits/skull_lord_servitor.jpg",
            hp: { total: 55 },
            defenses: { ac: 28, fort: 25, ref: 26, will: 27 },
            immunities: [ "disease", "poison" ],
            vulnerabilities: { radiant: 5 },
            resistances: { necrotic: 10 },
            init: 12, speed: 6,
            abilities: { STR: 14, CON: 19, DEX: 18, INT: 17, WIS: 16, CHA: 23 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 18, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 15, intimidate: 18, nature: 0, perception: 10, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Bone Staff", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: [ "1d8+4", { amount: "1d6", type: "necrotic" } ], keywords: [ "melee", "basic", "necrotic" ] },
                      { name: "Skull of Bonechilling Fear", usage: { frequency: "At-Will" }, range: 10, toHit: 19, defense: "Will", damage: { amount: "1d10+3", type: "cold" }, keywords: [ "ranged", "cold", "fear" ] },
                      { name: "Skull of Withering Flame", usage: { frequency: "At-Will" }, range: 10, toHit: 19, defense: "Fort", damage:  { amount: "2d6+5", type: "fire and necrotic" }, keywords: [ "ranged", "fire", "necrotic" ] }
              ]
        },
        "Slystone Dwarf Ruffian": { 
            name: "Slystone Dwarf Ruffian", level: 10, image: "../images/portraits/slystone_dwarf.jpg",
            hp: { total: 104 },
            defenses: { ac: 26, fort: 23, ref: 22, will: 21 },
            init: 12, speed: 6,
            abilities: { STR: 18, CON: 16, DEX: 21, INT: 11, WIS: 11, CHA: 18 },
            skills: { acrobatics: 0, arcana: 0, athletics: 14, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 5, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Hammer", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: "2d6+5", effects: [ "Marked" ], keywords: [ "melee", "basic" ] },
                      { name: "Hammer (charge)", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: "2d6+5", effects: [ "Marked", "Prone" ], keywords: [ "melee" ] },
                      { name: "Mighty Strike", usage: { frequency: "Recharge", recharge: 5 }, range: "melee", toHit: 17, defense: "AC", damage: "3d8+5", keywords: [ "melee" ] },
                      { name: "Mighty Strike (charge)", usage: { frequency: "Recharge", recharge: 5 }, range: "melee", toHit: 17, defense: "AC", damage: "3d8+5", effects: [ "Prone" ], keywords: [ "melee" ] }
              ]
        },
        "Spitting Troll": { 
            name: "Spitting Troll", level: 10, image: "../images/portraits/spitting_troll.jpg", // "http://www.wizards.com/dnd/images/dx20050907a_91226.jpg",
            hp: { total: 106, regeneration: 10 },
            defenses: { ac: 26, fort: 22, ref: 22, will: 23 },
            init: 12, speed: { walk: 6, climb: 4 },
            abilities: { STR: 16, CON: 18, DEX: 21, INT: 10, WIS: 17, CHA: 13 },
            skills: { acrobatics: 0, arcana: 0, athletics: 13, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 14, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 8, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Claw", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: [ "1d6+5", { amount: "1d6", type: "poison" } ], keywords: [ "melee", "basic" ] },
                      { name: "Javelin", usage: { frequency: "At-Will" }, range: "ranged", toHit: 17, defense: "AC", damage: [ "1d6+5", { amount: "1d6", type: "poison" } ], keywords: [ "ranged", "basic" ] },
                      { name: "Acid Spit", usage: { frequency: "At-Will" }, range: "ranged", toHit: 15, defense: "Ref", damage: { amount: "1d6", type: "acid" }, keywords: [ "ranged" ] }
              ]
        },
        "Storm Abishai Sniper": {
            name: "Storm Abishai Sniper", level: 12, image: "../images/portraits/storm_abishai.jpg",
            hp: { total: 98 },
            regeneration: 5,
            defenses: { ac: 24, fort: 24, ref: 24, will: 22 },
            init: 9, speed: { walk: 8, fly: 6 },
            abilities: { STR: 18, CON: 20, DEX: 16, INT: 11, WIS: 13, CHA: 21 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 23, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Lightning Sting", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: { amount: "2d6+7", type: "lightning" }, keywords: [ "melee", "basic", "lightning" ] },
                      { name: "Lightning Discharge", usage: { frequency: "Encounter" }, target: { area: "close burst", size: 1, range: 1 }, toHit: 17, defense: "Ref", damage: { amount: "1d6+8", type: "lightning" }, effects: [ { name: "Stunned", duration: "endTargetNext" } ], keywords: [ "close burst", "lightning" ] },
                      { name: "Shockbolt", usage: { frequency: "At-Will" }, target: { area: "burst", size: 2, range: 10 }, toHit: 15, defense: "Ref", damage: { amount: "2d6+8", type: "thunder" }, keywords: [ "ranged", "burst", "lightning" ] }
              ]
        },
        "Streetwise Thug": { 
            name: "Streetwise Thug", level: 9, image: "../images/portraits/streetwise_thug.gif", // "http://images.community.wizards.com/community.wizards.com/user/grawln/party_pics/characters/0ff3a392aa7b3d1450c59c8f0cb9552c.gif?v=196240",
            hp: { total: 1 },
            defenses: { ac: 21, fort: 19, ref: 16, will: 16 },
            init: 3, speed: 6,
            abilities: { STR: 16, CON: 15, DEX: 12, INT: 9, WIS: 10, CHA: 11 },
            skills: { acrobatics: 0, arcana: 0, athletics: 11, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 3, religion: 0, stealth: 0, streetwise: 0, thievery: 8 },
            attacks: [
                      { name: "Longsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 14, defense: "AC", damage: "6", keywords: [ "melee", "basic" ] },
                      { name: "Crossbow", usage: { frequency: "At-Will" }, range: "ranged", toHit: 13, defense: "AC", damage: "6", keywords: [ "ranged", "basic" ] }
              ]
        },
        "Thaggriel, Githyanki Dragonknight": { 
            name: "Thaggriel, Githyanki Dragonknight", level: 14, image: "../images/portraits/thaggriel.png",
            hp: { total: 272 },
            defenses: { ac: 28, fort: 27, ref: 27, will: 26 },
            init: 16, speed: { walk: 5 },
            abilities: { STR: 21, CON: 16, DEX: 20, INT: 16, WIS: 18, CHA: 14 },
            skills: { acrobatics: 17, arcana: 0, athletics: 17, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 11, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Psychic Lance", usage: { frequency: "At-Will" }, range: "reach", toHit: 19, defense: "AC", damage: { amount: "2d10+5", type: "psychic" }, keywords: [ "melee", "psychic", "basic" ] },
                      { name: "Silver Bastard Sword", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: [ "1d10+5", { amount: "1d10", type: "psychic" } ], keywords: [ "melee", "psychic", "basic" ] },
                      { name: "Mindslice", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 17, defense: "Will", damage: { amount: "2d8+3", type: "psychic" }, keywords: [ "ranged", "psychic" ] },
                      { name: "Hatred's Juggernaught", usage: { frequency: "Recharge", recharge: 6 }, range: "reach", toHit: 19, defense: "AC", damage: { amount: "2d10+5", type: "psychic" }, keywords: [ "melee", "psychic" ] }
              ]
        },
        "Troglodyte Warrior": { 
            name: "Troglodyte Warrior", level: 12, image: "../images/portraits/troglodyte.jpg",
            hp: { total: 1 },
            defenses: { ac: 25, fort: 25, ref: 22, will: 21 },
            init: 6, speed: 5,
            abilities: { STR: 18, CON: 16, DEX: 12, INT: 6, WIS: 11, CHA: 8 },
            skills: { acrobatics: 0, arcana: 0, athletics: 15, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 14, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 6, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Club", usage: { frequency: "At-Will" }, toHit: 15, defense: "AC", damage: "7", keywords: [ "melee", "basic" ] }
              ]
        },
        "Troll": { 
            name: "Troll", level: 9, image: "../images/portraits/troll.jpg", // "http://www.wizards.com/dnd/images/MM35_gallery/MM35_PG248a.jpg",
            hp: { total: 100, regeneration: 10 },
            defenses: { ac: 20, fort: 21, ref: 18, will: 17 },
            init: 7, speed: 8,
            abilities: { STR: 22, CON: 20, DEX: 18, INT: 5, WIS: 14, CHA: 9 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 6, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Claw", usage: { frequency: "At-Will" }, range: "reach", toHit: 13, defense: "AC", damage: "2d6+6", keywords: [ "melee", "basic" ] }
              ]
        },
        "Two-Headed Troll": { 
            name: "Two-Headed Troll", level: 10, image: "../images/portraits/two_headed_troll.jpg",
            hp: { total: 264, regeneration: 10 },
            defenses: { ac: 25, fort: 27, ref: 19, will: 20 },
            savingThrows: 2,
            init: 5, speed: 6,
            abilities: { STR: 24, CON: 22, DEX: 10, INT: 6, WIS: 14, CHA: 10 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 7, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Claw", usage: { frequency: "At-Will" }, range: "reach", toHit: 13, defense: "AC", damage: "3d6+7", keywords: [ "melee", "basic" ] },
                      { name: "Smackdown", usage: { frequency: "At-Will" }, range: "reach", toHit: 11, defense: "Fort", damage: "0", effects: [ "Prone" ], keywords: [ "melee" ] }
              ]
        },
        "Wailing Ghost": { 
            name: "Wailing Ghost", level: 12, image: "../images/portraits/wailing_ghost.png", // http://varlaventura.files.wordpress.com/2013/03/banshee-counterparts-e1364401380806.jpg 
            hp: { total: 91 },
            defenses: { ac: 23, fort: 23, ref: 23, will: 24 },
            immunities: [ "disease", "poison" ],
            insubstantial: true, // TODO: respect insubstantial in combat
            init: 8, speed: { fly: 6 }, //, flyAgility: "hover", phasing: true },
            abilities: { STR: 14, CON: 13, DEX: 15, INT: 10, WIS: 14, CHA: 17 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 17, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 13, religion: 0, stealth: 13, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Spirit Touch", usage: { frequency: "At-Will" }, toHit: 15, defense: "Ref", damage: { amount: "1d10+2", type: "necrotic" }, keywords: [ "melee", "basic" ] },
                      { name: "Death's Visage", usage: { frequency: "At-Will" }, range: 5, toHit: 15, defense: "Will", damage: { amount: "2d6+3", type: "psychic" }, effects: [ { name: "penalty to all defenses", amount: -2, saveEnds: true } ], keywords: [ "ranged", "fear", "psychic" ] },
                      { name: "Terrifying Shriek", usage: { frequency: "Recharge", recharge: 5 }, target: { area: "close burst", size: 5 }, toHit: 15, defense: "Will", damage: { amount: "2d8+3", type: "psychic" }, effects: [ { name: "Immobilized", saveEnds: true } ], keywords: [ "close burst", "fear", "psychic" ] }
              ]
        },
        "War Troll": { 
            name: "War Troll", level: 14, image: "../images/portraits/war_troll.jpg", // http://www.wizards.com/dnd/images/iw_war_troll.jpg
            hp: { total: 110, regeneration: 10 },
            defenses: { ac: 30, fort: 29, ref: 25, will: 25 },
            init: 12, speed: 7,
            abilities: { STR: 24, CON: 20, DEX: 16, INT: 10, WIS: 16, CHA: 12 },
            skills: { acrobatics: 0, arcana: 0, athletics: 15, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 17, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 15, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Greatsword", usage: { frequency: "At-Will" }, range: "reach", toHit: 20, defense: "AC", damage: "1d12+7", effects: [ { name: "Marked", duration: "endAttackerNext" } ], keywords: [ "melee", "basic" ] },
                      { name: "Claw", usage: { frequency: "At-Will" }, range: "reach", toHit: 20, defense: "AC", damage: "2d6+7", keywords: [ "melee" ] },
                      { name: "Longbow", usage: { frequency: "At-Will" }, range: 20, toHit: 20, defense: "AC", damage: "1d12+3", keywords: [ "ranged", "basic" ] },
                      { name: "Sweeping Strike", usage: { frequency: "At-Will" }, range: 2, toHit: 20, defense: "AC", damage: "1d12+7", effects: [ "Prone" ], keywords: [ "melee", "close blast" ] }
              ]
        },
        "Xirakis, Adult Pact Dragon": {        
            name: "Xirakis, Adult Pact Dragon", level: 13, image: "../images/portraits/xirakis.jpg",
            hp: { total: 268 },
            defenses: { ac: 29, fort: 28, ref: 27, will: 25 },
            resistances: { fire: 10, psychic: 10 },
            init: 13, speed: { walk: 7, fly: 10 },
            abilities: { STR: 24, CON: 22, DEX: 20, INT: 15, WIS: 18, CHA: 16 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 14, dungeoneering: 0, endurance: 17, heal: 0, history: 0, insight: 15, intimidate: 0, nature: 0, perception: 15, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Bite", usage: { frequency: "At-Will" }, range: "reach", toHit: 18, defense: "AC", damage: "2d6+7", keywords: [ "melee", "basic" ] },
                      { name: "Claw", usage: { frequency: "At-Will" }, range: "reach", toHit: 18, defense: "AC", damage: "1d8+7", keywords: [ "melee", "basic" ] },
                      { name: "Ripping Charger (Bite)", usage: { frequency: "At-Will" }, range: "reach", toHit: 18, defense: "AC", damage: "2d6+7", keywords: [ "melee" ] },
                      { name: "Ripping Charger (Claw)", usage: { frequency: "At-Will" }, range: "reach", toHit: 18, defense: "AC", damage: "1d8+7", keywords: [ "melee" ] },
                      { name: "Wing Buffet", usage: { frequency: "At-Will", action: "Immediate Reaction" }, range: "melee", toHit: 15, defense: "Fort", damage: "1d10+7", effects: [ "Prone" ], keywords: [ "melee" ] },
                      { name: "Skirmish", usage: { frequency: "At-Will" }, range: "melee", toHit: "automatic", defense: "AC", damage: "2d6", keywords: [ "melee", "striker", "skirmish" ] },
                      { name: "Breath Weapon", usage: { frequency: "Recharge", recharge: 5 }, target: { area: "close blast", size: 5 }, toHit: 15, defense: "Ref", damage: { amount: "3d12+12", type: "fire" }, effects: [ { name: "ongoing damage", amount: 5, type: "fire", saveEnds: true } ], keywords: [ "close blast", "fire" ] }
              ]
        },
        "Zithiruun, the Broken General": { 
            name: "Zithiruun, the Broken General", level: 14, image: "../images/portraits/zithiruun.jpg", // http://cdn.obsidianportal.com/images/145622/zith.jpg
            hp: { total: 280 },
            defenses: { ac: 30, fort: 26, ref: 29, will: 28 },
            savingThrows: { general: 2, charm: 4 },
            init: 15, speed: { walk: 6, fly: 5 },
            abilities: { STR: 6, CON: 6, DEX: 23, INT: 19, WIS: 15, CHA: 20 },
            skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 9, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
            attacks: [
                      { name: "Silver Saber", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: { amount: "2d8+6", type: "psychic" }, keywords: [ "melee", "psychic", "weapon", "basic" ] },
                      { name: "Thrown Saber", usage: { frequency: "At-Will" }, range: 5, toHit: 19, defense: "AC", damage: { amount: "2d8+6", type: "psychic" }, keywords: [ "ranged", "thrown", "psychic", "weapon" ] },
                      { name: "Silver Flurry", usage: { frequency: "Recharge", recharge: 5 }, range: "melee", toHit: 19, defense: "AC", damage: { amount: "4d8+6", type: "psychic" }, keywords: [ "melee", "psychic", "weapon" ] }
              ]
        }
    };
}