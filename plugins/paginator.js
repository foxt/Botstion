const Discord = require("discord.js");
const { Embeds: EmbedsMode } = require('discord-paginationembed');


module.exports = {
	name: "Paginator",
	author: "theLMGN",
	version: 1,
	description: "Paginator Module",
	addons: {
		paginate: function(m,embeds) {
			return new EmbedsMode()
				.setArray(embeds)
				.setAuthorizedUsers([m.author.id])
				.setChannel(m.channel)
				.setPageIndicator(true)
				.build();
		}
	}
};
