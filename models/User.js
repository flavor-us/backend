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
            kakao_id: {
                type: DataTypes.STRING,
            },
            uuid: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            signupdate: {
                type: DataTypes.DATE(),
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            kakaotoken: {
                type: DataTypes.STRING
            },
            profileimg_path: {
                type: DataTypes.STRING
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

        User.hasMany(models.Comments, {
            foreignKey: "user_id",
            sourceKey: "id",
        })

        // User.belongsToMany(User, {
        //     as: "Request",
        //     through: "Appointments",
        //     foreignKey: "request_id",
        //     unique: false
        // });

        // User.belongsToMany(User, {
        //     as: "Requested",
        //     through: "Appointments",
        //     foreignKey: "requested_id",
        //     unique: false
        // })
        User.hasOne(models.Token, { foreignKey: "user_id", sourceKey: "id", unique: true });
    };
    return User;
};