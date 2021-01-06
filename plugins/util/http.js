const Express = require('express')
const config = require("../../util/configLoader")

console.log("		[HTTP] Creating express app")
const app = Express()

app.use(Express.json()); // parsing of json post bodies

app.use(function (req, res, next) {
	res.set("Server", "Botstion4");
	next()
}) // set server header

app.use(Express.static('static'))



console.log("			[HTTP] Done!")
var tags = {
	float: `<span class="tag is-primary icon">.1</span>`,
	int: `<span class="tag is-success icon">12</span>`,
	word: `<span class="tag is-info icon"><i class="fas fa-font"></i></span>`,
	bool: `<span class="tag is-warning icon"><i class="fas fa-check"></i></span>`,
	enum: `<span class="tag is-danger icon"><i class="fas fa-list"></i></span>`,
	user: `<span class="tag is-link icon"><i class="fas fa-user"></i></span>`

}

module.exports = {
	name: "HTTP Server",
	author: "theLMGN",
	requiresConfig: "httpPort",
	version: 1,
	description: "This plugin is responsible for the Botstion HTTP server.",
	events: [{
		name: "ready",
		exec: function (c) {
			console.log("[HTTP] Adding servers endpoint")
			app.get("/api/info", async function (req, res) {
				var j = {
					serverIcons: ["http://bot.thelmgn.com/logo.svg"],
					members: c.users.cache.size,
					servers: c.guilds.cache.size,
				}
				res.send(JSON.stringify(j))
			})
			app.get("/commands", async function (req, res) {
				var cats = {
					Meta: "",
					Utilities: "",
					Fun: "",
					Games: "",
					Music: "",
					Currency: "",
				}
				for (var command of c.allCommands) {
					if (req.url.includes("hide" + command.category)) {continue}
					if (req.url.includes("hideMaintainer") && command.stipulations.maintainer) {continue}
					if (!cats[command.category]) {cats[command.category] = ""}
					cats[command.category] += `<article class="message">
		 <div class="message-header " style="justify-content: left;">
		   <p class="has-text-weight-light">${config.defaultPrefix}</p>
		   <p>${command.name}</p>
		   `
					for (var use of command.usage) {
						cats[command.category] += `<div class="control">
						<div class="tags has-addons" style="padding-left:0.75rem;">
							${tags[use.type.kind]}
							${use.type.allowedValues ? `<span class="tag is-danger">${use.type.allowedValues.join(", ")}</span>` : ""}
							${use.name ? `<span class="tag is-dark">${use.name}</span>` : ""}
							${use.default ? `<span class="tag is-light">${use.default}</span>` : ""}
							${use.optional ? `<span class="tag is-success">optional</span>` : ""}
						</div>
					</div>`
					}
					cats[command.category] += `
		   ${command.stipulations.nsfw == 1 ? `<div class="control">
		   <div class="tags has-addons" style="padding-left:0.75rem;">
			   <span class="tag is-warning icon"><i class="fas fa-surprise"></i></span>
			   <span class="tag has-background-grey has-text-light">Filtered NSFW</span>
		   </div>
	   </div>` : ""}
	   ${command.stipulations.nsfw > 1 ? `<div class="control">
		   <div class="tags has-addons" style="padding-left:0.75rem;">
			   <span class="tag is-danger icon"><i class="fas fa-surprise"></i></span>
			   <span class="tag has-background-grey has-text-light">NSFW</span>
		   </div>
	   </div>` : ""}
	   ${command.stipulations.maintainer ? `
		   <div class="control">
			   <div class="tags has-addons" style="padding-left:0.75rem;">
				   <span class="tag is-primary icon"><i class="fas fa-tools"></i></span>
				   <span class="tag has-background-grey has-text-light">Maintainer only</span>
			   </div>
		   </div>`
	 : "" }
		   
		 </div>
		 <div class="message-body">
		   ${command.description}
		 </div>
	   </article>`
				}
				var rtrn = `
				<head>
<title>Botstion Commands</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.css">
<style>
body,h2.title.is-2 {
	background:#222428;
	color: #fff;
}
</style>
</head>
<body>
<section class="hero is-dark">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">
        Botstion Commands
      </h1>
      <h2 class="subtitle">
        There are currently ${c.allCommands.length} commands in Botstion.
      </h2>
    </div>
  </div>
</section><br>
<section class="container is-widescreen">
	 `
	 for (var cat in cats) {
		rtrn += `<h2 class="title is-2">${cat}</h2>${cats[cat]}`
	 }

				
				rtrn += `
</section>
</div>
<script src="https://unpkg.com/showdown/dist/showdown.min.js"></script>
<script>
var c = new showdown.Converter()
	 for (var e of document.querySelectorAll(".message-body")) {
		 e.innerHTML = c.makeHtml(e.innerHTML.trim())
	 }
</script>`
				res.send(rtrn.replace(/<@158311402677731328>/g,"@theLMGN").replace(/<@321746347550310411>/g,"@Botstion"))
			})

			console.log("[HTTP] Listening on port " + config.httpPort)
			app.listen(config.httpPort)
		}
	}],
	addons: {
		express: app
	}
};