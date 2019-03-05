const fs = require("fs");

let config = []
if(fs.existsSync("./config/config.js")) {
	config = require("./config/config.js")
} else if(fs.existsSync("./config/defaultConfig.js")){
	config = require("./config/defaultConfig.js")
	console.log("Botstion has fallen back to the default config file!")
} else {
	console.log("No configurations found (tried defaultConfig.js and config.js), terminating!")
	process.exit(1);
}

for(var key in config){
	console.log(process.env)
	if(key in process.env){
		config[key] = process.env[key]
		console.log("Found " + key + " from environment variable - overriding config!")
	}
}

module.exports = config