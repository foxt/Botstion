/*
    Ganymede 2
    Botstion's command handler.
*/
const config = require("./config")
const aliases = require("./aliases")
const Discord = require("discord.js")
const client = new Discord.Client()
const figlet = require('figlet')
const clearRequire = require('clear-require')
const logger = require("./utils/BotstionLogger")
const permissionmanager = require("./utils/permissionmanager")

figlet('Ganymede', function(err, data) {
    console.log(data + "\nGanymede 2 loaded")
});
async function execCommand(client,cmd,suffix,message) {
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
                    return message.reply({embed:new Discord.RichEmbed()
                        .setTitle("Woops, we had an error.")
                        .setDescription(`\`\`\`${err}\`\`\``)
                        .setColor("#ff3860")})
                })
            } else {
                return message.reply("You don't have permissions to run that command. ")
            }
        } catch (err) {
            return message.reply({embed:new Discord.RichEmbed()
                .setTitle("Woops, we had an error.")
                .setDescription(`\`\`\`${err}\`\`\``)
                .setColor("#ff3860")})
        }
        
    }
}
module.exports = async function(client,cmd,suffix,message) {
    if (message.guild) {
        logger.info(`${message.author.tag} executed ${cmd} in ${message.channel.name} of ${message.guild.name}`)
    } else {
        logger.info(`${message.author.tag} executed ${cmd} in direct messages.`)
    }
    aliases.forEach(function (alias) {
        if (alias.aliasName == cmd) {
            if (alias.arguments) {
                execCommand(client,alias.aliasesTo,alias.arguments,message)
            } else {
                execCommand(client,alias.aliasesTo,suffix,message)
            }
            
        }
    })
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
        execCommand(client,cmd,suffix,message)
    }
}