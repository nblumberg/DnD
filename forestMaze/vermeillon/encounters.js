import { Encounter, makeSavingThrow, takeDamage } from '../encounters.js';
import { randomFrom, roll } from '../random.js';

class ToxicWeirdEncounter extends Encounter {
  constructor() {
    super({
      name: 'Toxic weird',
      description: `The acidic lake water gathers into an undulating, amphorous form and lunges toward you, trying to drown you in a stinging undertow.
        Make a Dexterity saving throw to dodge the crashing wave.`,
      image: 'https://cdn.hearthstonetopdecks.com/wp-content/uploads/2017/04/featured-hotspringguardian.jpg',
      // image: 'https://static.wikia.nocookie.net/moms-basement-dd/images/2/24/6aa84bc0f02ce842cd50dde402ce5aaa.jpg/revision/latest?cb=20181125133502',
      failure: makeSavingThrow(
        10,
        takeDamage({
          description: `The chemicals in the water sear your skin.`,
          damageRoll: 6,
          damageType: 'acid'
        })
      ),
    });
  }
  valid(location) {
    const priorLocation = this.lastLocation;
    this.lastLocation = location;
    return super.valid(location) && priorLocation && priorLocation.acidLake && location.acidLake;
  }
}

const insects = [
  { name: 'giant fire beetles', type: 'fire', image: 'https://www.dndbeyond.com/avatars/thumbnails/9/896/1000/1000/636334287498492864.jpeg' },
  { name: 'giant centipedes', type: 'necrotic', image: 'https://static.wikia.nocookie.net/astrohanasia/images/3/37/Giant_centipede.jpg/revision/latest?cb=20180113225843' },
  { name: 'giant spiders', type: 'piercing', image: 'https://www.dndbeyond.com/avatars/thumbnails/30849/299/1000/1000/638064499038216933.png' },
  { name: 'giant wasps', type: 'poison', image: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/00915a90-0c2a-469d-961a-d534a9ca868a/d7w2pfh-1e93b87c-a894-42f3-bc81-4ebb0ef79c8d.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzAwOTE1YTkwLTBjMmEtNDY5ZC05NjFhLWQ1MzRhOWNhODY4YVwvZDd3MnBmaC0xZTkzYjg3Yy1hODk0LTQyZjMtYmM4MS00ZWJiMGVmNzljOGQuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.If6CA9aGYIJBeCEMBVUnHohBZwBWt-ElFbUbY-YLzZs' },
];
class InsectSwarmEncounter extends Encounter {
  constructor() {
    // Fetching the name of the Encounter dynamically sets the other properties
    const name = () => {
      const quantity = roll(4);
      const { name, type: damageType, image } = randomFrom(insects);

      this.description = `${quantity} swarms of ${name} clatter out of the surrounding thicket and attack.
            Make a Strength saving throw to fight them off.`;
      this.image = image;
      this.failure = makeSavingThrow(
        13,
        takeDamage({
          description: `You dispatch the ${name}, but not before they sting and bite you.`,
          damageRoll: 6,
          damageType,
        }),
        () => ({ description: `You dispatch the ${name} without injury.` }),
      );

      return `${name} swarm`;
    };

    super({
      name
    });
  }
}

export const encounters = [
  new ToxicWeirdEncounter(),
  new Encounter({
    name: 'Cranium rat swarm',
    description: () => `A wave of hunger overcomes you moments before ${roll(5) + 1} rats come scurrying out of the underbrush.
        Each of their heads glows with a dim light, and as they nip at your ankles you realize you can see their exposed brains.
        Make an Intelligence saving throw to steer clear of the swarm.`,
    image: 'https://www.dndbeyond.com/avatars/thumbnails/25746/698/1000/1000/637880558074808985.jpeg',
    failure: makeSavingThrow(
      12,
      takeDamage({
        description: `The rats tear at your flesh before disappearing back into the underbrush.`,
        damage: 1,
        damageType: 'piercing'
      })
    ),
  }),
  new Encounter({
    name: 'Rot zombie',
    description: () => `An emaciated ${randomFrom(['man', 'woman'])} covered in strange growths stumbles toward you and lets out a pitious moan before falling face first into the dirt and lying still.`,
    image: 'https://preview.redd.it/3zi2uyi1gwc61.jpg?width=640&crop=smart&auto=webp&s=0e0b9b73f4d99f7c7115a0ee779a60a69ddeebf6'
  }),
  new Encounter({
    name: 'Spore mushrooms',
    description: `You step among a field of mushrooms.
        The vibrations from your steps cause the fungi to rupture and spew forth a cloud of spores.
        Make a Wisdom saving throw to spot the mushrooms before they rupture.`,
    image: 'https://allthatsinteresting.com/wordpress/wp-content/uploads/2015/06/mushrooms-puffball-exploding.jpg',
    failure: makeSavingThrow(
      10,
      takeDamage({
        description: 'You hack and cough as the spores irritate your throat and sinuses.',
        damageRoll: 4,
        damageType: 'poison'
      })
    ),
  }),
  new Encounter({
    name: 'Sticky slime',
    description: `A sticky slime coats the ground in one corner of the area.`,
    image: 'https://a.rgbimg.com/users/m/mi/micromoth/600/oI2luNC.jpg',
  }),
  new Encounter({
    name: 'Grabbing hands',
    description: () => `${roll(4)} hostile hands reach up through the grass clumps and attempt to grab your ankles.
        Make a Dexterity saving throw to dodge out of the way.`,
    image: 'https://images.pond5.com/zombie-hands-emerging-ground-088917873_prevstill.jpeg',
    failure: makeSavingThrow(
      10,
      takeDamage({
        description: `They grab you with crushing force before you manage to tear your leg away from their grasp.`,
        damageRoll: 4,
        damageType: 'bludgeoning'
      }),
    ),
  }),
  new Encounter({
    name: 'Boggle parade',
    description: `A procession of tiny Boggles march and goop their away across your path in the distance, paying you no mind.`,
    image: 'https://www.dndbeyond.com/avatars/thumbnails/9/594/1000/1000/636329509694817521.jpeg',
  }),
  new InsectSwarmEncounter(),
  new Encounter({
    name: 'Dead Minesian scout',
    description: `A hand reaching through the grass has a tight grip on a small glass medallion bearing the insignia of the Minesian scouts.`,
    image: 'https://serenesforest.net/wp-content/uploads/2014/05/fe10-lehran-holding-the-medallion.png',
  }),
  new Encounter({
    name: 'Stinking cloud',
    description: `A cloud of yellow, nauseating gas spews forth from a fissure in the ground. The cloud spreads around corners, and lingers in the air, heavily obscuring the area.
        Make a Constitution saving throw to weather the gas.`,
    image: 'https://globalnews.ca/wp-content/uploads/2020/05/geys-e1589384043552.jpg?quality=85&strip=all',
    failure: makeSavingThrow(
      10,
      takeDamage({
        description: 'You spend a moment retching and reeling.',
        damageRoll: 4,
        damageType: 'poison'
      }),
    ),
  }),
];
