const Discord = require("discord.js");
const bot = new Discord.Client;
const fs = require("fs")
const clearRequire = require('clear-require');

exports.run = async(client,msg,args) => {
    if (args === undefined || args.length == 0) {
        clearRequire.all()
        return Message.reply({embed:new Discord.RichEmbed()
            .setTitle("Unloaded")
            .setDescription("We have unloaded all of our commands.")
            .setColor("#23d160")})
    } else {
        var commands = ""
        args.forEach(function(c) {
            clearRequire("./commands/" + c)
            commands = commands + " " + c
        })
        return Message.reply({embed:new Discord.RichEmbed()
            .setTitle("Unloaded")
            .setDescription(`Unloaded ${commands}`)
            .setColor("#23d160")})
    }
}
exports.permission = 3
exports.help = {descrip: "Clears the module cache. Takes a space seperated list of commands, if no args are provided, the entire cache will be cleared.", example: "unload 8ball unload semojis **OR** unload"}