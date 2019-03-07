const Discord = require("discord.js")
const { get,post } = require('snekfetch')
const config = require("../configLoader");
let voters = [];

function updateServerCount(c) {
	post(`https://discordbots.org/api/bots/${c.user.id}/stats`).set('Authorization', config.dblToken).send({server_count: c.guilds.size})
	.catch(function(e) {console.error("[DBL] Updating server count failed,",e)})
}

module.exports = {
	name: "DBL Support",
	author: "theLMGN",
	version: 1,
	requiresConfig:"dblToken",
	description: "Adds support for Discord Bot List.",
	commands: [],
	events: [{
		name: "ready",
		exec: function(c) {

			// Update server count
			updateServerCount(c)
			setInterval(() => {
				updateServerCount(c)
			}, 1800000);
		}
	}],
	timer: [],
};
