module.exports = function (sequelize, DataTypes) {
    const Token = sequelize.define(
        "Token",
        {
            refreshtoken: {
                type: DataTypes.STRING,
                unique: true
            }
        },
        {
            sequelize,
            tableName: "Token",
            timestamps: true,
        }
    );
    Token.associate = (models) => {
        Token.belongsTo(models.User, { foreignKey: "user_id", sourceKey: "id", unique: true });
    }
    return Token;
};