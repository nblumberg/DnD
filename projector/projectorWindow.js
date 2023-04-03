const image = document.getElementById('image');
const dot = document.getElementById('dot');
const defaultImage = 'https://images.ctfassets.net/swt2dsco9mfe/5hvcpZM9EuL4dYa9cnPfW2/9a62a131d86b308bf7a114ebca4fbf64/c9yJAEn8GDeHWqD-hero-bg.jpg?q=70&w=1920';
image.src = defaultImage;

window.addEventListener('message', (event) => {
    const { data: { type, url, left, top } } = event;
    if (type !== 'projector') {
        return;
    }
    if (url) {
        image.src = url;
    }
    if (typeof left === 'number' && left > 0 && typeof top === 'number' && top > 0) {
        dot.style.left = `${image.offsetLeft + left * (image.offsetWidth - image.offsetLeft)}px`;
        dot.style.top = `${image.offsetTop + top * (image.offsetHeight - image.offsetTop)}px`;
        console.log(left, top);
    }
});
