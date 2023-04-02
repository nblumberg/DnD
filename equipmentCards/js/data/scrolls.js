function createScroll(properties) {
    let { tags = '' } = properties;
    if (!tags.includes('SCROLL')) {
        tags = `${tags}, SCROLL`;
    }
    if (!tags.includes('CONSUMABLE')) {
        tags = `${tags}, CONSUMABLE`;
    }
    return {
        ...properties,
        tags,
    };
}

export default [
    createScroll({
        name: 'Scroll of Remove Curse',
        hero: 'https://cdna.artstation.com/p/assets/images/images/015/268/540/large/nataly-keldy-asset.jpg?1547723131',
        level: 3,
        activate: '1A',
        target: '✋1👤/📦',
        target_long_form: 'touch',
        // components: 'VS',
        duration: '⚡',
        duration_long_form: 'Instantaneous',
        school: 'Abjuration',
        damage_effect: 'Buff',
        available: 'CLERIC,PALADIN,WARLOCK,WIZARD',
        tags: 'BUFF',
        description: `At your touch, all curses affecting one creature or object end. If the object is a cursed magic item, its curse remains, but the spell breaks its owner's attunement to the object so it can be removed or discarded.`,
    }),
    createScroll({
        name: 'Scroll of Misty Step',
        hero: 'https://i.pinimg.com/564x/e4/98/d9/e498d95dc1d1c99a47d4eb3fe60bed2b.jpg',
        level: 2,
        activate: '1B',
        target: "🧙30'",
        target_long_form: "self 30'",
        // components: 'V',
        duration: '⚡',
        duration_long_form: 'Instantaneous',
        school: 'Conjuration',
        damage_effect: 'Teleportation',
        available: 'SORCERER, WARLOCK, WIZARD, CIRCLE OF THE LAND (COAST), OATH OF THE ANCIENTS, OATH OF VENGEANCE, OATH OF THE SEA',
        tags: 'TELEPORTATION',
        description: `Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see.`,
    }),
    createScroll({
        name: 'Scroll of Lightning Bolt',
        hero: 'https://cdnb.artstation.com/p/assets/images/images/002/794/245/large/jari-hirvikoski-magic-scroll.jpg?1465805176',
        level: 3,
        activate: '1A',
        affect: 'DEX 15',
        target: "🧙100'➞",
        target_long_form: "self 100' line",
        // components: 'VSM',
        damage: '8d6⚡',
        duration: '⚡',
        duration_long_form: 'Instantaneous',
        school: 'Evocation',
        damage_effect: 'Lightning',
        available: 'SORCERER, WIZARD, CIRCLE OF THE LAND (MOUNTAIN), THE FATHOMLESS, ARMORER',
        tags: 'DAMAGE',
        description: `A stroke of lightning forming a line 100' long and 5' wide blasts out from you in a direction you choose. Each creature in the line must make a DEX saving throw. A creature takes 8d6 lightning damage on a failed save, or half as much damage on a successful one.
        The lightning ignites flammable objects in the area that aren't being worn or carried.`,
        materials: 'a bit of fur and a rod of amber, crystal, or glass',
    }),
    createScroll({
        name: 'Scroll of Alarm',
        hero: 'https://www.worldanvil.com/uploads/images/3ffba7410667d1be71921ff5b1f68f70.jpg',
        level: 1,
        activate: '1min',
        target: "20'🧊30'",
        target_long_form: "20' cube within 30'",
        // components: 'V, S, M*',
        duration: '8hr',
        duration_long_form: '8 hours',
        school: 'Abjuration',
        damage_effect: 'Detection',
        available: 'RANGER, WIZARD, ARTIFICER, OATH OF THE WATCHERS',
        tags: 'DETECTION',
        description: `You set an alarm against unwanted intrusion. Choose a door, a window, or an area within range that is no larger than a 20-foot cube. Until the spell ends, an alarm alerts you whenever a Tiny or larger creature touches or enters the warded area. When you cast the spell, you can designate creatures that won't set off the alarm. You also choose whether the alarm is mental or audible.
        A mental alarm alerts you with a ping in your mind if you are within 1 mile of the warded area. This ping awakens you if you are sleeping.
        An audible alarm produces the sound of a hand bell for 10 seconds within 60 feet.`,
        materials: 'a tiny bell & a piece of fine silver wire',
    }),
    createScroll({
        name: 'Scroll of Unseen Servant',
        hero: 'https://www.flutesloot.com/wp-content/uploads/2021/07/DND-Spell-Scroll-featured-image-900x400.jpg',
        level: 1,
        activate: '1A',
        target: "60'",
        target_long_form: "60'",
        // components: 'V, S, M*',
        duration: '1hr',
        duration_long_form: '1 hour',
        school: 'Conjuration',
        damage_effect: 'Control',
        available: 'BARD, WARLOCK, WIZARD',
        tags: 'CONTROL',
        description: `This spell creates an invisible, mindless, shapeless, Medium force that performs simple tasks at your command until the spell ends. The servant springs into existence in an unoccupied space on the ground within range. It has AC 10, 1 hit point, & a Strength of 2, & it can't attack. If it drops to 0 hit points, the spell ends.
        Once on each of your turns as a bonus action, you can mentally command the servant to move up to 15 feet & interact with an object. The servant can perform simple tasks that a human servant could do, such as fetching things, cleaning, mending, folding clothes, lighting fires, serving food, & pouring wine. Once you give the command, the servant performs the task to the best of its ability until it completes the task, then waits for your next command.
        If you command the servant to perform a task that would move it more than 60 feet away from you, the spell ends.`,
        materials: 'a bit of string & of wood',
    }),
];
