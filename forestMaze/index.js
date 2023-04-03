(async function IIFE() {
    // Utility methods
    function roll(sides) {
        return Math.round((Math.random() * (sides - 1)) + 1);
    }

    function randomFrom(list) {
        return list[roll(list.length) - 1];
    }

    // Constants

    const here = new URL(window.location.href);
    const path = `${here.protocol}//${here.hostname}${here.port ? `:${here.port}` : ''}/${new URLSearchParams(window.location.search).get('path') ?? 'vermeillon'}`;
    const [{ tiles }, { randomEncounters }] = await Promise.all([
        import(`${path}/tiles.js`),
        import(`${path}/randomEncounters.js`),
    ]);

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
        // tile = tiles[0];
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
})();
