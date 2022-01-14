module.exports = function (sequelize, DataTypes) {
    const Appointments = sequelize.define(
        "Appointments",
        {
            restname: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            request_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            requested_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        {
            sequelize,
            tableName: "Appointments",
            timestamps: true,
        }
    );
    Appointments.associate = (models) => {
        Appointments.belongsTo(models.User, {
            foreignKey: "request_id",
            targetKey: "id",
            allowNull: false
        })

        Appointments.associate = (models) => {
            Appointments.belongsTo(models.User, {
                foreignKey: "requested_id",
                targetKey: "id",
                allowNull: false
            })
        }
    }

    return Appointments;
};