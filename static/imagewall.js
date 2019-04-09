function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}
function randomFromArray(array) {
  return array[Math.round(Math.random() * (array.length - 1))]
}
var images = []
var imageSize = 64
var oldWidth = 0
function fill() {
  document.querySelector("#imagesContainer").innerHTML = ``
  var height = document.body.clientHeight
  var width = document.body.clientWidth
  imageSize = (width / 100) * 5
  if (imageSize < 64) { imageSize = 64 }
  if (imageSize > 128) { imageSize = 128 }
  var imagesPerRow = Math.ceil(width / imageSize)
  var rows = Math.ceil(height / imageSize)
  var clone = images.slice(0);
  
  for (row = 0; row <= rows; row++) {
    for (img = 0; img <= imagesPerRow; img++) {
      if (clone.length < 1) {
        clone = images.slice(0);
        shuffle(clone)
      }
      image = clone.pop()
      document.querySelector("#imagesContainer").innerHTML += `<img src="${image}" class="imageWallImg" width="${imageSize}" height="${imageSize}"></img>`
    }
    document.querySelector("#imagesContainer").innerHTML += `<br>`
    
  }
  setTimeout(function() {
    animation()
  },100)
}

// flip effect
setInterval(function() {
  var image = randomFromArray(images)
  var elem = randomFromArray(document.querySelectorAll(".imageWallImg"))
  elem.style.transform = "rotateY(90deg)"
  setTimeout(function() {
    elem.src = image
    elem.style.transform = "rotateY(0deg)"
  },500)
},3000)


async function load() {
  var j = await (await fetch("/api/info")).json()
  for (var g of j.serverIcons) {
    images.push(`https://cdn.discordapp.com/icons/${g}.png?size=128`)
  }
  shuffle(images)
  fill()
  var resizeTimeout = 0
  window.addEventListener('resize',function() {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(fill,150)
  })
}

load()
