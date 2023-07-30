function createInstrument(properties) {
  let { tags = '' } = properties;
  if (!tags.includes('INSTRUMENT')) {
    tags = `${tags}, INSTRUMENT`;
  }
  if (!tags.includes('WONDROUS')) {
    tags = `${tags}, WONDROUS`;
  }
  return {
    ...properties,
    tags,
  };
}

export default [
  createInstrument({
    name: 'Discordant Harp',
    hero: 'https://2.bp.blogspot.com/-2OM4bGZUUtU/VES5yRt7TII/AAAAAAAADzo/R7mSLPr8VAE/s1600/03a9fa84af6b0aa5cc66db8138e43242.jpg',
    rarity: 'uncommon',
    weight: 9,
    // target: "60' 1👤🦻",
    // target_long_form: '1 creature within 60 feet who can hear you',
    // affect: 'WIS 13',
    // damage: '1d6🧠',
    description: `<p>This harp is misshapen with permanently grimy strings that magically slip out of tune.</p>
    <p><em>Tritone.</em> (1 action) 1 👤 w/in 60' that can hear you, DC 13 WIS or take 1d6 psychic dmg & subtract 1d4 from the next saving throw it makes before the end of your next turn.</p>
    <p><em>Discordant Melody.</em> (1 action, 1/day) cast the <em>dissonant whispers</em> spell at 1st level (DC 13).</p>`,
    tags: '7/2/23',
  }),
  createInstrument({
    name: 'Instrument of Illusions',
    hero: 'https://i.etsystatic.com/42306574/r/il/94d3c8/4847054857/il_1140xN.4847054857_ljhr.jpg',
    attunement: 'any',
    rarity: 'uncommon',
    weight: 4,
    target: "15'🌐🎸",
    description: `While played this musical instrument can create harmless, illusory visual effects within a 5'-radius sphere centered on the instrument (15' for a bard). The magical effects have neither substance nor sound, & they are obviously illusory. The effects end when you stop playing.`,
    tags: 'SOCIAL, 7/2/23',
  }),
];
