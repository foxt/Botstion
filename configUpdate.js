const fs = require("fs");

if (fs.existsSync("./config/config.json")) {
	log(" -- Botstion Config Migration Utility -- ")
	log("	Making a backup of the config...")
	fs.renameSync("./config/config.json","./config/configBackup.json")
	log("		Done!")
	log("	Migrating config...")
	const config = require("./config/configBackup.json")
	fs.writeFileSync("./config/config.js",`module.exports = ${JSON.stringify(config,null,4)}`)
	log("		Done!")
	log(" -- Config updater done, starting bot --")
}