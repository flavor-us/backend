const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models/index');
const nunjucks = require('nunjucks');
// const { get } = require('./controllers');
// const sqEI = require('sequelize-import-export');

class App {
    constructor () {
        this.app = express();

        const server = this.app.listen( 3000, function(){
            console.log('Express listening on port : 3000');
        })

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        
        var testConnect = async function(){
            try {
                await db.sequelize.authenticate();
                console.log('Connection has been established successfully.');
            } catch (error) {
                console.error('Unable to connect to the database:', error);
            }
        }

        // var setViewEngine = function() {
        var getViewEngine = function (app) {
            nunjucks.configure('template', {
                autoescape: true,
                express: app
            });
        }

        // var sync = async function() {
        //     await db.sequelize.sync({ force: true });
        // };

        // sync();
        getViewEngine(this.app);
        // var getRouting = function() {
        this.app.use(require('./controllers'))
        // }

        testConnect();
        // getRouting();
        // setViewEngine();
    }
}

module.exports = new App().app;