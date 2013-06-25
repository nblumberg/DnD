describe("party.js", function() {
	describe("When loadParty() is invoked it should return ", function() {
		var description, party;
		it("a syntactically valid JSON Object", function() {
			party = loadParty();
			expect(typeof(party)).toEqual("object");
		});
		
		party = loadParty();
		Test.nonEmptyObject(party);
		
		describe(description = " an Object where each property", function() {
			var keys, i, key, member;			
			keys = Object.keys(party);
			
			for (i = 0; i < keys.length; i++) {
				key = keys[ i ];
			
				Test.nonEmptyString(key, "key");

				member = party[ key ];
				it("value is a Creature definition", function() {
					expect(typeof(member)).toEqual("object");
				});
				it("key is the corresponding Creature definition's name", function() {
					expect(member.hasOwnProperty("name")).toEqual(true);
					expect(member.name).toEqual(key);
				});
				
				describe("value is a Creature definition that has", function() {
					it("isPC: true", function() {
						expect(member.hasOwnProperty("isPC")).toEqual(true);
						expect(member.isPC).toEqual(true);
					});
					Test.hasMinMaxNumberProperty(member, "level", 1, 30, member.name);
					Test.hasNonEmptyStringProperty(member, "image", member.name);
					
					Test.hasObjectProperty(member, "abilities", member.name);
					describe("abilities: Object of the form", function() {
						var abilities, a;
						abilities = { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 };
						for (a in abilities) {
							Test.hasPositiveNumberProperty(member.abilities, a, member.name);
						}
					});
					
					Test.hasObjectProperty(member, "skills", member.name);
					describe("skills: Object of the form", function() {
						var skills, s;
						skills = { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 0, religion: 0, stealth: 0, streetwise: 0, thievery: 0 };
						for (s in skills) {
							Test.hasNumberProperty(member.skills, s, member.name);
						}
					});
					
					Test.hasObjectProperty(member, "hp", member.name);
					describe("hp: Object of the form", function() {
						Test.hasPositiveNumberProperty(member.hp, "total", member.name);
					});
					
					Test.hasObjectProperty(member, "surges", member.name);
					describe("surges: Object of the form", function() {
						Test.hasNumberProperty(member.surges, "perDay", member.name);
						Test.hasNumberProperty(member.surges, "current", member.name);
					});
					
					Test.hasObjectProperty(member, "defenses", member.name);
					describe("defenses: Object of the form", function() {
						Test.hasPositiveNumberProperty(member.defenses, "ac", member.name);
						Test.hasPositiveNumberProperty(member.defenses, "fort", member.name);
						Test.hasPositiveNumberProperty(member.defenses, "ref", member.name);
						Test.hasPositiveNumberProperty(member.defenses, "will", member.name);
					});
					
					if (member.hasOwnProperty("resistances")) {
						Test.hasObjectProperty(member, "resistances", member.name);
						describe("resistances: Object of the form", function() {
							var j;
							for (j in member.resistances) {
								Test.hasPositiveNumberProperty(member.resistances, j, member.name);
							}
						});
					}
					
					Test.hasNumberProperty(member, "init", member.name);
					Test.hasValidSpeed(member, member.name);
					
					if (member.hasOwnProperty("weapons")) {
						Test.hasArrayProperty(member, "weapons", member.name);
						if (member.weapons && member.weapons.length) {
							describe("weapons: Array of Object of the form", function() {
								var j, weapon;
								for (j = 0; j < member.weapons.length; j++) {
									weapon = member.weapons[ j ];
									Test.hasNonEmptyStringProperty(weapon, "name", member.name);
									Test.hasBooleanProperty(weapon, "isMelee", member.name + " " + weapon.name);
									Test.hasNumberProperty(weapon, "proficiency", member.name + " " + weapon.name);
									Test.hasNumberProperty(weapon, "enhancement", member.name + " " + weapon.name);
									Test.hasObjectProperty(weapon, "damage", member.name + " " + weapon.name);
									Test.hasNonEmptyStringProperty(weapon.damage, "amount", member.name + " " + weapon.name);
									Test.hasNonEmptyStringProperty(weapon.damage, "crit", member.name + " " + weapon.name);
								}
							});
						}
					}
					
					if (member.hasOwnProperty("implements")) {
						Test.hasArrayProperty(member, "implements", member.name);
						if (member[ "implements" ] && member[ "implements" ].length) {
							describe("implements: Array of Object of the form", function() {
								var j, implement;
								for (j = 0; j < member[ "implements" ].length; j++) {
									implement = member[ "implements" ][ j ];
									Test.hasNonEmptyStringProperty(implement, "name", member.name);
									Test.hasNumberProperty(implement, "enhancement", member.name + " " + implement.name);
									Test.hasNonEmptyStringProperty(implement, "crit", member.name + " " + implement.name);
								}
							});
						}
					}
					
					if (member.hasOwnProperty("attackBonuses")) {
						Test.hasArrayProperty(member, "attackBonuses", member.name);
						if (member.attackBonuses && member.attackBonuses.length) {
							describe("attackBonuses: Array of Object of the form", function() {
								var j, attackBonus, extra;
								for (j = 0; j < member.attackBonuses.length; j++) {
									attackBonus = member.attackBonuses[ j ];
									Test.hasNonEmptyStringProperty(attackBonus, "name", member.name);
									extra = member.name + " " + attackBonus.name;
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
										Test.hasNonEmptyArrayProperty(attackBonus, "status", member.name + " " + attackBonus.name);
										it("status: Array of String [" + member.name + " " + attackBonus.name + "]", (function(ab) {
											var j;
											for (j = 0; j < ab.status.length; j++) {
												expect(ab.status[ j ].length).not.toEqual(0);
											}
										}).bind(this, attackBonus));
									}
									if (attackBonus.hasOwnProperty("foeCondition")) {
										Test.hasNonEmptyArrayProperty(attackBonus, "status", member.name + " " + attackBonus.name);
										it("foeCondition: Array of String [" + member.name + " " + attackBonus.name + "]", (function(ab) {
											var j;
											for (j = 0; j < ab.foeCondition.length; j++) {
												expect(ab.foeCondition[ j ].length).not.toEqual(0);
											}
										}).bind(this, attackBonus));
									}
									if (attackBonus.hasOwnProperty("defense")) {
										Test.hasNonEmptyStringProperty(attackBonus, "defense", member.name + " " + attackBonus.name);
									}
								}
							});
						}
					}
					
					Test.hasNonEmptyArrayProperty(member, "attacks", member.name);
					describe("attacks: Array of Object of the form", function() {
						var j, attack, toHitRegEx, extra, hasMeleeBasic, hasRangedBasic;
						toHitRegEx = /^(automatic|(STR)?[/^]?(CON)?[/^]?(DEX)?[/^]?(INT)?[/^]?(WIS)?[/^]?(CHA)?[/^]?[+-]?\d*)$/;
						hasMeleeBasic = false;
						hasRangedBasic = false;
						for (j = 0; j < member.attacks.length; j++) {
							attack = member.attacks[ j ];
							Test.hasNonEmptyStringProperty(attack, "name", member.name);
							extra = member.name + " " + attack.name;
							Test.hasNonEmptyStringProperty(attack, "type", extra);
							it("type: \"At-Will\" | \"Encounter\" | \"Daily\" | \"Recharge\" [" + extra + "]", (function(a) {
								var valid = [ "At-Will", "Encounter", "Daily", "Recharge" ];
								expect(valid.indexOf(a.type)).not.toEqual(-1);
							}).bind(this, attack));
							if (attack.type === "Recharge") {
								Test.hasPositiveNumberProperty(attack, "recharge", "[" + extra + "]");
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
						it("has melee basic attack [" + member.name + "]", function() {
							expect(hasMeleeBasic).toEqual(true); 
						});
//						it("has ranged basic attack [" + member.name + "]", function() {
//							expect(hasRangedBasic).toEqual(true); 
//						});
					});
					
					// TODO: attack target tests
				});
			}
		});
		
	});
});