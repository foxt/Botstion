const Discord = require("discord.js");
const fetch = require("node-fetch");


module.exports = {
    name: "XKCD",
    author: "theLMGN",
    version: 2,
    description: "Comics from XKCD",
    commands: [
        {
            name: "xkcd",
            usage: "int optional comic_id",
            description: "Shows information of a XKCD comic.",
            category: "Fun",
            execute: async (c, m, a) => {
                if (a.comic_id) {
                    a.comic_id += "/";
                } else {
                    a.comic_id = "";
                }

                let r = await fetch(`https://xkcd.com/${a.comic_id}info.0.json`);
                let comic = await r.json();
                return m.reply({ embed: new Discord.MessageEmbed().setTitle(`Comic #${comic.num}: ${comic.title} (${comic.day}/${comic.month}/${comic.year})`)
                    .setFooter(comic.alt)
                    .setImage(comic.img)
                    .setColor("#96A8C8") });
            }
        }
    ]
};
