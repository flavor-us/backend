module.exports = function (sequelize, DataTypes) {
	const Contents = sequelize.define(
		"Contents",
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			date: {
				type: DataTypes.DATE(),
				allowNull: true,
			},
			filename: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			restname: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			rekognition: {
				type: DataTypes.JSON,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: "Contents",
			timestamps: false,
		});
	Contents.associate = (models) => {
		Contents.belongsTo(models.Location, {
			foreignKey: "restid",
			targetKey: "id",
			unique: false,
		})

		Contents.belongsToMany(models.Tag, {
			through: {
				model: "TagContents",
				unique: false,
			},
			foreignKey: {
				name: "content",
				type: DataTypes.INTEGER,
			},
			primaryKey: false,
			sourceKey: "id",
		})

		Contents.belongsTo(models.User, {
			foreignKey: "userid",
			targetKey: "uid"
		})
	}

	return Contents;
};
