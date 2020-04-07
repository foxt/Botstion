const Discord = require("discord.js");
const { Embeds: EmbedsMode } = require('discord-paginationembed');


module.exports = {
	name: "Paginator",
	author: "theLMGN",
	version: 1,
	description: "Paginator Module",
	addons: {
		paginate: function(m,embeds) {
			if (!m.channel.permissionsFor(m.guild.member(m.client.user)).has("MANAGE_MESSAGES")) {
				return m.reply(":warning: Botstion tried to paginate this message, but doesn't have Manage Messages permission. Ask an administrator to grant Botstion this permission to see the other " + (embeds.length - 1) + " pages.", embeds[0])
			}
			return new EmbedsMode()
				.setArray(embeds)
				.setAuthorizedUsers([m.author.id])
				.setChannel(m.channel)
				.setPageIndicator(true)
				.build();
		}
	}
};
