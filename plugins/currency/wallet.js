const Discord = require("discord.js");

module.exports = {
	name: "Wallet",
	author: "theLMGN",
	version: 1,
	description: "Allows users to pay eachother and view their balance",
	commands: [{
		name: "pay",
		usage: "user recipient=<@158311402677731328>, int amount=50",
		description: "Pay another user",
		category: "Currency",
		execute: async(c, m, a) => {
			if (c.db.dbLoaded && c.db.tables.wallet) {
				try {
					var amount = a.amount
					var fetched = a.recipient
					if (amount < 0) {
						return m.reply(new Discord.MessageEmbed()
						.setTitle("STOP! YOU'VE VIOLATED THE LAW")
						.setDescription("That would be stealing.")
						.setColor("#ff3860"))
					} else if (amount == 0 || m.author.id == fetched.id) {
						return m.reply(new Discord.MessageEmbed()
						.setTitle("Uhhh")
						.setDescription("That would acomplish nothing")
						.setColor("#ff3860"))
					} else {
						var reply = await m.reply(new Discord.MessageEmbed()
							.setTitle("Completing transaction...")
							.setDescription("<:loader:522177421370195969> Give us a mo")
							.setColor("#3273dc"))
						c.db.tables.wallet.sync()
						var payerBal = await c.getcoins(m.author.id)
						var payeeBal = await c.getcoins(fetched.id)
						if (payerBal >= amount) {
							await c.db.tables.wallet.update({ coins: payerBal - amount }, { where: { userId: m.author.id } }); // decrease payer's balance
							await c.db.tables.wallet.update({ coins: payeeBal + amount }, { where: { userId: fetched.id } }); // increase payee's balance
							c.db.tables.wallet.sync()
							try { fetched.send(m.author.toString() + " just paid you " + amount + " coins").catch(()=>{}) } catch(e) {}
							return reply.edit(new Discord.MessageEmbed()
							.setTitle("Transaction complete!")
							.setDescription(`You paid **${fetched.toString()} ${amount}** coins`)
							.setFooter(`You now have ${payerBal - amount} coins`)
							.setColor("#23d160"))
						} else {
							return reply.edit(new Discord.MessageEmbed()
							.setTitle("Nope.")
							.setDescription("We don't give out loans y'know.")
							.setFooter(`Try again when you have ${amount - payerBal} more coins`)
							.setColor("#ff3860"))
						}
					}
						
					
				}
				catch (e) {
					console.error(e)
					return m.reply(e.toString());
				}
			} else {
				m.reply("The database hasn't been loaded.  Please hold on")
			}
		}
	},
	{
		name: "balance",
		description: "Allows you to see how many coins you have in your wallet.",
		category: "Currency",
		execute: async(c, m, a) => {
			if (c.db.dbLoaded && c.db.tables.wallet) {
				try {
					c.db.tables.wallet.sync()
					var coins = await c.getcoins(m.author)
					return m.reply(new Discord.MessageEmbed()
					.setTitle("Your wallet contains...")
					.setDescription("**" + coins + " coins!**")
					.setColor("#23d160"))
				}
				catch (e) {
					return m.reply(e.toString());
				}
			} else {
				m.reply("The database hasn't been loaded.  Please hold on")
			}
		}
	}]
};
