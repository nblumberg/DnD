function createMarshGas(failure) {
    return () => ({
        description: `Marsh gas erupts from iridescent bubbles in the muck.
        When a bubble touches something edged, such as a twig or a blade of grass, it pops, releasing its gas with a sound of stifled laughter.
        The gas smells like old cheese.
        Make a Wisdom (Survival) group check`,
        image: `https://www.erasmatazz.com/_Media/unexplained-marsh-lights_med_hr.jpeg`,
        dc: 10,
        failure: { description: `Make a DC 10 Constitution save. On a failure, for the next hour, ${failure}` },
    });
}

function createStreamVision(vision, image) {
    return () => ({
        description: `You chance upon a 10-foot-wide stream, and looking into it, see a vision in the reflections: ${vision}`,
        image,
    });
}

export const randomEncounters = [
    createMarshGas('whenever you speak, your words come out as gibberish that only you and others affected by the gas can understand. This effect does not impede the ability to cast spells that have verbal components.'),
    createMarshGas('you experience a most annoying case of the hiccups. To cast a spell that has a verbal component, you must succeed on a DC 10 Constitution check. Also, you has disadvantage on Dexterity (Stealth) checks made to hide.'),
    createMarshGas('hideous warts erupt across your body. The warts are unattractive but have no harmful effect.'),
    createMarshGas('you experience a most annoying case of the hiccups. To cast a spell that has a verbal component, you must succeed on a DC 10 Constitution check. Also, you has disadvantage on Dexterity (Stealth) checks made to hide.'),
    createMarshGas('a foul taste fills your mouth, and everything the character eats or drinks tastes awful. You feel a compulsion to eat slugs.'),
    () => ({
        description: `Five slow, unctuous creatures of earth and water burst forth from the muck and in between droning complains threaten to attack you unless you can guess their favorite food.`,
        image: `https://www.dndbeyond.com/avatars/thumbnails/18/297/1000/1000/636379807088272583.jpeg`,
    }),
    () => ({
        description: `In a mist-veiled field of tall swamp grass dotted with clusters of cattails, you hear rustling in the vegetation ahead of you. The sound foreshadows the arrival of six humanoid creatures on stilts. The stilts allow these creatures to move more easily through the muck and to stay above the water. Their movement on stilts is seemingly not reduced by mud or water.`,
        image: `https://media.dndbeyond.com/compendium-images/twbtw/JtUXxjur9QWtb7E3/02-003.stilt-walker.png`,
    }),
    createStreamVision(
        'A headless, child-sized scarecrow with metal lobster claws for hands tries on some new heads, including an upside-down wooden bucket and a withered head of cabbage. It decides on a large gourd.',
        'https://www.dndbeyond.com/avatars/thumbnails/20472/380/400/402/637677437801975332.png'
    ),
    createStreamVision(
        'A bullywug bedecked in the trappings of a monarch constantly adjusts his ill-fitting crown of lily blossoms while leafing through a large tome spread across his lap.',
        'https://media.dndbeyond.com/compendium-images/twbtw/JtUXxjur9QWtb7E3/02-007.king-gullop.png'
    ),
    createStreamVision(
        'A hag with toad-like features relaxes in a pool of water while miniature versions of her ladle the water and pour it over her head and shoulders.',
        ''
    ),
    createStreamVision(
        'A tall, thin figure wearing a pointy black hat and a hooded black cloak climbs a rickety staircase leading up to a large, ramshackle house built on stilts. As the figure approaches the house, their shadow seems to detach from their body, move across the walls of the house, and crawl through an open window.',
        'https://media.dndbeyond.com/compendium-images/twbtw/JtUXxjur9QWtb7E3/02-009.charm.png'
    ),
    createStreamVision(
        'A satyr whistles to himself as he reclines in a metal cage that dangles off the end of a boom over a lake.',
        ''
    ),
    createStreamVision(
        'A short, mean-looking old woman wearing a crimson cap, a leather apron, and iron boots uses a cleaver to chop meat in a drab kitchen.'
    ),
    createStreamVision(
        'Two merrow swim past each other in murky water.',
        ''
    ),
    createStreamVision(
        'Rows upon rows of severed bullywug heads, all impaled on spikes, chatter at each other.',
        ''
    ),

    () => ({
        description: `Marsh gas erupts from iridescent bubbles in the muck.
        When a bubble touches something edged, such as a twig or a blade of grass, it pops, releasing its gas with a sound of stifled laughter.
        The gas smells like old cheese.
        Make a Wisdom (Survival) group check`,
        image: `https://www.erasmatazz.com/_Media/unexplained-marsh-lights_med_hr.jpeg`,
        dc: 10,
        failure: { description: 'The rats tear at your flesh before disappearing back into the underbrush', roll: 1, type: 'piercing' },
    }),
];
