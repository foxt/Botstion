console.log("[DB		] Initializing");
const Sequelize = require("sequelize");
const fs = require("fs");
const config = require("../util/configLoader");

let dbLoaded = false;
let db = { tables: {} };

if (config.sequelize) {
    const sequelize = new Sequelize(...config.sequelize);
    db.rawDB = sequelize;

    console.log("[DB		]\tLoading schemas");

    for (let file of fs.readdirSync("./db/schemas")) {
        if (file.endsWith(".js")) {
            console.log("[DB		]\t\t Loading schema " + file);
            db.tables[file.replace(/.js/g, "")] = require("./schemas/" + file)(sequelize);
        }
    }
} else {
    console.log("[DB		]\t no config key! not loading");
}

let addons = {
    db: db,
    dbLoaded: dbLoaded
};

for (let addon of fs.readdirSync("./db/helperaddons")) {
    if (addon.endsWith(".js")) {
        addons[addon.replace(".js", "")] = require("./helperaddons/" + addon)(db);
    }
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
            console.log("[DB		] Synchronizing schemas");
            for (let schema in db.tables) {
                console.log("[DB		]\t Synchronizing schema " + schema);
                db.tables[schema].sync();
            }
            db.dbLoaded = true;
        }
    }],
    addons: addons
};
