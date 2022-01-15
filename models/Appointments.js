module.exports = function (sequelize, DataTypes) {
    const Appointments = sequelize.define(
        "Appointments",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            restname: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            request_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: false,
                unique: false
            },
            requested_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: false,
                unique: false
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
            allowNull: false,
            unique: false
        })

        Appointments.associate = (models) => {
            Appointments.belongsTo(models.User, {
                foreignKey: "requested_id",
                targetKey: "id",
                allowNull: false,
                unique: false
            })
        }
    }

    return Appointments;
};