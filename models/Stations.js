module.exports = function (sequelize, DataTypes) {
    const Stations = sequelize.define(
        "Stations",
        {
            name: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
            },
            lat: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            lng: {
                type: DataTypes.DOUBLE,
                allowNull: false
            }
        },
        {
            sequelize,
            tableName: "Stations",
            timestamps: false,
        }
    );
    return Stations;
};