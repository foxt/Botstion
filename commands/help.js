const Discord = require("discord.js");
const bot = new Discord.Client;
const fs = require("fs")

exports.run = async(Client,Message,Arguments) => {
    fs.readdir("./commands", function(err, items) {
        if (err) {
            return message.reply(`Woops, we had an error.\n\`\`\`${err}\`\`\``)
        } else {
            var embed = new Discord.RichEmbed()
            .setTitle("Commands")
            .setDescription(`Found ${items.length} commands.`)
            .setColor("#3273dc")
            for (i = 0; i < items.length; i++) { 
                var command = require("./" + items[i])
                embed.addField(items[i].replace(".js",""), `${command.help.descrip}\n    ${command.help.example}`)
            }

            require("../utils/paginator")(
                Client,
                [new Discord.RichEmbed()
                    .setTitle("Commands list")
                    .setDescription("Press ⏭ to goto the next page\nPress ⏮ to goto the previous page\n\nStolen from [Cookie](http://github.com/samonyt/cookie)\n\n[Join the Botstion server](http://discord.gg/V6Ez2N6)\n[Donate](https://www.paypal.com/pools/c/80JewGlyVl)")
                    .setColor("#3273dc"),
                    embed,]
                ,Message)
        }
    })
}
exports.permission = 1
exports.help = {descrip: "Lists the commands", example: "help"}