function createTool(properties) {
  let { tags = '' } = properties;
  if (!tags.includes('TOOL')) {
    tags = `${tags}, TOOL`;
  }
  return {
    ...properties,
    tags,
  };
}

export default [
  createTool({
    name: '+2 Thieves Tools',
    hero: 'https://dicecove.com/wp-content/uploads/thieves-tools-dnd-5e.jpg',
    rarity: 'common',
    weight: 1,
    description: `This set of tools includes a small file, a set of lock picks, a small mirror mounted on a metal handle, a set of narrow-bladed scissors, and a pair of pliers. Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to disarm traps or open locks.`,
    tags: 'UTILITY, EXPLORATION, 7/2/23',
  }),
];
