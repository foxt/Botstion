const Discord = require("discord.js");
const { FieldsEmbed: FieldsEmbedMode } = require('discord-paginationembed');


module.exports = {
	name: "Paginator",
	author: "theLMGN",
	version: 1,
	description: "Paginator Module",
	commands: [],
	events: [],
	timer: [],
	paginate: function(m,embeds) {
		var paginator = new FieldsEmbedMode()
			.setArray(embeds)
			.setAuthorizedUsers([m.author.id])
			.setChannel(m.channel)
			.setElementsPerPage(1)
			.showPageIndicator(true)
			.build();
	}
};
