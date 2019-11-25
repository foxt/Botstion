const Sequelize = require('sequelize');
module.exports = function(sequelize) {
	return sequelize.define("modEvent", {
        eventId: {
			type: Sequelize.STRING,
			unique: true,
		},
        type: { // 0: Strike
                // 1: Kick
                // 2: Ban
                // 3: Pardon
                // 4: Mute
                // 5: Unmute
                // 6: Merit
			type: Sequelize.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		userId: {
            type: Sequelize.STRING,
            defaultValue: "158311402677731328",
			allowNull: false,
		},
		staffId: {
            type: Sequelize.STRING,
            defaultValue: "380096335858237441",
			allowNull: false,
        },
        reason: {
            type: Sequelize.STRING,
        },
        edited: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        editor: {
            type: Sequelize.STRING,
            defaultValue: "",
		},
	})
}