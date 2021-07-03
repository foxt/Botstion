const Discord = require("discord.js");
const config = require("../../util/configLoader");
const searcher = require("lyrics-searcher");

module.exports = {
    name: "Lyrics",
    author: "theLMGN",
    version: 3,
    disabled: true,
    description: "Song lyrics",
    commands: [
        {
            name: "lyrics",
            usage: "word[] search_query=\"Bohemian Rhapsody\"",
            description: "Song lyrics",
            category: "Music",
            execute: async (c, msg, args) => {
                let songs = await searcher("", args.search_query.join ? args.search_query.join(" ") : args.search_query);
                msg.reply(songs.length > 1990 ? { files: [new Discord.MessageAttachment(Buffer.from(songs), songs[0].fullTitle + ".txt")] } : songs);
            }
        }
    ]

};
