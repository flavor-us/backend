const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		"Location",
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			type: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			lat: {
				type: DataTypes.DOUBLE,
				allowNull: true,
			},
			lng: {
				type: DataTypes.DOUBLE,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: "Location",
			timestamps: false,
		}
	);
};
