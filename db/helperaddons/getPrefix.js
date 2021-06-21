module.exports = (db) => {
    let cache = {};
    setInterval(() => {
        cache = {};
    }, 600000);
    return async (server) => {
        let serverId = server.toString();
        if (server.id) {
            serverId = server.id;
        }
        if (cache[serverId]) { return cache[serverId]; }
        let serverConfig = await db.tables.serverConfig.findOne({ where: { serverId } });
        if (serverConfig) {
            cache[serverId] = serverConfig.prefix;
            return serverConfig.prefix;
        } else {
            await db.tables.serverConfig.create({
                serverId: serverId,
                prefix: "b!"
            });
            return "b!";
        }
    };
};