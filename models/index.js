const Sequelize = require("sequelize");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const sequelizeData = new Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
	host: process.env.DB_HOST,
	dialect: "mysql",
	timezone: "+09:00", //한국 시간 셋팅
	operatorsAliases: Sequelize.Op,
	pool: {
		max: 5,
		min: 0,
		idle: 10000,
	},
});

let db = [];

fs.readdirSync(__dirname)
	.filter((file) => {
		return file.indexOf(".js") && file !== "index.js";
	})
	.forEach((file) => {
		const model = require(path.join(__dirname, file))(sequelizeData, Sequelize.DataTypes);
		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if ("associate" in db[modelName]) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelizeData;

module.exports = db;
