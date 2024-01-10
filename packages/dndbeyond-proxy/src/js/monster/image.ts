export function getImage(monsterDetails: HTMLElement): string | undefined {
  let image = (
    monsterDetails.querySelector(
      ".details-aside .image img.monster-image"
    ) as HTMLImageElement
  )?.src;
  if (image && image.startsWith("//")) {
    image = `https:${image}`;
  }
  // Ignore placeholder images
  switch (image) {
    case "https://www.dndbeyond.com/attachments/2/648/beast.jpg":
    case "https://www.dndbeyond.com/attachments/2/650/construct.jpg":
    case "https://www.dndbeyond.com/attachments/2/651/dragon.jpg":
    case "https://www.dndbeyond.com/attachments/2/652/elemental.jpg":
    case "https://www.dndbeyond.com/attachments/2/654/fiend.jpg":
    case "https://www.dndbeyond.com/attachments/2/656/humanoid.jpg":
    case "https://www.dndbeyond.com/attachments/2/657/monstrosity.jpg":
    case "https://www.dndbeyond.com/attachments/2/658/ooze.jpg":
    case "https://www.dndbeyond.com/attachments/2/659/plant.jpg":
    case "https://www.dndbeyond.com/attachments/2/660/undead.jpg":
      return;
  }
  return image;
}
