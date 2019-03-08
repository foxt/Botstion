console.log("		[DB] Initializing")
const Sequelize = require('sequelize')
const fs = require("fs")
const config = require("../configLoader")

var dbLoaded = false
var db = {tables:{}}

if (config.sequelize) {
	const sequelize = new Sequelize(...config.sequelize)
	db["rawDB"] = sequelize

	console.log("		[DB] Loading schemas")

	for (var file of fs.readdirSync("./db/schemas")) {
		console.log("			[DB] Loading schema " + file)
		db.tables[file.replace(/.js/g,"")] = require("./schemas/" + file)(sequelize)
	}
} else {
	console.log("			[DB] no config key! not loading")
}

var addons = {
	db: db,
	dbLoaded: dbLoaded
}

for (var addon of fs.readdirSync("./db/helperaddons")) {
	addons[addon.replace(".js","")] = require("./helperaddons/" + addon)(db)
}

module.exports = {
	name: "Database plugin",
	author: "theLMGN",
	version: 1,
	description: "This is the main plugin for handling database support in Botstion.",
	commands: [],
	events: [{
		name: "ready",
		exec: function() {
			console.log("[DB] Synchronizing schemas") 
			for (var schema in db.tables) {
				console.log("	[DB] Synchronizing schema " + schema)
				db.tables[schema].sync()
			}
			db["dbLoaded"] = true
		}
	}],
	timer: [],
	addons: addons
};
