const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		"Location",
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			name: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			type: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			lat: {
				type: DataTypes.DECIMAL(20, 17),
				allowNull: false,
			},
			lng: {
				type: DataTypes.DECIMAL(20, 17),
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: "Location",
			timestamps: false,
		}
	);
};
