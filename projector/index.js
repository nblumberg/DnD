(() => {
    function sortByName(a, b) {
        if (a.name === b.name) {
            return 0;
        }
        return a.name < b.name ? -1 : 1
    }

    function getEntries() {
        try {
            const storageString = localStorage.getItem(storageKey);
            if (storageString) {
                return JSON.parse(storageString).sort(sortByName);
            }
            return [];
        } catch (e) {
            return [];
        }
    }

    function setEntries() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(entries.sort(sortByName)));
        } catch (e) {}
    }

    function createEntry(entry) {
        const { name, url } = entry;

        const li = document.createElement('li');
        li.classList.add('entry');
        li.dataset.name = name;
        li.dataset.url = url;
        entryList.append(li);

        const buttons = document.createElement('nav');
        buttons.classList.add('buttons');
        li.append(buttons);

        const upButton = document.createElement('button');
        upButton.classList.add('up');
        upButton.innerHTML = '⬆️';
        buttons.append(upButton);

        const trashButton = document.createElement('button');
        trashButton.classList.add('delete');
        trashButton.innerHTML = '🗑';
        buttons.append(trashButton);

        const downButton = document.createElement('button');
        downButton.classList.add('down');
        downButton.innerHTML = '⬇️';
        buttons.append(downButton);

        const urlButton = document.createElement('button');
        urlButton.classList.add('select');
        urlButton.innerText = name;
        li.append(urlButton);

        const iframe = document.createElement('img'); // 'iframe'
        iframe.src = url;
        li.append(iframe);

        const option = document.createElement('option');
        option.text = name;
        option.value = url;
        entrySelect.add(option);
    }

    const googleDriveUrlRegExp = /^https:\/\/drive.google.com\/file\/d\/(\w+)\/view\?usp=share_link$/;

    function loadUrl() {
        const name = nameInput.value;
        let url = urlInput.value;
        if (!name || !url) {
            alert('Missing a value');
            return;
        }
        const matches = url.match(googleDriveUrlRegExp);
        if (matches && matches.length > 1) {
            url = `https://drive.google.com/uc?id=${matches[1]}`
        }
        const entry = { name, url };
        preview.src = url;
        projectedWindow.location.href = url;
        const match = entries.find(({ url: u }) => u === url);
        if (match) {
            if (match.name !== name) {
                entries.splice(entries.indexOf(match), 1, entry);
                setEntries();
                entryList.innerHTML = '';
                entries.forEach(createEntry);
            }
        } else {
            entries.push(entry);
            entries.sort(sortByName);
            setEntries();
            entryList.innerHTML = '';
            entrySelect.innerHTML = '';
            entries.forEach(createEntry);
        }
    }

    function findEntry(target) {
        const parent = target.classList.contains('entry') ? target : target.closest('.entry');
        return {
            parent,
            name: parent ? parent.dataset.name : null,
            url: parent ? parent.dataset.url : null,
        };
    }

    function loadEntry(target) {
        const { parent, name, url } = findEntry(target);
        if (!parent) {
            return;
        }
        nameInput.value = name;
        urlInput.value = url;
        loadUrl();
    }

    function loadSelect(option) {
        const { text: name, value: url } = option;
        nameInput.value = name;
        urlInput.value = url;
        loadUrl();
        const entry = Array.from(document.getElementsByClassName('entry')).find(({ dataset }) => dataset.url === url);
        if (entry) {
            entry.scrollIntoView();
        }
    }

    function removeEntry(target) {
        const { parent, url } = findEntry(target);
        if (!parent) {
            return;
        }
        parent.remove();
        entries.splice(entries.findIndex(({ url: u }) => u === url), 1);
        setEntries();
    }

    function moveEntry(target, direction) {
        const { parent: entryElement, url } = findEntry(target);
        if (!entryElement) {
            return;
        }
        const parent = entryElement.parentNode;
        const elementIndex = Array.from(parent.children).indexOf(entryElement);
        entryElement.remove();
        parent.insertBefore(entryElement, parent.children[elementIndex + direction])
        const arrayIndex = entries.findIndex(({ url: u }) => u === url);
        const [entry] = entries.splice(arrayIndex, 1);
        entries.splice(arrayIndex + direction, 0, entry);
        setEntries();
    }

    function delegatedClickHandlers(event) {
        const { target } = event;

        if (target.classList.contains('delete')) {
            removeEntry(target);
            return;
        }
        if (target.classList.contains('up')) {
            moveEntry(target, -1);
            return;
        }
        if (target.classList.contains('down')) {
            moveEntry(target, 1);
            return;
        }
        loadEntry(target);
    }

    const nameInput = document.getElementById('name');
    const urlInput = document.getElementById('url');
    const loadButton = document.getElementById('load');
    const preview = document.getElementById('selectionPreview');
    const entryList = document.getElementById('entryList');
    const entrySelect = document.getElementById('entries');

    const storageKey = 'projectorEntries';
    const entries = getEntries();
    entries.forEach(createEntry);

    const projectedWindow = window.open('https://www.dndbeyond.com/', 'projected', 'popup,left=0,top=0');

    loadButton.addEventListener('click', loadUrl);
    document.body.addEventListener('click', delegatedClickHandlers);
    entrySelect.addEventListener('change', (event) => {
        const { target: selectElement } = event;
        loadSelect(selectElement.item(selectElement.selectedIndex));
    });
})();
