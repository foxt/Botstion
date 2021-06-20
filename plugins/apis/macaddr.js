const Discord = require("discord.js");
const config = require("../../util/configLoader");
const fetch = require("node-fetch");
let lastRequest = 0;

module.exports = {
    name: "MAC Address lookup",
    author: "theLMGN",
    version: 1,
    description: "Look up a MAC address",
    commands: [
        {
            name: "mac",
            usage: "word mac=00:23:DF:AD:BE:EF",
            description: "Look up a MAC address",
            aliases: ["macaddr"],
            category: "Utilities",
            execute: async(c, m, a) => {
                let e = await m.reply({ embed: new Discord.MessageEmbed()
                    .setTitle("Working...")
                    .setDescription("Please wait a few seconds")
                    .setColor("#ffdd57") });

                let r = await fetch("https://api.maclookup.app/v2/macs/" + encodeURIComponent(a.mac));
                let j = await r.json();

                if (!j.success) {
                    return e.edit({ embed: new Discord.MessageEmbed()
                        .setAuthor("An error occured", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                        .setColor("#ff3860")
                        .setFooter("This usually means **you** broke something.") });
                } else {
                    if (!j.found) {
                        return e.edit({ embed: new Discord.MessageEmbed()
                            .setAuthor("Not found", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                            .setColor("#ff3860") });
                    }
                    if (j.isPrivate) {
                        return e.edit({ embed: new Discord.MessageEmbed()
                            .setAuthor("Private listing", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                            .setFooter("The company prevents their name and address from showing up in the public listing")
                            .setColor("#3273dc") });
                    }
                    if (j.isRand) {
                        return e.edit({ embed: new Discord.MessageEmbed()
                            .setAuthor("Anonymised MAC", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                            .setFooter("This MAC can be transmitted when a device is not associated with an access point. In this case, it can be considered randomized")
                            .setColor("#3273dc") });
                    }
                    return e.edit({ embed: new Discord.MessageEmbed()
                        .setTitle(`:flag_${j.country.toLowerCase()}: ${j.company}`)
                        .addField("Address", j.address)
                        .addField("Block Size", `${j.blockStart}-${j.blockEnd} (${j.blockType}, ${j.blockSize})`)
                        .setTimestamp(new Date(j.updated))
                        .setColor("#23d160") });
                }
            }
        }
    ]
};
