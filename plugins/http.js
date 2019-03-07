const Express = require('express')
const config = require("../configLoader")

console.log("	[HTTP] Creating express app")
const app = Express()

app.use(function (req, res, next) {
	res.set("Server","Botstion4")
	next()
  })

app.get("/", function(req,res) {
	res.send("Botstion HTTP server.")
})
console.log("		[HTTP] Done!")

module.exports = {
	name: "HTTP Server",
	author: "theLMGN",
	requiresConfig: "httpPort",
	version: 1,
	description: "This plugin is responsible for the Botstion HTTP server.",
	commands: [],
	events: [{
		name: "ready",
		exec: function() {
			console.log("[HTTP] Listening on port " + config.httpPort)
			app.listen(config.httpPort)
		}
	}],
	timer: [],
	addons: {
		express: app
	}
};
