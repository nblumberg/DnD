import { initAuth } from "./auth";
import { listEntries } from "./listing";

initAuth().then(async () => {
  listEntries("monsters");
  // readMonster("Arakocra", "https://www.dndbeyond.com/monsters/17100-aarakocra");
  // readMonster("Aboleth", "https://www.dndbeyond.com/monsters/16762-aboleth");
  // readMonster(
  //   "Aartuk Weedling",
  //   "https://www.dndbeyond.com/monsters/2821143-aartuk-weedling"
  // );
  // readMonster("Aboleth", "https://www.dndbeyond.com/monsters/16762-aboleth");
});
