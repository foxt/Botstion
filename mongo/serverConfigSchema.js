const mongoose = require("mongoose");

module.exports = {
    rankOverride: [new mongoose.Schema({
        _id: { type: String, required: true },
        level: { type: Number, default: 1 }
    })],
    adminRoleId: { type: String, required: true},
    moderratorRoleId: { type: String, required: true},
    logsetup: { type: String, required: true},
}