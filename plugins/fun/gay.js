const Discord = require("discord.js");
const seed = require("../../util/seedprng");

let overrides = {};
try {
    overrides = require("../../config/gaydar.js");
} catch (e) {}
module.exports = {
    name: "Gaydar™",
    author: "theLMGN",
    version: 1,
    description: "Implements Gaydar™ technology",
    commands: [{
        name: "gay",
        usage: "user user=<@158311402677731328>",
        description: "Uses Gaydar™ on a specific user",
        /**
         * @param {Discord.Client} c Client
         * @param {Discord.Message} m Invoking message
         * @param {Array} a Arguments
         */
        category: "Fun",
        execute: async(c, m, a) => {
            let member = a.user;
            if (member.bot) {
                return m.reply({ embed: new Discord.MessageEmbed()
                    .setAuthor("That's a bot.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                    .setColor("#ff3860")
                    .setFooter("I don't think robots can have sexualities.") });
            }
            m.reply({ embed: new Discord.MessageEmbed()
                .setTitle("Gaydar™")
                .setDescription(`${member.username} is ${overrides[member.id] || 100 - Math.round(seed(member.id) / 70000000)}% gay`)
                .setColor("#3273dc") });
        }
    }]
};
