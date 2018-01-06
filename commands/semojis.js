const Discord = require("discord.js");
const bot = new Discord.Client;


exports.run = async(client,msg,args) => {
    msg.reply({embed:new Discord.RichEmbed().setTitle(`${msg.guild.name} has ${msg.guild.emojis.array().length} emoji(s)`)
    .setDescription(`${msg.guild.emojis.array().join("")}`)
    .setColor("#3273dc")
});

}
exports.permission = 1
exports.help = {descrip: "Shows you the emojis in this server..", example: "semojis"}