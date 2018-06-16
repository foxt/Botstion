module.exports = {
	name: "Playing Message",
	author: "theLMGN",
	version: 1,
	description: "Sets the bots playing message",
	commands: [],
	events: [],
	timer: [async c => {
		c.user.setPresence({ activity: { name: `in ${c.guilds.array().length} guilds | b!help` }, status: "online" });
	}],
};
