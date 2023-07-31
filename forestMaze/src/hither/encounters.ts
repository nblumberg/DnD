import { Encounter, Failure, ForcedEncounter, makeSavingThrow } from '../encounters.js';
import { Location } from '../locations.js';
import { randomFrom, roll } from '../shared/random.js';
import { Tide, addStatePropertyListener, setState } from '../shared/state.js';
import { HitherLocation } from './locations.js';

let showTidesEveryTime = addStatePropertyListener('tides', (value: boolean) => {
  showTidesEveryTime = value;
});

let currentTideLevel = addStatePropertyListener('tide', (newTide: Tide) => {
  currentTideLevel = newTide;
});

function changeTide(tide: Tide): void {
  setState({ tide });
}

class HitherEncounter extends Encounter {
  stream?: true;

  valid(location: HitherLocation) {
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

  validTide(tide: Tide) {
    const { valid: wrappedValid } = this;
    this.valid = (location) => wrappedValid.call(this, location) && currentTideLevel === tide;
    return this;
  }
}

class MarshGasEncounter extends HitherEncounter {
  constructor(status: string, failureText: string) {
    super({
      name:`Marsh gas: ${status}`,
      description:`Marsh gas erupts from iridescent bubbles in the muck.

            When a bubble touches something edged, such as a twig or a blade of grass, it pops, releasing its gas with a sound of stifled laughter. The gas smells like old cheese.

            Make a Wisdom (Survival) group check.`,
      image:`https://www.erasmatazz.com/_Media/unexplained-marsh-lights_med_hr.jpeg`,
      failure: makeSavingThrow(
        10,
        () => ({
          description:`Make a Constitution saving throw`,
          failure: makeSavingThrow(10, () => {
            return {
              description:`For the next 3 hours, ${failureText}`,
              status: [`Marsh gas: ${status}`, 'remaining', 3 * 60],
            };
          }),
        })
      ),
    });
  }
  valid(location: HitherLocation) {
    return super.valid(location) && !location.owell && !location.stream;
  }
}

class StreamVisionEncounter extends HitherEncounter {
  constructor(vision: string, image: string) {
    super({
      name:`Stream from Downfall: ${vision.substr(0, 10)}`,
      description:`You chance upon a 10-foot-wide stream, and looking into it, see a vision in the reflections:
      ${vision}`,
      image,
    });
    this.validStream();
  }
}

// Support tides
class TideEncounter extends HitherEncounter {
  tide: Tide;

  constructor({ tide, description, image }: { tide: Tide, description: string | (() => string), image: string }) {

    super({
      name:`${tide.charAt(0).toUpperCase()}${tide.substr(1)} tide`,
      description,
      image,
      onlyOnce: showTidesEveryTime || undefined,
    });
    this.tide = tide;
    this.validTide(tide === 'low' ? 'high' : 'low');
  }

  async show(location: HitherLocation) {
    await super.show(location);
    changeTide(this.tide);
  }
}

const highTide = new TideEncounter({
  tide: 'high',
  description: () => {
    return`You hear the roar of rushing water and a wave of brown sludge thunders through the trees and washes around your ankles.
        Within ${roll(10)} minutes the water is 5 feet deep and you're treading water.`
  },
  image:`https://i.giphy.com/media/KYWdVhA36WuRLyiy9H/giphy.webp`,
});
const lowTide = new TideEncounter({
  tide: 'low',
  description: () => {
    return`You hear the roar of rushing water and you are swept away, banging against obstacles, as the floodwater drains rapidly.
        Within ${roll(10)} minutes the water is gone completely and you're standing ankle-deep in mud.`;
  },
  image:`https://www.gizmodo.com.au/wp-content/uploads/sites/2/2014/08/01/qidj7fkfi3d1ryii9vng.gif`,
});

async function handleTides(location: Location, _initialLocation?: boolean): Promise<void> {
  const hitherLocation = location as HitherLocation;
  if (hitherLocation.tide) {
    changeTide(hitherLocation.tide);
  } else {
    changeTide(roll(2) === 2 ? 'high' : 'low');
  }
  const newTide = hitherLocation.tide ?? currentTideLevel;
  if (newTide === currentTideLevel) {
    return;
  }
  currentTideLevel = newTide;
  const encounter = currentTideLevel === 'low' ? lowTide : highTide;
  if (encounter.onlyOnce && encounter.resolved) {
    return;
  }
  await encounter.show(hitherLocation);
}

if (typeof window === 'undefined') {
  import('../server/serverNavigate').then(({ registerGoToLocationCallback }) => {
    registerGoToLocationCallback(handleTides);
  });
}


const mudTrap: Failure = (priorDepth = 0) => {
  const depth = Math.min(10, priorDepth + roll(4));
  return {
    description:`You have sunk ${depth} feet into the muck and are restrained. If you are not completely submerged, make a Strength check to escape.`,
    failure: makeSavingThrow(
      10 + depth,
      mudTrap.bind(null, depth),
      () => ({
        description:`You manage to claw your way to safety`,
      }),
    ),
  };
};

class RiddleEncounter extends HitherEncounter {
  constructor(riddle: string, answer: string | string[]) {
    const quizzer = randomFrom(['boggle', 'satyr', 'blink dog', 'pixie', 'quickling', 'redcap', 'dryad', 'darkling', 'grig']);
    const images: Record<string, string> = {
      'boggle': 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2021/08/Boggle-5e-Cropped.jpg?q=50&fit=crop&w=750&dpr=1.5',
      'satyr': 'https://cdn.inprnt.com/thumbs/29/e0/29e047df5e2c0f5365dd4914ea9c9c30@2x.jpg',
      'blink dog': 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2021/08/blink-dog-Cropped.jpg?q=50&fit=crop&w=750&dpr=1.5',
      'pixie': 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2022/07/Pixie-DnD.jpg?q=50&fit=crop&w=750&dpr=1.5',
      'quickling': 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2021/08/quickling-Cropped.jpg?q=50&fit=crop&w=750&dpr=1.5',
      'redcap': 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2021/08/Redcap-5e-Cropped.jpg?q=50&fit=crop&w=750&dpr=1.5',
      'dryad': 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2021/08/Dryad-Cropped.jpg?q=50&fit=crop&w=750&dpr=1.5',
      'darkling': 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2022/07/Darkling-DnD.jpg?q=50&fit=crop&w=750&dpr=1.5',
      'grig': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlNIevPEXaTmiwGJWwozpIzgQ8V2o_a3mX1kddVBTybDSHC3j62ardqjeQAaglY1O2CdM&usqp=CAU',
    };

    const feedback = (guess: string) => {
      if (Array.isArray(answer) ? answer.some(a => guess.toLowerCase().includes(a)) : guess.toLowerCase().includes(answer.toLowerCase().trim())) {
        this.onlyOnce = true;
        return {
          description: `"Correct!" says the ${quizzer} before pointing the way forward.`,
        };
      } else {
        return {
          description: `"Wrong!" says the ${quizzer} before disappearing laughing into the woods.`,
        };
      }
    };

    super({
      name:`${answer} Riddle`,
      description: `A ${quizzer} approaches and offers to point the way to your destination, if you can answer their riddle: ${riddle}`,
      feedback,
      image: images[quizzer],
    });
  }
}

const riddleEncounters = [
[`It has a golden head. It has a golden tail. It has no body. What is it?`, `Coin`],
[`It wears a leather coat to keep its skins in working order. Escorts you to other realms, without a magic portal. What is it?`, `Book`],
[`It dampens as it dries. What is it?`, `Towel`],
[`What has no arms between its hands and its face?`, `Clock`],
[`What kind of coat is always wet when you put it on?`, `Paint`],
[`Many have heard me, yet nobody has seen me. I won't speak back unless spoken to. What am I?`, `Echo`],
[`What word become shorter when you add two letters?`, `Short`],
[`What is not alive but grows, does not breaths but needs air?`, `Fire`],
[`Better old than young; the healthier it is, the smaller it will be.`, `Wound`],
[`This fire is smothered best not by water or sand but by words. What is it?`, `Desire`],
[`Two friends travel together in step, one nearly useless without the other.`, `Boots`],
[`Feed me and I will live, give me a drink and I will die. What am I?`, `Fire`],
[`A curved stick and a straight twig means red sap and a snapped trunk. What happened?`, `Arrow`],
// [`No warning of Timber could have stopped the dropping petals.`, `Death by axe`],
[`A fitting cravat for one's final suit. What happened?`, `Hang`],
[`I build castles, yet tear down mountains, make some men blind, and others see. What am I?`, `Sand`],
[`As I was going to St Ives I met a man with 7 wives. Each wife had 7 kids. Each kid had 7 cats. Each cat had 7 kittens. How many were going to St Ives?`, [`1`, `One`]],
// [`What do banana, grammar and assess all have in common?`, `if you take the first letter and put it on the end of the word, reading it backwards they spell the same word`],
[`Twelve men walking by, twelve pears hanging high. Each took a pear and left eleven hanging there. How did it happen?`, `Each is someone's name`],
[`River bridge crossing, look out for the guards. Can you spell that without any 'R's?`, `THAT`],
[`What is it that you carry when you need it not, but throw out when you do need it?`, `Anchor`],
[`The foolish man wastes me, The average man spends me, And wise man invests me, Yet all men succumb to me. What am I?`, `Time`],
[`What is something that dawns on you even when it shouldn't?`, `Obvious`],
[`When you come to the end of all you know, I am there. Who am I? A hint: I start out wonderful, but end in sorrow.`, `W`],
[`What has four legs in the morning, two legs in the afternoon and three legs in the evening?`, [`Man`, `Human`]], // `A Man. when he was a child he crawled on all four, when he was older, he walked on two legs and when he was old aged, he used a cane`],
[`I'm made out of five letters, And I'm made out of seven letters; I have keys but I don't have locks, I'm concerned with time, but not with clocks. What am I?`, `Piano`],
[`Forty white horses on a red hill. They champ, they stamp, and then stand still. What are they?`, `Teeth`],
[`I can fly like a bird not in the sky, which can always swim and can always dry. I say goodbye at night and morning hi. I'm part of you, what am I? I follow and lead as you pass, dress yourself in black my darkness lasts. I flee the light but without the sun, Your view of me would be gone.`, `Shadow`],
[`I am what men love more than life, fear more than death or mortal strife, what dead men have and rich require. I'm what contented men desire. What am I?`, `Nothing`],
[`Two men drink poisoned iced tea. One man drinks his fast and lives. The other man drinks his slow and dies. How is this possible?`, `Ice`], //`The poison is in the ice not the tea. The ice melts in the slower drinker's tea`],
[`Towns without houses, forests without trees, mountains without boulders and waterless seas. What am I?`, `Map`],
[`Two bodies in one, the longer I stand, the faster I run. What am I?`, `Hourglass`],
[`Men desire me in public, but fear me in private. What is it?`, `Truth`],
[`What is so fragile, even speaking its name will break it?`, `Silence`],
[`What must you first give to me in order to keep it?`, `Word`], // `Your Word`
[`Though I'm tender, I'm not to be eaten, Nor -- though, mint fresh -- your breath to sweeten. What am I?`, [`Money`, `Coin`]], // `Legal tender; minted coins`
[`You never see it, but it's almost always there, and most people quickly notice when it's absent.`, [`Air`, `Oxygen`]], // `Oxygen/Breathable Air`
[`An untiring servant it is, carrying loads across muddy earth. But one thing that cannot be forced, is a return to the place of its birth. What is it?`, `River`],
[`The first is blessed. The second is slow. Playful is the third. Bold is the fourth. Brave is the fifth. What is it?`, `Blade`],
[`Brought to the table. Cut and served. Never eaten. What are they?`, `Cards`],
[`It can pierce the best armor, and make swords crumble with a rub. Yet for all its power, it can't harm a club. What is it?`, `Rust`],
[`It is a journey whose path depends, on an other's vision of where it ends. What is it?`, [`Story`, `Book`, `Play`]],
[`Men seize it from its home, tear apart its flesh, drink the sweet blood, then cast its skin aside. What is it?`, `Orange`],
[`Names give power, Magic to control. But what is broken, by naming it?`, `Silence`],
[`Passed from father to son, And shared between brothers. Its importance is unquestioned, Though it is used more by others. What is it?`, `Name`],
[`Today he is there to trip you up, And he will torture you tomorrow. Yet he is also there to ease the pain, When you are lost in grief and sorrow. What is he?`, `Alcohol`],
[`In the form of fork or sheet, I hit the ground. And if you wait a heartbeat, You can hear my roaring sound.`, `Lightning`],
[`I have no tears but I perspire, I stretch but cannot respire, I can jump, walk, run and dance, Though I have no mind. I'll take a stance. What am I?`, `Leg`],
// TODO: review below:
[`The beast of the plains, it goes through the ground, constantly on the search for its next meal. While it hates the taste of dwarves and elves, it loves the taste of halfling.`, `Bulette`],
[`This thing can stay completely hidden in even the broadest of daylight. In halls and rooms that monster waits to ambush its next victim. Watch out from below, because it is the floor that this thing waits.`, `Rug of smothering`],
[`In the world below, almost everything below has a heart as dark as their surroundings. This thing is the one exception, giving a light glow in the world of the Underdark.`, `Flumph`],
[`You keep it, but it never ages. Once shared it is gone forever.`, `Secret`],
[`I can bring down the mightiest of men. Nobody can defy me. I am the enemy of flight. Yet you can't even sense my presence. What am I?`, `Gravity`],
[`The more you walk on me the more we get along, and while other may still use me, with you is where I belong. What am I?`, `Shoes`],
[`I give mirth and merriment and they say I smell quite old but I can turn a timid man into one that is quite bold. What am I?`, `Wine`],
[`I am green with envy when I am placed below the sky. I do not breathe the air you breathe but I never wonder why. If you go and shelter me, I simply shrink and die. The answer to this riddle is simply who am I?`, `A plant`],
[`I guard precious treasures and yet my body never moves, but I open like a book when something of yours is used. When finally I'm gutted always feel quite blue. I always feel so useless without the gold that I consume. What am I?`, `A Treasure Chest`],
[`My body's thin and slender and I grow shorter every day. You can use my single purpose, and I'll be sure to lead the way. When I am placed upon a pastry then my life is soon to fade. What am I?`, `A candle`],
[`I am what's desired above of all fame and wealth. Without me it's assured that you'll begin to lose your health. I'm not a fluid dancer, but you can put me on a shelf. What am I?`, `Food`],
[`I give people purpose, I am the gardener pulling weeds. In fact I keep a watchful eye over everybody's deeds. I am the cobbler making shoes I am the blacksmith shoeing steeds. What am I?`, `A job`],
[`Born by fire, stone, or rain I feel most comfortable at home on the planes. When I am out of my element, I feel much disarray. What am I?`, `An elemental`],
[`I am gifted to you only when I am unwanted. I have the power to kill kings or the lowliest paupers. My strength is unquestioned and I move far and wide, yet my power can falter from potions imbibed. What am I?`, `Sickness or Disease`],
[`The more you take out the bigger I get. What am I?`, `A hole`],
[`I am green for some time, but blue thereafter. If it is dark, I am likely to eat you. What am I?`, `Grue`],
[`Up and down they go and travel, but never do they move an inch.`, `Stairs`],
[`8 _ _ _ 1 _ _ _ 2 0'`, `549763 (Put all the numbers in alphabetical order)`],
[`Halo of water, tongue of wood, skin of stone and long I've stood. My fingers short reach to the sky, inside my heart men live and die. What am I?`, `Castle`],
[`Flying on invisible wings. I am massive in size. Then if my master commands, I am as small as he wishes. All men wish to own me, but when I touch them, They cannot touch me. I cry when I am with my brothers. Darkness follows wherever I go. I'm a friend, I'm an enemy. I am freedom. What am I?`, `A Cloud`],
[`A face I do have, but see I do not. When they see my hands, they oft ponder in thought`, `A watch`],
[`The more you take, the more you leave behind. What am I?`, `Footsteps`],
[`What kind of room can you never enter?`, `A Mushroom`],
[`What is long, brown, and sticky?`, `A stick`],
[`What has a head and a tail, can flip but has no legs?`, `A coin`],
[`What is black when you buy it, red when you use it, and white when you throw it away?`, `Coal`],
[`What belongs to you, but other people use it more than you do?`, `Your name`],
[`Tall I am young, Short I am old, While with life I glow, Wind is my foe. What am I?`, `A candle`],
[`I can build castles, I can stop a flood, I can show the time flow, I can make people blind, I can make others see. What am I?`, `Sand`],
[`If I'm in front I don't matter, If I'm in back I make everything be more, I am something yet I am nothing. What am I?`, `Zero`],
[`I shine brightest in the dark. I am there but cannot be seen. To have me costs you nothing. To be without me costs you everything.`, `Hope`],
[`I am taken from a mine, and shut up in a wooden case, from which I am never released, and yet I am used by almost everybody.`, `Pencil lead`],
[`What goes round the house and in the house but never touches the house?`, `The sun`],
[`What comes once in a minute, twice in a moment, but never in a thousand years?`, `The letter M`],
[`He who has it doesn't tell it. He who takes it doesn't know it. He who knows it doesn't want it. What is it?`, `Counterfeit money`],
[`What goes round and round the wood but never goes into the wood?`, `The bark of a tree`],
[`I have a little house in which I live all alone. It has no doors or windows, and if I want to go out I must break through the wall.`, `A chick in an egg`],
[`There are four siblings in this world, all born together. The first runs and never wearies. The second eats and is never full. The third drinks and is always thirsty. The fourth sings a song forever.`, `Water, fire, earth, wind`],
[`A cloud was my mother, the wind is my father, my son is the cool stream, and my daughter is the fruit of the land. A rainbow is my bed, the earth my final resting place, what am I?`, `Rain`],
[`Poke your fingers in my eyes and I will open wide my jaws. Linen cloth, quills or paper, all will split before my might. What am I?`, `Shears/Scissors`],
[`What goes with a carriage, comes with a carriage, is of no use to a carriage and yet the carriage cannot go without it?`, `Noise`],
[`What stands on one leg with its heart in its head?`, `A cabbage`],
[`It's been around for millions of years, but it's no more than a month old. What is it?`, `The moon`],
[`I met a man with a load of wood which was neither straight nor crooked. What kind of wood was it?`, `Sawdust`],
[`What binds two people yet touches only one?`, `A wedding ring`],
[`I am the beginning of sorrow and the end of sickness. There's no happiness without me nor is there sadness. I am always in risk, yet never in danger. You will find me in the sun, but I am never out of darkness.`, `The letter S`],
[`What holds water yet is full of holes?`, `A sponge`],
[`Lives without a body, hears without ears, speaks without a mouth, to which the air alone gives birth.`, `An echo`],
[`What goes into the water red and comes out black?`, `A red-hot poker`],
[`When one does not know what it is, then it is something. When one knows what it is, then it is nothing.`, `A riddle`],
[`It is the beginning of eternity, the end of time and space, the beginning of the end and the end of every space. What is it?`, `The letter E`],
[`What tastes better than it smells?`, `A tongue`],
].map(([riddle, answer]) => new RiddleEncounter(riddle as string, answer));

export const encounters = [
  ...riddleEncounters,

  // Tide encounters
  highTide,
  lowTide,

  // Forced encounters
  new ForcedEncounter({
    name:`Balloon Crash`,
    description:`In the distant sky, Eaton spots a great balloon made of patchwork material. It spins out of control as though punctured, causing the wicker basket that hangs from it to swing wildly. The balloon plunges out of sight, disappearing into the fog approximately a mile away.`,
    image: 'https://media.dndbeyond.com/compendium-images/twbtw/JtUXxjur9QWtb7E3/02-001.chapter-splash.jpg',
    onlyOnce: true,
  }),
  new ForcedEncounter({
    name:`Giant crane flees`,
    description:`As you reach the marshy ground, a giant crane previously hidden by the fog emerges and takes flight.`,
    image: 'https://goldengateaudubon.org/wp-content/uploads/aurich2.jpg',
    onlyOnce: true,
  }),
  new ForcedEncounter({
    name:`Queen's Way Brigands`,
    description:`Coming from one direction are several voices joined in a marching song. The singing grows louder as six bipedal rabbits wearing clothing emerge from the fog. Two of them tug at the reins of a giant snail, and the others carry clubs and slings.`,
    image: 'https://storage.googleapis.com/dream-machines-output/826dddb9-4409-4879-bb6a-d21007e4d5f5/0_0.png',
    onlyOnce: true,
  }),
  new ForcedEncounter({
    name:`Agdon Longscarf`,
    description:`An odd feeling suddenly comes over you as you become aware that somewhere along the way, a hunched, hooded figure has joined the group.

        He casts off his cloak with a flourish, revealing a Harengon with a wide grin on his face and wearing a 15-foot-long, bright blue scarf. He holds a hot branding iron in one hand and a small round shield in the other.

        The sound of a bagpipe erupts from somewhere up ahead.`,
    image: 'https://media.dndbeyond.com/compendium-images/twbtw/JtUXxjur9QWtb7E3/02-006.agdon-longscarf.png',
    onlyOnce: true,
  }),
  new ForcedEncounter({
    name:`Ufgunk`,
    description:`Up ahead, through the morass and fog, you can make out the form of a humanoid-frog sitting on the edge of a river.`,
    image:`https://res.cloudinary.com/teepublic/image/private/s--dxpAtAfS--/c_crop,x_10,y_10/c_fit,w_830/c_crop,g_north_west,h_1038,w_1038,x_-104,y_-168/l_upload:v1565806151:production:blanks:vdbwo35fw6qtflw9kezw/fl_layer_apply,g_north_west,x_-215,y_-279/b_rgb:0f7b47/c_limit,f_auto,h_630,q_90,w_630/v1626211540/production/designs/23054648_0.jpg`,
    onlyOnce: true,
  }),
  new ForcedEncounter({
    name:`Screaming Devilkin`,
    description:`The cacophony of screams grow louder up ahead as you approach the shoreline of a large lake. If not for the discord, the landscape would be serene. The winged creatures appear to be the source of the raucous noise.`,
    image: 'https://www.dndbeyond.com/avatars/thumbnails/8006/152/1000/1000/637115709679464710.jpeg',
    onlyOnce: true,
  }),

  // Hazards
  new HitherEncounter({
    name: 'Mud pit',
    description:`Marching across the swamp you blunder into swampy terrain that contains a pit of sucking mud. Make a group Wisdom (Survival) check.`,
    image:`https://pbs.twimg.com/media/ByJxxasCQAIu7nS.jpg`,
    failure: makeSavingThrow(
      10,
      mudTrap,
      () => ({
        description:`You spot and avoid the hazard.`,
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
    description:`In a mist-veiled field of tall swamp grass dotted with clusters of cattails, you hear rustling in the vegetation ahead of you. The sound foreshadows the arrival of six humanoid creatures on stilts. The stilts allow these creatures to move more easily through the muck and to stay above the water. Their movement on stilts is seemingly not reduced by mud or water.`,
    image:`https://media.dndbeyond.com/compendium-images/twbtw/JtUXxjur9QWtb7E3/02-003.stilt-walker.png`,
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
    name:`Gushing O'-Well`,
    description: () =>`${randomFrom(['Harrow', 'John', 'Eaton', 'Throne'])} notices ${roll(4)} items bobbing at the top of the plume`,
  }).validGushing(),
  new HitherEncounter({
    name: 'Dretch of Envy and the Gem of Having That Which Was Denied',
    description:`A repulsive monstrosity capers around the gushing O'-Well, staring covetously at the peak of the water plume.

        On closer inspection you notice a gold-flecked purple jewel embedded in its chest, the gem's beauty in stark contrast to the rest of the beast.`,
    image: 'https://www.dndbeyond.com/avatars/thumbnails/30781/610/1000/1000/638061931201709292.png',
    onlyOnce: true,
  }).validGushing(),

  // Combat encounters
  new HitherEncounter({
    name: 'Mud Mephits',
    description:`Five slow, unctuous creatures of earth and water burst forth from the muck and in between droning complains threaten to attack you unless you can guess their favorite food.`,
    image:`https://www.dndbeyond.com/avatars/thumbnails/18/297/1000/1000/636379807088272583.jpeg`,
  }).validCombat().validTide('low'),
  new HitherEncounter({
    name: 'Cranium rat swarm',
    description:`You think you hear the wind rustling through the leaves until the susurration is punctuated by squeeking telepathic thoughts like "They are here" and "We must find them." You recognize the pitter patter of many rat feet before a swarm of rodents with exposed brains erupts from the underbrush.`,
    image:`https://www.dndbeyond.com/avatars/thumbnails/25746/698/1000/1000/637880558074808985.jpeg`,
  }).validCombat(),
  new HitherEncounter({
    name: 'Intellect Devourer',
    description:`The swamp water recedes and exposes a walking brain protected by a crusty covering and set on bestial clawed legs. Without words it communicates its hunger - for your mind.`,
    image:`https://www.dndbeyond.com/avatars/thumbnails/30831/57/1000/1000/638063804285013333.png`,
  }).validCombat().validTide('low'),
  new HitherEncounter({
    name: 'Dolgaunt and Dolgrims',
    description:`You hear the sound of marching feet and grumbles in Goblin ahead. As you turn a bend and come face to face with the goblins, you realize something is wrong with the squat, deformed things. Each is essentially two goblins crushed into one creature, their misshapen body boasting four arms and a pair of twisted mouths that gibber and slather at the front of a headless torso. The two mouths carry on demented conversations with one another.`,
    image:`https://www.dndbeyond.com/avatars/thumbnails/7725/608/1000/1000/637091619688542557.png`,
  }).validCombat().validTide('low'),
  new HitherEncounter({
    name: 'Slithering Tracker',
    description:`A body floats in the muck. As you look closer, the rippling water forms into a pseudopod topped with a face that screams and lunges at you.`,
    image:`https://www.dndbeyond.com/avatars/thumbnails/25746/651/1000/1000/637880558006828597.jpeg`,
  }).validCombat(),
  new HitherEncounter({
    name: 'Neh-thalggu',
    description:`At first you think the swamp gas is getting thicker, but soon realize something more sinister is making you dizzy.
        You spot an elf leaning against a tree up ahead wearing a glazed look before they jerk unnaturally and fall to the ground in a heap, leaving a spider-like crab attached to the tree and gobbling what looks like brains.`,
    image:`https://www.dndbeyond.com/avatars/thumbnails/28079/897/1000/1000/637961800886575218.jpeg`,
  }).validCombat().validTide('low'),
  new HitherEncounter({
    name: 'Adult Oblex',
    description:`An elf steps from between two trees and notices you:
        "Thank the Lady, someone to help! Please come with me, my friends are trapped."`,
    image:`https://www.worldanvil.com/media/cache/apollo_preview/uploads/images/0ff8c3d73bb7eb00bb85de63e70056bc.jpg`,
  }).validCombat().validTide('low'),
];
