module.exports = function (sequelize, DataTypes) {
    const Comments = sequelize.define(
        "Comments",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            content: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "Comments",
            timestamps: true,
        },
    );
    Comments.associate = (models) => {
        Comments.belongsTo(models.User, {
            foreignKey: "user_id",
            targetKey: "id",
            unique: false,
        })
        Comments.belongsTo(models.Contents, {
            foreignKey: "content_id",
            targetKey: "id",
            unique: false,
        })
    }
    return Comments;
};