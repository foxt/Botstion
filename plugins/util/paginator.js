const Discord = require("discord.js");
const { Embeds: EmbedsMode } = require('discord-paginationembed');


module.exports = {
	name: "Paginator",
	author: "theLMGN",
	version: 1,
	description: "Paginator Module",
	addons: {
		paginate: async function(m,embeds,msg) {
			if (!m.channel.permissionsFor(m.guild.member(m.client.user)).has("MANAGE_MESSAGES")) {
				return m.reply(":warning: Botstion tried to paginate this message, but doesn't have Manage Messages permission. Ask an administrator to grant Botstion this permission to see the other " + (embeds.length - 1) + " pages.", embeds[0])
			}
			if (!msg) {msg = m.channel.send("Loading...")}
			new EmbedsMode()
				.setArray(embeds)
				.setAuthorizedUsers([m.author.id])
				.setChannel(m.channel)
				.setClientAssets({message:await msg})
				.setPageIndicator(true)
				.build();
			return msg
		}
	}
};
