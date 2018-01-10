const Discord = require("discord.js");
const bot = new Discord.Client;
const config = require("../config")
const url = require("url")
const snek = require("snekfetch")
const lyr  = require("lyricist")
const ly = new lyr(config.geniusAccessToken);

exports.run = async(client,msg,args) => {
    snek.get('https://api.genius.com/search?q=' + url.parse(args.join(" ")).href).set("Authorization", "Bearer " + config.geniusAccessToken).then(async function(r) {
        var songs = JSON.parse(r.text).response.hits
        if (songs.length < 1) {
            return msg.reply({embed:new Discord.RichEmbed()
                .setTitle("We can't find that!")
                .setAuthor("Genius Lyrics", "https://images.genius.com/f382a769534841745f6918c81cd66181.1000x1000x1.png")
                .setDescription(`We had **${songs.length}** results when we searched up **${args.join(" ")}**`)
                .setColor("#ff3860")})
        } else {
            var message = await msg.reply({embed:new Discord.RichEmbed().setTitle(songs[0].result.full_title)
                .setDescription(`*Please wait...*`)
                .setURL(songs[0].result.url)
                .setAuthor("Genius Lyrics", "https://images.genius.com/f382a769534841745f6918c81cd66181.1000x1000x1.png")
                .setThumbnail(songs[0].result.header_image_url)
                .setColor("#3273dc")
            }).then(function (message) {
                ly.song(songs[0].result.id, {fetchLyrics:true}).then(function (s) {
                    let description = s.lyrics
                    if (description.length > 1500) {
                        description = description.substring(0,1500) + " [(shortened, click for full lyrics)](" + s.url + ")"
                    }
                    
                    message.edit({embed:new Discord.RichEmbed().setTitle(s.full_title)
                        .setDescription(`${description}`)
                        .setURL(s.url)
                        .setAuthor("Genius Lyrics", "https://images.genius.com/f382a769534841745f6918c81cd66181.1000x1000x1.png")
                        .setThumbnail(s.header_image_url)
                        .setColor("#3273dc")
                    })
                })
            })
        }
    })
}
exports.permission = 1
exports.help = {descrip: "Shows you the lyrics for a song on genius.com", example: "lyrics As Your Father I Expressly Forbid It"}
