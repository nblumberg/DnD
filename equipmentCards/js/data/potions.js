const potionOfHealingHero = 'https://db4sgowjqfwig.cloudfront.net/campaigns/88422/assets/814917/Potion_of_Healing.png?1515179713';

function createPotion(properties) {
    let { tags = '' } = properties;
    if (!tags.includes('POTION')) {
        tags = `${tags}, POTION`;
    }
    if (!tags.includes('CONSUMABLE')) {
        tags = `${tags}, CONSUMABLE`;
    }
    return {
        activate: '1A',
        charges: '1',
        weight: 0.0625,
        ...properties,
        tags,
    };
}

export default [
    createPotion({
        name: 'Potion of Healing (Greater)',
        hero: potionOfHealingHero,
        damage: '4d4+4💗',
        rarity: 'uncommon',
        tags: 'HEALING',
        weight: 0.5,
        description: `You regain 4d4 + 4 hit points when you drink this potion. The potion's red liquid glimmers when agitated.`,
    }),
    createPotion({
        name: 'Potion of Healing (Superior)',
        hero: potionOfHealingHero,
        damage: '8d4+8💗',
        rarity: 'rare',
        tags: 'HEALING, 2/19/23',
        weight: 0.5,
        description: `You regain 8d4 + 8 hit points when you drink this potion. The potion's red liquid glimmers when agitated.`,
    }),
    createPotion({
        name: 'Potion of Fire Breath',
        hero: 'https://i.pinimg.com/originals/90/76/03/9076038134ed393f921b206e7a26bef5.jpg',
        rarity: 'uncommon',
        charges: '3',
        activate: '1B',
        affect: 'DEX 13',
        target: "1👤30'",
        target_long_form: "one creature within 30'",
        damage: '4d6🔥',
        damage_effect: 'Fire',
        duration: '1hr',
        duration_long_form: '1 hour',
        tags: 'DAMAGE',
        description: `After drinking this potion, you can use a bonus action to exhale fire at a target within 30 feet of you. The target must make a DC 13 Dexterity saving throw, taking 4d6 fire damage on a failed save, or half as much damage on a successful one. The effect ends after you exhale the fire three times or when 1 hour has passed.
        This potion's orange liquid flickers, & smoke fills the top of the container & wafts out whenever it is opened.`,
    }),
    createPotion({
        name: 'Potion of Hill Giant Strength',
        hero: 'https://db4sgowjqfwig.cloudfront.net/campaigns/157632/assets/729430/potion-of-giant-strength.jpg?1493397414',
        rarity: 'uncommon',
        activate: '1A',
        duration: '1hr',
        duration_long_form: '1 hour',
        weight: 0.0625,
        tags: 'BUFF, CONSUMABLE',
        description: `When you drink this potion, your Strength score changes to 21 for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score.
        This potion's transparent liquid has floating in it a sliver of fingernail from a hill giant.`,
    }),
    createPotion({
        name: 'Potion of Water Breathing',
        hero: 'https://www.dndbeyond.com/avatars/24423/642/637829132229702343.jpeg',
        rarity: 'uncommon',
        activate: '1A',
        duration: '1hr',
        duration_long_form: '1 hour',
        tags: 'BUFF, UTILITY, CONSUMABLE',
        description: `You can breathe underwater for 1 hour after drinking this potion. Its cloudy green fluid smells of the sea & has a jellyfish-like bubble floating in it.`,
    }),
    createPotion({
        name: 'Potion of Healing',
        hero: potionOfHealingHero,
        damage: '2d4+2💗',
        weight: 0.5,
        tags: 'HEALING,COMBAT,CONSUMABLE',
        description: `A character who drinks the magical red fluid in this vial regains 2d4 + 2 hit points. Drinking or administering a potion takes an action.`,
    }),
    createPotion({
        name: 'Potion of Greater Restoration',
        hero: 'https://images-na.ssl-images-amazon.com/images/I/6180m4bEHML._SY355_.jpg',
        level: 5,
        activate: '1A',
        target: '✋1👤',
        // components: 'VSM',
        duration: '⚡',
        duration_long_form: 'Instantaneous',
        school: 'Abjuration',
        damage_effect: 'Healing',
        available: 'BARD, CLERIC, DRUID, ARTIFICER, PEACE DOMAIN, THE CELESTIAL',
        tags: 'HEALING',
        description: `You imbue a creature you touch with positive energy to undo a debilitating effect. You can reduce the target's exhaustion level by one, or end one of the following effects on the target:
        One effect that charmed or petrified the target
        One curse, including the target's attunement to a cursed magic item
        Any reduction to one of the target's ability scores
        One effect reducing the target's hit point maximum`,
        materials: 'diamond dust worth at least 100 gp, which the spell consumes',
    }),
    createPotion({
        name: 'Potion of Growth',
        hero: 'https://db4sgowjqfwig.cloudfront.net/images/6048401/811EF378-687E-412E-A410-CDE09788BBC8.jpeg',
        rarity: 'uncommon',
        level: 2,
        activate: '1A',
        target: '✋1👤',
        // components: 'VSM',
        duration: '1min',
        duration_long_form: '1 minute',
        school: 'Transmutation',
        damage_effect: 'Buff',
        weight: 0.0625,
        available: 'SORCERER, WIZARD, ARTIFICER',
        tags: 'BUFF',
        description: `When you drink this potion, you gain the "enlarge" effect of the enlarge/reduce spell for 1d4 hours (no concentration required). The red in the potion's liquid continuously expands from a tiny bead to color the clear liquid around it and then contracts. Shaking the bottle fails to interrupt this process.
        You grow larger for the duration. If the target is unwilling, it can make a CON saving throw. On a success, the potion has no effect.
        Everything the creature is wearing & carrying changes size with it. Any item dropped by an affected creature returns to normal size at once.
        <em>Enlarge.</em> The target's size doubles in all dimensions, and its weight is multiplied by 8. This growth increases its size by one category -- from Medium to Large, for example. If there isn't enough room for the target to double its size, the creature or object attains the maximum possible size in the space available. Until the spell ends, the target also has advantage on STR checks & STR saving throws. The target's weapons also grow to match its new size. While these weapons are enlarged, the target's attacks with them deal 1d4 extra damage.`,
    }),
    createPotion({
        name: 'Potion of Stone Giant Strength',
        hero: 'https://db4sgowjqfwig.cloudfront.net/images/4054128/Potion_of_Stone_Giant_Strength.png',
        rarity: 'rare',
        activate: '1A',
        target: '✋1👤',
        duration: '1hr',
        duration_long_form: '1 hour',
        tags: 'BUFF',
        description: `When you drink this potion, your Strength score changes to 23 for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score.
        This potion's transparent liquid has floating in it a sliver of fingernail from a stone giant.`,
    }),
    createPotion({
        name: 'Potion of Constitution',
        hero: 'https://blackgeyser.wiki.fextralife.com/file/Black-Geyser/potion-of-constitution-potion-consumable-icon-black-geyser-wiki-guide-250px.png',
        rarity: 'rare',
        activate: '1A',
        target: '✋1👤',
        duration: '1hr',
        duration_long_form: '1 hour',
        tags: 'BUFF',
        description: `Drinking this potion adds +5 to your Constitution modifier for 1 hour`,
    }),
    createPotion({
        name: 'Potion of Perception',
        hero: 'https://www.gametruth.com/wp-content/uploads/2019/06/ui_item_potion_DraughtofPerception.png',
        rarity: 'uncommon',
        activate: '1A',
        target: '✋1👤',
        duration: '1hr',
        duration_long_form: '1 hour',
        tags: 'BUFF',
        description: `Drinking this potion adds +5 to your Wisdom (Perception) and Intelligence (Investigation) checks for 1 hour.`,
    }),
    createPotion({
        name: 'Potion of Long Rest',
        hero: 'https://www.scabard.com/user/Pochibella/image/dcd1438fafa29a2e1ba99f15d33bee8a.jpg',
        rarity: 'very rare',
        activate: '1A',
        target: '✋1👤',
        duration: '⚡',
        duration_long_form: 'Instantaneous',
        tags: 'HEALING',
        description: `Drinking this potion grants you all the benefits of a long rest without having to bed down for the night.`,
    }),
    createPotion({
        name: 'Potion of Speed',
        hero: 'https://cdna.artstation.com/p/assets/images/images/031/075/666/large/ana-popescu-potions-6.jpg?1602530455',
        // hero: 'https://static.wikia.nocookie.net/forgottenrealms/images/7/79/Potion_of_speed_5e.png/revision/latest?cb=20210302032548',
        rarity: 'very rare',
        level: 2,
        activate: '1A',
        target: '✋1👤',
        // components: 'VSM',
        duration: '1min',
        duration_long_form: '1 minute',
        school: 'Transmutation',
        damage_effect: 'Buff',
        available: 'SORCERER, WIZARD, ARTIFICER, CIRCLE OF THE LAND (GRASSLAND), OATH OF VENGEANCE, OATH OF GLORY',
        tags: 'BUFF',
        description: `When you drink this potion, you gain the effect of the haste spell for 1 minute (no concentration required). The potion's yellow fluid is streaked with black & swirls on its own.
        Until the spell ends, the target's speed is doubled, it gains a +2 bonus to AC, it has advantage on DEX saving throws, & it gains an additional action on each of its turns. That action can be used only to take the Attack (one weapon attack only), Dash, Disengage, Hide, or Use an Object action.
        When the spell ends, the target can't move or take actions until after its next turn, as a wave of lethargy sweeps over it.`,
        materials: 'a shaving of licorice root',
    }),
    createPotion({
        name: 'Dust of Disappearance',
        hero: 'https://thumbs.dreamstime.com/b/golden-sand-pouch-wooden-table-154963902.jpg',
        rarity: 'uncommon',
        description: `Found in a small packet, this powder resembles very fine sand. There is enough of it for one use. When you use an action to throw the dust into the air, you & each creature & object within 10' of you become invisible for 2d4 minutes. The duration is the same for all subjects, & the dust is consumed when its magic takes effect. If a creature affected by the dust attacks or casts a spell, the invisibility ends for that creature.`,
    }),
    createPotion({
        name: 'Elixir of Health',
        hero: 'https://db4sgowjqfwig.cloudfront.net/campaigns/157632/assets/775855/elixir_of_life.jpg?1504791382',
        rarity: 'rare',
        tags: 'CONSUMABLE, HEALING, 2/19/23',
        description: `When you drink this potion, it cures any disease afflicting you, and it removes the blinded, deafened, paralyzed, and poisoned conditions. The clear red liquid has tiny bubbles of light in it.`,
    }),
];
