const Discord = require("discord.js");
const querystring = require("querystring")
const snek = require("snekfetch")
const config = require("../configLoader");


module.exports = {
	name: "Weather",
	author: "theLMGN",
	version: 1,
	description: "Weather powered by DarkSky",
	requiresConfig: "darkskyApiKey",
	commands: [
		{
			name: "weather",
			usage: "London",
			description: "Weather powered by DarkSky",
			execute: async(c, m, a) => {
				if (a.includes("vlagland")) { a = ["bucharest"]}
				var e = await m.reply({ embed: new Discord.MessageEmbed()
					.setTitle("Working...")
					.setDescription(`Please wait a few seconds`)
					.setColor("#ffdd57") });
				var data = querystring.stringify({action: "gpcm", c1: a.join(" ")})
				console.log(data)
				snek.get("https://darksky.net/geo?q=" + encodeURIComponent(a.join(" ")))
				.then(async function(l) {
					var gps = l.body

					if (l.statusCode != 200) {
						return e.edit({ embed: new Discord.MessageEmbed()
							.setAuthor(l.statusCode + ": " + l.statusText, "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
							.setColor("#ff3860")
							.setFooter("Maybe try a different location?") });
					} else {

						snek.get(`https://darksky.net/rgeo?hires=1&lat=${gps.latitude}&lon=${gps.longitude}`).then(async function(lf) {
							var location = lf.body.name
							snek.get(`https://api.darksky.net/forecast/${config.darkskyApiKey}/${gps.latitude},${gps.longitude}?units=uk2`).then(async function(w) {
								var weather = w.body

								var alerts = ":smiley: There are no weather alerts in this region currently"
								if (weather.alerts) {
									alerts = `:warning: There are ${weather.alerts.length} weather alerts in this region.`
								}
								var em = new Discord.MessageEmbed()
								.setDescription(alerts)
								.setFooter("Weather information powered by DarkSky")
								.setColor("#23d160")
								.setTitle(`${weather.currently.summary} (${weather.currently.temperature}C) in ${location}`)
								if (weather.minutely) {
									em.addField("And within the hour it'll be", weather.minutely.summary)
								}
								if (weather.hourly) {
									em.addField("For the rest of today it'll be",weather.hourly.summary)
								}
								if (weather.daily) {
									em.addField("During the week, it'll be",weather.daily.summary)
								}
								for (var day of weather.daily.data) {
									var date = new Date(day.time * 1000)
									var df = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][date.getDay()]
									var data = `${day.summary} (HI: ${day.temperatureHigh}C, LO: ${day.temperatureLow}C)`
									em.addField(df,data)
								}

								await e.edit({ embed: em });
							})
						})
					}

				});
			},
		},
	]
};
