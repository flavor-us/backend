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
				type: DataTypes.TEXT,
				allowNull: true,
				comment: "컨텐츠에 올라간 사진의 파일 명입니다."
			},
			restname: {
				type: DataTypes.TEXT,
				allowNull: true,
				comment: "컨텐츠의 식당 명 입니다."
			},
			rekognition: {
				type: DataTypes.JSON,
				allowNull: true,
				comment: "AWS rekognition의 json 결과 값입니다."
			},
			tagList: {
				type: DataTypes.JSON,
				allowNull: true,
				comment: "필수로 1~3개를 선택해야하는 태그의 json 리스트입니다."
			}
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
			comment: "Location 테이블 식당 id의 외래키입니다."
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
