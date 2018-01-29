const Discord = require("discord.js")
const client = new Discord.Client()
const config = require("./config.json")
const clearRequire = require('clear-require')
const permissionmanager = require("./utils/permissionmanager")
const logger = require("./utils/BotstionLogger")
require("./scratchpad")
logger.info("Loaded core modules.")

/* Handle commands */
client.on("message", async message => {
    var prefix = config.prefix
    if (message.author.bot) return null
    if (!message.content.startsWith(prefix)) return null
    const cmd = message.content.split(" ")[0].trim().toLowerCase().replace(prefix, "")
    const suffix = message.content.split(" ").splice(1)
    if (cmd == "reloadganymede" && permissionmanager.userHasPerms(message.author) > 3) {
        clearRequire("./ganymede")
        require("./ganymede")
        logger.warn(`Ganymede was reloaded (invoker: ${message.author.tag})`)
        return message.reply({embed:new Discord.RichEmbed()
            .setTitle("Reloaded Ganymede")
            .setDescription(`Ganymede was reloaded succesfully.`)
            .setColor("#23d160")})
    } else {
        require("./ganymede")(client,cmd,suffix,message)
    }
})

client.on('ready', () => {
    logger.info(`Logged in as ${client.user.tag}!`)
    require("./webserver")(client)
})
 
client.login(config.token)
