module.exports = (sequelize, DataTypes) => {
    const InfoPk = sequelize.define('InfoPk',
        {
            id: { type: DataTypes.INTEGER, primaryKey: true},
            name : { type: DataTypes.TEXT, allowNull : false },
            type : { type: DataTypes.TEXT, allowNull : false },
            lat : { type: DataTypes.DOUBLE, allowNull : false },
            lng : { type: DataTypes.DOUBLE, allowNull : false }            
        },
        {
            tableName: 'InfoPk',
        }
    );
    return InfoPk;
}
