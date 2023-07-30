function createClothing(properties) {
  let { tags = '' } = properties;
  if (!tags.includes('CLOTHES')) {
    tags = `${tags}, CLOTHES`;
  }
  return {
    ...properties,
    tags,
  };
}

export default [
  createClothing({
    name: 'Boots of Striding & Springing',
    hero: 'https://www.dndbeyond.com/avatars/thumbnails/7/138/1000/1000/636284714659292153.jpeg',
    attunement: 'any',
    rarity: 'uncommon',
    weight: 1,
    description: `While you wear these boots, your walking speed becomes 30 feet, unless your walking speed is higher, and your speed isn't reduced if you are encumbered or wearing heavy armor. In addition, you can jump three times the normal distance, though you can't jump farther than your remaining movement would allow.`,
  }),
  createClothing({
    name: "Hold Hammerhearth's Fancy Hat",
    hero: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStKoI_SkAwhYCkarylw3Ugiyx9csvXRbH6UQ&usqp=CAU',
    attunement: 'any',
    rarity: 'rare',
    weight: 0.2875,
    description: `A fancy wool top hat with a golden eagle feather, this hat was hadnmade by Hold Hammerhearth as a means of helping him deceive his former employer, Preston Glimbow.
        Offers +2 and advantage on Charisma (Deception) checks, makes the wearer appear slightly taller; is particularly fancy.`,
  }),
  createClothing({
    name: 'Robe of Useful Items',
    hero: 'https://www.dndbeyond.com/avatars/thumbnails/7/384/1000/1000/636284764677563266.jpeg',
    rarity: 'uncommon',
    weight: 4,
    tags: 'UTILITY, OUTERWEAR',
    description: `This robe has cloth patches of various shapes & colors covering it. While wearing the robe, you can use an action to detach one of the patches, causing it to become the object or creature it represents. Once the last patch is removed, the robe becomes an ordinary garment.
        * 2x Dagger
        * 2x Bullseye lantern (filled & lit)
        * 2x Steel mirror
        * 2x 10' pole
        * 2x Hempen rope (50' coiled)
        * 2x Sack
        * 4x Wooden Ladder
        * 1x Portable ram
        * 1x 10 gems worth 100gp/each
        * 1x Iron door (up to 10'x10', barred on side of your choice), which you can place in an opening you can reach; it confirms to fit the opening, attaching & hinging itself
        * 1x Window (2'x4'x2'), which you can place on a vertical surface you can reach
        * 1x Pit (10' cube), which you can place on the ground within 10' of you
        * 1x Mastiff
        * 1x Scroll of Revivify`,
  }),
  createClothing({
    name: 'Clothes, fine',
    hero: 'https://i.etsystatic.com/8701180/r/il/5b6982/1857081158/il_1140xN.1857081158_pmu9.jpg',
    description: `This set of clothes is designed specifically to be expensive and to show it, including fancy, tailored clothes in whatever fashion happens to be the current style in the courts of the nobles. Precious metals and gems could be worked into the clothing.`,
    tags: 'SOCIAL, OUTWEAR',
    weight: 6,
  }),
  createClothing({
    name: 'Clothes, fine',
    hero: 'https://di2ponv0v5otw.cloudfront.net/posts/2022/03/18/623552fc691412ba2e4ee7c7/m_wp_623552fc691412ba2e4ee7c8.webp',
    description: `This set of clothes is designed specifically to be expensive and to show it, including fancy, tailored clothes in whatever fashion happens to be the current style in the courts of the nobles. Precious metals and gems could be worked into the clothing.`,
    tags: 'SOCIAL, OUTWEAR',
    weight: 6,
  }),
  createClothing({
    name: 'Clothes, fine',
    hero: 'https://i.etsystatic.com/12112987/r/il/4a21d2/3247332148/il_1588xN.3247332148_rrwo.jpg',
    description: `This set of clothes is designed specifically to be expensive and to show it, including fancy, tailored clothes in whatever fashion happens to be the current style in the courts of the nobles. Precious metals and gems could be worked into the clothing.`,
    tags: 'SOCIAL, OUTWEAR',
    weight: 6,
  }),
  createClothing({
    name: 'Clothes, fine',
    hero: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSiTi89N4chK5TZw4xHJLk17wV89UqcON5a6Qs6C3W_S--gs7IA4QdTp34vDrVdlU6eHDRGmGoUczuzWjtFoqs6hizW5WFTVg',
    description: `This set of clothes is designed specifically to be expensive and to show it, including fancy, tailored clothes in whatever fashion happens to be the current style in the courts of the nobles. Precious metals and gems could be worked into the clothing.`,
    tags: 'SOCIAL, OUTWEAR',
    weight: 6,
  }),
  createClothing({
    name: 'Clothes, fine',
    hero: 'https://i.pinimg.com/236x/bf/5b/90/bf5b90cb01bc2f5164bcebea2620d198--costumes-for-men-medieval-costume.jpg',
    description: `This set of clothes is designed specifically to be expensive and to show it, including fancy, tailored clothes in whatever fashion happens to be the current style in the courts of the nobles. Precious metals and gems could be worked into the clothing.`,
    tags: 'SOCIAL, OUTWEAR',
    weight: 6,
  }),
  createClothing({
    name: 'Clothes, fine',
    hero: 'https://preview.redd.it/t37zuy9ap3731.jpg?auto=webp&s=f6174e92db6109683bfcf2bf1941ef069a8d3eec',
    description: `This set of clothes is designed specifically to be expensive and to show it, including fancy, tailored clothes in whatever fashion happens to be the current style in the courts of the nobles. Precious metals and gems could be worked into the clothing.`,
    tags: 'SOCIAL, OUTWEAR',
    weight: 6,
  }),
  createClothing({
    name: 'Clothes, fine',
    hero: 'https://i.pinimg.com/originals/4a/97/d6/4a97d680158f4ebee718f646df3b7cf5.jpg',
    description: `This set of clothes is designed specifically to be expensive and to show it, including fancy, tailored clothes in whatever fashion happens to be the current style in the courts of the nobles. Precious metals and gems could be worked into the clothing.`,
    tags: 'SOCIAL, OUTWEAR',
    weight: 6,
  }),
  createClothing({
    name: 'Clothes, fine',
    hero: 'https://listverse.com/wp-content/uploads/2019/03/Gilbert-de-Clare.jpg',
    description: `This set of clothes is designed specifically to be expensive and to show it, including fancy, tailored clothes in whatever fashion happens to be the current style in the courts of the nobles. Precious metals and gems could be worked into the clothing.`,
    tags: 'SOCIAL, OUTWEAR',
    weight: 6,
  }),
  createClothing({
    name: 'Clothes, fine',
    hero: 'https://m.media-amazon.com/images/I/51u7HUguldL._AC_UY741_.jpg',
    description: `This set of clothes is designed specifically to be expensive and to show it, including fancy, tailored clothes in whatever fashion happens to be the current style in the courts of the nobles. Precious metals and gems could be worked into the clothing.`,
    tags: 'SOCIAL, OUTWEAR',
    weight: 6,
  }),
  createClothing({
    name: 'Hat of Disguise',
    hero: 'https://i.etsystatic.com/6491228/r/il/48ac12/3029574401/il_fullxfull.3029574401_jbr7.jpg',
    description: `While wearing this hat, you can use an action to cast the <em>disguise self</em> spell from it at will. The spell ends if the hat is removed.`,
    attunement: 'any',
    tags: 'WONDROUS, DECEPTION, HEADWEAR, 7/2/23',
    rarity: 'uncommon',
    weight: 0.5,
  }),
  createClothing({
    name: 'Scarf of Resolve',
    hero: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP7YaMUMEsIzaE7cOIMY0XKsg_zUgGv4pkgfPV-Dz6jhGR5LA48_dexPnRXz74JDalsVM&usqp=CAU',
    description: `This luxurious knit scarf allows the wearer to stand firm in the face of fearsome or intimidating foes whether in battle or in bargain-making. It is also very cozy. When attuned to the scarf, you are immune to the frightened condition and also gain advantage on Wisdom (Insight) and Charisma (Persuasion) checks related to haggling.`,
    tags: 'WONDROUS, OUTWEAR, 7/2/23',
    rarity: 'rare',
    weight: 0.25,
  }),
];
