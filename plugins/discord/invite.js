const Discord = require("discord.js");
const fetch = require("node-fetch")

module.exports = {
	name: "Invite",
	author: "theLMGN",
	version: 1,
	description: "Gets information on an invite",
	commands: [
		{
			name: "invite",
			usage: "hNgA7va",
			description: "Shows you information an invite",
			execute: async(c, m, a) => {
                if (a.length < 1) {
                    return m.reply({ embed: new Discord.MessageEmbed()
						.setAuthor("400: No invite link provided", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
						.setColor("#ff3860")
                        .setDescription(`You need to pass an invite link, such as \`b!invite discord.gg/fmhYSCr\` or \`b!invite fmhYSCr\`\n\n
                        If you meant to grab the bot's invite link, you should use b!info, or click [here](https://discordapp.com/oauth2/authorize?client_id=${c.user.id}&scope=bot&permissions=268561473)`) })
                }
                var invite = a[0].replace(/discord.gg\//g,"").replace(/https:\/\//g,"").replace(/http:\/\//g,"").replace(/www./g,"").replace(/discordapp.com\/invite\//g)
                var ftch = await fetch(`https://discordapp.com/api/v6/invites/${encodeURIComponent(invite)}?with_counts=true`)
                var j = await ftch.json()
                if (j.message) {
                    return m.reply({ embed: new Discord.MessageEmbed()
						.setAuthor(j.code +": " + j.message, "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
						.setColor("#ff3860")})
                }
                var icon = `https://cdn.discordapp.com/icons/${j.guild.id}/${j.guild.icon}.${j.guild.icon.startsWith("a_") ? "gif" : "png"}?size=128`
                var embed = new Discord.MessageEmbed()
                    .setTitle(j.guild.name)
                    .addField("Guild ID",j.guild.id,true)
                    .addField("Verification Level",j.guild.verification_level,true)
                    .addField("Vanity URL",j.guild.vanity_url_code ? j.guild.vanity_url_code : "None",true)
                    .addField("Invite Channel",j.channel.name + " (<#" + j.channel.id + ">)",true)
                    .addField("Members",j.approximate_member_count + " (" + j.approximate_presence_count + " online)",true)
                    .setColor("#3273dc")
                if (j.guild.icon) {
                    embed.setThumbnail(icon)
                }
                if (j.guild.banner) {
                    embed.setImage(`https://cdn.discordapp.com/banners/${j.guild.id}/${j.guild.banner}.png?size=2048`)
                }
                if (j.guild.splash) {
                    embed.setImage(`https://cdn.discordapp.com/splashes/${j.guild.id}/${j.guild.splash}.png?size=2048`)
                }
                if (j.guild.icon || j.guild.banner || j.guild.splash) {
                    embed.addField("Images",
                        (j.guild.icon ? `[Icon](${icon}) ` : "") + 
                        (j.guild.banner ? `[Banner](https://cdn.discordapp.com/banners/${j.guild.id}/${j.guild.banner}.png?size=2048) ` : "")  +
                        (j.guild.banner ? `[Splash](https://cdn.discordapp.com/splashes/${j.guild.id}/${j.guild.splash}.png?size=2048)` : ""))
                }
                if (j.inviter) {
                    embed.setAuthor(j.inviter.username + "#" + j.inviter.discriminator + " (" + j.inviter.id + ")", `https://cdn.discordapp.com/avatars/${j.inviter.id}/${j.inviter.avatar}.${j.inviter.avatar.startsWith("a_") ? "gif" : "png"}?size=2048`) 
                }
                return m.reply({ embed: embed })
            }
		}
	]
};
