const Discord = require("discord.js");
const cheerio = require("cheerio");
const fetch = require("node-fetch");

const assetTypes = ["???", "Image", "T-Shirt", "Audio", "Mesh", "Lua", "HTML", "Text", "Hat", "Place", "Model", "Shirt", "Pants", "Decal", "???","???", "Avatar", "Head", "Face", "Gear", "???", "Badge", "Group Emblem", "???", "Animation", "Arms", "Legs", "Torso", "Right Arm", "Left Arm", "Left Leg", "Right Leg", "Package", "YouTubeVideo", "Game Pass", "App", "???", "Code", "Plugin", "SolidModel", "MeshPart", "Hair Accessory", "Face Accessory", "Neck Accessory", "Shoulder Accessory", "Front Accessory", "Back Accessory", "Waist Accessory", "Climb Animation", "Death Animation", "Fall Animation", "Idle Animation", "Jump Animation", "Run Animation", "Swim Animation", "Walk Animation", "Pose Animation"]

async function getAssetThumbnail(id) {
	var ftch = await fetch("https://www.roblox.com/asset-thumbnail/json?width=420&height=420&format=png&assetId=" + id)
	var j = await ftch.json()
	if (!j.Final) {
		return "https://www.roblox.com/asset-thumbnail/image?width=420&height=420&format=png&assetId=" + id
	}
	return j.Url
}

async function embedAsset(m,a) {
	var input = a[0]

	var e = await m.reply({ embed: new Discord.MessageEmbed()
		.setTitle("Working...")
		.setDescription(`Please wait a few seconds`)
		.setColor("#ffdd57") });
	if (a.length >= 1) {
		if (isNaN(input)) {
			return e.edit({ embed: new Discord.MessageEmbed()
				.setAuthor("400: Invalid ID", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
				.setColor("#ff3860")
				.setFooter('This command only accepts 1 argument, asset id') });
		}
		var ftch = await fetch(`https://api.roblox.com/marketplace/productinfo?assetId=${input}`)
		if (!ftch.ok) {
			return e.edit({ embed: new Discord.MessageEmbed()
				.setAuthor("404: Not found", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
				.setColor("#ff3860")
				.setFooter('Double check the provided ID') });
		}
		var details = await ftch.json()
		if (details) {
			var tags = []
			if (details.IsNew) {
				tags.push("[New]")
			}
			if (details.IsLimited && !details.IsLimitedUnique) {
				tags.push("[Limited]")
			}
			if (details.IsLimited && details.IsLimitedUnique) {
				tags.push("[LimitedU]")
			}
			if (details.MinimumMembershipLevel > 0) {
				tags.push("[BC Only]")
			}
			if (details.ContentRatingTypeId > 0) {
				tags.push("[13+]")
			}
			tags.push(details.Name)
			var pfp = undefined
			if (details.Creator.CreatorType == "User") {
				pfp = "https://www.roblox.com/headshot-thumbnail/image?width=420&height=420&format=png&userId=" + details.Creator.CreatorTargetId
			} else {
				try {
					var ftch = await fetch("https://api.roblox.com/groups/" + details.Creator.CreatorTargetId)
					if (ftch.ok) {
						var gdetails = await ftch.json()
						pfp = gdetails.EmblemUrl
					}
				} catch(e) {
				}
			}
			var embed = new Discord.MessageEmbed()
			.setColor("#E2231A")
			.setThumbnail(await getAssetThumbnail(details.AssetId))
			.setDescription(details.Description)
			.setTitle(tags.join(" "))
				.setAuthor(details.Creator.Name, pfp, details.Creator.CreatorType == "User" ? `https://roblox.com/users/${details.Creator.CreatorTargetId}/profile` : "https://www.roblox.com/groups/" + details.Creator.CreatorTargetId)
			.addField("Type", assetTypes[details.AssetTypeId])
			.addField("Public Domain?", details.IsPublicDomain ? "Yes" : "No")
			.addField("For Sale?", details.IsForSale ? "Yes" : "No")
			.addField("Created", new Date(details.Created))
			.addField("Updated", new Date(details.Updated))
			if (details.Sales > 0 || details.PriceInRobux) {
				embed.addField(details.PriceInRobux ? "Price" : "Sales", details.PriceInRobux ? `R$${details.PriceInRobux} (${details.Sales} sales)` : details.Sales)
			}
			if (details.IsLimited || details.Remaining) {
				embed.addField("Remaining", details.Remaining || "0")
			}

			return e.edit({embed:embed})
		}

	} else if (a.length < 1) {
		return e.edit({ embed: new Discord.MessageEmbed()
			.setTitle("400: Too few arguments.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
			.setColor("#ff3860")
			.setFooter('This command only accepts 1 argument, Username, User ID or Discord mention') });
	}
}

module.exports = {
	name: "Roblox API Support",
	author: "theLMGN",
	version: 1,
	description: "Connection to Roblox",
	commands: [
		{
			name: "rblxprofile",
			usage: "theLMGN",
			description: "Shows you the profile of a Roblox user. You can pass either a Roblox username (e.g. theLMGN), a Roblox user ID, (e.g 47757673) or mention a user if they've verified with [RoVer](https://eryn.io/RoVer/)",
			execute: async(c, m, a) => {
				var input = a[0]

				var e = await m.reply({ embed: new Discord.MessageEmbed()
					.setTitle("Working...")
					.setDescription(`Please wait a few seconds`)
					.setColor("#ffdd57") });
				if (a.length >= 1) {
					var userID = 0;
					var userName = ""
					if (!isNaN(new Number(input))) { // UserID checker
						userID = +input
						var ftch = await fetch("https://api.roblox.com/users/" + input)
						var apiResponse = await ftch.json()
						if (apiResponse.errors) {
							return e.edit({ embed: new Discord.MessageEmbed()
								.setAuthor(`${apiResponse.errors[0].code}: ${apiResponse.errors[0].message}.`, "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
								.setColor("#ff3860")
								.setFooter('Make sure you got the UserID correct') });
						}
						userName = apiResponse.Username
					} else if (!new RegExp("[^A-Za-z0-9_]").exec(input)) { // Username checker
						var ftch = await fetch("https://api.roblox.com/users/get-by-username?username=" + input)
						var apiResponse = await ftch.json()
						if (apiResponse.errorMessage) {
							return e.edit({ embed: new Discord.MessageEmbed()
								.setAuthor("404: " + apiResponse.errorMessage, "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
								.setColor("#ff3860")
								.setFooter('Make sure you got the username correct.') });
						} else {
							userID = apiResponse.Id
							userName = apiResponse.Username
						}
					} else if (input.startsWith("<@") && input.endsWith(">") && (!isNaN(input.replace("<@","").replace(">","").replace("!","")))) { // Mention checker
						var discordID = input.replace("<@","").replace(">","").replace("!","")
						var ftch = await fetch("https://verify.eryn.io/api/user/" + discordID)
						var apiResponse = await ftch.json()
						if (apiResponse.robloxId) {
							userID = apiResponse.robloxId
							userName = apiResponse.robloxUsername
						} else {
							return e.edit({ embed: new Discord.MessageEmbed()
								.setAuthor(`${apiResponse.errorCode}: ${apiResponse.error}`, "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
								.setColor("#ff3860")
								.setFooter('Make sure you mentioned the right user and they are signed up on http://verify.eryn.io') });
						}
					} else {
						return e.edit({ embed: new Discord.MessageEmbed()
							.setAuthor("400: Bad format.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
							.setColor("#ff3860")
							.setFooter('This command only accepts 1 argument, Username, User ID or Discord mention') });
					}
					var ftch = await fetch(`https://www.roblox.com/users/${userID}/profile`)
					if (!ftch.ok) {
						return e.edit({ embed: new Discord.MessageEmbed()
							.setAuthor(`**${userName}**`)
							.setColor("#ff3860")
							.setDescription("**Banned!**")
							.addField("ID",userID)
							.setThumbnail("https://discordemoji.com/assets/emoji/BlobBanhammerCouncil.png") });
					}
					var profilePage = await ftch.text()
					if (profilePage) {
						var $ = cheerio.load(profilePage)
						var info = $(".profile-header-content > div")[0].attribs
						var bcBadge = ""
						if ($(".header-title > span")[0]) {
							bcBadge = $(".header-title > span")[0].attribs.class.replace("icon-","")
							if (bcBadge == "obc") {
								bcBadge = "[OBC]"
							}
							if (bcBadge == "tbc") {
								bcBadge = "[TBC]"
							}
							if (bcBadge == "bc") {
								bcBadge = "[BC]"
							}
							if (bcBadge == "premium-medium") {
								bcBadge = "[Premium]"
							}
						}
						var embed = new Discord.MessageEmbed()
						.setColor("#E2231A")
						.addField("Friends",info["data-friendscount"],true)
						.addField("Followers",info["data-followerscount"],true)
						.addField("Following",info["data-followingscount"],true)
						.addField("Creation Date",$("#about > div.section.profile-statistics > div.section-content > ul > li:nth-child(1) > p.text-lead")[0].childNodes[0].data,true)
						.addField("Place Visits",$("#about > div.section.profile-statistics > div.section-content > ul > li:nth-child(2) > p.text-lead")[0].childNodes[0].data,true)
						.setThumbnail("https://www.roblox.com/avatar-thumbnail/image?width=420&height=420&format=png&userId=" + userID)
						.setFooter('User ID: ' + userID)
						try {embed.addField("Previous Usernames",JSON.parse($(".profile-header-content > script")[0].childNodes[0].data.replace(`var Roblox=Roblox||{};Roblox.ProfileHeaderData=`,"").replace(`;`,"")).previoususernames)}catch{}
						try {embed.addField("Status",info["data-statustext"],false)}catch{}
						try {embed.setDescription($(".profile-about-content-text")[0].childNodes[0].data)}catch{}
						embed.setAuthor(bcBadge.replace("premium-medium","") + userName, "https://www.roblox.com/headshot-thumbnail/image?width=420&height=420&format=png&userId=" + userID)
						return e.edit({embed:embed})
					}

				} else if (a.length < 1) {
					return e.edit({ embed: new Discord.MessageEmbed()
						.setTitle("400: Too few arguments.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
						.setColor("#ff3860")
						.setFooter('This command only accepts 1 argument, Username, User ID or Discord mention') });
				}
			},
		},
		{
			name: "rblxgroup",
			usage: "3534114",
			description: "Shows you the profile of a Roblox group. Requires ID, not name",
			execute: async(c, m, a) => {
				var input = a[0]

				var e = await m.reply({ embed: new Discord.MessageEmbed()
					.setTitle("Working...")
					.setDescription(`Please wait a few seconds`)
					.setColor("#ffdd57") });
				if (a.length >= 1) {
					if (isNaN(input)) {
						return e.edit({ embed: new Discord.MessageEmbed()
							.setAuthor("400: Invalid ID", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
							.setColor("#ff3860")
							.setFooter('This command only accepts 1 argument, group id') });
					}
					var ftch = await fetch("https://api.roblox.com/groups/" + input)
					if (!ftch.ok) {
						return e.edit({ embed: new Discord.MessageEmbed()
							.setAuthor("404: Not found", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
							.setColor("#ff3860")
							.setFooter('Double check the provided ID') });
					}
					var details = await ftch.json()
					if (details) {
						
						var embed = new Discord.MessageEmbed()
						.setColor("#E2231A")
						.setThumbnail(await getAssetThumbnail(details.EmblemUrl.split("=")[1]))
						.setDescription(details.Description)
						.setTitle(details.Name)
						.setURL(`https://roblox.com/groups/` + details.Id)
						.setFooter("Group ID: " + details.Id)
						.setAuthor(details.Owner.Name, "https://www.roblox.com/headshot-thumbnail/image?width=420&height=420&format=png&userId=" + details.Owner.Id, `https://roblox.com/users/${details.Owner.Id}/profile`)
						return e.edit({embed:embed})
					}

				} else if (a.length < 1) {
					return e.edit({ embed: new Discord.MessageEmbed()
						.setTitle("400: Too few arguments.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
						.setColor("#ff3860")
						.setFooter('This command only accepts 1 argument, group ID') });
				}
			},
		},

		{
			name: "rblxasset",
			usage: "14083380",
			description: "Shows you the information of a Roblox asset provided by it's ID",
			execute: (c, m, a) => {
				return embedAsset(m,a)
			},
		},
	]
};
