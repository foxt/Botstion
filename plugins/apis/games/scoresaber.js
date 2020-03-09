const Discord = require("discord.js");
const fetch = require("node-fetch")

function normaliseChart(str) {
    var vals = str.split(",").map(function (x) { return parseInt(x,10)})
    var min = Math.min(...vals)
    var max = (Math.max(...vals) - min) / 100
    return vals.map(function (x) { return 100 - ((x - min) / max) }).join(",")
}
function getName(e) {
    return e.includes("ExpertPlus") ? "Expert+" : e.includes("Expert") ? "Expert" : e.includes("Hard") ? "Hard" : e.includes("Normal") ? "Normal" : e.includes("Easy") ? "Easy" : e
}

function getRank(acc) {
    if (acc > 90) { return "SS" }
    if (acc > 80) { return "S" }
    if (acc > 65) { return "A" }
    if (acc > 50) { return "B" }
    if (acc > 35) { return "C" }
    if (acc > 20) { return "D" }
    return "E"
}

async function createPage(msg,j,m) {
    var p = j.playerInfo
    var s = j.scoreStats
    if (!p.difference) {
        p.difference = p.history.split(",")
        p.difference = parseInt(p.difference[p.difference.length - 7]) - parseInt(p.difference[p.difference.length - 1])
    }
    var emb = new Discord.MessageEmbed()
    .setColor("#F5D842")
    .setTitle((p.country && p.country.length == 2 ? ":flag_" + p.country.toLowerCase() + ": " : "" ) +
              (p.role && p.role.length > 1 ? "[" + p.role + "]" : "") +
              (p.banned == 1 ? "[Banned]" : "") +
              (p.inactive == 1 ? "[Inactive]" : "") +
              p.playerName)
    .setDescription(p.badges.map((x) => {return x.description}).join(", "))
    .addField("Rank","#" + parseInt(p.rank).toLocaleString() + (p.difference ? " (" + (p.difference > 0 ? "+" : "") + p.difference.toLocaleString() + " weekly change) " : "" )+ (p.country && p.country.length == 2 ? "(:flag_" + p.country.toLowerCase() + ": #" + p.countryRank + ")" : "" ),false)
    .addField("PP",p.pp.toLocaleString(),false)
    .addField("Total Score",s.totalScore.toLocaleString() + " (" + s.totalRankedScore.toLocaleString() + " ranked)",true)
    .addField("Play count",s.totalPlayCount.toLocaleString() + " (" + s.rankedPlayCount.toLocaleString() + " ranked)",false)
    .addField("Avg. Ranked Accuracy",s.averageRankedAccuracy.toLocaleString() + "% (" + getRank(s.averageRankedAccuracy) + ")",true)
    .setImage("https://chart.googleapis.com/chart?cht=lc&chs=450x150&chf=bg,s,2F3136&chm=B,127FA9,0,0,0&chco=02A9E8&chls=5&chd=t:" + normaliseChart(p.history))
    .setThumbnail("https://new.scoresaber.com" + p.avatar)
    .setURL(`https://new.scoresaber.com/u/` + p.playerId)
    .setFooter('Player ID: ' + p.playerId)
    msg.edit(emb)
    var embeds = [emb]
    var latest = await (await fetch("https://new.scoresaber.com/api/player/" + p.playerId + "/scores/recent/1")).json()
    if (!latest.error) {
        emb.addField("Last Seen",latest.scores[0].timeSet)
        var e = new Discord.MessageEmbed()
        .setColor("#F5D842")
        .setTitle(p.playerName + "'s Latest Scores")
        .setThumbnail("https://new.scoresaber.com" + p.avatar)
        .setURL(`https://new.scoresaber.com/u/` + p.playerId)
        for (var score of latest.scores) {
            e.addField(`${score.songName} ${getName(score.difficultyRaw)}`,`[${score.score.toLocaleString()} ${score.maxScore > 0 ? `${(score.score / (score.maxScore / 100)).toLocaleString()}% ${Math.floor(score.pp)}pp` : "Unranked"}](https://scoresaber.com/leaderboard/${score.leaderboardId})`,true)
        }
        embeds.push(e)
    }
    var top = await (await fetch("https://new.scoresaber.com/api/player/" + p.playerId + "/scores/top/1")).json()
    if (!top.error) {
        var topScore = top.scores[0]
        emb.addField("Top Play",`[${topScore.score.toLocaleString()} ${(topScore.score / (topScore.maxScore / 100)).toLocaleString()}% ${Math.floor(topScore.pp)}pp](https://scoresaber.com/leaderboard/${topScore.leaderboardId})`)
        var e = new Discord.MessageEmbed()
            .setColor("#F5D842")
            .setTitle(p.playerName + "'s Top Scores")
            .setThumbnail("https://new.scoresaber.com" + p.avatar)
            .setURL(`https://new.scoresaber.com/u/` + p.playerId)
        for (var score of top.scores) {
            e.addField(`${score.songName} ${getName(score.difficultyRaw)}`,`[${score.score.toLocaleString()} ${score.maxScore > 0 ? `${(score.score / (score.maxScore / 100)).toLocaleString()}% ${Math.floor(score.pp)}pp` : "Unranked"}](https://scoresaber.com/leaderboard/${score.leaderboardId})`,true)
        }
        embeds.push(e)
    }
    global.client.paginate(m,embeds,msg)
}

module.exports = {
	name: "ScoreSaber",
	author: "theLMGN",
	version: 1,
	description: "ScoreSaber statistics",
	commands: [
		{
			name: "scoresaber",
			usage: "word playerName=theLMGN",
			description: "Show Beat Saber ranking for a player. Accepts username or SteamID64.",
			execute: async(c, m, a) => {
                var un = encodeURIComponent(a.playerName)
                var msg 
                if (!isNaN(parseInt(un))) {
                    msg = await m.reply(new Discord.MessageEmbed().setColor("#ffdd57").setTitle("Validating ID `" + un + "`"))
                    var j = await (await fetch(`https://new.scoresaber.com/api/player/${un}/full`)).json()
                    if (!j.error) {
                        createPage(msg,j,m)
                        //return msg
                    }
                }
                msg = (msg || await m.reply(new Discord.MessageEmbed().setColor("#ffdd57").setTitle("Searching for player `" + un + "`")))
                var j = await (await fetch(`https://new.scoresaber.com/api/players/by-name/` + un)).json()
                if (j.error) {
                    return msg.edit({ embed: new Discord.MessageEmbed()
                        .setAuthor(j.error.message, "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                        .setColor("#ff3860") });
                }
                var p = j.players[0]
                mbd = new Discord.MessageEmbed()
                .setColor("#ffdd57")
                .setTitle((p.country && p.country.length == 2 ? ":flag_" + p.country.toLowerCase() + ": " : "" ) + p.playerName)
                .addField("Rank","#" + parseInt(p.rank).toLocaleString() + "(" + (p.difference > 0 ? "+" : "") + p.difference.toLocaleString() + " weekly change)",false)
                .addField("PP",p.pp.toLocaleString(),true)
                .addField("​​​",`**${p.history.split(",").length}-Day Global Charts Position History Graph**`,false)
                .setImage("https://chart.googleapis.com/chart?cht=lc&chs=450x150&chf=bg,s,2F3136&chm=B,127FA9,0,0,0&chco=02A9E8&chls=5&chd=t:" + normaliseChart(p.history))
                .setThumbnail("https://new.scoresaber.com" + p.avatar)
                .setURL(`https://new.scoresaber.com/u/` + p.playerId)
                .setFooter('Player ID: ' + p.playerId)
                msg.edit(mbd)
                var j = await (await fetch(`https://new.scoresaber.com/api/player/${p.playerId}/full`)).json()
                if (!j.error) {
                    j.playerInfo.difference = p.difference
                    createPage(msg,j,m)
                    //return msg
                } else {
                    msg.edit(mbd.setDescription("Error while fetching full results: " + j.error.message).setColor("#ff3860"))
                }
                
			}
		}
	]
};
