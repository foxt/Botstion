const Sequelize = require("sequelize");
module.exports = (sequelize) => sequelize.define("serverConfig", {
    serverId: {
        type: Sequelize.STRING,
        unique: true
    },
    prefix: {
        type: Sequelize.STRING,
        defaultValue: "b!"
    },
    staffRole: {
        type: Sequelize.STRING,
        defaultValue: "",
        allowNull: true
    },
    logChannel: {
        type: Sequelize.STRING,
        defaultValue: "",
        allowNull: true
    },
    joinLeaveChannel: {
        type: Sequelize.STRING,
        defaultValue: "",
        allowNull: true
    }
});