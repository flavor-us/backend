const express = require("express");
const bodyParser = require("body-parser");
const db = require("./models/index");
const nunjucks = require("nunjucks");
const { swaggerUi, specs } = require('./modules/swagger');

class App {
	constructor() {
		this.app = express();

		this.app.listen(3000, function () {
			console.log("Express listening on port : 3000");
		});
		this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));

		this.app.get("/test", (req, res) => {
			console.log("test")
			res.send(200).send("Complete");
		})
		var dbConnection = function () {
			// DB authentication
			db.sequelize
				.authenticate()
				.then(() => {
					console.log("Connection has been established successfully.");
					return db.sequelize.sync();
				})
				.then(() => {
					console.log("DB Sync complete.");
				})
				.catch((err) => {
					console.error("Unable to connect to the database:", err);
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
