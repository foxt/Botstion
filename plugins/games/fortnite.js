const Discord = require("discord.js");
const config = require("../../util/configLoader");
const fetch = require("node-fetch");
let requestsRemaining = 30;
let uptimeAtLastReset = process.uptime();

module.exports = {
    name: "Fortnite",
    author: "theLMGN",
    version: 1,
    description: "Fortnite stats provided by fortnitetracker.com",
    requiresConfig: "trackerNetworkApiKey",
    commands: [
        {
            name: "fortnite",
            usage: "enum{kbm,gamepad,touch} platform=kbm, word playerName=theLMGN",
            description: "Fortnite statistics. (Powered by https://fortnitetracker.com/, valid platforms are currently `pc`,`xbl` and `psn`)",
            category: "Games",
            execute: async (c, m, a) => {
                let platform = a.platform;
                if (requestsRemaining < 6) {
                    return m.reply({ embed: new Discord.MessageEmbed()
                        .setAuthor("429: Ratelimited!", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                        .setColor("#ff3860")
                        .setFooter(`Try again in ${60 - Math.floor(process.uptime() - uptimeAtLastReset)} seconds.`) });
                }
                let e = await m.reply({ embed: new Discord.MessageEmbed()
                    .setTitle("Working...")
                    .setDescription("Please wait a few seconds")
                    .setColor("#ffdd57") });

                let r = await fetch(`https://api.fortnitetracker.com/v1/profile/${platform}/${a.playerName}`, {
                    headers: { "TRN-Api-Key": config.trackerNetworkApiKey }
                });
                let j = await r.json();
                if (j.error) {
                    let text = j.error;
                    if (text == "Player Not Found") {
                        return e.edit({ embed: new Discord.MessageEmbed()
                            .setAuthor("404: Account not found.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                            .setColor("#ff3860")
                            .setFooter("Make sure you've got the name correct!") });
                    } else {
                        return e.edit({ embed: new Discord.MessageEmbed()
                            .setAuthor("500: Something broke", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                            .setColor("#ff3860")
                            .setFooter(text) });
                    }
                } else {
                    let emb = new Discord.MessageEmbed()
                        .setAuthor(`[${j.platformNameLong}] ${j.epicUserHandle}`)
                        .setColor("#23d160")
                        .setFooter("Epic Account ID: " + j.accountId + " (powered by fortnitetracker.com)")
                        .setThumbnail("https://i.imgur.com/QDzGMB8.png")
                        .setURL(`https://fortnitetracker.com/profile/${j.platformName}/${j.epicUserHandle}`)
                        .setDescription(`[View full stats on FortniteTracker.com](https://fortnitetracker.com/profile/${j.platformName}/${j.epicUserHandle})`);
                    for (let stat of j.lifeTimeStats) {
                        emb.addField(stat.key, stat.value, true);
                    }
                    return e.edit({ embed: emb });
                }
            }
        }
    ],
    events: [
        {
            name: "ready",
            exec: function() {
                setInterval(() => {
                    requestsRemaining = 30;
                    uptimeAtLastReset = process.uptime();
                }, 60000);
            }
        }
    ]
};
