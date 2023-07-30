function createWondrousItem(properties) {
  let { tags = '' } = properties;
  if (!tags.includes('WONDROUS')) {
    tags = `${tags}, WONDROUS`;
  }
  return {
    ...properties,
    tags,
  };

}

export default [
  createWondrousItem({
    name: 'Bag of Holding',
    hero: 'https://www.dndbeyond.com/avatars/thumbnails/7/120/1000/1000/636284708068284913.jpeg',
    weight: 15,
    tags: 'UTILITY, CONTAINER',
    description: `This bag has an interior space considerably larger than its outside dimensions, roughly 2 feet in diameter at the mouth and 4 feet deep. The bag can hold up to 500 pounds, not exceeding a volume of 64 cubic feet. The bag weighs 15 pounds, regardless of its contents. Retrieving an item from the bag requires an action.
        If the bag is overloaded, pierced, or torn, it ruptures and is destroyed, and its contents are scattered in the Astral Plane. If the bag is turned inside out, its contents spill forth, unharmed, but the bag must be put right before it can be used again. Breathing creatures inside the bag can survive up to a number of minutes equal to 10 divided by the number of creatures (minimum 1 minute), after which time they begin to suffocate.
        Placing a bag of holding inside an extradimensional space created by a handy haversack, portable hole, or similar item instantly destroys both items and opens a gate to the Astral Plane. The gate originates where the one item was placed inside the other. Any creature within 10 feet of the gate is sucked through it to a random location on the Astral Plane. The gate then closes. The gate is one-way only and can't be reopened.`,
  }),
  createWondrousItem({
    name: 'Wand of Magic Detection',
    hero: 'https://www.dndbeyond.com/avatars/thumbnails/7/474/1000/1000/636284782882788348.jpeg',
    rarity: 'uncommon',
    type: 'wand',
    charges: '3/☀️',
    activate: '1A',
    target: "🧙30'🌐",
    target_long_form: "Self 30' sphere",
    duration: '10m🧠',
    duration_long_form: '10 minutes (concentration)',
    weight: 0.02,
    description: `This wand has 3 charges. While holding it, you can expend 1 charge as an action to cast the detect magic spell from it. The wand regains 1d3 expended charges daily at dawn.`,
  }),
  createWondrousItem({
    name: 'Driftglobe',
    hero: 'https://www.dndbeyond.com/avatars/thumbnails/7/192/1000/1000/636284728787568027.jpeg',
    rarity: 'uncommon',
    weight: 1,
    activate: '1A',
    target: "20'/60'🌐",
    duration: '1hr',
    charges: '1/☀️',
    tags: 'UTILITY, LIGHT',
    description: `This small sphere of thick glass weighs 1 lb. If you are within 60' of it, you can speak its command word and cause it to emanate the light or daylight spell. Once used, the daylight effect can't be used again until the next dawn.
        You can speak another command word as an action to make the illuminated globe rise into the air and float no more than 5' off the ground. The globe hovers in this way until you or another creature grasps it. If you move more than 60' from the hovering globe, it follows you until it is within 60' of you. It takes the shortest route to do so. If prevented from moving, the globe sinks gently to the ground and becomes inactive, and its light winks out.`,
  }),
  createWondrousItem({
    name: 'Immovable Rod',
    hero: 'https://www.dndbeyond.com/avatars/thumbnails/7/261/1000/1000/636284741670235041.jpeg',
    rarity: 'uncommon',
    weight: 5,
    description: `This flat iron rod has a button on one end. You can use an action to press the button, which causes the rod to become magically fixed in place. Until you or another creature uses an action to push the button again, the rod doesn't move, even if it is defying gravity. The rod can hold up to 8,000 pounds of weight. More weight causes the rod to deactivate & fall. A creature can use an action to make a DC 30 Strength check, moving the fixed rod up to 10 feet on a success.`,
  }),
  createWondrousItem({
    name: 'Rope of Climbing',
    hero: 'https://static.wikia.nocookie.net/forgottenrealms/images/1/16/Rope_of_climbing_W%26S.PNG',
    rarity: 'uncommon',
    weight: 3,
    tags: 'UTILITY, MOVEMENT',
    description: `This 60' length of silk rope weighs 3 lbs. & can hold up to 3,000 lbs. If you hold one end of the rope & use an action to speak the command word, the rope animates. As a bonus action, you can command the other end to move toward a destination you choose. That end moves 10' on your turn when you first command it & 10' on each of your turns until reaching its destination, up to its maximum length away, or until you tell it to stop. You can also tell the rope to fasten itself securely to an object or to unfasten itself, to knot or unknot itself, or to coil itself for carrying.
        If you tell the rope to knot, large knots appear at 1' intervals along the rope. While knotted, the rope shortens to a 50' length & grants advantage on checks made to climb it.
        The rope has AC 20 & 20 hit points. It regains 1 hit point every 5 minutes as long as it has at least 1 hit point. If the rope drops to 0 hit points, it is destroyed.`,
  }),
  createWondrousItem({
    name: 'Goggles of Night',
    hero: 'https://www.dndbeyond.com/avatars/thumbnails/7/235/1000/1000/636284736878181910.jpeg',
    rarity: 'uncommon',
    weight: 0.5,
    tags: 'DETECTION, EYEWEAR',
    description: `While wearing these dark lenses, you have darkvision out to a range of 60 feet. If you already have darkvision, wearing the goggles increases its range by 60 feet.`,
  }),
  createWondrousItem({
    name: 'Portable Hole',
    hero: 'https://i.pinimg.com/originals/be/ba/32/beba322c04debe063921c734b699c731.jpg',
    height: `10'`,
    weight: 0,
    tags: 'UTILITY, CONTAINER, 2/21/23',
    description: `<p>A fine black cloth, soft as silk. No matter what's in it, it weighs next to nothing.</p>

        <p>1 action: Fold/close (handkerchief size), or unfold/open (6' diameter circle) on/against a solid surface. Creates an extradimensional cylindrical hole 10' deep. Can't create open passages.</p>

        <p>1 action (DC 10 STR check): escape closed hole. Appear within 5' of the portable hole/creature carrying it. 10 min. of air in closed hole.</p>

        <p>Don't put inside other magic items that create extradimensional spaces!</p>
        `,
  }),
  createWondrousItem({
    name: 'Clockwork Key',
    hero: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b2fc566a-2472-4016-8f9c-2f1ce3aa3aca/d2t2med-dfbf514e-324f-4dfc-94c5-370875588d4c.jpg/v1/fill/w_344,h_400,q_70,strp/coil_clockwork_key_by_arianhwyvar_d2t2med-400t.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTA0NyIsInBhdGgiOiJcL2ZcL2IyZmM1NjZhLTI0NzItNDAxNi04ZjljLTJmMWNlM2FhM2FjYVwvZDJ0Mm1lZC1kZmJmNTE0ZS0zMjRmLTRkZmMtOTRjNS0zNzA4NzU1ODhkNGMuanBnIiwid2lkdGgiOiI8PTkwMCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.Vhv2SSiNYRyhzDj-9_AiOLn_zw0_4ynxCEhP-3YaWew',
    weight: 0,
    tags: 'UTILITY, 7/2/23',
    description: `If pushed against a humanoid and spun clockwise, the creature's body ages a year, with the opposite happening if it is spun counterclockwise. The key becomes nonmagical when it has been spun eight times. It has already been spun two times.`,
    charges: 6,
  }),
  createWondrousItem({
    name: 'Ice Key',
    hero: 'https://i.pinimg.com/originals/80/be/69/80be699d9daadacae3e8e92b1928bef3.jpg',
    weight: 0,
    tags: 'UTILITY, 7/2/23',
    description: `This key is made of solid, clear ice that is always humid but never truly melts. As an action, you can cast the <em>prestidigitation</em> cantrip from it, but only to chill 1 cubic foot of nonliving material for 1 hour.`,
  }),
  createWondrousItem({
    name: 'Immovable Lock',
    hero: 'https://i.ebayimg.com/images/g/LC8AAOSwK~RZ-VUo/s-l1200.webp',
    weight: 0.5,
    tags: 'UTILITY, 7/2/23',
    description: `When locked, this magical lock gains all the properties of an activated <em>immovable rod</em> (holds 8,000 lbs.). The only non-immovable parts are the locking mechanisms, which can be unlocked with the key or picked (DC 20), deactivating it.`,
  }),
  createWondrousItem({
    name: 'Locking Key',
    hero: 'https://www.1999.co.jp/itbig35/10351906a_m.jpg',
    weight: 0,
    tags: 'UTILITY, 7/2/23',
    description: `This magical key will fit into any unlocked lock and can be used to lock it.`,
  }),
  createWondrousItem({
    name: 'Key Witness',
    hero: 'https://www.magicalomaha.com/shared/images/product/MagicalOmaha-Dragon-Eye-Key-Wall-Plaque.jpg',
    weight: 0,
    tags: 'UTILITY, 7/2/23',
    description: `Touch this key to your temple for 1 min., to become blind to your surroundings & begin to see a backwards recording of 30' from the key, as if looking from its position in every direction. The recording plays out in real time, so you must hold the key there for 1 hour if you wish to look backwards 1 hour. The key records up to 8 years, at which point it deletes its oldest records to make room for new "footage."`,
  }),
  createWondrousItem({
    name: 'Rope of Climbing',
    hero: 'img/Rope of Climbing.webp',
    // hero: 'https://static.wikia.nocookie.net/forgottenrealms/images/1/16/Rope_of_climbing_W%26S.PNG/revision/latest/thumbnail/width/360/height/450?cb=20211107040810',
    height: 60,
    weight: 3,
    tags: 'UTILITY, ADVANTAGE: ATHLETICS, MOVEMENT, EXPLORATION, 7/2/23',
    rarity: 'uncommon',
    description: `<p>This 60' silk rope can hold up to 3,000 lbs., has AC 20 & 20 HP. It regains 1 HP/5 min. while ≥1 HP. At 0 HP, it is destroyed.</p>

    <p>(1 action) hold one end of the rope & the rope animates. (1 bonus action thereafter), the rope moves 10' toward a destination you choose, up to its maximum length away. You can also tell the rope to securely fasten/unfasten itself to/from an object, to knot/unknot, or to coil itself for carrying.</p>

    <p>When knotted, large knots appear at 1' intervals, the rope shortens to 50' & grants advantage on climb checks.</p>`,
  }),

];
