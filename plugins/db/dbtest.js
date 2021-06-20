const Discord = require("discord.js");

module.exports = {
    name: "DBTest",
    author: "theLMGN",
    disable: true,
    version: 1,
    description: "DBTest",
    commands: [{
        name: "dbsave",
        description: "db test save",
        category: "Meta",
        execute: async(c, m, a) => {
            console.log(c.db);
            if (c.db.dbLoaded && c.db.tables.test) {
                try {
                    await c.db.tables.test.create({
                        userId: m.author.id,
                        description: a.join(" ")
                    });
                    return m.reply("Added.");
                } catch (e) {
                    return m.reply(e.toString());
                }
            } else {
                m.reply("The database hasn't been loaded.  Please hold on");
            }
        }
    },
    {
        name: "dbload",
        description: "db test load",
        category: "Meta",
        execute: async(c, m, a) => {
            console.log(c.db);
            if (c.db.dbLoaded && c.db.tables.test) {
                try {
                    let entries = await c.db.tables.test.findAll({ where: { userId: m.author.id } });
                    let strings = [];
                    for (let entry of entries) {
                        strings.push(`${entry.description} (${entry.createdAt.toString()})`);
                    }
                    return m.reply(strings.join("\n"));
                } catch (e) {
                    return m.reply(e.toString());
                }
            } else {
                m.reply("The database hasn't been loaded.  Please hold on");
            }
        }
    }]
};
