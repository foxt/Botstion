const Discord = require("discord.js");
const fetch = require("node-fetch");
const config = require("../../util/configLoader");

function updateServerCount(c) {
    fetch(`https://discordbots.org/api/bots/${c.user.id}/stats`, {
        headers: {
            Authorization: config.dblToken,
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ server_count: c.guilds.cache.size })
    }).then(async(e) => {
        if (!e.ok) {
            console.error("[t.gg] Updating server count failed,", await e.text());
        }
    }).catch((e) => {
        console.error("[t.gg] Updating server count failed,", e);
    });
}

module.exports = {
    name: "top.gg support",
    author: "theLMGN",
    version: 1,
    requiresConfig: "dblToken",
    description: "Adds support for top.gg",
    events: [{
        name: "ready",
        exec: function(c) {
            // Update server count
            updateServerCount(c);
            setInterval(() => {
                updateServerCount(c);
            }, 1800000);

            // Webhook setup

            c.express.post("/performVote", async(req, res) => {
                try {
                    console.log("[t.gg] Incoming vote from " + req.ip);
                    if (req.get("Authorization") != config.dblToken) {
                        return res.send("invalid/no auth token!");
                    }

                    let vote = req.body;
                    if (vote) {
                        if (!vote.bot || vote.bot != c.user.id) {
                            console.log("	wrong bot id ", vote.bot, "!=", c.user.id);
                            return res.send("wrong/no bot id!");
                        }
                        let user = await c.users.fetch(vote.user);
                        if (user) {
                            await c.db.tables.wallet.update({ coins: await c.getcoins(vote.user) + 50 }, { where: { userId: vote.user } });
                            let e = new Discord.MessageEmbed();
                            e.setTitle(":blush: Thank you!");
                            e.setDescription("Thanks for voting for Botstion on top.gg! You've recieved **50 coins**!");
                            e.setColor("#23d160");
                            user.send({ embed: e });
                            return res.send("success!");
                        }
                    } else {
                        return res.send("   no json post body!");
                    }
                } catch (e) {
                    console.error("	", e);
                    res.send(e.toString());
                }
            });
        }
    }]
};
