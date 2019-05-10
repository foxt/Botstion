// Rename me to config.js and fill it in.

module.exports = {
	token: "",
	defaultPrefix: "b!",
	maintainers: ["158311402677731328","432492383851249686"],
	geniusAccessToken: "",
	dblToken:"",
	trackerNetworkApiKey: "",
	ipinfoioToken: "",
	googleApi: "",
	imgurClientID: "",
	darkskyApiKey: "",
	sequelize: [ // these are the arguments passed to the Sequelize init, see http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html
		"botstion","username","password", {
			host: "localhost",
			dialect: "sqlite",
			logging: false,
			operatorsAliases: false,
			storage: "database.sqlite"
		}
    ],
    httpPort: 6597
}