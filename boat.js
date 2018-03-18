const discord = require("discord.js");
const config = require("./config/config.json");
const client = new discord.Client();

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async msg => {
	console.log(msg);
});

client.login(config.token);
