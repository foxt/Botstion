const { Embeds: EmbedsMode } = require("discord-paginationembed");


module.exports = {
    name: "Paginator",
    author: "theLMGN",
    version: 1,
    description: "Paginator Module",
    addons: {
        paginate: async function(m, embeds, msg) {
            if (m.guild && !m.channel.permissionsFor(m.guild.member(m.client.user)).has("MANAGE_MESSAGES")) {
                return m.reply(":warning: Botstion tried to paginate this message, but doesn't have Manage Messages permission. Ask an administrator to grant Botstion this permission, or run this command in DMs, to see the other " + (embeds.length - 1) + " pages. (this is a requirement of the discord-paginationembed library Botstion used, not my fault, sorry!)", embeds[0]);
            }
            if (!msg) { msg = m.channel.send("Loading..."); }
            new EmbedsMode()
                .setArray(embeds)
                .setAuthorizedUsers([m.author.id])
                .setChannel(m.channel)
                .setClientAssets({ message: await msg })
                .setPageIndicator(true)
                .build();
            return msg;
        }
    }
};
