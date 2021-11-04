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
			foreignKey: "rest_id",
			targetKey: "id",
			unique: false,
		})

		Contents.belongsToMany(models.Tag, {
			as: "Tag",
			through: "TagContents",
			foreignKey: "content_id"
		})

		Contents.belongsTo(models.User, {
			foreignKey: "user_id",
			targetKey: "uid"
		})
	}
	return Contents;
};
