import { initAuth } from "./auth";
import { saveFeats } from "./feat";

initAuth().then(async () => {
  initAuth();
  saveFeats();
  // listEntries("magic-items", 29);
  // const targets = listWithFieldValue("spells");
  // parseHTML("monsters", targets.slice(targets.indexOf("Sir Godfrey Gwilym")));
  // trimHtml("Two-Headed Crocodile.html");
  // listAllFieldValues(["actions", "*", "*", "attack", "toHit", "target"]);
  // readMonsters();
  // readMonsters([
  //   "First-Year Student",
  //   "Lorehold Apprentice",
  //   "Lorehold Pledgemage",
  //   "Lorehold Professor of Chaos",
  //   "Lorehold Professor of Order",
  //   "Prismari Apprentice",
  //   "Prismari Pledgemage",
  //   "Prismari Professor of Expression",
  //   "Prismari Professor of Perfection",
  //   "Quandrix Apprentice",
  //   "Quandrix Pledgemage",
  //   "Quandrix Professor of Substance",
  //   "Quandrix Professor of Theory",
  //   "Silverquill Apprentice",
  //   "Silverquill Pledgemage",
  //   "Silverquill Professor of Radiance",
  //   "Silverquill Professor of Shadow",
  //   "Witherbloom Apprentice",
  //   "Witherbloom Pledgemage",
  //   "Witherbloom Professor of Decay",
  //   "Witherbloom Professor of Growth",
  //   "Neogi Hatchling Swarm",
  //   "Sahuagin Hatchling Swarm",
  //   "Swarm of Bats",
  //   "Swarm of Cranium Rats",
  //   "Swarm of Insects (Beetles)",
  //   "Swarm of Insects (Centipedes)",
  //   "Swarm of Insects (Spiders)",
  //   "Swarm of Insects (Wasps)",
  //   "Swarm of Insects",
  //   "Swarm of Maggots",
  //   "Swarm of Poisonous Snakes",
  //   "Swarm of Quippers",
  //   "Swarm of Rats",
  //   "Swarm of Ravens",
  //   "Swarm of Rot Grubs",
  //   "Swarm of Scarabs",
  //   "Skeletal Swarm",
  //   "Swarm of Animated Books",
  //   "Swarm of Campestris",
  //   "Swarm of Gremishkas",
  //   "Swarm of Hoard Scarabs",
  //   "Swarm of Zombie Limbs",
  // ]);
  // repairOriginalRequestData();
});
