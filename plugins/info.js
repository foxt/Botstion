var config = require("../config/config.json");
const Discord = require("discord.js");
const os = require("os");


function stohms(totalSeconds) {
	var hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	var minutes = Math.floor(totalSeconds / 60);
	var seconds = totalSeconds % 60;
	return `${hours}h ${minutes}m ${seconds}s`;
}

module.exports = {
	name: "Botstion Info",
	author: "theLMGN",
	version: 2.1,
	description: "Shows you some information about the bot. (Ported from Botstion3)",
	commands: [{
		name: "info",
		usage: "",
		description: "Shows you some information about the bot.",
		execute: async(c, m, a) => m.reply({ embed: new Discord.MessageEmbed()
			.setTitle("Botstion⁴")
			.setDescription(`Developed by [theLMGN](https://thelmgn.com) and [SunburntRock89](https://twitter.com/sunburntrock89) in 2018. [Contribute](https://github.com/theLMGN/botstion) [Website](https://botstion.tech)`)
			.addField(":ping_pong: Ping", `${Math.floor(c.ping)}ms`, true)
			.addField("<:js:388353565619519488> Node Version", process.version, true)
			.addField("<:Discord:375377712681844736> Discord.JS Version", Discord.version, true)
			.addField(":clock10: Uptime", stohms(c.uptime / 1000), true)
			.addField(":id: PID", process.pid, true)
			.addField(":desktop: Platform", `${process.platform.replace("win32", "Windows").replace("darwin", "macOS")} (${os.release})`, true)
			.setColor("#3273dc") }),
	}],
	events: [],
	timer: [],
};
