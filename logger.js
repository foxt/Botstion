global.log = function() {
    console.log(...arguments)
}
global.log.error = function() {
    console.error(...arguments)
}
global.log.warn = function() {
    console.warn(...arguments)
}