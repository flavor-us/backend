"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
		return queryInterface.addColumn("Contents", "rekognition", {
			type: Sequelize.DataTypes.JSON,
		});
	},

	down: async (queryInterface, _) => {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
		return queryInterface.removeColumn("Contents", "rekognition");
	},
};
