document.body.parentElement.style.overflow = "hidden"
document.scrollingElement.scrollTop = 0
var ffsfsfsfsfsf = false
function animation() {
  clearTimeout(timeoutAnimation)
  var ls = document.querySelector("#logo").style
  var lis = document.querySelector("#logoIndent").style
  ls.transition = "2s all"
  ls.width = "100vh"
  ls.left = "calc(50vw - 50vh)"
  ls.top = "0px"
  ls.backgroundPosition = "0% 0%"
  lis.height = "66.666vh"

  if (!ffsfsfsfsfsf) {
    fill()
    ffsfsfsfsfsf = true
  }
  
  setTimeout(function() {
    ls.transition = "none"
    try { document.querySelector("#logoIndent").remove() } catch(e) {}
    ls.background = `url(\"\logo.svg\")`
    ls.backgroundSize = "100% 100%"
    ls.transition = "1s transform, 1s border-radius,1s top,1s width,1s height,1s left,1s top"
    ls.borderRadius = "2.5vh"
    setTimeout(function() {
      var goto = document.querySelector("#botstion-main-logo").getBoundingClientRect()
      var at = document.querySelector("#logo").getBoundingClientRect()
      var percent = goto.width / at.width
      ls.borderRadius = "0.1em"
      ls.width = goto.width + "px"
      ls.height = goto.height + "px"
      ls.left = goto.x + "px"
      ls.top = goto.y + "px"
      
      setTimeout(function() {
        document.body.parentElement.style.overflowY = "scroll"
        document.querySelector("#logo").remove()
      },1000)
    },150)
  },2000)
}
function addpopup(url,elem) {
  document.getElementById(elem).classList.add("is-loading")
  var windows = window.open(url, "_blank", "width=400,height=430");
  var pollTimer = window.setInterval(function() {
    if (windows.closed !== false) {
        window.clearInterval(pollTimer);
        document.getElementById(elem).classList.remove("is-loading");
    }
  }, 200);
}

var timeoutAnimation = setTimeout(animation,5000)

;(async function() {
  var gh = await (await fetch("https://api.github.com/repos/thelmgn/botstion/stats/commit_activity")).json()
  var commits = 0
  for (var week of gh) {
    commits += week.total
  }
  document.getElementById("commits").innerHTML = commits
})()

async function updateCounters() {
  


  var botstion = await (await fetch("/api/info")).json()
  document.querySelector("#servers").innerText = botstion.servers
  document.querySelector("#users").innerText = botstion.members
  animation()
}

updateCounters()
 
window.onscroll = function(e) {
  return false //disabled because it looks bad in some browsers
  var percentScrolled = document.scrollingElement.scrollTop / document.querySelector("#hero2").offsetHeight
  document.querySelector("#hero1").style.transiton = "none"
  document.querySelector("#hero1").style.opacity = `${1 - (percentScrolled * 0.75)}`
  document.querySelector("#hero1").style.transform = `translate(0%, -${percentScrolled * 25}%) scale(${1-(percentScrolled * 0.5)})`
  document.querySelector("#imagesContainer").style.transform = `translate(0%, -${percentScrolled * 25}%) scale(${percentScrolled + 1})`


}

// fix for mobile safari thing where 100vh is 100% of the screen, not 100% of vp
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
window.addEventListener('resize',function() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  document.querySelector("#panel1").style.maxHeight = `${vh * 100}px`
})