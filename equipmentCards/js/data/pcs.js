function makeSection(title, content) {
    if (!content) {
        return '';
    }
    return `<h1>${title}</h1>
    ${content}`;
}

function makeAssociates(associates = {}) {
    const entries = Object.entries(associates);
    if (!entries.length) {
        return '';
    }
    return entries.map(([name, role]) => `${name} (${role})`).join(', ');
}

function createCharacter(properties) {
    const { name, hero, gender, creatureType, size = 'Medium', alignment, height, weight, age, race, appearance, from, associates, ideals, bond, flaws, faith } = properties;
    let { tags = '' } = properties;
    if (!tags.includes('CHARACTER')) {
        tags = `${tags}, CHARACTER`;
    }
    const value = {
        name, hero, gender, creatureType, size, alignment, height, weight, age, 
        tags,
        description: `${makeSection(race, appearance)}
        ${makeSection('From', from)}
        ${makeSection('Associates', makeAssociates(associates))}
        ${makeSection('Faith', faith)}
        `
    };
    return value;
}

export default [
    createCharacter({
        name: 'Harrow Zinvaris',
        hero: 'https://drive.google.com/uc?export=view&id=14DPaHJYi8D-dA5yvohEkxHpYUKMQlg8-',
        race: 'Eladrin',
        appearance: 'Caucasian, Purple Hair, Yellow Eyes',
        from: 'Bendith Court, Feywild; raised in Stanlos, Minesia',
        associates: {
            'The Morrigan': 'patron', 
            'Lailah': 'patron', 
            'Mamau': 'mother', 
            'Elara': 'foster mother', 
            'Formir': 'foster father', 
            'Erzulie': "mother's vassal",
        },
        ideals: "People. I'm loyal to my friends, not to any ideals, and everyone else can take a trip down the Styx for all I care. (Neutral)",
        bonds: "I'm trying to pay off an old debt I owe to a generous benefactor.",
        flaws: "You overdrink.",
        gender: '♀',
        creatureType: 'Fey',
        alignment: 'CN',
        height: `5'8"`,
        weight: 150,
        age: 100,
    }),
    createCharacter({
        name: 'John Rambo McClain',
        hero: 'https://m.media-amazon.com/images/I/71NMogbLHKL._AC_SX342_.jpg',
        race: 'Human',
        appearance: 'Caucasian, Brunette, Brown Eyes',
        from: 'Manhattan, Kansas, USA, Earth',
        associates: {
            'Frank': 'father', 
            'Fran': 'mother', 
            'Ray-Ray': 'friend', 
            'Little Mike': 'friend', 
            'Lili': 'friend', 
            'Simpson': 'mentor',
        },
        personality: 'Sarcasm and insults are my weapons of choice.',
        ideals: "Adventure. I'm far from home, and everything is strange and wonderful! (Chaotic)",
        bonds: 'Though I had no choice, I lament having to leave my loved one(s) behind. I hope to see them again one day.',
        flaws: 'I am secretly (or not so secretly) convinced of the superiority of my own culture over that of this foreign land.',
        gender: '♂',
        creatureType: 'Humanoid',
        alignment: 'CN',
        height: `5'7"`,
        weight: 210,
        age: 35,
    }),
    createCharacter({
        name: 'Nacho Chessier IV',
        hero: 'https://drive.google.com/uc?export=view&id=1lT0uTbZwQsHloVWuFo5IjK_6N2FEbu3H',
        race: 'Gnome',
        appearance: 'Tan skin, Blue Hair, Blue Eyes',
        from: 'Mithrendain, Prismeer, Feywild',
        associates: {
            'Macho': 'father', 
            'Ootz the Wise': 'king', 
            'Zybilna': 'queen', 
            'Taco': 'older brother', 
            'Pancho': 'older brother', 
            'Sancho': 'older brother',
        },
        personality: 'Happy, loyal and a big eater',
        ideals: 'Independence. I must prove that I can handle myself without the coddling of my family. (Chaotic)',
        bonds: 'I will face any challenge to win the approval of my family.',
        flaws: 'I have an insatiable desire for carnal pleasures.',
        gender: '♂',
        creatureType: 'Fey',
        size: 'Small',
        alignment: 'NG',
        height: `3'`,
        weight: 40,
        age: 20,
    }),
    createCharacter({
        name: 'Rhiannon Fray',
        hero: 'https://drive.google.com/uc?export=view&id=16ZqR7cLKm95vX2kLP5UG3JQrz_5u1MgB',
        race: 'Human',
        appearance: 'Olive skinned, Brown Hair, Blue Eyes',
        from: 'Graftonon, Rivierion',
        associates: {
            'Beyoncen': 'older sister', 
            'Ed Sheeron': 'father', 
            'Madonnon': 'mother',
        },
        faith: 'goat mysticism',
        personality: 'I refuse to become a victim, and I will not allow others to be victimized.',
        ideals: 'I try to help those in need, no matter what the personal cost. (Good)',
        bonds: "My torment drove away the person I love. I strive to win back the love I've lost.",
        flaws: 'I am a purveyor of doom and gloom who lives in a world without hope.',
        gender: '♀',
        creatureType: 'Humanoid',
        alignment: 'LG',
        height: `5'6"`,
        weight: 140,
        age: 25,
    }),
    createCharacter({
        name: 'Ser Eaton Dorito',
        hero: 'https://drive.google.com/uc?export=view&id=1YSwL98mDWLxkhjsxpSpEur-qNcRYqRHU',
        race: 'Human',
        appearance: 'Caucasian, White Hair, Amber-brown Eyes, sheds sticky orange dust',
        from: 'rural Minesia',
        faith: 'Freedolay',
        personality: 'Jolly, loyal, hugger',
        ideals: 'Respect. People deserve to be treated with dignity and respect. (Good)',
        bonds: 'I protect those who cannot protect themselves.',
        flaws: "I'm convinced of the significance of my destiny, and blind to my shortcomings and the risk of failure.",
        gender: '♂',
        creatureType: 'Humanoid',
        alignment: 'CG',
        height: `6'`,
        weight: 190,
        age: 56,
    }),
    createCharacter({
        name: 'Throne',
        hero: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/416c3615-2760-4445-8a12-6909dab4fb79/dehjnbc-abde5c6c-21a0-4b70-ae91-7dbb1bc72280.png/v1/fill/w_755,h_1058,q_70,strp/a_warforged_begginning_life_without_his_creator_by_gaoasmegu09_dehjnbc-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTQzNCIsInBhdGgiOiJcL2ZcLzQxNmMzNjE1LTI3NjAtNDQ0NS04YTEyLTY5MDlkYWI0ZmI3OVwvZGVoam5iYy1hYmRlNWM2Yy0yMWEwLTRiNzAtYWU5MS03ZGJiMWJjNzIyODAucG5nIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.WqSb8GQ9xKmfY3-bX_33XemWcD5eQ1CtyEfP4lheU2E', // https://i.pinimg.com/originals/9a/c3/b9/9ac3b92b01579acb0f980f3f7421e3f2.jpg',
        race: 'Construct',
        appearance: 'Assorted metal plating (primarily gold/bronze tinged), No Hair, Glowing Green Eyes',
        from: 'Celladore, Minesia (formerly Nueue)',
        faith: 'Milyun Mufadal',
        personality: 'I like to read and memorize poetry. It keeps me calm and brings me fleeting moments of happiness. I expect danger around every corner.',
        ideals: "I'll stop the spirits that haunt me or die trying. (Any)",
        bonds: 'A terrible guilt consumes me. I hope that I can find redemption through my actions.',
        flaws: 'I am a purveyor of doom and gloom who lives in a world without hope.',
        gender: '⚧',
        creatureType: 'Construct',
        alignment: 'LG',
        height: `7'`,
        weight: 55,
        age: `10`,
    }),
];
