function removeDR() {
  for (var dr of document.querySelectorAll(".darkreader")
  ) {
    dr.remove()
  }
}
removeDR()
setInterval(removeDR)
setTimeout(removeDR,1000)