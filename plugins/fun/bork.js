module.exports = {
	name: "bork",
	author: "theLMGN",
	version: 1,
	description: "Bork",
	commands: [
		{
			name: "<@321746347550310411>",
			description: "Bork",
			execute: async(c, m, a) => {
				m.reply("bork")
			}
		},
	]
};
