var DataTypes = require("sequelize").DataTypes;
var _Location = require("./Location");

function initModels(sequelize) {
  var Location = _Location(sequelize, DataTypes);


  return {
    Location,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
