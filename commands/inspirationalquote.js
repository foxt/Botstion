const Discord = require("discord.js");
const bot = new Discord.Client;
const fs = require("fs")
const SNEK = require('snekfetch');

exports.run = async(client,msg,args) => {
    SNEK.get('http://inspirobot.me/api?generate=true').then(r =>msg.reply({embed:new Discord.RichEmbed().setTitle("Inspirational Quote*").setDescription(`I just cooked up a hot new inspirational quote*`).setFooter("*Botstion or theLMGN do not claim that these quotes are actually insperational, or even make sense. In most cases, you should not follow the instructions in this quote. If you do not know if you should act upon this quote, see a mental asylum, they'll help you :^).").setColor("#3273dc").setImage(r.text)}));
}
exports.permission = 1
exports.help = {descrip: "Shows you an inspirational quote.", example: "inspirationalquote"}