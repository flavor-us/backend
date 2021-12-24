module.exports = function (sequelize, DataTypes) {
	const Contents = sequelize.define(
		"Contents",
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "컨텐츠마다 고유하게 갖는 아이디입니다."
			},
			date: {
				type: DataTypes.DATE(),
				allowNull: true,
				comment: "컨텐츠의 업로드 날짜입니다."
			},
			filename: {
				type: DataTypes.STRING,
				allowNull: true,
				comment: "컨텐츠에 올라간 사진의 파일 명입니다."
			},
			filepath: {
				type: DataTypes.STRING,
				allowNull: true,
				comment: "컨텐츠에 올라간 사진의 파일 경로입니다."
			},
			restname: {
				type: DataTypes.STRING,
				allowNull: true,
				comment: "컨텐츠의 식당 명 입니다."
			},
			rekognition: {
				type: DataTypes.JSON,
				allowNull: true,
				comment: "AWS rekognition의 json 결과 값입니다."
			},
			lat: {
				type: DataTypes.DECIMAL(20, 17),
				allowNull: false,
			},
			lng: {
				type: DataTypes.DECIMAL(20, 17),
				allowNull: false,
			},
			station_distance: {
				type: DataTypes.STRING,
				allowNull: true
			}
		},
		{
			sequelize,
			tableName: "Contents",
			timestamps: false,
		});
	Contents.associate = (models) => {
		Contents.belongsTo(models.Restaurants, {
			foreignKey: "rest_id",
			targetKey: "id",
			unique: false,
			comment: "Restaurants 테이블 식당 id의 외래키입니다."
		})

		Contents.belongsTo(models.Stations, {
			foreignKey: "near_station",
			targetKey: "name",
			unique: false,
			comment: "Station 테이블 역 이름 외래키입니다."
		})

		// Contents.belongsToMany(models.Tag, {
		// 	as: "Tag",
		// 	through: "TagContents",
		// 	foreignKey: "content_id",
		// 	comment: "TagContents 테이블에서 컨텐츠를 매핑하는 외래키입니다."
		// })

		Contents.belongsTo(models.User, {
			foreignKey: "user_id",
			targetKey: "id"
		})
	}
	return Contents;
};
