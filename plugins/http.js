const Express = require('express')
const config = require("../configLoader")

console.log("		[HTTP] Creating express app")
const app = Express()

app.use(Express.json()); // parsing of json post bodies

app.use(function (req, res, next) {res.set("Server","Botstion4");next()}) // set server header

app.get("/", function(req,res) { res.send("Botstion HTTP server.") }) // basic reply on GET /

console.log("			[HTTP] Done!")

module.exports = {
	name: "HTTP Server",
	author: "theLMGN",
	requiresConfig: "httpPort",
	version: 1,
	description: "This plugin is responsible for the Botstion HTTP server.",
	commands: [],
	events: [{
		name: "ready",
		exec: function(c) {
			console.log("[HTTP] Adding servers endpoint")
			app.get("/api/servers", async function(req,res) {
				var j = []
				for (var g of c.guilds.array()) {
					j.push({
						id: g.id,
						members: g.memberCount,
						icon: g.icon,
						name: g.name
					})
				}
				res.send(JSON.stringify(j))
			})
			console.log("[HTTP] Listening on port " + config.httpPort)
			app.listen(config.httpPort)
		}
	}],
	timer: [],
	addons: {
		express: app
	}
};
