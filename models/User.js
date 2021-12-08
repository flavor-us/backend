module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define(
        "User",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            uuid: {
                type: DataTypes.TEXT,
                allowNull: false,
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
            kakaotoken: {
                type: DataTypes.TEXT
            },
            profileimg_path: {
                type: DataTypes.TEXT
            }
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
            sourceKey: "id",
        })

        User.belongsToMany(User, {
            as: "Follower",
            through: "Relation",
            foreignKey: "follower_id"
        });

        User.belongsToMany(User, {
            as: "Followed",
            through: "Relation",
            foreignKey: "followed_id"
        })

        User.belongsToMany(User, {
            as: "Request",
            through: "Appointment",
            foreignKey: "request_id"
        });

        User.belongsToMany(User, {
            as: "Requested",
            through: "Appointment",
            foreignKey: "requested_id"
        })
    };
    return User;
};