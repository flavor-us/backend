module.exports = function (sequelize, DataTypes) {
    const Tag_FirstAdj = sequelize.define(
        "Tag_FirstAdj",
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
            tableName: "Tag_FirstAdj",
            timestamps: false,
        }
    );

    Tag_FirstAdj.associate = (models) => {
        Tag_FirstAdj.hasMany(models.Contents, {
            foreignKey: "adj1_id",
            sourceKey: "id"
        });
    }

    return Tag_FirstAdj;
};