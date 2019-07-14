// Rename me to config.js and fill it in.

module.exports = {
	token: "",
	defaultPrefix: "b!",
	maintainers: ["158311402677731328"],
	errorReportChannel: "600082294258139137",
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
			storage: "database.sqlite"
		}
    ],
    httpPort: 6597
}