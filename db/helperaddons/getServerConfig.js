module.exports = function(db) {
    return async function(server) {
        var serverId = user.toString()
        if (server.id) {
            serverId = server.id
        }
        var serverConfig = await db.tables.serverConfig.findOne({ where: { serverId } });
        if (serverConfig) {
            return serverConfig
        } else {
            return db.tables.serverConfig.create({
                serverId: serverId,
                prefix: "b!",
            });
        }
    }
}