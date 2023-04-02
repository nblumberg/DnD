function createPrize(properties) {
    return {
        ...properties,
        tags: 'PRIZE',
    };
}

export default [
    createPrize({
        name: `Prestidigitation wand`,
        hero: `https://cdn.shopify.com/s/files/1/0503/2729/0052/products/778988421606_6_496x413.jpg?v=1652833124`,
        charges: 8,
        level: 1,
        activate: '1A',
        target: "1'🧊10'",
        target_long_form: "1 cubic foot within 10 feet",
        // components: 'VS',
        duration: '1hr',
        duration_long_form: '1 hour',
        school: 'Transmutation',
        damage_effect: 'Utility',
        available: 'BARD, SORCERER, WARLOCK, WIZARD, ARTIFICER',
        tags: 'UTILITY',
        description: `Cast the <em>prestidigitation</em> cantrip. This wand can't be recharged and pops like a bubble when exhausted.
        <ul>
        <li>Harmless sensory effect</li>
        <li>Light/snuff out a small fire</li>
        <li>Clean/soil an object ≤ 1 cu.ft.</li>
        <li>Chill/warm/flavor ≤ 1 cu.ft.</li>
        <li>Draw on an object or a surface</li>
        <li>Create trinket/image in your hand for 1 turn</li>
        </ul>`,
    }),
    createPrize({
        name: `Packet of Pixie Dust`,
        hero: `https://i.etsystatic.com/19430306/r/il/5ce926/2382534942/il_1140xN.2382534942_hyde.jpg`,
        charges: 1,
        activate: '1A',
        target: "1👤",
        target_long_form: "1 Creature",
        duration: '1min',
        duration_long_form: '1 minute',
        description: `As an action, you can sprinkle this dust on yourself or another creature you can see within 5 feet of you. The recipient gains a flying speed of 30 feet and the ability to hover for 1 minute. If the creature is airborne when this effect ends, it falls safely to the ground, taking no damage and landing on its feet.
        A small packet holds enough pixie dust for one use.`,
    }),
    createPrize({
        name: `Bottle of Witchlight Wine`,
        hero: `https://icdn.bottlenose.wine/images/full/565482.jpg`,
        description: `While the bottle is uncorked, it plays calliope music until the bottle is emptied of wine.`,
    }),
    createPrize({
        name: `Unicorn candy horn`,
        hero: `https://content.instructables.com/FVD/IU20/HAFHLBSY/FVDIU20HAFHLBSY.jpg?auto=webp`,
        description: `Replica unicorn horn filled with candy.`,
    }),
    createPrize({
        name: `Cuddly toy spider`,
        hero: `https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/81deM5Q59OL._AC_SL1500_.jpg`,
        charges: 1,
        level: 2,
        activate: '1A',
        target: "🧙",
        target_long_form: "Self",
        // components: 'VSM',
        duration: '1hr',
        duration_long_form: '1 hour',
        school: 'Transmutation',
        damage_effect: 'Buff',
        available: 'SORCERER, WARLOCK, WIZARD, ARTIFICER, CIRCLE OF THE LAND (FOREST), CIRCLE OF THE LAND (MOUNTAIN), CIRCLE OF THE LAND (UNDERDARK)',
        tags: 'BUFF, MOVEMENT',
        description: `You can stroke the spider to gain the benefit of a <em>spider climb</em> spell. Once used, the toy turns into a real spider and crawls away.

        Until the spell ends, you gain the ability to move up, down, and across vertical surfaces and upside down along ceilings, while leaving your hands free. You also gain a climbing speed equal to your walking speed.`,
        materials: 'a drop of bitumen and a spider',
    }),
    createPrize({
        name: `Wizard puppet`,
        hero: `https://i.etsystatic.com/6649219/r/il/051e79/2981541696/il_570xN.2981541696_gnjg.jpg`,
        charges: 3,
        level: 0,
        activate: '1A',
        target: "5'🧊30'",
        target_long_form: "5 foot cube within 30 feet",
        // components: 'SM',
        duration: '1min',
        duration_long_form: '1 minute',
        school: 'Illusion',
        damage_effect: 'Control',
        available: 'BARD, SORCERER, WARLOCK, WIZARD',
        tags: 'CONTROL',
        description: `Glove puppet in the shape of a wizard. As an action, you can move the puppet's arms to cast the <em>minor illusion</em> cantrip. After three uses, the puppet disappears in a puff of smoke.`,
        materials: 'a bit of fleece',
    }),
    createPrize({
        name: `Rainbow pen`,
        hero: `https://quillandpad.com/wp-content/uploads/2018/12/Grayson-Tighe-Rainbow-Fire-7.jpg`,
        charges: 1,
        level: 1,
        activate: '1min',
        target: "✋",
        target_long_form: "Touch",
        // components: 'SM',
        duration: '10d',
        duration_long_form: '10 days',
        school: 'Illusion',
        damage_effect: 'Control',
        available: 'BARD, WARLOCK, WIZARD',
        tags: 'COMMUNICATION',
        description: `A rainbow fountain pen. As an action, you can cast the <em>illusory script</em> spell once before the pen loses its magic.

        Your writing looks correct to those you designate, but looks like something else or unintelligble to others.`,
        extraDescription: `

        Should the spell be dispelled, the original script and the illusion both disappear.

        A creature with <em>truesight</em> can read the hidden message.`,
        materials: 'a lead-based ink worth at least 10 gp, which the spell consumes',
    }),
    createPrize({
        name: `Fake nose`,
        hero: `https://rukminim1.flixcart.com/image/416/416/kjuby4w0/gag-toy/a/y/x/artificial-fake-nose-witch-nose-halloween-nose-horror-nose-amaco-original-imafzbhzpygheghf.jpeg?q=70`,
        description: `A giant fake nose. While wearing the nose, you have advantage on Wisdom (<strong>Perception</strong>) checks that rely on smell. It loses its magic after 8 days and becomes a normal giant fake nose.`,
    }),
    createPrize({
        name: `Story Book`,
        hero: `https://i.pinimg.com/originals/89/db/de/89dbde84f67b19aeb8a627aab82e6a1c.jpg`,
        charges: 1,
        activate: '1A',
        components: 'V',
        duration: '1min',
        duration_long_form: '1 minute',
        target: "1👤5'",
        target_long_form: "One creature within 5 feet",
        affect: 'WIS 13',
        description: `A book filled with fantastical stories.

        Choose 1 creature that you can see within 5' of you that can hear & understand you. It must succeed on a DC 13 WIS saving throw or be <em>charmed</em> by you for 1 min or until you stop reading. While <em>charmed</em>, the creature's speed drops to 0 and it is <em>incapacitated</em> and visibly dazed. On subsequent turns you must take an action to continue reading. Once a complete story is read from the book, the entire book loses its magic.`,
    }),
    createPrize({
        name: `Bonbon pouch`,
        hero: `https://www.mooglyblog.com/wp-content/uploads/2014/04/Bonbon-Kisses-Open.jpg`,
        charges: 8,
        level: 1,
        activate: '1A',
        target: "✋",
        target_long_form: "Touch",
        // components: 'VSM',
        duration: '⚡',
        duration_long_form: 'Instantaneous',
        school: 'Transmutation',
        damage_effect: 'Healing',
        available: 'DRUID, RANGER',
        tags: 'HEALING',
        description: `A tiny paper pouch containing eight bonbons.

        A creature can use its action to eat one bonbon. Eating a bonbon restores 1 hit point, and the berry provides enough nourishment to sustain a creature for one day.

        All bonbons lose their magic after 3 days.`,
        materials: 'a sprig of mistletoe',
    }),
    createPrize({
        name: `Dirty Jokes`,
        hero: `https://i.ebayimg.com/images/g/Nl0AAOSwITdjmSPY/s-l1600.jpg`,
        charges: 8,
        level: 0,
        activate: '1A',
        target: "60'",
        target_long_form: "60 feet",
        components: 'V',
        duration: '⚡',
        duration_long_form: 'Instantaneous',
        damage: '1d4🧠',
        damage_effect: 'Psychic',
        affect: 'WIS 13',
        description: `A book of eight dirty jokes. Once a joke is read, it disappears from the book.

        Reading a joke casts <em>vicious mockery</em>. A failed save causes the target to have disadvantage on the next attack roll it makes before the end of its next turn.`,
    }),
    createPrize({
        name: `Water bottle`,
        hero: `https://i.etsystatic.com/6228712/r/il/1379ca/2164649208/il_fullxfull.2164649208_qu0e.jpg`,
        charges: 1,
        level: 1,
        activate: '1A',
        target: "30'🧊30'",
        target_long_form: "30 foot cube within 30 feet",
        components: 'VSM',
        duration: '⚡',
        duration_long_form: 'Instantaneous',
        damage_effect: 'Creation',
        description: `A reusable Witchlight-themed water bottle. You can cast the <em>create or destroy water</em> spell. Once used this way, the water bottle loses its magic.

        <strong>Create Water.</strong> You create up to 10 gal. of clean water within range in an open container. Alternatively, the water falls as rain in a 30' cube within range, extinguishing exposed flames in the area.

        <strong>Destroy Water.</strong> You destroy up to 10 gal. of water in an open container within range. Alternatively, you destroy fog in a 30' cube within range.`,
        materials: 'a drop of water if creating water or a few grains of sand if destroying it',
    }),
    createPrize({
        name: `Sparkly bell`,
        hero: `https://sparklerider.com/wp-content/uploads/Sparkle-Rider-Swarovski-Sugar-Skull-Bell-Hanger-Mount-with-Swarovski-Crystal-Motorcycle-Bell-0-0-247x296.jpg`,
        charges: 1,
        target: "1👤600'",
        target_long_form: "1 creature within 600 feet",
        description: `A small sparkly bell. When you use an action to ring it, one creature of your choice can hear the ringing, provided the creature is within 600 feet of the bell and not deafened. No other creature hears the sound coming from the bell. Once used, the bell loses its magic.`,
    }),
    createPrize({
        name: 'Yellow cloak',
        hero: 'https://i5.walmartimages.com/asr/ac921d0b-90c7-43dc-9ca2-0f8cf8353839_1.ae5452e3fd0fb659f9db2e1cb9dbcf46.jpeg',
        level: 1,
        activate: '1A',
        target: "60'",
        target_long_form: "60 feet",
        // components: 'V, S, M*',
        duration: '1hr',
        duration_long_form: '1 hour',
        school: 'Conjuration',
        damage_effect: 'Control',
        available: 'BARD, WARLOCK, WIZARD',
        tags: 'CONTROL',
        description: `A magical yellow cloak. While holding the cloak, you can use an action to cast an <em>unseen servant</em> spell, which occupies the cloak. After the spell ends, the cloak ceases to be magical.

        Cloak performs simple tasks at your mental command (bonus action each round) until the spell ends. It has AC 10, 1 HP, STR 2, move 15', & it can't attack.`,
        materials: 'a bit of string & of wood',
    }),
    createPrize({
        name: 'Toy slingshot',
        hero: 'https://64.media.tumblr.com/d442032bd33487462df46a7d53dcdfcd/634acbb092263526-ed/s1280x1920/bf50878971b6666d85667b50d9565f17cf644dd0.jpg',
        level: 1,
        activate: '1A',
        target: "60'",
        target_long_form: "60'",
        // components: 'S',
        duration: '⚡',
        duration_long_form: 'Instantaneous',
        school: 'Transmutation',
        damage: '3d8🔨',
        damage_effect: 'Bludgeoning',
        affect: 'DEX 13',
        available: 'SORCERER, WIZARD, ARTIFICER',
        tags: 'DAMAGE, CONTROL',
        description: `A magical toy slingshot that casts the <em>catapult spell</em> on the bullet you sling. This damage is non-lethal. The slingshot breaks after it has been used this way.

        Sling 1 object (1-5 lbs.) 90'. If it would strike a creature, that creature must make a DEX saving throw or take 3d8 bludgeoning (bullet takes the same damage).`,
    }),
    createPrize({
        name: `Bottle of glue`,
        hero: `https://www.dndbeyond.com/avatars/thumbnails/7/404/1000/1000/636284767755507290.jpeg`,
        charges: 1,
        target: "10'□",
        target_long_form: "10 foot square",
        affect: 'STR 13',
        description: `A bottle of glue. This container holds enough liquid glue to cover an area of 10 square feet. A creature that walks into that area must succeed on DC 13 Strength saving throw or have its speed reduced to 0. The target can use its action to make a Strength check to free itself from the glue (escape DC 13).`,
    }),
    createPrize({
        name: `Scatterleaf Tea`,
        hero: `https://img.freepik.com/premium-photo/dry-tea-leaves-burlap-bag-isolated-white-background_436608-2818.jpg`,
        charges: 1,
        level: 1,
        activate: '1A',
        // components: 'VSM',
        school: 'Abjuration',
        target: "5'⭕️",
        target_long_form: "120 feet",
        duration: '10min',
        duration_long_form: '10 minutes',
        damage_effect: 'Buff',
        description: `You can scatter these tea leaves on the ground in a 5'-radius circle, duplicating the effect of a <em>protection from evil and good</em> spell that lasts for 10 minutes. To gain the spell's protection, a creature must stand in the circle of tea leaves. In addition, a cup of hot, delicious tea magically appears in the protected creature's hands. A pouch contains enough leaves for one use.`,
        materials: 'holy water or powdered silver and iron, which the spell consumes',
    }),
    createPrize({
        name: `Northwind's Acorn`,
        hero: `https://cdna.artstation.com/p/assets/images/images/028/206/594/large/joviaal-artist-nut-spell.jpg?1593778381`,
        description: `A magic bean? Throw it on the ground and see.`,
    }),
    createPrize({
        name: `Cupcake`,
        hero: `http://atreatsaffair.com/wp-content/uploads/2014/03/garden-fairy-chocolate-cupcakes-recipe-.jpg`,
        description: `A cupcake, that when you eat all of it, you become invisible for 1 hour. Anything you wear or carry is invisible with you. The effect ends early if you attack or cast a spell.`,
        tags: 'BUFF, UTILITY, CONSUMABLE',
    }),
    createPrize({
        name: 'Potion of Advantage',
        hero: 'https://i.etsystatic.com/11772875/r/il/9b026f/1512466572/il_570xN.1512466572_nn6s.jpg',
        rarity: 'uncommon',
        charges: 1,
        activate: '1A',
        duration: '1hr',
        duration_long_form: '1 hour',
        tags: 'BUFF, UTILITY, CONSUMABLE',
        description: `When you drink this potion, you gain advantage on one ability check, attack roll, or saving throw of your choice that you make within the next hour.
        This potion takes the form of a sparkling, golden mist that moves and pours like water.`,
    }),
    createPrize({
        name: `Dancing Lights wand`,
        hero: `https://secure.img1-cg.wfcdn.com/im/47978530/resize-h445%5Ecompr-r85/1113/111399491/Magic+Mystical+Unicorn+Horn+Witches+and+Wizards+Wand.jpg`,
        charges: 1,
        level: 0,
        activate: '1A',
        target: "120'",
        target_long_form: "120 feet",
        // components: 'VSM',
        duration: '1min',
        duration_long_form: '1 minute',
        school: 'Evocation',
        damage_effect: 'Utility',
        available: 'BARD, SORCERER, WIZARD, ARTIFICER',
        tags: 'UTILITY',
        description: `Wooden wand with 1 charge can be used to cast <em>dancing lights</em>.

        Create ≤ 4 small floating lights (or 1 medium figure) you can move up to 60' within range as a bonus action. Sheds light in a 10' radius.

        Once used, the wand turns into a tulip.`,
        extraDescription: `You create up to four torch-sized lights within range, making them appear as torches, lanterns, or glowing orbs that hover in the air for the duration. You can also combine the four lights into one glowing vaguely humanoid form of Medium size. Whichever form you choose, each light sheds dim light in a 10-foot radius.

        As a bonus action on your turn, you can move the lights up to 60 feet to a new spot within range. A light must be within 20 feet of another light created by this spell, and a light winks out if it exceeds the spell's range.`,
        materials: 'a bit of phosphorus or wychwood, or a glowworm',
    }),

];
