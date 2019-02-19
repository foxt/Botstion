const Sequelize = require('sequelize');
module.exports = function(sequelize) {
	return sequelize.define("test", {
		userId: Sequelize.STRING,
		description: Sequelize.TEXT
	})
}