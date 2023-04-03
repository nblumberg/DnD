import { roll, randomFrom } from '../random.js';

function createMarshGas(failure) {
    const data = {
        description: `Marsh gas erupts from iridescent bubbles in the muck.
        When a bubble touches something edged, such as a twig or a blade of grass, it pops, releasing its gas with a sound of stifled laughter.
        The gas smells like old cheese.
        Make a Wisdom (Survival) group check`,
        image: `https://www.erasmatazz.com/_Media/unexplained-marsh-lights_med_hr.jpeg`,
        dc: 10,
        failure: { description: `Make a DC 10 Constitution save. On a failure, for the next hour, ${failure}` },
    };
    return () => data;
}

function createStreamVision(vision, image) {
    const data = {
        description: `You chance upon a 10-foot-wide stream, and looking into it, see a vision in the reflections: ${vision}`,
        image,
    };
    return ({ stream }) => (!stream || data.resolved ? null : data);
}

function createGushingOwell(description, image) {
    const data = {
        description,
        image,
    };
    return ({ owell, gushing }) => (!owell || !gushing || data.resolved ? null : data);
}

function createForcedEncounter(name, description, image) {
    const data = {
        name,
        description,
        image,
    };
    return ({ forcedEncounter }) => (forcedEncounter !== name || data.resolved ? null : data);
}

export const randomEncounters = [
    createForcedEncounter(
        `Balloon Crash`,
        `In the distant sky, Eaton spots a great balloon made of patchwork material. It spins out of control as though punctured, causing the wicker basket that hangs from it to swing wildly. The balloon plunges out of sight, disappearing into the fog approximately a mile away.`,
        'https://media.dndbeyond.com/compendium-images/twbtw/JtUXxjur9QWtb7E3/02-001.chapter-splash.jpg',
    ),
    createForcedEncounter(
        `Giant crane flees`,
        `As you reach the marshy ground, a giant crane previously hidden by the fog emerges and takes flight.`,
        'https://goldengateaudubon.org/wp-content/uploads/aurich2.jpg',
    ),
    createForcedEncounter(
        `Queen's Way Brigands`,
        `Coming from one direction are several voices joined in a marching song. The singing grows louder as six bipedal rabbits wearing clothing emerge from the fog. Two of them tug at the reins of a giant snail, and the others carry clubs and slings.`,
        'https://storage.googleapis.com/dream-machines-output/826dddb9-4409-4879-bb6a-d21007e4d5f5/0_0.png',
    ),
    createForcedEncounter(
        `Agdon Longscarf`,
        `An odd feeling suddenly comes over you as you become aware that somewhere along the way, a hunched, hooded figure has joined the group.

        He casts off his cloak with a flourish, revealing a Harengon with a wide grin on his face and wearing a 15-foot-long, bright blue scarf. He holds a hot branding iron in one hand and a small round shield in the other.

        The sound of a bagpipe erupts from somewhere up ahead.`,
        'https://media.dndbeyond.com/compendium-images/twbtw/JtUXxjur9QWtb7E3/02-006.agdon-longscarf.png',
    ),

    createMarshGas('whenever you speak, your words come out as gibberish that only you and others affected by the gas can understand. This effect does not impede the ability to cast spells that have verbal components.'),
    createMarshGas('you experience a most annoying case of the hiccups. To cast a spell that has a verbal component, you must succeed on a DC 10 Constitution check. Also, you has disadvantage on Dexterity (Stealth) checks made to hide.'),
    createMarshGas('hideous warts erupt across your body. The warts are unattractive but have no harmful effect.'),
    createMarshGas('you experience a most annoying case of the hiccups. To cast a spell that has a verbal component, you must succeed on a DC 10 Constitution check. Also, you has disadvantage on Dexterity (Stealth) checks made to hide.'),
    createMarshGas('a foul taste fills your mouth, and everything the character eats or drinks tastes awful. You feel a compulsion to eat slugs.'),

    ({ tide }) => (tide === 'high' ? null : {
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
        'https://www.dndbeyond.com/avatars/thumbnails/20472/350/400/471/637677436598601233.png'
    ),
    createStreamVision(
        'A tall, thin figure wearing a pointy black hat and a hooded black cloak climbs a rickety staircase leading up to a large, ramshackle house built on stilts. As the figure approaches the house, their shadow seems to detach from their body, move across the walls of the house, and crawl through an open window.',
        'https://media.dndbeyond.com/compendium-images/twbtw/JtUXxjur9QWtb7E3/02-009.charm.png'
    ),
    createStreamVision(
        'A satyr whistles to himself as he reclines in a metal cage that dangles off the end of a boom over a lake.',
        'https://cdna.artstation.com/p/assets/images/images/034/651/762/large/matthieu-martin-satyre-carre-final-web-crop.jpg?1612865327'
    ),
    createStreamVision(
        'A short, mean-looking old woman wearing a crimson cap, a leather apron, and iron boots uses a cleaver to chop meat in a drab kitchen.',
        'https://static.wikia.nocookie.net/the-hollow-on-netflix/images/0/0f/Red_Cap.png/revision/latest'
    ),
    createStreamVision(
        'Two merrow swim past each other in murky water.',
        'https://b2358178.smushcdn.com/2358178/wp-content/uploads/2022/06/Kiai-Sunken-Isles-Merfolk.jpg?lossy=1&strip=1&webp=1'
    ),
    createStreamVision(
        'Rows upon rows of severed bullywug heads, all impaled on spikes, chatter at each other.',
        // TODO: get frog images
        'https://i0.wp.com/www.twdlocations.com/wp-content/uploads/2019/03/twdls09-2019-08-19-14h10m16s327.png'
    ),

    createGushingOwell(
        `${randomFrom(['Harrow', 'John', 'Eaton', 'Throne'])} notices ${roll(4)} items bobbing at the top of the plume`,
    ),
    createGushingOwell(
        `A repulsive monstrosity capers around the gushing O'-Well, staring covetously at the peak of the water plume.

        On closer inspection you notice a gold-flecked purple jewel embedded in its chest, the gem's beauty in stark contrast to the rest of the beast.`,
        'https://www.dndbeyond.com/avatars/thumbnails/30781/610/1000/1000/638061931201709292.png'
    ),
];
