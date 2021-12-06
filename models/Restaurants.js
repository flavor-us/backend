module.exports = function (sequelize, DataTypes) {
	const Restaurants = sequelize.define(
		"Restaurants",
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
			tableName: "Restaurants",
			timestamps: false,
		}
	);

	Restaurants.associate = (models) => {
		Restaurants.hasMany(models.Contents, {
			foreignKey: "rest_id",
			sourceKey: "id",
			unique: false,
		})
	}

	return Restaurants;
};
