describe("monsters.js", function() {
	describe("When loadMonsters() is invoked it should return ", function() {
		var description, monsters;
		it("a syntactically valid JSON Object", function() {
			monsters = loadMonsters();
			expect(typeof(monsters)).toEqual("object");
		});
		
		monsters = loadMonsters();
		Test.nonEmptyObject(monsters);
		
		describe(description = " an Object where each property", function() {
			var keys, i, key, monster;			
			keys = Object.keys(monsters);
			
			for (i = 0; i < keys.length; i++) {
				key = keys[ i ];
			
				Test.nonEmptyString(key, "key");

				monster = monsters[ key ];
				it("value is a Creature definition", function() {
					expect(typeof(monster)).toEqual("object");
				});
				it("key is the corresponding Creature definition's name", function() {
					expect(monster.hasOwnProperty("name")).toEqual(true);
					expect(monster.name).toEqual(key);
				});
				
				describe("value is a Creature definition that has", function() {
					it("isPC: false", function() {
						if (monster.hasOwnProperty("isPC")) {
							expect(monster.isPC).toEqual(false);
						}
					});
					Test.hasMinMaxNumberProperty(monster, "level", 1, 30, monster.name);
					Test.hasNonEmptyStringProperty(monster, "image", monster.name);
					
					Test.hasObjectProperty(monster, "abilities", monster.name);
					describe("abilities: Object of the form", function() {
						var abilities, a;
						abilities = { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 };
						for (a in abilities) {
							Test.hasPositiveNumberProperty(monster.abilities, a, monster.name);
						}
					});
					
					Test.hasObjectProperty(monster, "skills", monster.name);
					describe("skills: Object of the form", function() {
						var skills, s;
						skills = { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 0, religion: 0, stealth: 0, streetwise: 0, thievery: 0 };
						for (s in skills) {
							Test.hasNumberProperty(monster.skills, s, monster.name);
						}
					});
					
					Test.hasObjectProperty(monster, "hp", monster.name);
					describe("hp: Object of the form", function() {
						Test.hasPositiveNumberProperty(monster.hp, "total", monster.name);
					});
					
					if (monster.hasOwnProperty("surges")) {
						Test.hasObjectProperty(monster, "surges", monster.name);
						describe("surges: Object of the form", function() {
							Test.hasNumberProperty(monster.surges, "perDay", monster.name);
						});
					}
					
					Test.hasObjectProperty(monster, "defenses", monster.name);
					describe("defenses: Object of the form", function() {
						Test.hasPositiveNumberProperty(monster.defenses, "ac", monster.name);
						Test.hasPositiveNumberProperty(monster.defenses, "fort", monster.name);
						Test.hasPositiveNumberProperty(monster.defenses, "ref", monster.name);
						Test.hasPositiveNumberProperty(monster.defenses, "will", monster.name);
					});
					
					if (monster.hasOwnProperty("resistances")) {
						Test.hasObjectProperty(monster, "resistances", monster.name);
						describe("resistances: Object of the form", function() {
							var j;
							for (j in monster.resistances) {
								Test.hasPositiveNumberProperty(monster.resistances, j, monster.name);
							}
						});
					}
					
					Test.hasNumberProperty(monster, "init", monster.name);
					Test.hasValidSpeed(monster, monster.name);
					
					if (monster.hasOwnProperty("weapons")) {
						Test.hasArrayProperty(monster, "weapons", monster.name);
						if (monster.weapons && monster.weapons.length) {
							describe("weapons: Array of Object of the form", function() {
								var j, weapon;
								for (j = 0; j < monster.weapons.length; j++) {
									weapon = monster.weapons[ j ];
									Test.hasNonEmptyStringProperty(weapon, "name", monster.name);
									Test.hasBooleanProperty(weapon, "isMelee", monster.name + " " + weapon.name);
									Test.hasNumberProperty(weapon, "proficiency", monster.name + " " + weapon.name);
									Test.hasNumberProperty(weapon, "enhancement", monster.name + " " + weapon.name);
									Test.hasObjectProperty(weapon, "damage", monster.name + " " + weapon.name);
									Test.hasNonEmptyStringProperty(weapon.damage, "amount", monster.name + " " + weapon.name);
									Test.hasNonEmptyStringProperty(weapon.damage, "crit", monster.name + " " + weapon.name);
								}
							});
						}
					}
					
					if (monster.hasOwnProperty("implements")) {
						Test.hasArrayProperty(monster, "implements", monster.name);
						if (monster[ "implements" ] && monster[ "implements" ].length) {
							describe("implements: Array of Object of the form", function() {
								var j, implement;
								for (j = 0; j < monster[ "implements" ].length; j++) {
									implement = monster[ "implements" ][ j ];
									Test.hasNonEmptyStringProperty(implement, "name", monster.name);
									Test.hasNumberProperty(implement, "enhancement", monster.name + " " + implement.name);
									Test.hasNonEmptyStringProperty(implement, "crit", monster.name + " " + implement.name);
								}
							});
						}
					}
					
					if (monster.hasOwnProperty("attackBonuses")) {
						Test.hasArrayProperty(monster, "attackBonuses", monster.name);
						if (monster.attackBonuses && monster.attackBonuses.length) {
							describe("attackBonuses: Array of Object of the form", function() {
								var j, attackBonus, extra;
								for (j = 0; j < monster.attackBonuses.length; j++) {
									attackBonus = monster.attackBonuses[ j ];
									Test.hasNonEmptyStringProperty(attackBonus, "name", monster.name);
									extra = monster.name + " " + attackBonus.name;
									if (!attackBonus.hasOwnProperty("toHit") && !attackBonus.hasOwnProperty("damage") && !attackBonus.hasOwnProperty("effects")) {
										it("toHit or damage or effects", function() {
											expect(null).toEqual("something [" + extra + "]");
										});
									}
									if (attackBonus.hasOwnProperty("toHit")) {
										Test.hasNumberProperty(attackBonus, "toHit", extra);
									}
									if (attackBonus.hasOwnProperty("damage")) {
										if (typeof(attackBonus.damage) === "number") {
											Test.hasNumberProperty(attackBonus, "damage", extra);
										}
										else {
											Test.hasNonEmptyStringProperty(attackBonus, "damage", extra);
										}
									}
									Test.hasValidEffects(attackBonus, false, extra);
									Test.hasValidKeywords(attackBonus, false, extra);
									if (attackBonus.hasOwnProperty("status")) {
										Test.hasNonEmptyArrayProperty(attackBonus, "status", monster.name + " " + attackBonus.name);
										it("status: Array of String [" + monster.name + " " + attackBonus.name + "]", (function(ab) {
											var j;
											for (j = 0; j < ab.status.length; j++) {
												expect(ab.status[ j ].length).not.toEqual(0);
											}
										}).bind(this, attackBonus));
									}
									if (attackBonus.hasOwnProperty("foeCondition")) {
										Test.hasNonEmptyArrayProperty(attackBonus, "status", monster.name + " " + attackBonus.name);
										it("foeCondition: Array of String [" + monster.name + " " + attackBonus.name + "]", (function(ab) {
											var j;
											for (j = 0; j < ab.foeCondition.length; j++) {
												expect(ab.foeCondition[ j ].length).not.toEqual(0);
											}
										}).bind(this, attackBonus));
									}
									if (attackBonus.hasOwnProperty("defense")) {
										Test.hasNonEmptyStringProperty(attackBonus, "defense", monster.name + " " + attackBonus.name);
									}
								}
							});
						}
					}
					
					Test.hasNonEmptyArrayProperty(monster, "attacks", monster.name);
					describe("attacks: Array of Object of the form", function() {
						var j, attack, toHitRegEx, extra, hasMeleeBasic, hasRangedBasic;
						toHitRegEx = /^(automatic|(STR)?[/^]?(CON)?[/^]?(DEX)?[/^]?(INT)?[/^]?(WIS)?[/^]?(CHA)?[/^]?[+-]?\d*)$/;
						hasMeleeBasic = false;
						hasRangedBasic = false;
						for (j = 0; j < monster.attacks.length; j++) {
							attack = monster.attacks[ j ];
							Test.hasNonEmptyStringProperty(attack, "name", monster.name);
							extra = monster.name + " " + attack.name;
							Test.hasNonEmptyObjectProperty(attack, "usage", extra);
							it("usage: { frequency: \"At-Will\" | \"Encounter\" | \"Daily\" | \"Recharge\" } [" + extra + "]", (function(a) {
								var valid = [ "At-Will", "Encounter", "Daily", "Recharge" ];
								expect(valid.indexOf(a.usage.frequency)).not.toEqual(-1);
							}).bind(this, attack));
							if (attack.usage.frequency === "Recharge") {
								Test.hasPositiveNumberProperty(attack.usage, "recharge", "[" + extra + "]");
							}
							
							it("toHit: Number | \"{valid expression}\" [" + extra + "]", (function(a) {
								expect(a.hasOwnProperty("toHit")).toEqual(true);
								expect(typeof(a.toHit) === "number" || typeof(a.toHit) === "string").toEqual(true);
								if (typeof(a.toHit) === "string") {
									expect(toHitRegEx.test(a.toHit)).toEqual(true);
								}
							}).bind(this, attack));
							
							it("defense: \"AC\" | \"Fort\" | \"Ref\" | \"Will\" [" + extra + "]", (function(a) {
								var valid = [ "AC", "Fort", "Ref", "Will" ];
								expect(valid.indexOf(a.defense)).not.toEqual(-1);
							}).bind(this, attack));
							
							Test.hasValidDamage(attack, extra);
							
							if (attack.hasOwnProperty("miss")) {
								Test.hasNonEmptyObjectProperty(attack, "miss", extra);
								describe("miss: Object of the form", function() {
									var miss = attack.miss;
									if (miss.hasOwnProperty("halfDamage")) {
										it("halfDamage: true [" + extra + "]", (function(m) {
											expect(m.halfDamage).toEqual(true);
										}).bind(this, miss));
									}
									if (miss.hasOwnProperty("damage")) {
										Test.hasValidDamage(miss, extra);
									}
									Test.hasValidEffects(miss, false, extra);
								});
							}
							
							Test.hasValidEffects(attack, false, extra);
							Test.hasValidKeywords(attack, false, extra);
							
							if (attack.hasOwnProperty("keywords") && attack.keywords.indexOf("basic") !== -1) {
								if (attack.keywords.indexOf("melee") !== -1) {
									hasMeleeBasic = true;
								}
								else if (attack.keywords.indexOf("ranged") !== -1) {
									hasRangedBasic = true;
								}
							}
						}
						it("has melee basic attack [" + monster.name + "]", function() {
							expect(hasMeleeBasic).toEqual(true); 
						});
//						it("has ranged basic attack [" + monster.name + "]", function() {
//							expect(hasRangedBasic).toEqual(true); 
//						});
					});
					
					// TODO: attack target tests
				});
			}
		});
		
	});
});