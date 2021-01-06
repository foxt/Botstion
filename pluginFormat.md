```js
module.exports = {
	name: "My Amazing Plugin",
	author: "Me",
	version: 1,
    description: "Does pluginy things",
    disabled: false,
    requiresConfig: "myApiKey",
	commands: [
		{
			name: "hello",
			usage: "word optional name=Bob", // see util/argparser.js
            description: "Greetings!",
            stipulations: {
                nsfw: 1, // whether the command is NSFW or not, defaults to 0
                         // 0 - never returns nsfw
                         // 1 - filtered nsfw command (allowed to run in SFW channels with limited content/capabilities)
                         // 2 - unfiltered, possibily nsfw command (chance of sending nsfw command in non-sfw commands, therefore disabled in sfw channels)
                         // 3 - always returns nsfw
                maintainer: true, // if the user needs to be a maintainer to run this command
                context: 0, // what types of channels the command can run in
                            // 0 - any
                            // 1 - server only
                            // 2 - guild only
            },
            /**
             * @param client {Discord.Client}
             * @param message {Discord.Message}
             * @param arguments {Object}
             */
			execute: async(client, message, arguments) => {
                return message.reply(new Discord.MessageEmbed().setTitle(client.hi(a.name)))
            }
        }
    ],
    timer: [async c => { // runs every so often (15s by default)
        console.log("time passed!")
    }],
    events: [ // client events to hook on to
		{
			name: "ready",
			exec: function(c) {
				console.log("howdy!")
			}
		}
    ],
    addons: { // functions and variables published to the client 
		hi: function(name) {
            return "Howdy, " + name+ "!"
        }
    }
};
```
