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
  var height = document.body.clientHeight
  var width = document.body.clientWidth
  var ctx = document.querySelector("canvas#imagewallCanvas").getContext("2d")
  document.querySelector("canvas#imagewallCanvas").width = width
  document.querySelector("canvas#imagewallCanvas").height = height
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
      }
      image = clone.pop()
      try { ctx.drawImage(image, img * imageSize,row * imageSize,imageSize,imageSize) } catch(e) {}
    }
  }
  requestAnimationFrame(fill)
}

// flip effect
setInterval(function() {
  return false
  var image = randomFromArray(images)
  var img = randomFromArray(j.serverIcons)
  image.style.transform = "rotateY(90deg)"
  image.dataset.imageWallTransition = 0
  setTimeout(function() {
    image.src = img
    image.style.transform = "rotateY(0deg)"
  },500)
},3000)


async function load() {
  var j = await (await fetch("/api/info")).json()
  console.log(j)
  for (var g of j.serverIcons) {
    var image = document.createElement("img")
    image.src = `https://cdn.discordapp.com/icons/${g}.png?size=128`
    images.push(image)
  }
  fill()
  var resizeTimeout = 0
  window.addEventListener('resize',function() {
    //clearTimeout(resizeTimeout)
    //resizeTimeout = setTimeout(fill,150)
  })
}

load()
