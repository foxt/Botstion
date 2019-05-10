const Discord = require("discord.js");

let sentRequests = {};

function checkIfUsersNotAlreadyMarried(c, message, user2){
    return new Promise(async function(resolve){
        const user1Partner = await c.getpartner(message.author.id);
        const user2Partner = await c.getpartner(user2.id);

        if(user1Partner !== null){
            message.reply(new Discord.MessageEmbed()
                .setTitle("Hold on a second!")
                .setDescription("Botstion does not support polygamy!! :triumph: :triumph: You must divorce your current partner.")
                .setColor("#ff3860"));
            resolve(false);
        } else if(user2Partner !== null){
            message.reply(new Discord.MessageEmbed()
                .setTitle("Excuse me!")
                .setDescription(`${user2.toString()} is already in a committed relationship! :triumph: :triumph: They need to divorce their current partner.`)
                .setColor("#ff3860"));
            resolve(false);
        } else {
            resolve(true);
        }
    });
}

module.exports = {
	name: "Marriage",
	author: "Netx",
	version: 1,
	description: "Allows users to marry eachother",
	commands: [{
		name: "marry",
		usage: "<@321746347550310411>",
		description: "Marry another user.. :heart: :heart:",
		execute: async(c, m, a) => {
			if (c.db.dbLoaded && c.db.tables.relationship) {
				try {
                    let userId = a[0].replace("<@","").replace("!","").replace(">","")
                    const fetchedUser = await c.users.fetch(userId)

                    if(fetchedUser){
                        if(fetchedUser.id === m.author.id){
                            return m.reply(new Discord.MessageEmbed()
						        .setTitle("Excuse me!")
						        .setDescription("You can't marry yourself, there's not an option for that on the paperwork!")
                                .setColor("#ff3860"));
                        }

                        checkIfUsersNotAlreadyMarried(c, m,fetchedUser).then(function(result){
                            if(result){
                                if(sentRequests[m.author.id]){
                                    return m.reply(new Discord.MessageEmbed()
                                        .setTitle("Patience is a virtue")
                                        .setDescription(`You need to wait for <@${sentRequests[m.author.id]}> to respond to your previous proposal first!`)
                                        .setColor("#23d160"));
                                }

                                sentRequests[m.author.id] = fetchedUser.id;

                                setTimeout(function(){
                                    // This may cause unexpected behaviour if a user reproposes to the same user
                                    if(sentRequests[m.author.id] === fetchedUser.id){
                                        delete sentRequests[m.author.id];
                                        return m.reply(new Discord.MessageEmbed()
						                    .setTitle("Aww..")
						                    .setDescription(`I guess ${fetchedUser.toString()} doesn't want to marry you, ${m.author.toString()}`)
						                    .setColor("#ff3860"));
                                    }
                                }, 120 * 1000);
                                return m.reply(new Discord.MessageEmbed()
                                        .setTitle("Love is in the air.. :love_letter: ")
                                        .setDescription(`${fetchedUser.toString()}.. ${m.author.toString()} is proposing!! :heart:\n\n Type b!accept ${m.author.toString()} to confirm it or b!deny ${m.author.toString()} to deny them\nYou have two minutes to respond.`)
                                        .setColor("#23d160"));
                            }
                        });
                    } else {
                        return m.reply(new Discord.MessageEmbed()
						    .setTitle("Who?")
						    .setDescription("I don't know "+ a[0] + " that is.")
						    .setColor("#ff3860"));
                    }
                } catch (e){
                    return m.reply(new Discord.MessageEmbed()
						.setTitle("This is embarassing..")
						.setDescription("We experienced an error, please try again later or report this to a Botstion developer.")
                        .setColor("#ff3860"));
                }
            } else {
                m.reply("The database hasn't been loaded.  Please hold on")
            }
        }
    },
    {
        name: "deny",
		usage: "<@321746347550310411>",
		description: "Deny a user's proposal",
		execute: async(c, m, a) => {
            if(a.length === 0){
                return m.reply(new Discord.MessageEmbed()
                    .setTitle("Oopsie!")
                    .setDescription(`You need to specify a user to accept!`)
                    .setColor("#ff3860"));
            }
            const userId = a[0].replace("<@","").replace("!","").replace(">","")

            const proposal = sentRequests[userId];
            if(proposal === null){
                return m.reply(new Discord.MessageEmbed()
					.setTitle("Yikes...")
					.setDescription(`${fetchedUser.toString()} hasn't proposed to anyone!`)
					.setColor("#ff3860"));
            }

            if(proposal !== m.author.id){
                return m.reply(new Discord.MessageEmbed()
					.setTitle("Yikes...")
					.setDescription(`${fetchedUser.toString()} hasn't proposed to you!`)
					.setColor("#ff3860"));
            }

            delete sentRequests[userId];

            return m.reply(new Discord.MessageEmbed()
                .setTitle(":broken_heart: Ouch..")
                .setDescription(`Sorry <@${userId}>, ${m.author.toString()} doesn't like you like that..`)
                .setColor("#23d160"));
        }
    },
    {
        name: "accept",
		usage: "<@321746347550310411>",
		description: "Accept a user's proposal",
		execute: async(c, m, a) => {
			if (c.db.dbLoaded && c.db.tables.relationship) {
			    try {
                    if(a.length === 0){
                        return m.reply(new Discord.MessageEmbed()
						    .setTitle("Oopsie!")
						    .setDescription(`You need to specify a user to accept!`)
						    .setColor("#ff3860"));
                    }
                    let userId = a[0].replace("<@","").replace("!","").replace(">","")
                    const fetchedUser = await c.users.fetch(userId)

                    if(fetchedUser){
                        const proposal = sentRequests[fetchedUser.id];
                        if(proposal === null){
                            return m.reply(new Discord.MessageEmbed()
						        .setTitle("Yikes...")
						        .setDescription(`${fetchedUser.toString()} hasn't proposed to anyone! You could try proposing to them.. :heart:`)
						        .setColor("#ff3860"));
                        }

                        if(proposal !== m.author.id){
                            return m.reply(new Discord.MessageEmbed()
						        .setTitle("Yikes...")
						        .setDescription(`${fetchedUser.toString()} hasn't proposed to you! You could try proposing to them.. :heart:`)
						        .setColor("#ff3860"));
                        }

                        checkIfUsersNotAlreadyMarried(c, m,fetchedUser).then(async function(result){
                            if(result){
                                await c.db.tables.relationship.create({
                                    userOneId: m.author.id,
                                    userTwoId: fetchedUser.id
                                });

                                delete sentRequests[fetchedUser.id];

                                return m.reply(new Discord.MessageEmbed()
                                    .setTitle(":ring: Congratulations!")
                                    .setDescription(`Congratulate ${m.author.toString()} and ${fetchedUser.toString()} on their new marriage!`)
                                    .setColor("#23d160"));
                            }
                        });
                    } else {
                        return m.reply(new Discord.MessageEmbed()
                            .setTitle("Who?")
                            .setDescription("I don't know "+ a[0] + " that is.")
                            .setColor("#ff3860"));
                    }
                } catch (e){
                    return m.reply(new Discord.MessageEmbed()
                        .setTitle("This is embarassing..")
                        .setDescription("We experienced an error, please try again later or report this to a Botstion developer.")
                        .setColor("#ff3860"));
                }  
            } else {
                 m.reply("The database hasn't been loaded.  Please hold on")
            }  
        },
    },
    {
        name: "partner",
		usage: "<@321746347550310411>",
		description: "See who someone's partner is",
		execute: async(c, m, a) => {
            if (c.db.dbLoaded && c.db.tables.relationship) {
                let userId = m.author.id;
                if(a.length >= 1){
                    userId = a[0].replace("<@","").replace("!","").replace(">","");
                }

                const partner = await c.getpartner(userId);
                if(partner === null){
                    return m.reply(new Discord.MessageEmbed()
                        .setTitle("This is embarassing..")
                        .setDescription("They're not married to anybody!")
                        .setColor("#ff3860"));
                }

                return m.reply(new Discord.MessageEmbed()
                    .setTitle(":ring: Partner")
                    .setDescription(`They're married to <@${partner}>`)
                    .setColor("#23d160"));
            } else {
                m.reply("The database hasn't been loaded.  Please hold on")
           }  
        },
    },
    {
        name: "divorce",
        usage: "",
        description: "Divorce your current partner",
        execute: async(c,m,a) => {
            if (c.db.dbLoaded && c.db.tables.relationship) {
                const partner = await c.getpartner(m.author.id);
                if(partner === null){
                    return m.reply(new Discord.MessageEmbed()
                        .setTitle("This is embarassing..")
                        .setDescription("You can't divorce thin air!")
                        .setColor("#ff3860"));
                }

                const result = await c.divorce(m.author.id);
                if(result){
                    return m.reply(new Discord.MessageEmbed()
                    .setTitle(":broken_heart:  Oh..")
                    .setDescription(`${m.author.toString()} has divorced their partner, <@${partner}>`)
                    .setColor("#23d160"));
                } else {
                    return m.reply(new Discord.MessageEmbed()
                        .setTitle("This is embarassing..")
                        .setDescription("You can't divorce thin air!")
                        .setColor("#ff3860"));
                }
            }
        }
    }],
	events: [],
	timer: [],
};
