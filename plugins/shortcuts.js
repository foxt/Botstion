const Discord = require("discord.js");
const shortcuts = require("shortcuts.js")

function imgurUpload(image) {

	return new Promise(function(a,r) {
		var apiKey = require("../configLoader").imgurClientID
		require("snekfetch").post("https://api.imgur.com/3/image").set("Authorization", "Client-ID " + apiKey).send({image: image}).then(a).catch(r)
	})
}


module.exports = {
	name: "Apple Shortcuts",
	author: "theLMGN",
	version: 1,
	description: "Data on Apple iOS Shortcuts",
	requiresConfig: "imgurClientID",
	commands: [
		{
			name: "shortcuts",
			usage: "https://www.icloud.com/shortcuts/5e8f36990cec481db78872ed70b3dcc8",
			description: "Data on Apple iOS Shortcuts",
			execute: async(c, m, a) => {

				var e = await m.reply({ embed: new Discord.MessageEmbed()
					.setTitle("Working...")
					.setDescription(`Please wait a few seconds`)
					.setColor("#ffdd57") });
				if (a.length > 1) {
					return e.edit({ embed: new Discord.MessageEmbed()
						.setAuthor("414: Too many arguments.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
						.setColor("#ff3860")
						.setFooter('This command only accepts 1 argument, Shortcut URL.') });
				} else if (a.length == 1) {
					var input = a[0]
					var id = shortcuts.idFromURL(input)
					if (input.length == 32) {
						id = input
					}
					if (id) {
						var shortcut = await shortcuts.getShortcutDetails(id);
						var metadata = await shortcut.getMetadata();
						var imgur = (await imgurUpload(shortcut.icon.downloadURL)).body.data
						var output = ""
						if (metadata.importQuestions.length > 0) {
							output = output + `**Import questions (${metadata.importQuestions.length}):**`
							for (var importQuestion of metadata.importQuestions) {
								output = output + `\n${importQuestion.text}: \`${importQuestion.defaultValue}\``
							}
						}
						if (metadata.importQuestions.length > 0 && metadata.actions.length > 0) {
							output = output + "\n\n\n"
						}
						if (metadata.actions.length > 0) {
							output = output + `**Actions (beta) (${metadata.actions.length}):**`
							for (var action of metadata.actions) {
								if (output.length < 1900) {
									output = output + "\n" + action.identifier + ": ```json\n" + JSON.stringify(action.parameters) + "```"
								}


							}
						}
						if (output.length > 1750) {
							output = output + "(output may of been truncated)"
						}
						return e.edit({ embed: new Discord.MessageEmbed()
							.setTitle(shortcut.name)
							.setColor("#" + shortcut.icon.color.toString(16).substring(0,6))
							.setThumbnail(imgur.link)
							.setURL("https://www.icloud.com/shortcuts/" + shortcut.id)
							.setDescription(output)
							.setFooter('Shortcut last updated ' + shortcut.modificationDate.toString()) });
					} else {
						return e.edit({ embed: new Discord.MessageEmbed()
							.setAuthor("400: Failed to parse", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
							.setColor("#ff3860")
							.setFooter('This command only accepts 1 argument, the shortcut URL.') });
					}
				} else if (a.length < 1) {
					return e.edit({ embed: new Discord.MessageEmbed()
						.setTitle("400: Too few arguments.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
						.setColor("#ff3860")
						.setFooter('This command only accepts 1 argument, Shortcut URL.') });
				}
			},
		},
	]
};
