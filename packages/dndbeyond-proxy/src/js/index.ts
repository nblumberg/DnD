import { initAuth } from "./auth";
import { readMonsters } from "./monsters";

initAuth().then(async () => {
  // listEntries("monsters", 1);
  readMonsters();
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
