const Discord = require("discord.js")
const client = new Discord.Client()
const mongoose = require("mongoose")
const logger = require("./utils/BotstionLogger")
const permissionmanager = require("./utils/permissionmanager")
const config = require("./config.json")
const database = require("./mongo/database")
const clearRequire = require('clear-require');
require("./scratchpad")
logger.info("Loaded core modules.")
/*database.initialize(config.mongoURL).then(db => {
	logger.info(`Database Loaded!`);
}).catch(err => {
	logger.crit(`Failed to launch Database, this is probably your fault you Mongo`);
    process.exit(1);
});*/

/* Import commands */
client.on("message", async message => {
    var prefix = config.prefix
    if (message.author.bot) return null
    if (!message.content.startsWith(prefix)) return null
    const cmd = message.content.split(" ")[0].trim().toLowerCase().replace(prefix, "")
    if (message.guild) {
        logger.info(`${message.author.tag} executed ${cmd} in ${message.channel.name} of ${message.guild.name}`)
    } else {
        logger.info(`${message.author.tag} executed ${cmd} in direct messages.`)
    }
    const suffix = message.content.split(" ").splice(1)
    if (cmd == "unload" && permissionmanager.userHasPerms(message.author) > 3) {
        if (suffix === undefined || suffix.length == 0) {
            clearRequire.all()
            return message.reply({embed:new Discord.RichEmbed()
                .setTitle("Unloaded")
                .setDescription("We have unloaded all of our commands.")
                .setColor("#23d160")})
        } else {
            var commands = ""
            suffix.forEach(function(c) {
                clearRequire("./commands/" + c)
                commands = commands + " " + c
            })
            return message.reply({embed:new Discord.RichEmbed()
                .setTitle("Unloaded")
                .setDescription(`Unloaded ${commands}`)
                .setColor("#23d160")})
        }
    } else {
        let cmdFile
        try {
            cmdFile = require(`./commands/${cmd}.js`)
        } catch (err) {
            return logger.err(err)
        }
        if (cmdFile) {
            try {
                var up = permissionmanager.userHasPerms(message.author)
                if (up >= cmdFile.permission) {
                    return cmdFile.run(client, message, suffix).catch(function (err) {
                        return Message.reply({embed:new Discord.RichEmbed()
                            .setTitle("Woops, we had an error.")
                            .setDescription(`\`\`\`${err}\`\`\``)
                            .setColor("#ff3860")})
                    })
                } else {
                    return message.reply("You don't have permissions to run that command. ")
                }
            } catch (err) {
                return Message.reply({embed:new Discord.RichEmbed()
                    .setTitle("Woops, we had an error.")
                    .setDescription(`\`\`\`${err}\`\`\``)
                    .setColor("#ff3860")})
            }
            
        }
    }

})

client.on('ready', () => {
    logger.info(`Logged in as ${client.user.tag}!`)
  })
 
  client.login(config.token)
