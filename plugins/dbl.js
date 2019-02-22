const Discord = require("discord.js")
const { get,post } = require('snekfetch')
const conf = require("../config/config.js")
let voters = [];

function dbl(c) {
	post(`https://discordbots.org/api/bots/${c.user.id}/stats`).set('Authorization', conf.dblToken).send({server_count: c.guilds.size}).then(function (r) {
		console.log("[DBL]" + JSON.stringify(r.body));
	}).catch(function(e) {console.error("[DBL] Updating server count failed")})
	get(`https://discordbots.org/api/bots/${c.user.id}/votes`).set('Authorization', conf.dblToken).send().then(function (r) {
		voters = r.body;
	}).catch(function(e) {console.error("[DBL] Updating voters failed")})

}

module.exports = {
	name: "DBL Support",
	author: "theLMGN",
	version: 1,
	requiresConfig:"dblToken",
	description: "Adds support for Discord Bot List.",
	commands: [
		{
			name: "voters",
			usage: "",
			description: "Shows you the people who've voted for Botstion on DBL in the last 24 hours (updates every 3 minutes)",
			execute: async(c, m, a) => {
				if (voters.length > 0)  {
					let e = new Discord.MessageEmbed()
					e.setTitle(":blush: Thank you!")
					e.setDescription(`The below shows the people who have voted in the last 24 hours on DBL!\n\n[Vote here!](https://discordbots.org/bot/${c.user.id}/vote)`)
					e.setColor("#23d160")
					e.setFooter("Thank you to all of these people! This really helps our small bot grow!");
					for (var voter of voters) {
						e.addField(voter.username + "#" + voter.discriminator, `<@${voter.id}>`)
					}
					return m.reply({ embed: e });
				} else {
					let e = new Discord.MessageEmbed()
					e.setTitle(":frowning: Awh. We haven't got any votes in the last 24 hours.")
					e.setDescription(`Noone has voted for us in the last 24 hours, [why don't you be the first?](https://discordbots.org/bot/${c.user.id}/vote)`)
					e.setColor("#ff3860")
					e.setFooter(":'(");
					return m.reply({ embed: e });
				}
			},
		}
	],
	events: [{
		name: "ready",
		exec: function(c) {
			dbl(c)
			setInterval(() => {
				dbl(c)
			}, 1800000);
		}
	}],
	timer: [],
};
