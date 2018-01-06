

const Discord = require("discord.js");
const bot = new Discord.Client;
const fs = require("fs")

var positiveAnswers = ["It is certain", "As I see it, yes", "It is decidedly so", "Most likely", "Without a doubt", "Outlook good", "Yes, definitely", "Yes", "You may rely on it", "Signs point to yes"]
var unknownAnswers = ["Reply hazy, please try again", "Try again later" ,"Better not tell you now.","ERR 15: Cannot connect to 8-Ball service", "Concentrate, and then try again"]
var negativeAnswer = ["Don't count on it", "My reply is no", "My sources say no", "Outlook, not so good", "Very doubtful"]

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

exports.run = async(Client,Message,Arguments) => {
   var random = getRandomInt(1,5)
   if (random == 1) {
    return Message.reply({embed:new Discord.RichEmbed()
        .setTitle("The Magic 8-Ball")
        .setDescription("```md\n# " + negativeAnswer[getRandomInt(0,4)] + "```")
        .setColor("#ff3860")})
   } else if (random == 2) {
    return Message.reply({embed:new Discord.RichEmbed()
        .setTitle("The Magic 8-Ball")
        .setDescription("```md\n# " + unknownAnswers[getRandomInt(0,4)] + "```")
        .setColor("#ffdd57")})
   } else {
    return Message.reply({embed:new Discord.RichEmbed()
        .setTitle("The Magic 8-Ball")
        .setDescription("```md\n# " + positiveAnswers[getRandomInt(0,0)] + "```")
        .setColor("#23d160")})
   }
}
exports.permission = 1
exports.help = {descrip: "Consults the Magic 8-Ball.", example: "8ball {yes/no question}"}