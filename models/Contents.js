const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Contents', {
    userid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    date:{
      type: DataTypes.DATE(),
      allowNull: true
    },
    filename: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lat: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    lng: {
      type: DataTypes.DOUBLE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Contents',
    timestamps: false
  });
};