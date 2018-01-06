const mongoose = require("mongoose");

module.exports = {
    _id: { type: String, required: true },
    merits: [new mongoose.Schema({
        _id: { type: String, required: true },
        staffmember: { type: String, required: true},
        reason: { type: String, default: "None provided." }
    })],
    strikes: [new mongoose.Schema({
        _id: { type: String, required: true },
        staffmember: { type: String, required: true},
        reason: { type: String, default: "None provided." }
    })]
}