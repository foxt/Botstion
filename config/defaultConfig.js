// Rename me to config.js and fill it in.
// Not all API keys are required (plugins that require an API key that isn't provided will not load.)

module.exports = {
	token: "discordapp.com/developers/", // discord token
	defaultPrefix: "b!", // bot's prefix
	maintainers: ["158311402677731328"], // allowed access to eval, shutdown etc command
	errorReportChannel: "600082294258139137", // exceptions will be sent to this channel
	geniusAccessToken: "https://genius.com/developers", // b!lyrics
	dblToken:"", // top.gg token, same token is used as the voting authorization
	trackerNetworkApiKey: "https://tracker.gg/developers", // used for fortnite, csgo, division, apex, etc
	ipinfoioToken: "https://ipinfo.io/",
	googleApi: "", // Used for b!ip maps, turn on the maps API
	imgurClientID: "https://api.imgur.com/oauth2/addclient", // required for b!shortcuts
	darkskyApiKey: "https://darksky.net/dev", //required for b!weather
	alphaVantageKey: "https://www.alphavantage.co/support/#api-key", // used for b!currency and b!stocks
	sequelize: [ // these are the arguments passed to the Sequelize init, see http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html
		"botstion","username","password", { // username and password can be left blank if using sqlite
			host: "localhost",
			dialect: "sqlite",
			logging: false,
			storage: "database.sqlite"
		}
    ],
    httpPort: 6597 // port used for the built in http server
}