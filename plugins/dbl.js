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

			// Webhook setup

			c.express.post("/performVote", async function(req,res) {
				try {
					console.log("[DBL] Incoming vote from " + req.ip)
					if (req.get("Authorization") != config.dblToken)  {
						return res.send("invalid/no auth token!")
					}

					var vote = req.body
					if (vote) {
						if (!vote.bot || vote.bot != c.user.id) {
							console.log("	wrong bot id ", vote.bot,"!=", c.user.id)
							return res.send("wrong/no bot id!")
						}
						var user = await c.users.fetch(vote.user)
						if (user) {
							let e = new Discord.MessageEmbed()
							e.setTitle(":blush: Thank you!")
							e.setDescription(`Thanks for voting for Botstion on DBL! We're gonna add an Botstion currency soon, so keep voting and you'll get some of those when they launch for voting!`)
							e.setColor("#23d160")
							user.send({ embed: e });
							return res.send("success!")
						}
					} else {
						return res.send("no json post body!")
					}
				} catch(e) {
					console.error("	",e)
					res.send(e.toString())
				}
				
			})
		}
	}],
	timer: [],
};
