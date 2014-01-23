describe("actions.js", function() {
    var diceNotations = {
            "0": { dieCount: 0, dieSides: 0, extra: 0, crits: false, type: null, crit: null, needsWeapon: false, weaponMultiplier: 0, meleeExtra: 0, rangedExtra: 0, /* testing properties */ max: 0, min: 0, breakdown: "[0] 0" },
            "1": { dieCount: 0, dieSides: 0, extra: 1, crits: false, type: null, crit: null, needsWeapon: false, weaponMultiplier: 0, meleeExtra: 0, rangedExtra: 0,  /* testing properties */ max: 1, min: 1, breakdown: "[1] 1" },
            "2": { dieCount: 0, dieSides: 0, extra: 2, crits: false, type: null, crit: null, needsWeapon: false, weaponMultiplier: 0, meleeExtra: 0, rangedExtra: 0,  /* testing properties */ max: 2, min: 2, breakdown: "[2] 2" },
            "3": { dieCount: 0, dieSides: 0, extra: 3, crits: false, type: null, crit: null, needsWeapon: false, weaponMultiplier: 0, meleeExtra: 0, rangedExtra: 0,  /* testing properties */ max: 3, min: 3, breakdown: "[3] 3" },
            "1d6": { dieCount: 1, dieSides: 6, extra: 0, crits: false, type: null, crit: null, needsWeapon: false, weaponMultiplier: 0, meleeExtra: 0, rangedExtra: 0,  /* testing properties */ max: 6, min: 1, breakdown: "[1d6] 6" },
            "2d4": { dieCount: 2, dieSides: 4, extra: 0, crits: false, type: null, crit: null, needsWeapon: false, weaponMultiplier: 0, meleeExtra: 0, rangedExtra: 0,  /* testing properties */ max: 8, min: 2, breakdown: "[2d4] 4 + 4" },
            "3d8+5": { dieCount: 3, dieSides: 8, extra: 5, crits: false, type: null, crit: null, needsWeapon: false, weaponMultiplier: 0, meleeExtra: 0, rangedExtra: 0,  /* testing properties */ max: 29, min: 8, breakdown: "[3d8+5] 8 + 8 + 8 + 5" },
            "4d10-7": { dieCount: 4, dieSides: 10, extra: -7, crits: false, type: null, crit: null, needsWeapon: false, weaponMultiplier: 0, meleeExtra: 0, rangedExtra: 0,  /* testing properties */ max: 33, min: -3, breakdown: "[4d10-7] 10 + 10 + 10 + 10 -7" },
            "1d20+14": { dieCount: 1, dieSides: 20, extra: 14, crits: true, type: null, crit: null, needsWeapon: false, weaponMultiplier: 0, meleeExtra: 0, rangedExtra: 0, /* testing properties */ max: 34, min: 15, breakdown: "[1d20+14] CRIT" }
    };



    describe("Attack", function() {
        // TODO
    });
});