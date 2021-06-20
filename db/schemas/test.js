const Sequelize = require("sequelize");
module.exports = (sequelize) => sequelize.define("test", {
    userId: Sequelize.STRING,
    description: Sequelize.TEXT
});