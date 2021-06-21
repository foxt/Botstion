module.exports = {
    name: "Playing Message",
    author: "theLMGN",
    version: 1,
    description: "Sets the bots playing message",
    timer: [async (c) => {
        c.user.setPresence({ activity: { name: `in ${c.guilds.cache.size} guilds | ${require("../../util/configLoader").defaultPrefix}help` }, status: "online" });
    }]
};
