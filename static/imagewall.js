function shuffle(array) {
    let newArray = array.slice();
    newArray.sort(() => Math.random() - 0.5);
    return newArray;
}
function randomFromArray(array) {
    return array[Math.round(Math.random() * (array.length - 1))];
}
let images = [];
let imageSize = 64;
let oldWidth = 0;
function fill() {
    console.trace("Repainting wall");
    let height = document.body.clientHeight;
    let width = document.body.clientWidth;
    let ctx = document.querySelector("canvas#imagewallCanvas").getContext("2d");
    document.querySelector("canvas#imagewallCanvas").width = width;
    document.querySelector("canvas#imagewallCanvas").height = height;
    imageSize = (width / 100) * 5;
    if (imageSize < 64) { imageSize = 64; }
    if (imageSize > 128) { imageSize = 128; }
    let imagesPerRow = Math.ceil(width / imageSize);
    let rows = Math.ceil(height / imageSize);
    let clone = shuffle(images);

    for (row = 0; row <= rows; row++) {
        for (img = 0; img <= imagesPerRow; img++) {
            if (clone.length < 1) {
                clone = shuffle(images);
            }
            image = clone.pop();
            try { ctx.drawImage(image, img * imageSize, row * imageSize, imageSize, imageSize); } catch (e) {}
        }
    }
    // requestAnimationFrame(fill)
}

// flip effect
setInterval(() => {
    return false;
    let image = randomFromArray(images);
    let img = randomFromArray(j.serverIcons);
    image.style.transform = "rotateY(90deg)";
    image.dataset.imageWallTransition = 0;
    setTimeout(() => {
        image.src = img;
        image.style.transform = "rotateY(0deg)";
    }, 500);
}, 3000);


async function load() {
    let j = await (await fetch("/api/info")).json();
    // console.log(j)
    for (let g of j.serverIcons) {
        let image = document.createElement("img");
        image.src = `https://cdn.discordapp.com/icons/${g}.png?size=128`;
        images.push(image);
    }
    fill();
    let resizeTimeout = 0;
    window.addEventListener("resize", () => {
    // clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(fill, 1);
    });
}

load();
