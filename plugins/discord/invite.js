const Discord = require("discord.js");
const fetch = require("node-fetch");
class UserFlags extends Discord.BitField {}
UserFlags.FLAGS = {
    DISCORD_EMPLOYEE: 1 << 0,
    PARTNERED_SERVER_OWNER: 1 << 1,
    HYPESQUAD_EVENTS: 1 << 2,
    BUGHUNTER_LEVEL_1: 1 << 3,
    HYPESQUAD_BRAVERY: 1 << 6,
    HYPESQUAD_BRILLIANCE: 1 << 7,
    HYPESQUAD_BALANCE: 1 << 8,
    EARLY_SUPPORTER: 1 << 9,
    TEAM_USER: 1 << 10,
    SYSTEM: 1 << 12,
    BUGHUNTER_LEVEL_2: 1 << 14,
    VERIFIED_BOT: 1 << 16,
    EARLY_VERIFIED_DEVELOPER: 1 << 17
};
let userFlags = {
    DISCORD_EMPLOYEE: "Employee", //
    PARTNERED_SERVER_OWNER: "Partner", //
    HYPESQUAD_EVENTS: "HypeSquad (Old)", //
    BUGHUNTER_LEVEL_1: "BugHunter", //
    BUGHUNTER_LEVEL_2: "Gold BugHunter", //
    HYPESQUAD_BRAVERY: "Bravery", //
    HYPESQUAD_BRILLIANCE: "Brilliance", //
    HYPESQUAD_BALANCE: "Balance", //
    EARLY_SUPPORTER: "Early Supporter", //
    TEAM_USER: "Team",
    SYSTEM: "System",
    VERIFIED_BOT: "Verified",
    EARLY_VERIFIED_DEVELOPER: "Verified Bot Dev" //
};

let flagEmojis = {
    DISCORD_EMPLOYEE: "795732813067321385",
    PARTNERED_SERVER_OWNER: "795732813654654986",
    HYPESQUAD_EVENTS: "795732813323829281",
    BUGHUNTER_LEVEL_1: "795732813399588924",
    BUGHUNTER_LEVEL_2: "795732813398671390",
    HYPESQUAD_BRAVERY: "795732813118177332",
    HYPESQUAD_BRILLIANCE: "795732813663830046",
    HYPESQUAD_BALANCE: "795732813412433961",
    EARLY_SUPPORTER: "795732813269696533",
    EARLY_VERIFIED_DEVELOPER: "795732813432225832"
};
module.exports = {
    name: "Invite",
    author: "theLMGN",
    version: 1,
    description: "Gets information on an invite",
    commands: [
        {
            name: "invite",
            usage: "word invite=fmhYSCr",
            description: "Shows you information an invite",
            category: "Utilities",
            execute: async (c, m, a) => {
                let invite = a.invite.replace(/discord.gg\//g, "").replace(/https:\/\//g, "").replace(/http:\/\//g, "")
                    .replace(/www./g, "")
                    .replace(/discordapp.com\/invite\//g);
                let ftch = await fetch(`https://discordapp.com/api/v6/invites/${encodeURIComponent(invite)}?with_counts=true`);
                let j = await ftch.json();
                if (j.message) {
                    return m.reply({ embed: new Discord.MessageEmbed()
                        .setAuthor(j.code + ": " + j.message, "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                        .setColor("#ff3860") });
                }
                let icon = `https://cdn.discordapp.com/icons/${j.guild.id}/${j.guild.icon}.${j.guild.icon.startsWith("a_") ? "gif" : "png"}?size=128`;
                let embed = new Discord.MessageEmbed()
                    .setTitle(j.guild.name)
                    .addField("Guild ID", j.guild.id, true)
                    .addField("Verification Level", j.guild.verification_level, true)
                    .addField("Vanity URL", j.guild.vanity_url_code ? j.guild.vanity_url_code : "None", true)
                    .addField("Invite Channel", j.channel.name + " (<#" + j.channel.id + ">)", true)
                    .addField("Members", j.approximate_member_count + " (" + j.approximate_presence_count + " online)", true)
                    .setColor("#3273dc");
                if (j.guild.icon) {
                    embed.setThumbnail(icon);
                }
                if (j.guild.banner) {
                    embed.setImage(`https://cdn.discordapp.com/banners/${j.guild.id}/${j.guild.banner}.png?size=2048`);
                }
                if (j.guild.splash) {
                    embed.setImage(`https://cdn.discordapp.com/splashes/${j.guild.id}/${j.guild.splash}.png?size=2048`);
                }
                if (j.guild.icon || j.guild.banner || j.guild.splash) {
                    embed.addField("Images",
                        (j.guild.icon ? `[Icon](${icon}) ` : "") +
                        (j.guild.banner ? `[Banner](https://cdn.discordapp.com/banners/${j.guild.id}/${j.guild.banner}.png?size=2048) ` : "") +
                        (j.guild.banner ? `[Splash](https://cdn.discordapp.com/splashes/${j.guild.id}/${j.guild.splash}.png?size=2048)` : ""));
                }
                if (j.inviter) {
                    let flags = new UserFlags(j.inviter.public_flags);
                    let emojis = flags.toArray().map((f) => flagEmojis[f] ? "<:" + f + ":" + flagEmojis[f] + ">" : userFlags[f] ? userFlags[f] : f);
                    embed.setAuthor(j.inviter.username + "#" + j.inviter.discriminator + " (" + j.inviter.id + ")", `https://cdn.discordapp.com/avatars/${j.inviter.id}/${j.inviter.avatar}.${j.inviter.avatar.startsWith("a_") ? "gif" : "png"}?size=2048`);
                    embed.addField("Inviter", `${emojis.join("")} [${j.inviter.username}#${j.inviter.discriminator}](https://discord.com/users/${j.inviter.id}) (${j.inviter.id}) [\\[PFP\\]](https://cdn.discordapp.com/avatars/${j.inviter.id}/${j.inviter.avatar}.${j.inviter.avatar.startsWith("a_") ? "gif" : "png"}?size=2048)`);
                }
                if (j.description) {
                    embed.setDescription(j.description);
                }
                return m.reply({ embed: embed });
            }
        }
    ]
};
