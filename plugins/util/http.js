const Express = require('express')
const config = require("../../configLoader")

console.log("		[HTTP] Creating express app")
const app = Express()

app.use(Express.json()); // parsing of json post bodies

app.use(function (req, res, next) {res.set("Server","Botstion4");next()}) // set server header

app.use(Express.static('static'))



console.log("			[HTTP] Done!")

module.exports = {
	name: "HTTP Server",
	author: "theLMGN",
	requiresConfig: "httpPort",
	version: 1,
	description: "This plugin is responsible for the Botstion HTTP server.",
	events: [{
		name: "ready",
		exec: function(c) {
			console.log("[HTTP] Adding servers endpoint")
			app.get("/api/info", async function(req,res) {
				var j = {
					serverIcons: ["http://bot.thelmgn.com/logo.svg"],
					members: c.users.cache.size,
					servers: c.guilds.cache.size,
				}
				res.send(JSON.stringify(j))
			})
			app.get("/commands", async function(req,res) {
				res.send("<h1>commands</h1>" + c.allCommands.map((c) => c.name).join("<br>"))
			})

			console.log("[HTTP] Listening on port " + config.httpPort)
			app.listen(config.httpPort)
		}
	}],
	addons: {
		express: app
	}
};
