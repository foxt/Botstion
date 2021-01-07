const Discord = require("discord.js");
const mcjs = require("../../util/minecraft")

module.exports = {
	name: "Minecraft",
	author: "theLMGN",
	version: 1,
	description: "i like to build with brown bricks in mine craf",
	commands: [
		{
			name: "mcsrv",
			usage: "word ip=mc.hypixel.net, int optional port=25565",
			description: "Shows you details of a Minecraft server",
			category: "Games",
			execute: async(c, msg, a) => {
				var e = await msg.reply({ embed: new Discord.MessageEmbed()
					.setTitle("Working...")
                    .setDescription(`Please wait a few seconds`)
                    .setFooter("Trying 1.7+ server...")
					.setColor("#ffdd57") });
                try {
                    var m = await mcjs.pingModernMinecraftServer(a.ip,a.port)
                    if (m) {
                        console.log(m)
                        if (m.description.extra) {
                            var t = m.description.text || "";
                            m.description.extra.map((a) => t += a.bold ? "**" + a.text + "**" : a.italic ? "*" + a.text + "*" : a.text)
                            m.description = t
                        }
                        var emb = new Discord.MessageEmbed()
                        .setTitle(a.ip + ":" + a.port)
                        .setDescription(m.description.toString().replace(/§./g,""))
                        .addField(m.players.online + "/" + m.players.max,(m.players.sample || []).length > 0 ? m.players.sample.map((p) => "[" + p.name + "](https://namemc.com/profile/" + p.id + ")" ).join("\n") : m.players.online > 0 ? "The server doesn't want to tell us who they are" : "There are no players online.")
                        .setFooter(m.version.name + " (" +m.version.protocol+")")
                        .setColor("#23d160")
                        var b = Buffer.from(m.favicon.split(",")[1], 'base64')
                        emb.attachFiles(new Discord.MessageAttachment(b,"icon.png"))
                        .setThumbnail("attachment://icon.png")
                        e.delete()
                        return msg.reply(emb )
                    }
                } catch(e) {console.error(e)}
				
			}
		}
	],
	events: [
		{
			name: "ready",
			exec: function(c) {
				setInterval(function() {
					requestsRemaining = 30;
					uptimeAtLastReset = process.uptime();
				},60000)
			}
		}
	]
};
