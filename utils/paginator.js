/* Stolen from Cookie https://github.com/samonyt/cookie */

const Discord = require("discord.js");
const bot = new Discord.Client;

module.exports = async(client,embeds,message) => {
	var messageID = "";
    for (i = 0; i < embeds.length; i++) { 
        embeds[i].setFooter(`Page ${i + 1}/${embeds.length}`)
    }
	// Menu Start
	message.reply({ embed: embeds[0] }).then(async message2 => {
		await message2.react("⏮");
		await message2.react("⏭");
		messageID += message2.id;
	});
	var page = 0;

	// reading reactions
	client.on("messageReactionAdd", async(reaction, user) => {
		// make sure only reactions are read for the help message and determine which reaction is pressed
		if (user.id !== client.user.id && reaction.emoji.name !== ("⏮", "⏭") && reaction.message.id === messageID) {
			reaction.remove(user);
		}
		if (user.id !== client.user.id && reaction.emoji.name === "⏭" && reaction.message.id === messageID && page === 0) {
			reaction.message.edit({ embed: embeds[1] }).then(asyncmessage => {
				page += 1;
			});

			if (reaction.count > 1 && user.id !== client.user.id) {
				reaction.remove(user);
			}
		}
		if (user.id !== client.user.id && reaction.emoji.name === "⏭" && reaction.message.id === messageID && page === 1) {
			reaction.message.edit({ embed: embeds[2] }).then(asyncmessage => {
				page += 1;
			});
			if (reaction.count > 1 && user.id !== client.user.id) {
				reaction.remove(user);
			}
		}
		if (user.id !== client.user.id && reaction.emoji.name === "⏭" && reaction.message.id === messageID && page === 2) {
			reaction.message.edit({ embed: embeds[3] }).then(asyncmessage => {
			});
			if (reaction.count > 1 && user.id !== client.user.id) {
				reaction.remove(user);
			}
		}
		if (user.id !== client.user.id && reaction.emoji.name === "⏮" && reaction.message.id === messageID && page === 2) {
			reaction.message.edit({ embed: embeds[2] }).then(asyncmessage => {
				page -= 1;
			});
			if (reaction.count > 1 && user.id !== client.user.id) {
				reaction.remove(user);
			}
		}
		if (user.id !== client.user.id && reaction.emoji.name === "⏮" && reaction.message.id === messageID && page === 1) {
			reaction.message.edit({ embed: embeds[1] }).then(asyncmessage => {
				page -= 1;
			});
			if (reaction.count > 1 && user.id !== client.user.id) {
				reaction.remove(user);
			}
		}
		if (user.id !== client.user.id && reaction.emoji.name === "⏮" && reaction.message.id === messageID && page === 0) {
			reaction.message.edit({ embed: embeds[0] });
			if (reaction.count > 1 && user.id !== client.user.id) {
				reaction.remove(user);
			}
		}
	});
};