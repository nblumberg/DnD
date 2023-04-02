function createSpell(properties) {
    let { tags = '' } = properties;
    if (!tags.includes('SPELL')) {
        tags = `${tags}, SPELL`;
    }
    return {
        ...properties,
        tags,
    };
}

export default [
    createSpell({
        name: 'Frostbite',
        hero: 'https://explorednd.com/wp-content/uploads/2021/08/Ray-of-Frost-5e-Guide.jpg',
        level: '0',
        range: 60,
        activate: '1A',
        target: "60' 1👤",
        target_long_form: '60 feet',
        components: 'VS',
        affect: 'CON 16',
        duration: '⚡',
        duration_long_form: 'Instantaneous',
        school: 'Evocation',
        damage: '2d6❄️',
        damage_effect: 'Debuff',
        available: 'DRUID, SORCERER, WARLOCK, WIZARD, ARTIFICER',
        tags: 'DAMAGE, DEBUFF, 2/19/23',
        description: `You cause numbing frost to form on one creature that you can see within range. 
        The target must make a Constitution saving throw. 
        On a failed save, the target takes 1d6 cold damage, and it has disadvantage on the next weapon attack roll it makes before the end of its next turn.
        The spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).`,
    }),
    createSpell({
        name: 'Infestation',
        hero: 'https://www.dndbeyond.com/attachments/thumbnails/0/768/300/668/c117.png',
        level: '0',
        range: 30,
        activate: '1A',
        target: "30' 1👤",
        target_long_form: '30 feet',
        components: 'VSM',
        affect: 'CON 16',
        duration: '⚡',
        duration_long_form: 'Instantaneous',
        school: 'Conjuration',
        damage: '2d6🤮',
        damage_effect: 'poison',
        available: 'DRUID, SORCERER, WARLOCK, WIZARD',
        tags: 'SUMMONING, DAMAGEx, CONTROL, 2/21/23',
        description: `You cause a cloud of mites, fleas, and other parasites to appear momentarily on one creature you can see within range. 
        The target must succeed on a Constitution saving throw, or it takes 1d6 poison damage and moves 5 feet in a random direction if it can move and its speed is at least 5 feet. 
        Roll a d4 for the direction: 1, north; 2, south; 3, east; or 4, west. 
        This movement doesn't provoke opportunity attacks, and if the direction rolled is blocked, the target doesn't move.

        The spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).`,
        materials: 'a living flea',
    }),
    createSpell({
        name: 'Mind Sliver',
        hero: 'https://media.comicbook.com/2020/09/mind-sliver-hed-1237496.jpeg?auto=webp',
        level: '0',
        range: 60,
        activate: '1A',
        target: "60' 1👤",
        target_long_form: '60 feet',
        components: 'V',
        affect: 'INT',
        duration: '⚡',
        duration_long_form: 'Instantaneous',
        school: 'Enchantment',
        damage: '2d6🧠',
        damage_effect: 'debuff',
        available: 'SORCERER, WARLOCK, WIZARD',
        tags: 'DAMAGE, DEBUFF, 2/21/23',
        description: `You drive a disorienting spike of psychic energy into the mind of one creature you can see within range. 
        The target must succeed on an Intelligence saving throw or take 1d6 psychic damage and subtract 1d4 from the next saving throw it makes before the end of your next turn.

        This spell's damage increases by 1d6 when you reach certain levels: 5th level (2d6), 11th level (3d6), and 17th level (4d6).`,
    }),
    createSpell({
        name: 'Ice Knife',
        hero: 'https://explorednd.com/wp-content/uploads/2021/09/sorcerer-ice-knife-dnd.jpg',
        level: 1,
        range: 60,
        activate: '1A',
        target: "60' 1👤/5'🌐",
        target_long_form: '60 feet, 5 foot sphere',
        components: 'SM',
        affect: '🎯/DEX',
        duration: '⚡',
        duration_long_form: 'Instantaneous',
        school: 'Conjuration',
        damage: '1d10🏹/2d6❄️',
        damage_effect: 'debuff',
        available: 'DRUID, SORCERER, WIZARD',
        tags: 'DAMAGE, 2/21/23',
        description: `You create a shard of ice and fling it at one creature within range. 
        Make a ranged spell attack against the target. 
        On a hit, the target takes 1d10 piercing damage. 
        Hit or miss, the shard then explodes. 
        The target and each creature within 5 feet of it must succeed on a Dexterity saving throw or take 2d6 cold damage.

        <strong>At Higher Levels.</strong> When you cast this spell using a spell slot of 2nd level or higher, the cold damage increases by 1d6 for each slot level above 1st.`,
        materials: 'a drop of water or a piece of ice',
    }),
];
