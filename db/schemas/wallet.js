const Sequelize = require('sequelize');
module.exports = function(sequelize) {
	return sequelize.define("wallet", {
		userId: {
			type: Sequelize.STRING,
			unique: true,
		},
		coins: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
			allowNull: false,
		}
	})
}