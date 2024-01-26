import { initAuth } from "./auth";
import { readMonsters } from "./monsters";

initAuth().then(async () => {
  // listEntries("monsters", 1);
  // trimHtml("Two-Headed Crocodile.html");
  readMonsters();
  // readMonsters([
  //   "Piercer",
  //   "Sahuagin Hatchling Swarm",
  //   "Skeletal Swarm",
  //   "Swarm of Animated Books",
  //   "Swarm of Bats",
  //   "Swarm of Campestris",
  //   "Swarm of Cranium Rats",
  //   "Swarm of Gremishkas",
  //   "Swarm of Hoard Scarabs",
  //   "Swarm of Insects (Beetles)",
  //   "Swarm of Insects (Centipedes)",
  //   "Swarm of Insects (Spiders)",
  //   "Swarm of Insects (Wasps)",
  //   "Swarm of Insects",
  //   "Swarm of Maggots",
  //   "Swarm of Poisonous Snakes",
  //   "Swarm of Quippers",
  //   "Swarm of Rats",
  //   "Swarm of Rot Grubs",
  //   "Swarm of Scarabs",
  //   "Swarm of Zombie Limbs",
  // ]);
  //  readMonsters(undefined, "Sahuagin Hatchling Swarm");
  // repairOriginalRequestData();
  // readMonsters(undefined, "Winged Kobold");
  // readMonster("Arakocra", "https://www.dndbeyond.com/monsters/17100-aarakocra");
  // readMonster("Aboleth", "https://www.dndbeyond.com/monsters/16762-aboleth");
  // readMonster(
  //   "Aartuk Weedling",
  //   "https://www.dndbeyond.com/monsters/2821143-aartuk-weedling"
  // );
  // readMonster("Aboleth", "https://www.dndbeyond.com/monsters/16762-aboleth");
  // readMonster(
  //   "Animated Broom",
  //   "https://www.dndbeyond.com/monsters/1528953-animated-broom"
  // );
  // readMonster(
  //   "Animated Chained Library",
  //   "https://www.dndbeyond.com/monsters/1528954-animated-chained-library"
  // );
  // readMonster(
  //   "Bavlorna Blightstraw",
  //   "https://www.dndbeyond.com/monsters/1979771-bavlorna-blightstraw"
  // );
  // readMonster(
  //   "Bheur Hag",
  //   "https://www.dndbeyond.com/monsters/2560738-bheur-hag"
  // );
  // readMonster(
  //   "https://www.dndbeyond.com/monsters/27734-avatar-of-death",
  //   "https://www.dndbeyond.com/monsters/27734-avatar-of-death"
  // );
});
