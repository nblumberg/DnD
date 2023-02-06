// Utility methods
function roll(sides) {
    return Math.round((Math.random() * (sides - 1)) + 1);
}

function randomFrom(list) {
    return list[roll(list.length) - 1];
}

// Constants
const tiles = [
    { 
        name: "w1", up: "w1", right: "w2", down: "w1", left: "w3", 
        description: `The fog abates enough for you to see the mountain woods around you, 
but the landscape offers little clue as to which direction to go. 
Looking about you notice a small wooden sign with "DANGER" carved into it.`, 
        src: "https://preview.redd.it/8caqhw4i0jg61.png?width=960&crop=smart&auto=webp&v=enabled&s=68ffd240591a3339a3d3842defb60194e33afc80" 
    },
    { 
        name: "w2", up: "", right: "w3", down: "w1", left: "w10", 
        acidLake: true,
        description: `A small lake stinking of chemical runoff from uphill mining efforts steams in the cool mountain air and stings your eyes.
Separate from the nearby trees is a large log covered in several species of mushrooms.`,
        src: "https://i.redd.it/bvl0rga5e9111.jpg" 
    },
    { 
        name: "w3", up: "w4", right: "w12", down: "w1", left: "w3", 
        acidLake: true,
        description: `A small lake stinking of chemical runoff from uphill mining efforts steams in the cool mountain air and stings your eyes.
An arrangement of suspicious looking rocks lines the shore.`,
        src: "https://i.pinimg.com/736x/0d/da/64/0dda64368a76c358088579867de8edb9.jpg" 
    },
    { 
        name: "w4", up: "w1", right: "w9", down: "w4", left: "w6", 
        acidLake: true,
        description: `A small lake stinking of chemical runoff from uphill mining efforts steams in the cool mountain air and stings your eyes.
Washed up on the shore is a severed arm covered in boils.`,
        src: "https://preview.redd.it/wzbiaofx3g351.jpg?auto=webp&s=a82e099501e49739b0064aef7caf95c86cce4dd6" 
    },
    { 
        name: "w5", up: "Vermeillon", right: "w6", down: "", left: "w6", 
        acidLake: true,
        description: `A small lake stinking of chemical runoff from uphill mining efforts steams in the cool mountain air and stings your eyes.
A hollowed-out stump at the edge of the woods is stuffed with a contorted human skeleton.`,
        src: "https://pbs.twimg.com/media/DoRtkwrXgAU5e_M.jpg:large" 
    },
    { 
        name: "w6", up: "w8", right: "w6", down: "", left: "w5", 
        acidLake: true,
        description: `A small lake stinking of chemical runoff from uphill mining efforts steams in the cool mountain air and stings your eyes.
A large rotting animal corpse lies stinking on the shore. On closer inspection it appears to be a miserable mix of buffalo, dinosaur, warthog and hippopatmus.`,
        src: "https://i.pinimg.com/originals/d6/a7/31/d6a7318ce50d1b64e8fee8462a7773ba.jpg" 
    },
    { 
        name: "w7", up: "w1", right: "w5", down: "w11", left: "", 
        acidLake: true,
        description: `A small lake stinking of chemical runoff from uphill mining efforts steams in the cool mountain air and stings your eyes.
Sitting along the branches of a nearby tree is a still swarm of black and green butterflies.`,
        src: "https://preview.redd.it/xxrpfet0ica41.jpg?width=640&crop=smart&auto=webp&s=f955c2524e89e3b02190c441f7d4bf4ddfe9c849" 
    },
    { 
        name: "w8", up: "", right: "", down: "w14", left: "", 
        description: `In this secluded glade a large flat stone has been laid on several smaller cairns to form a rudimentary table.
Arranged about the rough surface are six tiny figures made from bound twigs and crudely whittled wood.
On closer inspection you realize they resemble you and each has been arranged in a different death scene.`,
        src: "https://i.imgur.com/XGlFiuT.jpg", 
        // src: "https://pbs.twimg.com/media/FBXIgkSWUAgMceq.jpghttps://pbs.twimg.com/media/FBXIgkSWUAgMceq.jpg" 
    },
    { 
        name: "w9", up: "", right: "", down: "", left: "w2", 
        description: `The forest opens up on a cliff with a precipitous drop.
Hanging on a tree at the edge is a small wooden sign reading "Escape"`,
        src: "https://preview.redd.it/lwxnxnunvsy71.jpg?auto=webp&s=855d3401c34ac20e849fdc6f246421d37fa21ab2", rotate: 90 
    },
    { 
        name: "w10", up: "", right: "w10", down: "w7", left: "w10", 
        acidLake: true,
        description: `A small lake stinking of chemical runoff from uphill mining efforts steams in the cool mountain air and stings your eyes.`,
        src: "https://2minutetabletop.com/wp-content/uploads/2021/09/Lake-Spring-Day-44x32-1.jpg" 
    },
    { 
        name: "w11", up: "w7", right: "w10", down: "w1", left: "", 
        acidLake: true,
        description: `A small lake stinking of chemical runoff from uphill mining efforts steams in the cool mountain air and stings your eyes.
Slimy looking cliffs nearly 30 feet high stand between you the area above you (bottom).`,
        src: "https://i.pinimg.com/originals/86/fe/20/86fe20bdfb6ef2d3ec8e51ac504d0329.jpg" 
    },
    { 
        name: "w12a", up: "", right: "", down: "w12a", left: "w12", 
        description: `A massive dam of downed trees forms a bridge across the swampy glade. 
It is covered in several species of mushrooms.`, 
        src: "https://i.etsystatic.com/20055898/r/il/83fcf0/1900704579/il_fullxfull.1900704579_3jhc.jpg" 
    },
    { 
        name: "w12", up: "w12a", right: "", down: "", left: "w13", 
        description: `To your right, the thicket eases off to give you slightly more breathing room. 
A large hill dominates the opposite end of the glade and features a creek that seems to stumble down the grade.`, 
        src: "https://preview.redd.it/psgmsy4i0jg61.png?width=960&crop=smart&auto=webp&v=enabled&s=9ed18a7f6d6e587716e3910439755ca0f6f97df9" 
    },
    { 
        name: "w13", up: "w11", right: "w1", down: "", left: "", 
        description: `Finally on dry ground you're able to breathe in your surroundings. 
The edges of the thicket seem to lean in over an abandoned well of water in the center of the zone. 
Any who would dare to pass them would surely risk falling into the pool. 
At the bottom, a chest with blue writing dancing across its surface can be seen through clouds of organic matter. 
At the edge of the pool, you can see a small wooden sign with a dark green, almost black teardrop on it.`,
        src: "https://2minutetabletop.com/wp-content/uploads/2021/04/Sacred-Spring-Natural-Day-16x22-1.jpg",
        // src: "https://i.imgur.com/XGlFiuT.jpg", 
        rotate: 270
    },
    { 
        name: "w14", up: "w1", right: "", down: "", left: "", 
        description: `Before you is a large pile of refuse in the middle of the otherwise featureless glade. 
The edges of the stinking mass seem to be moving, but you have a hard time determining if it's because of some unknown filth creature, 
or simply escaping gasses given off by the decomposing mixture of flesh, feces, and the gods know what else.`,
        src: "https://i.pinimg.com/originals/99/e4/16/99e41601325669c4d4cbef52ecc9df6e.jpg", rotate: 180 },
    { 
        name: "Vermeillon", up: "", right: "", down: "", left: "", 
        description: `The village is eerily quiet. 
Plants and wildlife have overtaken the crumbling houses. 
Leafless vines climb rotting walls, birds and other small creatures nest in the exposed rafters, and gnarled trees protrude from the fallen roofs of a few buildings. 
The overcast sky adds an air of oppression to the scene, seeming to envelop the village.`,
        src: "https://preview.redd.it/n6r665pk8ls61.jpg?width=1080&crop=smart&auto=webp&v=enabled&s=4b76c50d306fc9067c03dd32980c4c51e403a4d3" 
    },
];

const toxicWeird = () => ({
    description: `The acidic lake water gathers into an undulating, amphorous form and lunges toward you, trying to drown you in a stinging undertow. 
Make a Dexterity saving throw to dodge the crashing wave.`,
    image: 'https://cdn.hearthstonetopdecks.com/wp-content/uploads/2017/04/featured-hotspringguardian.jpg',
    // image: 'https://static.wikia.nocookie.net/moms-basement-dd/images/2/24/6aa84bc0f02ce842cd50dde402ce5aaa.jpg/revision/latest?cb=20181125133502',
    dc: 10,
    failure: { description: 'The chemicals in the water sear your skin.', roll: 6, type: 'acid' },
});

const stinkingCloud = () => ({
    description: `A cloud of yellow, nauseating gas spews forth from a fissure in the ground. The cloud spreads around corners, and lingers in the air, heavily obscuring the area. 
Make a Constitution saving throw to weather the gas.`,
    image: 'https://globalnews.ca/wp-content/uploads/2020/05/geys-e1589384043552.jpg?quality=85&strip=all',
    dc: 10,
    failure: { description: 'You spend a moment retching and reeling.', roll: 4, type: 'poison' },
});

const randomEncounters = [
    () => ({
        description: `A wave of hunger overcomes you moments before ${roll(5) + 1} rats come scurrying out of the underbrush. 
Each of their heads glows with a dim light, and as they nip at your ankles you realize you can see their exposed brains.
Make an Intelligence saving throw to steer clear of the swarm.`,
        image: 'https://www.dndbeyond.com/avatars/thumbnails/25746/698/1000/1000/637880558074808985.jpeg',
        dc: 12,
        failure: { description: 'The rats tear at your flesh before disappearing back into the underbrush', roll: 1, type: 'piercing' },
    }),
    () => ({
        description: `An emaciated ${randomFrom(['man', 'woman'])} covered in strange growths stumbles toward you and lets out a pitious moan before falling face first into the dirt and lying still.`,
        image: 'https://preview.redd.it/3zi2uyi1gwc61.jpg?width=640&crop=smart&auto=webp&s=0e0b9b73f4d99f7c7115a0ee779a60a69ddeebf6'
    }),
    () => ({
        description: `You step among a field of mushrooms. 
The vibrations from your steps cause the fungi to rupture and spew forth a cloud of spores. 
Make a Wisdom saving throw to spot the mushrooms before they rupture.`,
        image: 'https://allthatsinteresting.com/wordpress/wp-content/uploads/2015/06/mushrooms-puffball-exploding.jpg',
        dc: 10,
        failure: { description: 'You hack and cough as the spores irritate your throat and sinuses.', roll: 4, type: 'poison' },
    }),
    () => ({
        description: `A sticky slime coats the ground in one corner of the area.`,
        image: 'https://a.rgbimg.com/users/m/mi/micromoth/600/oI2luNC.jpg',
    }),
    () => ({
        description: `${roll(4)} hostile hands reach up through the grass clumps and attempt to grab your ankles. 
Make a Dexterity saving throw to dodge out of the way.`,
        image: 'https://images.pond5.com/zombie-hands-emerging-ground-088917873_prevstill.jpeg',
        dc: 10,
        failure: { description: 'They grab you with crushing force before you manage to tear your leg away from their grasp.', roll: 4, type: 'bludgeoning' },
    }),
    () => ({
        description: `A procession of tiny Boggles march and goop their away across your path in the distance, paying you no mind.`,
        image: 'https://www.dndbeyond.com/avatars/thumbnails/9/594/1000/1000/636329509694817521.jpeg',
    }),
    () => {
        const insects = [
            { name: 'giant fire beetles', type: 'fire', image: 'https://www.dndbeyond.com/avatars/thumbnails/9/896/1000/1000/636334287498492864.jpeg' },
            { name: 'giant centipedes', type: 'necrotic', image: 'https://static.wikia.nocookie.net/astrohanasia/images/3/37/Giant_centipede.jpg/revision/latest?cb=20180113225843' }, 
            { name: 'giant spiders', type: 'piercing', image: 'https://www.dndbeyond.com/avatars/thumbnails/30849/299/1000/1000/638064499038216933.png' }, 
            { name: 'giant wasps', type: 'poison', image: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/00915a90-0c2a-469d-961a-d534a9ca868a/d7w2pfh-1e93b87c-a894-42f3-bc81-4ebb0ef79c8d.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzAwOTE1YTkwLTBjMmEtNDY5ZC05NjFhLWQ1MzRhOWNhODY4YVwvZDd3MnBmaC0xZTkzYjg3Yy1hODk0LTQyZjMtYmM4MS00ZWJiMGVmNzljOGQuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.If6CA9aGYIJBeCEMBVUnHohBZwBWt-ElFbUbY-YLzZs' },
        ];
        const quantity = roll(4);
        const { name, type, image } = randomFrom(insects);
        return {
            description: `${quantity} swarms of ${name} clatter out of the surrounding thicket and attack. 
Make a Strength saving throw to fight them off.`,
            image,
            dc: 13,
            failure: { description: `You dispatch the ${name}, but not before they sting and bite you.`, roll: 6, type },
        };
    },
    () => ({
        description: `A hand reaching through the grass has a tight grip on a small glass medallion bearing the insignia of the Minesian scouts.`,
        image: 'https://serenesforest.net/wp-content/uploads/2014/05/fe10-lehran-holding-the-medallion.png',
    }),
    stinkingCloud,
    stinkingCloud,
];

const storageKeyTile = 'tileName';
const storageTileCharacter = 'characterState';
const randomEncounterChance = 15;
const transition = 2000;
const forest = document.getElementById('forest');
const upButton = document.getElementById('up');
const rightButton = document.getElementById('right');
const downButton = document.getElementById('down');
const leftButton = document.getElementById('left');
const restart = document.getElementById('restart');
const health = document.getElementById('health');
let tile;

// Event handlers
function showImage(image, rotate = 0) {
    return new Promise(resolve => {
        forest.classList.add('navigateOut');
        setTimeout(() => {
            forest.style.backgroundImage = `url('${image}')`;
            forest.style.transform = `rotate(${rotate}deg)`;
            forest.classList.add('navigateIn');
            setTimeout(() => {
                forest.classList.remove('navigateOut');
                forest.classList.remove('navigateIn');
                resolve();
            }, transition);
        }, transition)
    });
}

function getState() {
    return JSON.parse(localStorage.getItem(storageTileCharacter) || '{}');
}

function setState(state = getState()) {
    if (!Object.keys(state).length) {
        return;
    }
    const str = JSON.stringify(state, null, '  ');
    health.innerText = str;
    localStorage.setItem(storageTileCharacter, str);
}

function resolveEncounter({ description, dc, failure }) {
    return new Promise(resolve => {
        if (dc) {
            const savingThrow = parseInt(prompt(description), 10);
            if (savingThrow < dc) {
                const damage = roll(failure.roll);
                alert(`${failure.description} Take ${damage} ${failure.type} damage.`);
                const state = getState();
                state[failure.type] = (state[failure.type] || 0) + damage;
                setState(state);
            }
        } else {
            alert(description);
        }
        resolve();
    });
}

async function showEncounter(encounter) {
    const { image } = encounter;
    if (image) {
        await showImage(image)
    }
    await resolveEncounter(encounter);
    if (image) {
        showImage(tile.src, tile.rotate);
    }
}

async function goToTile(name, encounters = true) {
    const { acidLake: formerAcidLake = false } = tile || {};
    tile = tiles.find(tile => tile.name === name);
    if (!tile) {
        alert(`Couldn't find tile ${name}`);
        return;
    }
    localStorage.setItem(storageKeyTile, name);
    const { src: backgroundImage, rotate = 0, up, right, down, left, description, acidLake } = tile;
    upButton.classList.add('hidden');
    rightButton.classList.add('hidden');
    downButton.classList.add('hidden');
    leftButton.classList.add('hidden');
    await showImage(backgroundImage, rotate);
    if (up) {
        upButton.classList.remove('hidden');
    }
    if (right) {
        rightButton.classList.remove('hidden');
    }
    if (down) {
        downButton.classList.remove('hidden');
    }
    if (left) {
        leftButton.classList.remove('hidden');
    }
    if (description) {
        alert(description);
    }
    if (formerAcidLake && acidLake) {
        await showEncounter(toxicWeird());
    }
    if (encounters && name !== 'Vermeillon' && roll(20) >= randomEncounterChance) {
        await showEncounter(randomFrom(randomEncounters)());
    }
}

function onNavigate(event) {
    const { id: direction } = event.target;
    if (!tile[direction]) {
        return;
    }
    goToTile(tile[direction]);
}

function onReset() {
    goToTile(tiles[0].name);
    localStorage.removeItem(storageTileCharacter);
}

// Attach event handlers
Array.from(document.getElementsByClassName('direction')).forEach(element => {
    element.addEventListener('click', onNavigate);
});
restart.addEventListener('click', onReset);

// Initial state
goToTile(localStorage.getItem(storageKeyTile) || tiles[0].name, false);
setState();
