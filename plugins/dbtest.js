const Discord = require("discord.js");

module.exports = {
	name: "DBTest",
	author: "theLMGN",
	disable: true,
	version: 1,
	description: "DBTest",
	commands: [{
		name: "dbsave",
		usage: "hello",
		description: "db test save",
		execute: async(c, m, a) => {
			console.log(c.db)
			if (c.db.dbLoaded && c.db.tables.test) {
				try {
					await c.db.tables.test.create({
						userId: m.author.id,
						description: a.join(" "),
					});
					return m.reply(`Added.`);
				}
				catch (e) {
					return m.reply(e.toString());
				}
			} else {
				m.reply("The database hasn't been loaded.  Please hold on")
			}
		}
	},
	{
		name: "dbload",
		usage: "",
		description: "db test load",
		execute: async(c, m, a) => {
			console.log(c.db)
			if (c.db.dbLoaded && c.db.tables.test) {
				try {
					var entries = await c.db.tables.test.findAll({ where: { userId: m.author.id } });
					var strings = []
					for (var entry of entries) {
						strings.push(`${entry.description} (${entry.createdAt.toString()})`)
					}
					return m.reply(strings.join("\n"))
				}
				catch (e) {
					return m.reply(e.toString());
				}
			} else {
				m.reply("The database hasn't been loaded.  Please hold on")
			}
		}
	}],
	events: [],
	timer: [],
};
