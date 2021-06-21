const Discord = require("discord.js");
const config = require("../../util/configLoader");
const url = require("url");
const fetch = require("node-fetch");
const lyr = require("genius-lyrics");
let ly = null;


module.exports = {
    name: "Genius Lyrics",
    author: "theLMGN",
    version: 1,
    disabled: true,
    description: "Lyrics from genius.com (Ported from Botstion3)",
    requiresConfig: "geniusAccessToken",
    commands: [
        {
            name: "lyrics",
            usage: "word[] searchQuery=\"Bohemian Rhapsody\"",
            description: "Lyrics from Genius.com",
            category: "Music",
            execute: async (c, msg, args) => {
                let songs = await ly.songs.search(args.searchQuery.join(" "));
                if (songs.length < 1) {
                    return msg.reply({ embed: new Discord.MessageEmbed()
                        .setTitle("We can't find that!")
                        .setAuthor("Genius Lyrics", "https://images.genius.com/f382a769534841745f6918c81cd66181.1000x1000x1.png")
                        .setDescription(`We had **${songs.length}** results when we searched.`)
                        .setColor("#ff3860") });
                } else {
                    let m = await msg.reply({ embed: new Discord.MessageEmbed().setTitle(songs[0].fullTitle)
                        .setDescription("*Please wait...*")
                        .setURL(songs[0].url)
                        .setAuthor("Genius Lyrics", "https://images.genius.com/f382a769534841745f6918c81cd66181.1000x1000x1.png")
                        .setThumbnail(songs[0].thumbnail)
                        .setColor("#3273dc")
                    });
                    try {
                        let description = await songs[0].lyrics();
                        if (description.length > 1500) {
                            m.delete();
                            return msg.reply([new Discord.MessageEmbed().setTitle(songs[0].fullTitle)
                            // .setDescription(`[]`)
                                .setURL(songs[0].url)
                                .setAuthor("Genius Lyrics", "https://images.genius.com/f382a769534841745f6918c81cd66181.1000x1000x1.png")
                                .setThumbnail(songs[0].thumbnail)
                                .setColor("#3273dc"),
                            new Discord.MessageAttachment(Buffer.from(description), songs[0].fullTitle + ".txt")]);
                        }

                        return m.edit({ embed: new Discord.MessageEmbed().setTitle(songs[0].fullTitle)
                            .setDescription(`${description}`)
                            .setURL(songs[0].url)
                            .setAuthor("Genius Lyrics", "https://images.genius.com/f382a769534841745f6918c81cd66181.1000x1000x1.png")
                            .setThumbnail(songs[0].thumbnail)
                            .setColor("#3273dc") });
                    } catch (e) {
                        return m.edit({ embed: new Discord.MessageEmbed().setTitle(songs[0].fullTitle)
                            .setDescription(e.message)
                            .setColor("#ff3860") });
                    }
                }
            }
        }
    ],
    events: [
        {
            name: "ready",
            exec: function(c) {
                ly = new lyr.Client(config.geniusAccessToken);
            }
        }
    ]
};
