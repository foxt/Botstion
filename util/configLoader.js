const fs = require("fs");

let config = [];
if (fs.existsSync("./config/config.js")) {
    config = require("../config/config");
} else if (fs.existsSync("../config/defaultConfig.js")) {
    config = require("./config/defaultConfig");
    console.log("[Config		] Botstion has fallen back to the default config file!");
    console.error("[Config		] This most likely means you have not got a configuration file. You *should* rename defaultConfig to config, and fill it in.");
} else {
    console.log("[Config		] No configurations found (tried defaultConfig.js and config.js), terminating!");
    process.exit(1);
}

for (let key in config) {
    if (key in process.env) {
        config[key] = process.env[key];
        console.log("[Config		] \tFound " + key + " from environment variable - overriding config!");
    }
}

module.exports = config;
