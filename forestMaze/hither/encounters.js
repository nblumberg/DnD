import { Encounter, ForcedEncounter, makeSavingThrow } from '../encounters.js';
import { getUrlParam } from '../getUrlParam.js';
import { registerGoToLocationCallback } from '../navigate.js';
import { randomFrom, roll } from '../random.js';
import { showTide } from '../showState.js';
import { getTide, setTide } from '../state.js';

let currentTideLevel = 'low';

class HitherEncounter extends Encounter {
  valid(location) {
    return super.valid(location) && (!location.stream || !!this.stream);
  }

  validCombat() {
    this.onlyOnce = true;
    const { valid: wrappedValid } = this;
    this.valid = (location) => wrappedValid.call(this, location) && location.battleMap === true;
    return this;
  }

  validOwell() {
    const { valid: wrappedValid } = this;
    this.valid = (location) => wrappedValid.call(this, location) && location.owell === true;
    return this;
  }

  validGushing() {
    this.validOwell();
    const { valid: wrappedValid } = this;
    this.valid = (location) => wrappedValid.call(this, location) && location.gushing === true;
    return this;
  }

  validStream() {
    this.stream = true;
    this.onlyOnce = true;
    return this;
  }

  validTide(tide) {
    const { valid: wrappedValid } = this;
    this.valid = (location) => wrappedValid.call(this, location) && currentTideLevel === tide;
    return this;
  }
}

class MarshGasEncounter extends Encounter {
  constructor(status, failureText) {
    super({
      name: `Marsh gas: ${status}`,
      description: `Marsh gas erupts from iridescent bubbles in the muck.

            When a bubble touches something edged, such as a twig or a blade of grass, it pops, releasing its gas with a sound of stifled laughter. The gas smells like old cheese.

            Make a Wisdom (Survival) group check.`,
      image: `https://www.erasmatazz.com/_Media/unexplained-marsh-lights_med_hr.jpeg`,
      failure: makeSavingThrow(10, () => {
        return {
          description: `Make a Constitution saving throw`,
          failure: makeSavingThrow(10, () => {
            return {
              description: `For the next 3 hours, ${failureText}`,
              status: [`Marsh gas: ${status}`, 'remaining', 3 * 60],
            };
          }),
        };
      })
    });
  }
  valid(location) {
    return super.valid(location) && !location.owell && !location.stream;
  }
}

class StreamVisionEncounter extends HitherEncounter {
  constructor(vision, image) {
    super({
      name: `Stream from Downfall: ${vision.substr(0, 10)}`,
      description: `You chance upon a 10-foot-wide stream, and looking into it, see a vision in the reflections:
      ${vision}`,
      image,
    });
    this.validStream();
  }
}

// Support tides
class TideEncounter extends HitherEncounter {
  constructor({ tide, description, image }) {

    super({
      name: `${tide.charAt(0).toUpperCase()}${tide.substr(1)} tide`,
      description,
      image,
      onlyOnce: getUrlParam('tides') !== 'true',
    });
    this.tide = tide;
    this.validTide(tide === 'low' ? 'high' : 'low');
  }

  async show(location) {
    await super.show(location);
    setTide(this.tide);
    showTide(this.tide);
  }
}

const highTide = new TideEncounter({
  tide: 'high',
  description: () => {
    return `You hear the roar of rushing water and a wave of brown sludge thunders through the trees and washes around your ankles.
        Within ${roll(10)} minutes the water is 5 feet deep and you're treading water.`
  },
  image: `https://i.giphy.com/media/KYWdVhA36WuRLyiy9H/giphy.webp`,
});
const lowTide = new TideEncounter({
  tide: 'low',
  description: () => {
    return `You hear the roar of rushing water and you are swept away, banging against obstacles, as the floodwater drains rapidly.
        Within ${roll(10)} minutes the water is gone completely and you're standing ankle-deep in mud.`;
  },
  image: `https://www.gizmodo.com.au/wp-content/uploads/sites/2/2014/08/01/qidj7fkfi3d1ryii9vng.gif`,
});

async function handleTides(_encounters, _locations, location, _fromPageLoad) {
  if (location.tide) {
    setTide(location.tide);
  } else {
    setTide(roll(2) === 2 ? 'high' : 'low');
  }
  const newTide = location.tide ?? getTide();
  if (newTide === currentTideLevel) {
    return;
  }
  currentTideLevel = newTide;
  showTide(currentTideLevel);
  const encounter = currentTideLevel === 'low' ? lowTide : highTide;
  if (encounter.onlyOnce && encounter.resolved) {
    return;
  }
  await encounter.show(location);
}
registerGoToLocationCallback(handleTides);


const mudTrap = (priorDepth = 0) => {
  const depth = Math.min(10, priorDepth + roll(4));
  return {
    description: `You have sunk ${depth} feet into the muck and are restrained. If you are not completely submerged, make a Strength check to escape.`,
    failure: makeSavingThrow(
      10 + depth,
      mudTrap.bind(null, depth),
      () => ({
        description: `You manage to claw your way to safety`,
      }),
    ),
  };
};

export const encounters = [
  // Tide encounters
  highTide,
  lowTide,

  // Forced encounters
  new ForcedEncounter({
    name: `Balloon Crash`,
    description: `In the distant sky, Eaton spots a great balloon made of patchwork material. It spins out of control as though punctured, causing the wicker basket that hangs from it to swing wildly. The balloon plunges out of sight, disappearing into the fog approximately a mile away.`,
    image: 'https://media.dndbeyond.com/compendium-images/twbtw/JtUXxjur9QWtb7E3/02-001.chapter-splash.jpg',
    onlyOnce: true,
  }),
  new ForcedEncounter({
    name: `Giant crane flees`,
    description: `As you reach the marshy ground, a giant crane previously hidden by the fog emerges and takes flight.`,
    image: 'https://goldengateaudubon.org/wp-content/uploads/aurich2.jpg',
    onlyOnce: true,
  }),
  new ForcedEncounter({
    name: `Queen's Way Brigands`,
    description: `Coming from one direction are several voices joined in a marching song. The singing grows louder as six bipedal rabbits wearing clothing emerge from the fog. Two of them tug at the reins of a giant snail, and the others carry clubs and slings.`,
    image: 'https://storage.googleapis.com/dream-machines-output/826dddb9-4409-4879-bb6a-d21007e4d5f5/0_0.png',
    onlyOnce: true,
  }),
  new ForcedEncounter({
    name: `Agdon Longscarf`,
    description: `An odd feeling suddenly comes over you as you become aware that somewhere along the way, a hunched, hooded figure has joined the group.

        He casts off his cloak with a flourish, revealing a Harengon with a wide grin on his face and wearing a 15-foot-long, bright blue scarf. He holds a hot branding iron in one hand and a small round shield in the other.

        The sound of a bagpipe erupts from somewhere up ahead.`,
    image: 'https://media.dndbeyond.com/compendium-images/twbtw/JtUXxjur9QWtb7E3/02-006.agdon-longscarf.png',
    onlyOnce: true,
  }),
  new ForcedEncounter({
    name: `Ufgunk`,
    description: `Up ahead, through the morass and fog, you can make out the form of a humanoid-frog sitting on the edge of a river.`,
    image: `https://res.cloudinary.com/teepublic/image/private/s--dxpAtAfS--/c_crop,x_10,y_10/c_fit,w_830/c_crop,g_north_west,h_1038,w_1038,x_-104,y_-168/l_upload:v1565806151:production:blanks:vdbwo35fw6qtflw9kezw/fl_layer_apply,g_north_west,x_-215,y_-279/b_rgb:0f7b47/c_limit,f_auto,h_630,q_90,w_630/v1626211540/production/designs/23054648_0.jpg`,
    onlyOnce: true,
  }),
  new ForcedEncounter({
    name: `Screaming Devilkin`,
    description: `The cacophony of screams grow louder up ahead as you approach the shoreline of a large lake. If not for the discord, the landscape would be serene. The winged creatures appear to be the source of the raucous noise.`,
    image: 'https://www.dndbeyond.com/avatars/thumbnails/8006/152/1000/1000/637115709679464710.jpeg',
    onlyOnce: true,
  }),

  // Hazards
  new HitherEncounter({
    name: 'Mud pit',
    description: `Marching across the swamp you blunder into swampy terrain that contains a pit of sucking mud. Make a group Wisdom (Survival) check.`,
    image: `https://pbs.twimg.com/media/ByJxxasCQAIu7nS.jpg`,
    failure: makeSavingThrow(
      10,
      mudTrap,
      () => ({
        description: `You spot and avoid the hazard.`,
      })
    ),
  }).validTide('low'),
  new MarshGasEncounter('gibberish', 'whenever you speak, your words come out as gibberish that only you and others affected by the gas can understand. This effect does not impede the ability to cast spells that have verbal components.'),
  new MarshGasEncounter('hiccups', 'you experience a most annoying case of the hiccups. To cast a spell that has a verbal component, you must succeed on a DC 10 Constitution check. Also, you has disadvantage on Dexterity (Stealth) checks made to hide.'),
  new MarshGasEncounter('warts', 'hideous warts erupt across your body. The warts are unattractive but have no harmful effect.'),
  new MarshGasEncounter('slugs', 'a foul taste fills your mouth, and everything the character eats or drinks tastes awful. You feel a compulsion to eat slugs.'),

  // Informational encounters
  new Encounter({
    name: 'Stilt walkers',
    description: `In a mist-veiled field of tall swamp grass dotted with clusters of cattails, you hear rustling in the vegetation ahead of you. The sound foreshadows the arrival of six humanoid creatures on stilts. The stilts allow these creatures to move more easily through the muck and to stay above the water. Their movement on stilts is seemingly not reduced by mud or water.`,
    image: `https://media.dndbeyond.com/compendium-images/twbtw/JtUXxjur9QWtb7E3/02-003.stilt-walker.png`,
  }),
  new StreamVisionEncounter(
    'A headless, child-sized scarecrow with metal lobster claws for hands tries on some new heads, including an upside-down wooden bucket and a withered head of cabbage. It decides on a large gourd.',
    'https://www.dndbeyond.com/avatars/thumbnails/20472/380/400/402/637677437801975332.png'
  ),
  new StreamVisionEncounter(
    'A bullywug bedecked in the trappings of a monarch constantly adjusts his ill-fitting crown of lily blossoms while leafing through a large tome spread across his lap.',
    'https://media.dndbeyond.com/compendium-images/twbtw/JtUXxjur9QWtb7E3/02-007.king-gullop.png'
  ),
  new StreamVisionEncounter(
    'A hag with toad-like features relaxes in a pool of water while miniature versions of her ladle the water and pour it over her head and shoulders.',
    'https://www.dndbeyond.com/avatars/thumbnails/20472/350/400/471/637677436598601233.png'
  ),
  new StreamVisionEncounter(
    'A tall, thin figure wearing a pointy black hat and a hooded black cloak climbs a rickety staircase leading up to a large, ramshackle house built on stilts. As the figure approaches the house, their shadow seems to detach from their body, move across the walls of the house, and crawl through an open window.',
    'https://media.dndbeyond.com/compendium-images/twbtw/JtUXxjur9QWtb7E3/02-009.charm.png'
  ),
  new StreamVisionEncounter(
    'A satyr whistles to himself as he reclines in a metal cage that dangles off the end of a boom over a lake.',
    'https://cdna.artstation.com/p/assets/images/images/034/651/762/large/matthieu-martin-satyre-carre-final-web-crop.jpg?1612865327'
  ),
  new StreamVisionEncounter(
    'A short, mean-looking old woman wearing a crimson cap, a leather apron, and iron boots uses a cleaver to chop meat in a drab kitchen.',
    'https://static.wikia.nocookie.net/the-hollow-on-netflix/images/0/0f/Red_Cap.png',
    // 'https://static.wikia.nocookie.net/the-hollow-on-netflix/images/0/0f/Red_Cap.png/revision/latest',
  ),
  new StreamVisionEncounter(
    'Two merrow swim past each other in murky water.',
    'https://b2358178.smushcdn.com/2358178/wp-content/uploads/2022/06/Kiai-Sunken-Isles-Merfolk.jpg?lossy=1&strip=1&webp=1'
  ),
  new StreamVisionEncounter(
    'Rows upon rows of severed bullywug heads, all impaled on spikes, chatter at each other.',
    // TODO: get frog images
    'https://i0.wp.com/www.twdlocations.com/wp-content/uploads/2019/03/twdls09-2019-08-19-14h10m16s327.png'
  ),

  // O'-Well encounters
  new HitherEncounter({
    name: `Gushing O'-Well`,
    description: () => `${randomFrom(['Harrow', 'John', 'Eaton', 'Throne'])} notices ${roll(4)} items bobbing at the top of the plume`,
  }).validGushing(),
  new HitherEncounter({
    name: 'Dretch of Envy and the Gem of Having That Which Was Denied',
    description: `A repulsive monstrosity capers around the gushing O'-Well, staring covetously at the peak of the water plume.

        On closer inspection you notice a gold-flecked purple jewel embedded in its chest, the gem's beauty in stark contrast to the rest of the beast.`,
    image: 'https://www.dndbeyond.com/avatars/thumbnails/30781/610/1000/1000/638061931201709292.png',
    onlyOnce: true,
  }).validGushing(),

  // Combat encounters
  new HitherEncounter({
    name: 'Mud Mephits',
    description: `Five slow, unctuous creatures of earth and water burst forth from the muck and in between droning complains threaten to attack you unless you can guess their favorite food.`,
    image: `https://www.dndbeyond.com/avatars/thumbnails/18/297/1000/1000/636379807088272583.jpeg`,
  }).validCombat().validTide('low'),
  new HitherEncounter({
    name: 'Cranium rat swarm',
    description: `You think you hear the wind rustling through the leaves until the susurration is punctuated by squeeking telepathic thoughts like "They are here" and "We must find them." You recognize the pitter patter of many rat feet before a swarm of rodents with exposed brains erupts from the underbrush.`,
    image: `https://www.dndbeyond.com/avatars/thumbnails/25746/698/1000/1000/637880558074808985.jpeg`,
  }).validCombat(),
  new HitherEncounter({
    name: 'Intellect Devourer',
    description: `The swamp water recedes and exposes a walking brain protected by a crusty covering and set on bestial clawed legs. Without words it communicates its hunger - for your mind.`,
    image: `https://www.dndbeyond.com/avatars/thumbnails/30831/57/1000/1000/638063804285013333.png`,
  }).validCombat().validTide('low'),
  new HitherEncounter({
    name: 'Dolgaunt and Dolgrims',
    description: `You hear the sound of marching feet and grumbles in Goblin ahead. As you turn a bend and come face to face with the goblins, you realize something is wrong with the squat, deformed things. Each is essentially two goblins crushed into one creature, their misshapen body boasting four arms and a pair of twisted mouths that gibber and slather at the front of a headless torso. The two mouths carry on demented conversations with one another.`,
    image: `https://www.dndbeyond.com/avatars/thumbnails/7725/608/1000/1000/637091619688542557.png`,
  }).validCombat().validTide('low'),
  new HitherEncounter({
    name: 'Slithering Tracker',
    description: `A body floats in the muck. As you look closer, the rippling water forms into a pseudopod topped with a face that screams and lunges at you.`,
    image: `https://www.dndbeyond.com/avatars/thumbnails/25746/651/1000/1000/637880558006828597.jpeg`,
  }).validCombat(),
  new HitherEncounter({
    name: 'Neh-thalggu',
    description: `At first you think the swamp gas is getting thicker, but soon realize something more sinister is making you dizzy.
        You spot an elf leaning against a tree up ahead wearing a glazed look before they jerk unnaturally and fall to the ground in a heap, leaving a spider-like crab attached to the tree and gobbling what looks like brains.`,
    image: `https://www.dndbeyond.com/avatars/thumbnails/28079/897/1000/1000/637961800886575218.jpeg`,
  }).validCombat().validTide('low'),
  new HitherEncounter({
    name: 'Adult Oblex',
    description: `An elf steps from between two trees and notices you:
        "Thank the Lady, someone to help! Please come with me, my friends are trapped."`,
    image: `https://www.worldanvil.com/media/cache/apollo_preview/uploads/images/0ff8c3d73bb7eb00bb85de63e70056bc.jpg`,
  }).validCombat().validTide('low'),
];
