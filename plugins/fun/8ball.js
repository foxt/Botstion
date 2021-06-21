const Discord = require("discord.js");

let positiveAnswers = ["It is certain", "As I see it, yes", "It is decidedly so", "Most likely", "Without a doubt", "Outlook good", "Yes, definitely", "Yes", "You may rely on it", "Signs point to yes"];
let unknownAnswers = ["Reply hazy, please try again", "Try again later", "Better not tell you now.", "ERR 15: Cannot connect to 8-Ball service", "Concentrate, and then try again"];
let negativeAnswer = ["Don't count on it", "My reply is no", "My sources say no", "Outlook, not so good", "Very doubtful"];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
}

module.exports = {
    name: "8 Ball",
    author: "theLMGN",
    version: 1,
    description: "A simple random answer generator based of the famous 8ball toy. (Ported from Botstion3)",
    commands: [{
        name: "8ball",
        usage: "word[] question=are you real?",
        description: "Consult the magic 8ball",
        category: "Fun",
        execute: async (c, m, a) => {
            let random = getRandomInt(1, 4);
            if (random == 1) {
                return m.reply({ embed: new Discord.MessageEmbed()
                    .setTitle("The Magic 8-Ball")
                    .setDescription(`\`\`\`diff\n- ${negativeAnswer[getRandomInt(0, 4)]}\`\`\``)
                    .setColor("#ff3860") });
            } else if (random == 2) {
                return m.reply({ embed: new Discord.MessageEmbed()
                    .setTitle("The Magic 8-Ball")
                    .setDescription(`\`\`\`diff\n+ ${unknownAnswers[getRandomInt(0, 4)]}\`\`\``)
                    .setColor("#ffdd57") });
            } else {
                return m.reply({ embed: new Discord.MessageEmbed()
                    .setTitle("The Magic 8-Ball")
                    .setDescription(`\`\`\`md\n# ${positiveAnswers[getRandomInt(0, 9)]}\`\`\``)
                    .setColor("#23d160") });
            }
        }
    }]
};
