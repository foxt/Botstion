module.exports = function(db) {
    var cache = {}
    setInterval(function() {
        cache = {}
    },600000)
    return async function(server) {
        var serverId = user.toString()
        if (server.id) {
            serverId = server.id
        }
        if (cache[serverId]) {return cache[serverId]}
        var serverConfig = await db.tables.serverConfig.findOne({ where: { serverId } });
        if (serverConfig) {
            cache[serverId] = serverConfig.prefix
            return serverConfig.prefix
        } else {
            await db.tables.serverConfig.create({
                serverId: serverId,
                prefix: "b!",
            });
            return "b!"
        }
    }
}