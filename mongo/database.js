


const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const serverSchema = require("./ServerSchema");

const addToGlobal = (name, val) => {
	global[name] = val;
};
exports.initialize = url => new Promise((resolve, reject) => {
	mongoose.connect(url, {
		useMongoClient: true,
		promiseLibrary: global.Promise,
	});
	const [Servers,] = [
		mongoose.model("servers", serverSchema),
		
	];
	mongoose.connection
		.on("error", err => reject(err))
		.once("open", () => {
			addToGlobal("Servers", Servers);
			addToGlobal("Database", {
				Servers, servers: Servers,
				Raw: mongoose.connection,
			});
			resolve(global.Database);
		});
});

exports.get = exports.getConnection = () => global.Database;
