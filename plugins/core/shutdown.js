const Discord = require("discord.js");
const config = require("../../util/configLoader");

module.exports = {
    name: "Shutdown",
    author: "theLMGN",
    version: 1,
    description: "Destroys the client then kills the process. (Ported from Botstion3)",
    commands: [{
        name: "shutdown",
        description: "Shutdown the bot.",
        category: "Meta",
        stipulations: {
            maintainer: true
        },
        execute: async (c, m, a) => {
            await m.reply({ embed: new Discord.MessageEmbed()
                .setTitle("See ya!")
                .setDescription("Botstion is about to go down.")
                .setColor("#23d160") });
            await c.destroy();
            process.exit();
        }
    }]
};
