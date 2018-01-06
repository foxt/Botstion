const Mongoose = require("mongoose");

module.exports = Mongoose.Schema({
    _id: { type: String, required: true},
    Config: require("./serverConfigSchema"),
    members: [require("./serverMemberSchema")],
});