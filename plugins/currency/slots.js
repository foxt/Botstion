const Discord = require("discord.js");

const EMOJIS = ":apple: :watermelon: :banana: :tangerine: :cherries:".split(" ")

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
}


module.exports = {
	name: "Slots",
	author: "theLMGN",
	version: 1,
	description: "Slots game using coins.",
	commands: [{
		name: "slots",
		usage: "100",
		description: "Play slots. The provided input is your bet.",
		execute: async(c, m, a) => {
			if (!(c.db.dbLoaded && c.db.tables.wallet)) { return m.reply("The database is unavailable right now. Try again later.") }
            try {
                var amount = parseInt(a[0])
                if (isNaN(amount) && amount % 2 == 0) { return m.reply(new Discord.MessageEmbed()
                    .setTitle("Uhh?")
                    .setDescription("That doesn't look like a number to me! The bet must be a even number.")
					.setColor("#ff3860")) }
				var coins = await c.getcoins(m.author)
				if (amount > coins) { return m.reply(new Discord.MessageEmbed()
                    .setTitle("Nope")
                    .setDescription("We don't give out loans y'know.")
					.setFooter(`Try again when you have ${amount - coins} more coins`)
					.setColor("#ff3860"))  }
				
				var spin = [
					EMOJIS[getRandomInt(0,4)],
					EMOJIS[getRandomInt(0,4)],
					EMOJIS[getRandomInt(0,4)]
				]
				console.log(spin)
				var multiplier = 0
				var embed = new Discord.MessageEmbed()
				.setTitle("Too bad.")
				.setDescription(spin.join("|")) // .join didn't work
				.setFooter(`You lost ${amount} coins.`)
				.setColor("#ff3860")
			

				if (spin[0] == spin[2]) {
					multiplier = 0.5
					embed = embed.setTitle(`Well, at least you didn't lose it all.`)
					.setFooter(`You lost ${amount * multiplier} coins.`)
					.setColor("#ffdd57") 
				}
				if (spin[0] == spin[1] || spin[2] == spin[1]) {
					multiplier = 1
					embed =  embed.setTitle(`Well, at least you broke even..`)
					.setFooter("")
					.setColor("#ffdd57") 
				}
				if (spin[0] == spin[1] && spin[2] == spin[1]) {
					multiplier = 5
					embed = embed.setTitle("JACKPOT!")
					.setFooter(`You won ${amount*multiplier} coins.`)
					.setColor("#23d160")
				}
				await c.db.tables.wallet.update({ coins:(coins - amount) + (amount * multiplier) }, { where: { userId: m.author.id } });
				m.reply(embed)
            } catch (e) {
                return m.reply(e.toString());
            }
		}
	}]
};
