const Discord = require("discord.js");
const config = require("../../util/configLoader");
const fetch = require("node-fetch");
let requestsRemaining = 30;
let uptimeAtLastReset = process.uptime();



async function trnHandler(game, platform, username, m, c) {
    let e = await m.reply({ embed: new Discord.MessageEmbed()
        .setTitle("Working...")
        .setDescription("Please wait a few seconds")
        .setColor("#ffdd57") });
    let r = await fetch(`https://public-api.tracker.gg/v2/${game.id}/standard/profile/${platform}/${encodeURIComponent(username)}`, {
        headers: { "TRN-Api-Key": config.trackerNetworkApiKey }
    });
    let j = await r.json();
    if (j.errors) {
        let error = j.errors[0];
        if (error.code == "CollectorResultStatus::NotFound") {
            return e.edit({ embed: new Discord.MessageEmbed()
                .setAuthor("404: Account not found.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                .setColor("#ff3860")
                .setFooter("Make sure you've got the name correct!") });
        } else if (error.code == "CollectorResultStatus::CollectionError") {
            return e.edit({ embed: new Discord.MessageEmbed()
                .setAuthor("400: Invalid format!", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                .setColor("#ff3860")
                .setFooter("Make sure to include the battletag") });
        } else {
            return e.edit({ embed: new Discord.MessageEmbed()
                .setAuthor("500: " + error.code, "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                .setColor("#ff3860")
                .setFooter(error.message) });
        }
    } else {
        j = j.data;
        let embeds = [];
        for (let segment of j.segments) {
            let decorators = [];
            if (j.userInfo.countryCode) { decorators.push(`:flag_${j.userInfo.countryCode.toLowerCase()}:`); }
            decorators.push("");
            let embed = new Discord.MessageEmbed()
                .setAuthor(`${game.name} Statistics`)
                .setTitle(`${decorators.join(" ")}${j.platformInfo.platformUserHandle} - ${segment.metadata.name}`)
                .setColor(game.color)
                .setThumbnail(game.logo)
                .setFooter("Powered by https://thetrackernetwork.com/");
            for (let stat in segment.stats) {
                embed.addField(segment.stats[stat].displayName, segment.stats[stat].displayValue, true);
            }
            embeds.push(embed);
        }
        e.delete();

        return c.paginate(m, embeds);
    }
}

async function trnCmdHandler(game, c, m, a) {
    if (requestsRemaining < 6) {
        return m.reply({ embed: new Discord.MessageEmbed()
            .setAuthor("429: Ratelimited!", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
            .setColor("#ff3860")
            .setFooter(`Try again in ${60 - Math.floor(process.uptime() - uptimeAtLastReset)} seconds.`) });
    }
    trnHandler(game, a.platform, a.username, m, c);
}


module.exports = {
    name: "TrackerNetwork",
    author: "theLMGN",
    version: 1,
    description: "Game stats provided by thetrackernetwork.com",
    requiresConfig: "trackerNetworkApiKey",
    commands: [
        {
            name: "ow",
            usage: "enum{battlenet,xbl,psn} platform=battlenet, word username=theLMGN#2143",
            description: "Overwatch statistics. (Powered by https://thetrackernetwork.com/, valid platforms are currently `battlenet`,`xbl` and `psn`)",
            category: "Games",
            execute: async (c, m, a) => trnCmdHandler({
                id: "overwatch",
                name: "Overwatch",
                logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Overwatch_circle_logo.svg/768px-Overwatch_circle_logo.svg.png",
                color: "#FA9C1E"
            }, c, m, a)
        },
        {
            name: "apex",
            usage: "enum{origin,xbl,psn} platform=origin, word username=thetheLMGN",
            description: "Apex Legends statistics. (Powered by https://thetrackernetwork.com/, valid platforms are currently `origin`,`xbl` and `psn`)",
            category: "Games",
            execute: async (c, m, a) => trnCmdHandler({
                id: "apex",
                name: "Apex Legends",
                logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/0/03/Apex_Legends_Logo.png/1200px-Apex_Legends_Logo.png",
                color: "#CD3333"
            }, c, m, a)
        },
        {
            name: "csgo",
            usage: "word username=lmgn",
            description: "CS:GO statistics. (Powered by https://thetrackernetwork.com/, platform must be `steam`)",
            category: "Games",
            execute: async (c, m, a) => {
                a.platform = "steam";
                return trnCmdHandler({
                    id: "csgo",
                    name: "Counter Strike: Global Offensive",
                    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/CS-GO_Logo.svg/1280px-CS-GO_Logo.svg.png",
                    color: "#262E6F"
                }, c, m, a);
            }
        },
        {
            name: "division",
            usage: "enum{uplay,xbl,psn} platform=uplay, word username=DivisionPlayer",
            description: "The Division 2 statistics. (Powered by https://thetrackernetwork.com/, platform must be `uplay`, `xbl` or `psn`)",
            category: "Games",
            execute: async (c, m, a) => trnCmdHandler({
                id: "division-2",
                name: "The Division 2",
                logo: "https://upload.wikimedia.org/wikipedia/en/a/af/The_Division_2_art.jpg",
                color: "#FD6B06"
            }, c, m, a)
        }
    ],
    events: [
        {
            name: "ready",
            exec: function(c) {
                setInterval(() => {
                    requestsRemaining = 30;
                    uptimeAtLastReset = process.uptime();
                }, 60000);
            }
        }
    ]
};
