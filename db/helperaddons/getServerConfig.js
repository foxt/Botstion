module.exports = (db) => async (server) => {
    let serverId = server.toString();
    if (server.id) {
        serverId = server.id;
    }
    let serverConfig = await db.tables.serverConfig.findOne({ where: { serverId } });
    if (serverConfig) {
        return serverConfig;
    } else {
        return db.tables.serverConfig.create({
            serverId: serverId,
            prefix: "b!"
        });
    }
};