const Discord = require("discord.js");

function userIsPlaying(activities,game) {
	for (var activity of activities) {
		if (activity.name.toLowerCase() == game) { return true}
	}
	return false
}

module.exports = {
	name: "Playing Count",
	author: "theLMGN",
	version: 1,
	disabled: true,
	description: "A command that shows all the user the bot knows who are playing a game.",
	commands: [
		{
			name: "playing",
			usage: "Team Fortress 2",
			description: "Shows you a number of how many people are playing the specified game",
			execute: async(c, m, a) => {
				var game = a.join(" ").toLowerCase();
				var count = 0;
				var total = 0;
				var inGame = 0;

				for (var users of c.users.cache.array()) {
					if (!users.bot) {
						if (users.presence.status != "offline") {
							total += 1;
							if (users.presence.activities && users.presence.activities[0]) {
								inGame += 1;
								if (userIsPlaying(users.presence.activities,game)) {
									count += 1;
								}
							}
						}

					}

				}
				return m.reply(new Discord.MessageEmbed()
				.setColor("#23d160")
				.setDescription(`:video_game: I know ${total} people who are online, ${inGame} (${Math.floor((inGame / total) * 100)}%) are in a game, and ${count} (${Math.floor((count / total) * 100)}% out of total users, ${Math.floor((count / inGame) * 100)}% out of all users in game) are playing **${game}**`));
			},
		},
	]
};
