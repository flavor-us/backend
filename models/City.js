module.exports = function (sequelize, DataTypes) {
    const City = sequelize.define(
        "City",
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
            tableName: "City",
            timestamps: false,
        }
    );
    return City;
};