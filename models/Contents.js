const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		"Contents",
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			userid: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			date: {
				type: DataTypes.DATE(),
				allowNull: true,
			},
			filename: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			rekognition: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: "Contents",
			timestamps: false,
		}
	);
};
