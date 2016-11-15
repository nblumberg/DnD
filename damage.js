function data() {
	return {
		"types": {
			"slashing": {
				"attack": [
					"attack",
					"strike",
					"onslaught",
					"strike",
					"thrust",
					"hack",
					"slice",
					"chop",
					"gash",
					"rend",
					"rip",
					"cleave",
					"slash",
					"hew",
					"shear",
					"cut"
				],
				"dex": {
					0: [
						"{attacker} telegraphs {attack} and {target} easily steps aside"
					],
					50: [
						"{target}'s reactions fire ahead of {attacker}'s {attack} and {target} dodges out of the way"
					],
					100: [
						"{target} jerks back and {attacker}'s {attack} passes within a hairsbredth of {target}"
					]
				},
				"shield": {
					0: [
						"{attacker}'s {attack} scratches quickly across {target}'s shield but leaves no mark"
					],
					50: [
						"{attacker}'s {attack} scores a thin slice in {target}'s shield"
					],
					100: [
						"{attacker}'s {attack} slices a chip from {target}'s shield"
					]
				},
				"armor": {
					0: [
						"{attacker}'s {attack} scratches quickly across {target}'s armor but leaves no mark"
					],
					50: [
						"{attacker}'s {attack} scores a thin slice in {target}'s armor"
					],
					100: [
						"{attacker}'s {attack} slices a chip from {target}'s armor"
					]
				},
				"hit": {
					0: [
						"{attacker}'s {attack} scratches quickly across {target}'s armor but leaves no mark"
					],
					1: [
						"{attacker}'s {attack} scores a thin slice in {target}'s armor"
					],
					5: [
						"{attacker}'s {attack} slices a chip from {target}'s armor"
					],
					10: [
						"{attacker}'s {attack} notches {target}'s armor, leaving {target}'s flesh numb underneath"
					],
					25: [
						"{attacker}'s {attack} cuts across a gap in {target}'s armor, a searing sting followed by a steady trickle of blood"
					],
					50: [
						"{attacker}'s {attack} hacks through {target}'s defenses, rending a deep tear in {target}'s flesh that bleeds freely"
					],
					75: [
						"{attacker}'s {attack} hews a devastating gash across {target}'s belly, shearing skin and muscle and hobbling {target}"
					],
					100: [
						"{attacker}'s {attack} cleaves a mortal wound from {target}'s neck to hip, a spray of blood and gore painting {attacker}"
					]
				},
			}
		}
	};
}
