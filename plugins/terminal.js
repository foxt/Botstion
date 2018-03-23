const snek = require("snekfetch");
const config = require("../config/config");
module.exports = {
	name: "Terminal.ink",
	author: "theLMGN",
	version: 1,
	description: "Updates the bot's guild count on terminal.ink",
	commands: [],
	events: [],
	timer: [async c => {
		c.user.setPresence({ activity: { name: `in ${c.guilds.array().length} guilds` }, status: "online" });
		snek.post(`https://ls.terminal.ink/api/v1/bots/${c.user.id}`).set({ Authorization: config.terminalToken }).send({ usingGoodRequestLibrary: true });
	}],
};
