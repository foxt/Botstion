const Discord = require("discord.js");
const bot = new Discord.Client;

exports.run = async(client,msg,args) => {
     await msg.reply({embed:new Discord.RichEmbed()
        .setTitle("See ya!")
        .setDescription("Botstion is about to go down.")
        .setColor("#23d160")})
    client.destroy().then(function () {process.exit()})
}
exports.permission = 4
exports.help = {descrip: "Shuts Botstion down.", example: "shutdown"}