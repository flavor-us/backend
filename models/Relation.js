module.exports = function (sequelize, DataTypes) {
    const Relation = sequelize.define(
        "Relation",
        {
            followed_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            follower_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        {
            sequelize,
            tableName: "Relation",
            timestamps: false,
        }
    );
    return Relation;
};