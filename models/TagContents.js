module.exports = function (sequelize, DataTypes) {
    const TagContents = sequelize.define(
        "TagContents",
        {
            tag: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            content_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
        },
        {
            sequelize,
            tableName: "TagContents",
            timestamps: false,
        }
    );

    return TagContents;
};