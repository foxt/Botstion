const Discord = require("discord.js");
const config = require("../../configLoader");
const fetch = require("node-fetch")
let requestsRemaining = 5;
let uptimeAtLastReset = process.uptime();

var currencyListDownloaded = false
var currencies = []

function parseCurrencyList(text) {
    var split = text.split("\n")
    split.shift()
    for (var currency of split) {
        currencies.push(currency.split(",")[0])
    }
}

module.exports = {
	name: "Alpha Vantage",
	author: "theLMGN",
	version: 1,
	description: "Currency conversion and stock exchange commands.",
	requiresConfig: "alphaVantageKey",
	commands: [
		{
			name: "currency",
			usage: "50 GBP BTC",
			description: "Currency conversions, {amount} {source currency} {to currency}",
			execute: async(c, m, a) => {
                if (!currencyListDownloaded) {
                    return m.reply({ embed: new Discord.MessageEmbed()
                        .setAuthor("428: Currency list not loaded.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                        .setColor("#ff3860")
                        .setFooter(`Please try again later.`) });
                }
				if (requestsRemaining < 1) {
                    return m.reply({ embed: new Discord.MessageEmbed()
                        .setAuthor("429: Ratelimited!", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                        .setColor("#ff3860")
                        .setFooter(`Try again in ${60 - Math.floor(process.uptime() - uptimeAtLastReset)} seconds.`) });
                }
                if (a.length < 3) {
                    return m.reply({ embed: new Discord.MessageEmbed()
                        .setAuthor("400: Too few arguments", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                        .setColor("#ff3860")
                        .setFooter(`This command only accepts 3 arguments, {amount} {source currency} {to currency}`) });
                }
                log(currencies)
                var floatNumber = parseFloat(a[0])
                if (isNaN(floatNumber)) {
                    return m.reply({ embed: new Discord.MessageEmbed()
                        .setAuthor("400: First argument is not a number.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                        .setColor("#ff3860")
                        .setFooter(`This command only accepts 3 arguments, {amount} {source currency} {to currency}`) });
                }
                if (!currencies.includes(a[1].toUpperCase())) {
                    return m.reply({ embed: new Discord.MessageEmbed()
                        .setAuthor(`400: ${a[1]} is not a recognised currency.`, "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                        .setColor("#ff3860")
                        .setFooter(`This command only accepts 3 arguments, {amount} {source currency} {to currency}`) });
                }
                
                if (!currencies.includes(a[2].toUpperCase())) {
                    return m.reply({ embed: new Discord.MessageEmbed()
                        .setAuthor(`400: ${a[2]} is not a recognised currency.`, "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                        .setColor("#ff3860")
                        .setFooter(`This command only accepts 3 arguments, {amount} {source currency} {to currency}`) });
                }
                if (a[2].toUpperCase() == a[1].toUpperCase()) {
                    return m.reply({ embed: new Discord.MessageEmbed()
                        .setTitle(`${floatNumber} ${a[1]} = ${floatNumber} ${a[2]}`)
                        .setColor("#3273dc")
                        .setFooter(`Currency conversion powered by alphavantage.io`) });
                }
                requestsRemaining -= 1
                var ftch = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${a[1]}&to_currency=${a[2]}&apikey=${config.alphaVantageKey}`)
                var j = await ftch.json()
                var exchange = j["Realtime Currency Exchange Rate"]
                var fromName = exchange["2. From_Currency Name"]
                var toName = exchange["4. To_Currency Name"]
                var rate = parseFloat(exchange["5. Exchange Rate"])
                return m.reply({ embed: new Discord.MessageEmbed()
                    .setTitle(`${floatNumber} ${fromName} = ${floatNumber * rate} ${toName}`)
                    .setColor("#3273dc")
                    .setFooter(`Currency conversion powered by alphavantage.io`) });
			}
		}
	],
	events: [
		{
			name: "ready",
			exec: async function(c) {
				setInterval(function() {
					requestsRemaining = 5;
					uptimeAtLastReset = process.uptime();
                },60000)
                log("[AlphaVantage] Downloading list of real currencies")
                var realFetch = await fetch("https://www.alphavantage.co/physical_currency_list/")
                parseCurrencyList(await realFetch.text())

                log("[AlphaVantage] Downloading list of virtual currencies")
                var digitalFetch = await fetch("https://www.alphavantage.co/digital_currency_list/")
                parseCurrencyList(await digitalFetch.text())
                currencyListDownloaded = true
                log(`[AlphaVantage] ${currencies.length} currencies loaded.`)
			}
		}
	]
};
