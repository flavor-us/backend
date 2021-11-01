module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define(
        "User",
        {
            uid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            signupdate: {
                type: DataTypes.DATE(),
                allowNull: true,
            },
            email: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            username: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: "User",
            timestamps: false,
        }
    );

    User.associate = (models) => {
        User.hasMany(models.Contents, {
            foreignKey: "user_id",
            sourceKey: "uid",
        })
    }

    return User;
};