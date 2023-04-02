function createRing(properties) {
    let { tags = '' } = properties;
    if (!tags.includes('JEWELRY')) {
        tags = `${tags}, JEWELRY`;
    }
    return {
        weight: 0.1,
        ...properties,
        tags,
    };
}

export default [
    createRing({
        name: 'Ring of Water Walking',
        // hero: 'https://www.dndbeyond.com/avatars/thumbnails/7/374/1000/1000/636284763046262817.jpeg',
        hero: 'https://db4sgowjqfwig.cloudfront.net/images/4071885/Ring_of_Swimming.PNG',
        rarity: 'uncommon',
        tags: 'MOVEMENT',
        description: `While wearing this ring, you can stand on & move across any liquid surface as if it were solid ground.`,
    }),
    createRing({
        name: 'Ring of Swimming',
        hero: 'https://sites.google.com/site/scourgeofthefr/_/rsrc/1350762288336/campaign-notes-and-random-info/loot/magical-items-acquired/ring-of-swimming/ring%20of%20swimming.jpg',
        rarity: 'uncommon',
        tags: 'MOVEMENT, 2/19/23',
        description: `You have a swimming speed of 40' while wearing this ring.`,
    }),
];
