export function parseImage(main: HTMLElement): string {
  const imageLink: HTMLAnchorElement | null = main.querySelector(
    ".details-aside .image a"
  );
  if (!imageLink) {
    throw new Error("Couldn't find image anchor element");
  }
  const { href: image } = imageLink;
  if (!image) {
    throw new Error("Couldn't find image URL");
  }
  if (!image.startsWith("https:")) {
    return `https:${image}`;
  }
  return image;
}
