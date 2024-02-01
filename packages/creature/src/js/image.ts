const defaultImageBase = "https://www.dndbeyond.com/attachments/2/";
const defaultImages: Record<string, string> = {
  beast: "648/beast.jpg",
  construct: "650/construct.jpg",
  dragon: "651/dragon.jpg",
  elemental: "652/elemental.jpg",
  fiend: "654/fiend.jpg",
  humanoid: "656/humanoid.jpg",
  monstrosity: "657/monstrosity.jpg",
  ooze: "658/ooze.jpg",
  plant: "659/plant.jpg",
  undead: "660/undead.jpg",
};

export function defaultImage(type: string, src?: string): string {
  return src || `${defaultImageBase}${defaultImages[type]}`;
}
