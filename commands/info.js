const Discord = require("discord.js");
const bot = new Discord.Client;
const fs = require("fs")

exports.run = async(Client,Message,Arguments) => {
    return Message.reply({embed:new Discord.RichEmbed()
                        .setTitle("Botstion³")
                        .setDescription(`Made by theLMGN in 2017 with :heart: using Node<:js:388353565619519488>.\n\nThanks to [SunburntRock89](http://sr89.ml) for some help and also [Sam's Cookie](http://github.com/samfromyt/cookie) which I stole some code from`)
                        .addField(":ping_pong: Ping", Client.ping + "ms",true) 
                        .addField("<:js:388353565619519488> Node Version", process.version,true) 
                        .addField("<:Discord:375377712681844736> Discord.JS Version", Discord.version,true) 
                        .addField(":clock10: Uptime (hours)", Math.floor(Client.uptime / 60 / 60),true)
                        .addField(":id: PID", process.pid,true) 
                        .addField(":desktop: Platform", process.platform,true) 
                        .setColor("#3273dc")})
    
}
exports.permission = 1
exports.help = {descrip: "Shows some information on the bot.", example: "info"}