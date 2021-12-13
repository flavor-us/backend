module.exports = function (sequelize, DataTypes) {
    const Appointment = sequelize.define(
        "Appointment",
        {
            request_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            requested_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            restname: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize,
            tableName: "Appointment",
            timestamps: false,
        }
    );
    return Appointment;
};