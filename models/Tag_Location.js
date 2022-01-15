module.exports = function (sequelize, DataTypes) {
    const Tag_Location = sequelize.define(
        "Tag_Location",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            tagname: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            indexes: [{ unique: true, fields: ['tagname'] }]
        },
        {
            sequelize,
            tableName: "Tag_Location",
            timestamps: false,
        }
    );

    Tag_Location.associate = (models) => {
        Tag_Location.hasMany(models.Contents, {
            foreignKey: "locationtag_id",
            sourceKey: "id"
        });
    }
    return Tag_Location;
};