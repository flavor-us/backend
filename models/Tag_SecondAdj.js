module.exports = function (sequelize, DataTypes) {
    const Tag_SecondAdj = sequelize.define(
        "Tag_SecondAdj",
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
            tableName: "Tag_SecondAdj",
            timestamps: true,
        }
    );

    Tag_SecondAdj.associate = (models) => {
        Tag_SecondAdj.hasMany(models.Contents, {
            foreignKey: "adj2_id",
            sourceKey: "id"
        });
    }
    return Tag_SecondAdj;
};