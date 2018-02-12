//todo: paginate
//      but i'm too lazy so could someone please do it for me

const SauceNAO = require('saucenao')
const Discord = require("discord.js");

function getURL(data) {
    if (data.author_name) {
        if (data.ext_urls) {
            return {name: data.author_name, url: data.ext_urls[0]}
        } else {
            return {name: data.author_name, url: ""}
        }
    } else {
        if (data.ext_urls) {
            return {name: data.company, url: data.ext_urls[0]}
        } else {
            return {name: data.company, url: ""}
        }
    }
}

exports.run = async(client,msg,args) => {
     msg.embeds.forEach(MessageEmbed => {
        if (MessageEmbed.type == "image" && MessageEmbed.url) {
            SauceNAO(MessageEmbed.url).then(function (sauce) {
                
                if (sauce.json.results.length > 0) {
                    var results = sauce.json.results
                    var firstResult = results.shift()
                    var embed = new Discord.RichEmbed()
                        .setTitle("We think it was made by " + getURL(firstResult.data).name)
                        .setDescription(`[Similarity: %${firstResult.header.similarity}\nTitle: ${firstResult.data.title}\nName: ${firstResult.header.index_name}](${getURL(firstResult.data).url})`)
                        .setColor("#ff3860")
                        .setImage(firstResult.header.thumbnail)
                        .setThumbnail(MessageEmbed.url)
                    results.forEach(result => {
                        embed.addField(`${result.header.index_name} (${result.header.similarity}%}`, `[${result.data.title} by ${getURL(firstResult.data).name}](${getURL(firstResult.data).url})`)
                    });
                    msg.reply({embed:embed})
                } else {
                    msg.reply({embed:new Discord.RichEmbed()
                        .setTitle("No results.")
                        .setDescription(`We couldn't find a source for this image`)
                        .setColor("#ff3860")
                        .setThumbnail(MessageEmbed.url)
                })    
                }
                
            }).catch(function(err) {
                msg.reply({embed:new Discord.RichEmbed()
                    .setTitle("Woops, we had an error.")
                    .setDescription(`This probably means we couldn't find a sauce for the URL.\n\n${err}`)
                    .setColor("#ff3860")
                    .setThumbnail(MessageEmbed.url)
                })
            })
        }
     });
     
}
exports.permission = 9999999 
exports.help = {descrip: "Searches SauceNAO for attatched images (COMMAND SCRAPPED)", example: "saucenao"}