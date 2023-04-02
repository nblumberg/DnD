function createArmor(properties) {
    let { tags = '' } = properties;
    if (!tags.includes('ARMOR')) {
        tags = `${tags}, ARMOR`;
    }
    return {
        ...properties,
        tags,
    };
}

export default [
    createArmor({
        name: 'Bracers of Defense',
        hero: 'https://www.dndbeyond.com/avatars/thumbnails/7/146/1000/1000/636284716655660478.jpeg',
        affect: 'AC +2',
        attunement: 'any',
        rarity: 'rare',
        weight: 2,
        tags: 'WARDING, WRISTWEAR',
        description: `While wearing these bracers, you gain a +2 bonus to AC if you are wearing no armor & using no shield.`,
    }),
];
