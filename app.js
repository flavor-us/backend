const express = require("express");
const bodyParser = require("body-parser");
const db = require("./models/index");
const nunjucks = require("nunjucks");
const logger = require("./config/logger");

class App {
	constructor() {
		this.app = express();

		this.app.listen(3000, function () {
			logger.info("Express listening on port : 3000");
		});
		// this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));

		var dbConnection = function () {
			// DB authentication
			db.sequelize
				.authenticate()
				.then(() => {
					logger.info("Connection has been established successfully.");
					// return db.sequelize.sync({ alter: true });
				})
				.then(() => {
					logger.info("DB Sync complete.");
				})
				.catch((err) => {
					logger.error("Unable to connect to the database:", err);
				});
		};

		var getViewEngine = function (app) {
			nunjucks.configure("template", {
				autoescape: true,
				express: app,
			});
		};
		dbConnection();
		getViewEngine(this.app);
		this.app.use(require("./controllers"));
	}
}

module.exports = new App().app;
