const mongoose = require("mongoose");

module.exports = new mongoose.Schema({
	_id: { type: String, required: true },
	config: require("./serverConfigSchema"),
	strikes: [new mongoose.Schema({
		_id: { type: String, required: true },
		offender: { type: String, requried: true },
		creator: { type: String, required: true },
		reason: { type: String, required: true },
	}, { usePushEach: true })],
}, { usePushEach: true });
