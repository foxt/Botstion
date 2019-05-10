const Sequelize = require('sequelize');
module.exports = function(sequelize) {
	return sequelize.define("relationship", {
		userOneId: {
            type: Sequelize.STRING,
            allowNull: false
		},
		userTwoId: {
			type: Sequelize.STRING,
            allowNull: false
		}
	})
}