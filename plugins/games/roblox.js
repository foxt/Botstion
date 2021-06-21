const Discord = require("discord.js");
const cheerio = require("cheerio");
const fetch = require("node-fetch");

// <snippet> from ExtraDataInitializer.lua
// Written by Xsitsu
// Copyright (c) Roblox Corp.
// https://github.com/Roblox/Core-Scripts/blob/master/CoreScriptsRoot/Modules/Server/ServerChat/DefaultChatModules/ExtraDataInitializer.lua#L86
// (this link was last updated 2018, I grabbed a fresh copy of the chat scripts)
// Ported to JavaScript by theLMGN

const NAME_COLORS = [
    "#fd2943", // red
    "#01a2ff", // blue
    "#02b857", // green
    "#6b327c", // purple
    "#da8541", // orange
    "#f5cd30", // yellow
    "#eabac8", // pink
    "#d7c59a" // cream
];

function GetNameValue(pName) {
    let value = 0;
    for (let index = 0; index < pName.length; index++) {
        let cValue = pName.charCodeAt(index);
        let reverseIndex = pName.length - index + 1;
        if (index.length % 2 == 1) {
            reverseIndex -= 1;
        }
        if (reverseIndex % 4 >= 2) {
            cValue = -cValue;
        }
        value += cValue;
    }
    if (value < 0) {
        return -value;
    }
    return value;
}

let color_offset = 0;
function ComputeNameColor(pName) {
    return NAME_COLORS[(GetNameValue(pName) + color_offset) % NAME_COLORS.length];
}

// </snippet>

const assetTypes = [
    "???",
    "Image",
    "T-Shirt",
    "Audio",
    "Mesh",
    "Lua",
    "HTML",
    "Text",
    "Hat",
    "Place",
    "Model",
    "Shirt",
    "Pants",
    "Decal",
    "???",
    "???",
    "Avatar",
    "Head",
    "Face",
    "Gear",
    "???",
    "Badge",
    "Group Emblem",
    "???",
    "Animation",
    "Arms",
    "Legs",
    "Torso",
    "Right Arm",
    "Left Arm",
    "Left Leg",
    "Right Leg",
    "Package",
    "YouTubeVideo",
    "Game Pass",
    "App",
    "???",
    "Code",
    "Plugin",
    "SolidModel",
    "MeshPart",
    "Hair Accessory",
    "Face Accessory",
    "Neck Accessory",
    "Shoulder Accessory",
    "Front Accessory",
    "Back Accessory",
    "Waist Accessory",
    "Climb Animation",
    "Death Animation",
    "Fall Animation",
    "Idle Animation",
    "Jump Animation",
    "Run Animation",
    "Swim Animation",
    "Walk Animation",
    "Pose Animation"
];

async function getAssetThumbnail(id) {
    let ftch = await fetch("https://www.roblox.com/asset-thumbnail/json?width=420&height=420&format=png&assetId=" + id);
    let j = await ftch.json();
    if (!j.Final) {
        return "https://www.roblox.com/asset-thumbnail/image?width=420&height=420&format=png&assetId=" + id;
    }
    return j.Url;
}

module.exports = {
    name: "Roblox API Support",
    author: "theLMGN",
    version: 1,
    description: "Connection to Roblox",
    commands: [
        {
            name: "rblxprofile",
            usage: "word username=Builderman",
            description:
                "Shows you the profile of a Roblox user. You can pass either a Roblox username (e.g. theLMGN), a Roblox user ID, (e.g 47757673) or mention a user if they've verified with [RoVer](https://eryn.io/RoVer/)",
            category: "Games",
            execute: async (c, m, a) => {
                let input = a.username;

                let e = await m.reply({
                    embed: new Discord.MessageEmbed()
                        .setTitle("Working...")
                        .setDescription("Please wait a few seconds")
                        .setColor("#ffdd57")
                });
                let userID = 0;
                let userName = "";
                if (!isNaN(parseInt(input))) {
                    // UserID checker
                    userID = +input;
                    let ftch = await fetch("https://api.roblox.com/users/" + input);
                    let apiResponse = await ftch.json();
                    if (apiResponse.errors) {
                        return e.edit({
                            embed: new Discord.MessageEmbed()
                                .setAuthor(
                                    `${apiResponse.errors[0].code}: ${apiResponse.errors[0].message}.`,
                                    "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png"
                                )
                                .setColor("#ff3860")
                                .setFooter("Make sure you got the UserID correct")
                        });
                    }
                    userName = apiResponse.Username;
                } else if (!new RegExp("[^A-Za-z0-9_]").exec(input)) {
                    // Username checker
                    const usernameFetch = await fetch("https://api.roblox.com/users/get-by-username?username=" + input);
                    const username = await usernameFetch.json();
                    if (username.errorMessage) {
                        return e.edit({
                            embed: new Discord.MessageEmbed()
                                .setAuthor(
                                    "404: " + username.errorMessage,
                                    "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png"
                                )
                                .setColor("#ff3860")
                                .setFooter("Make sure you got the username correct.")
                        });
                    } else {
                        userID = username.Id;
                        userName = username.Username;
                    }
                } else if (
                    input.startsWith("<@") &&
                    input.endsWith(">") &&
                    !isNaN(input.replace("<@", "").replace(">", "").replace("!", ""))
                ) {
                    // Mention checker
                    let discordID = input.replace("<@", "").replace(">", "").replace("!", "");
                    let verifyFetch = await fetch("https://verify.eryn.io/api/user/" + discordID);
                    let verify = await verifyFetch.json();
                    if (verify.robloxId) {
                        userID = verify.robloxId;
                        userName = verify.robloxUsername;
                    } else {
                        return e.edit({
                            embed: new Discord.MessageEmbed()
                                .setAuthor(
                                    `${verify.errorCode}: ${verify.error}`,
                                    "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png"
                                )
                                .setColor("#ff3860")
                                .setFooter(
                                    "Make sure you mentioned the right user and they are signed up on http://verify.eryn.io"
                                )
                        });
                    }
                } else {
                    return e.edit({
                        embed: new Discord.MessageEmbed()
                            .setAuthor(
                                "415: Bad format.",
                                "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png"
                            )
                            .setColor("#ff3860")
                            .setFooter("This command only accepts 1 argument, Username, User ID or Discord mention")
                    });
                }
                let ftch = await fetch(`https://www.roblox.com/users/${userID}/profile`);
                if (!ftch.ok) {
                    return e.edit({
                        embed: new Discord.MessageEmbed()
                            .setAuthor(`**${userName}**`)
                            .setColor("#ff3860")
                            .setDescription("**Banned!**")
                            .addField("ID", userID)
                            .setThumbnail("https://discordemoji.com/assets/emoji/BlobBanhammerCouncil.png")
                    });
                }
                let profilePage = await ftch.text();
                if (profilePage) {
                    let $ = cheerio.load(profilePage);
                    let info = $(".profile-header-content > div")[0].attribs;
                    let bcBadge = "";
                    if ($(".header-title > span")[0]) {
                        bcBadge = $(".header-title > span")[0].attribs.class.replace("icon-", "");
                        if (bcBadge == "obc") {
                            bcBadge = "[OBC]";
                        }
                        if (bcBadge == "tbc") {
                            bcBadge = "[TBC]";
                        }
                        if (bcBadge == "bc") {
                            bcBadge = "[BC]";
                        }
                        if (bcBadge == "premium-medium") {
                            bcBadge = "[Premium]";
                        }
                    }
                    let embed = new Discord.MessageEmbed()
                        .setColor(ComputeNameColor(userName) || "#E2231A")
                        .addField("Friends", info["data-friendscount"], true)
                        .addField("Followers", info["data-followerscount"], true)
                        .addField("Following", info["data-followingscount"], true)
                        .addField(
                            "Creation Date",
                            $(
                                "#about > div.section.profile-statistics > div.section-content > ul > li:nth-child(1) > p.text-lead"
                            )[0].childNodes[0].data,
                            true
                        )
                        .addField(
                            "Place Visits",
                            $(
                                "#about > div.section.profile-statistics > div.section-content > ul > li:nth-child(2) > p.text-lead"
                            )[0].childNodes[0].data,
                            true
                        )
                        .setThumbnail(
                            "https://www.roblox.com/avatar-thumbnail/image?width=420&height=420&format=png&userId=" +
                                userID
                        )
                        .setFooter("User ID: " + userID);
                    try {
                        embed.addField(
                            "Previous Usernames",
                            JSON.parse(
                                $(".profile-header-content > script")[0]
                                    .childNodes[0].data.replace("var Roblox=Roblox||{};Roblox.ProfileHeaderData=", "")
                                    .replace(";", "")
                            ).previoususernames
                        );
                    } catch {}
                    try {
                        embed.addField("Status", info["data-statustext"], false);
                    } catch {}
                    try {
                        embed.setDescription($(".profile-about-content-text")[0].childNodes[0].data);
                    } catch {}
                    embed.setAuthor(
                        bcBadge.replace("premium-medium", "") + userName,
                        "https://www.roblox.com/headshot-thumbnail/image?width=420&height=420&format=png&userId=" +
                            userID
                    );
                    return e.edit({ embed: embed });
                }
            }
        },
        {
            name: "rblxgroup",
            usage: "int groupId=3534114",
            description: "Shows you the profile of a Roblox group. Requires ID, not name",
            category: "Games",
            execute: async (c, m, a) => {
                let input = a.groupId;

                let e = await m.reply({
                    embed: new Discord.MessageEmbed()
                        .setTitle("Working...")
                        .setDescription("Please wait a few seconds")
                        .setColor("#ffdd57")
                });

                let ftch = await fetch("https://api.roblox.com/groups/" + input);
                if (!ftch.ok) {
                    return e.edit({
                        embed: new Discord.MessageEmbed()
                            .setAuthor(
                                "404: Not found",
                                "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png"
                            )
                            .setColor("#ff3860")
                            .setFooter("Double check the provided ID")
                    });
                }
                let details = await ftch.json();
                if (details) {
                    let embed = new Discord.MessageEmbed()
                        .setColor("#E2231A")
                        .setThumbnail(await getAssetThumbnail(details.EmblemUrl.split("=")[1]))
                        .setDescription(details.Description)
                        .setTitle(details.Name)
                        .setURL("https://roblox.com/groups/" + details.Id)
                        .setFooter("Group ID: " + details.Id)
                        .setAuthor(
                            details.Owner.Name,
                            "https://www.roblox.com/headshot-thumbnail/image?width=420&height=420&format=png&userId=" +
                                details.Owner.Id,
                            `https://roblox.com/users/${details.Owner.Id}/profile`
                        );
                    return e.edit({ embed: embed });
                }
            }
        },

        {
            name: "rblxasset",
            usage: "int itemId=14083380",
            description: "Shows you the information of a Roblox asset provided by it's ID",
            category: "Games",
            execute: async (c, m, a) => {
                let input = a.itemId;

                let e = await m.reply({
                    embed: new Discord.MessageEmbed()
                        .setTitle("Working...")
                        .setDescription("Please wait a few seconds")
                        .setColor("#ffdd57")
                });

                let ftch = await fetch(`https://api.roblox.com/marketplace/productinfo?assetId=${input}`);
                if (!ftch.ok) {
                    return e.edit({
                        embed: new Discord.MessageEmbed()
                            .setAuthor(
                                "404: Not found",
                                "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png"
                            )
                            .setColor("#ff3860")
                            .setFooter("Double check the provided ID")
                    });
                }
                let details = await ftch.json();
                if (details) {
                    let tags = [];
                    if (details.IsNew) {
                        tags.push("[New]");
                    }
                    if (details.IsLimited && !details.IsLimitedUnique) {
                        tags.push("[Limited]");
                    }
                    if (details.IsLimited && details.IsLimitedUnique) {
                        tags.push("[LimitedU]");
                    }
                    if (details.MinimumMembershipLevel > 0) {
                        tags.push("[BC Only]");
                    }
                    if (details.ContentRatingTypeId > 0) {
                        tags.push("[13+]");
                    }
                    tags.push(details.Name);
                    let pfp;
                    if (details.Creator.CreatorType == "User") {
                        pfp =
                            "https://www.roblox.com/headshot-thumbnail/image?width=420&height=420&format=png&userId=" +
                            details.Creator.CreatorTargetId;
                    } else {
                        try {
                            let gFetch = await fetch("https://api.roblox.com/groups/" + details.Creator.CreatorTargetId);
                            if (gFetch.ok) {
                                let gdetails = await gFetch.json();
                                pfp = gdetails.EmblemUrl;
                            }
                        } catch (err) {}
                    }
                    let embed = new Discord.MessageEmbed()
                        .setColor("#E2231A")
                        .setThumbnail(await getAssetThumbnail(details.AssetId))
                        .setDescription(details.Description)
                        .setTitle(tags.join(" "))
                        .setAuthor(
                            details.Creator.Name,
                            pfp,
                            details.Creator.CreatorType == "User"
                                ? `https://roblox.com/users/${details.Creator.CreatorTargetId}/profile`
                                : "https://www.roblox.com/groups/" + details.Creator.CreatorTargetId
                        )
                        .addField("Type", assetTypes[details.AssetTypeId])
                        .addField("Public Domain?", details.IsPublicDomain ? "Yes" : "No")
                        .addField("For Sale?", details.IsForSale ? "Yes" : "No")
                        .addField("Created", new Date(details.Created))
                        .addField("Updated", new Date(details.Updated));
                    if (details.Sales > 0 || details.PriceInRobux) {
                        embed.addField(
                            details.PriceInRobux ? "Price" : "Sales",
                            details.PriceInRobux ? `R$${details.PriceInRobux} (${details.Sales} sales)` : details.Sales
                        );
                    }
                    if (details.IsLimited || details.Remaining) {
                        embed.addField("Remaining", details.Remaining || "0");
                    }

                    return e.edit({ embed: embed });
                }
            }
        }
    ]
};
