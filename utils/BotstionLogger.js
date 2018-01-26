const prefix = {
    err: "\x1b[0m\x1b[31m ERR : ",
    warn: "\x1b[0m\x1b[43m WARN: ",
    info: "\x1b[0m\x1b[34m INFO: ",
    crit: "\x1b[0m\x1b[41m\x1b[37m\x1b[1m\x1b[5m\x1b[4m\x1b[31m CRIT: "
}

let logmessages = []

exports.err = function(msg) {
    logmessages.push({type: "error", message: msg})
    console.error(prefix.err,msg)
}
exports.warn = function(msg) {
    logmessages.push({type: "warn", message: msg})
    console.warn(prefix.warn, msg)
}
exports.info = function(msg) {
    logmessages.push({type: "info", message: msg})
    console.info(prefix.info, msg)
}
exports.crit = function(msg) {
    logmessages.push({type: "crit", message: msg})
    console.error(prefix.crit, msg)
}
exports.getLogs = function() {
    return logmessages
}