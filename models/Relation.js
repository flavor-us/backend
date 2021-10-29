module.exports = function (sequelize, DataTypes) {
    const Relation = sequelize.define(
        "Relation",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            send_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            receive_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: "Relation",
            timestamps: false,
        }
    );

    return Relation;
};