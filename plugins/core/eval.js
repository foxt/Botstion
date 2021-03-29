const config = require("../../util/configLoader");
const Discord = require("discord.js");
module.exports = {
	name: "Evaluate Code",
	author: "SunburntRock89",
	version: 2,
	description: "Evaluates code from a message.",
	commands: [{
		name: "eval",
		usage: "word[] code=console.log(\"Hello World!\")",
		description: "Executes some code.",
		category: "Meta",
		stipulations: {
			maintainer: true
		},
		/**
		 * 
		 * @param {Discord.Client} c 
		 * @param {Discord.Message} m 
		 * @param {Object} a 
		 */
		execute: async(c, m, a) => {
			try {
				var s = m.content.split(" ")
				s.shift()
				var cntnt = s.join(" ")
				let result = await eval(`(async function() {return ${cntnt.replace("c.token", "").replace("client.token", "").replace("[\"token\"]", "")}})()`);
				var str = result.toString()
				try {
					str = require('util').inspect(str)
				} catch(e) {}
				console.log(result,str)
				if (result && !str) {
					if (typeof result.toString == "function") {
						str = result.toString()
					} else {
						str = "*I have no idea what to do with this " + typeof result + "*"
					}
				}
				if (!result) {
					result = "undefined"
				}
				str = str.replace(eval(`/${config.token}/g`), "no");
				if (str.length > 1990) {
					return m.reply([new Discord.MessageEmbed().setTitle(`Evaluation Result`)
					.setFooter("Limited to first 1990 characters")
					.setDescription("```json\n" +str.substring(0,1990) + "```")
					.setColor("#FFCA28"),new Discord.MessageAttachment(Buffer.from(str),`Eval-${new Date()}.txt`)])
				} else {
					return m.reply(new Discord.MessageEmbed().setTitle(`Evaluation Result`)
					.setDescription("```json\n" +str + "```")
					.setColor("#FFCA28"))
				}
				
			} catch (err) {
				var str = err.stack || err.toString()
				if (str.length > 1990) {
					return m.reply([new Discord.MessageEmbed().setTitle(`Evaluation Error`)
					.setFooter("Limited to first 1990 characters")
					.setDescription("```json\n" +str.substring(0,1990) + "```")
					.setColor("#ff3860"),new Discord.MessageAttachment(Buffer.from(str),`EvalError-${new Date()}.txt`)])
				} else {
					return m.reply(new Discord.MessageEmbed().setTitle(`Evaluation Error`)
					.setDescription("```json\n" +str + "```")
					.setColor("#ff3860"))
				}
			}
		},
	}]
};
