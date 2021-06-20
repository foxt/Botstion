const Discord = require("discord.js");
const mcjs = require("../../util/minecraft");

let requestsRemaining = 30;
let uptimeAtLastReset = process.uptime();

module.exports = {
    name: "Minecraft",
    author: "theLMGN",
    version: 1,
    description: "i like to build with brown bricks in mine crap",
    commands: [
        {
            name: "mcsrv",
            usage: "word ip=mc.hypixel.net, int optional port=25565",
            description: "Shows you details of a Minecraft server",
            category: "Games",
            execute: async(c, msg, a) => {
                let e = await msg.reply({ embed: new Discord.MessageEmbed()
                    .setTitle("Working...")
                    .setDescription("Please wait a few seconds")
                    .setFooter("Trying >=1.7 server...")
                    .setColor("#ffdd57") });
                let m;
                try {
                    m = await mcjs.pingModernMinecraftServer(a.ip, a.port);
                } catch (e) { console.error(e); }
                if (!m) {
                    await e.edit({ embed: new Discord.MessageEmbed()
                        .setTitle("Working...")
                        .setDescription("Please wait a few seconds")
                        .setFooter("Trying >=1.4 server...")
                        .setColor("#ffac41") });
                    try {
                        m = await mcjs.pingMinecraftServer(a.ip, a.port);
                    } catch (e) { console.error(e); }
                }
                if (m) {
                    console.log(m);
                    if (m.description.extra) {
                        let t = m.description.text || "";
                        m.description.extra.map((a) => { t += a.bold ? "**" + a.text + "**" : a.italic ? "*" + a.text + "*" : a.text; });
                        console.log(m.description, t);
                        m.description.text = t;
                    }
                    var emb = new Discord.MessageEmbed()
                        .setTitle(a.ip + ":" + a.port)
                        .setDescription((m.description.text || m.description || "(no description)").toString().replace(/§./g, ""))
                        .addField(m.players.online + "/" + m.players.max, (m.players.sample || []).length > 0 ? m.players.sample.map((p) => "[" + p.name + "](https://namemc.com/profile/" + p.id + ")").join("\n") : m.players.online > 0 ? "The server doesn't want to tell us who they are" : "There are no players online.")
                        .setFooter(m.version.name + " (" + m.version.protocol + ")")
                        .setColor("#23d160");
                    if (m.favicon) {
                        let b = Buffer.from(m.favicon.split(",")[1], "base64");
                        emb.attachFiles(new Discord.MessageAttachment(b, "icon.png"))
                            .setThumbnail("attachment://icon.png");
                        e.delete();
                        return msg.reply(emb);
                    } else {
                        return e.edit(emb);
                    }
                } else {
                    var emb = new Discord.MessageEmbed()
                        .setTitle("Couldn't get server details")
                        .setDescription("Either there's no Minecraft server running on that host, or it's really ancient.")
                        .setColor("#ff3860");
                    return e.edit(emb);
                }
            }
        }
    ],
    events: [
        {
            name: "ready",
            exec: function(c) {
                setInterval(() => {
                    requestsRemaining = 30;
                    uptimeAtLastReset = process.uptime();
                }, 60000);
            }
        }
    ]
};
