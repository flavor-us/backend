module.exports = function (sequelize, DataTypes) {
    const Tag = sequelize.define(
        "Tag",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            tagname: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "Tag",
            timestamps: false,
        }
    );

    Tag.associate = (models) => {
        Tag.belongsToMany(models.Contents, {
            through: {
                model: "TagContents",
                unique: true,
            },
            foreignKey: "tag",
            sourceKey: "tagname",
        })
    }
    return Tag;
};