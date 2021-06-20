const Sequelize = require("sequelize");
module.exports = (sequelize) => sequelize.define("wallet", {
    userId: {
        type: Sequelize.STRING,
        unique: true
    },
    coins: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
});