const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models/index');
const nunjucks = require('nunjucks');
// const Sequelize = require('sequelize');
// const SequelizeAuto = require('sequelize-auto');
// const auto = new SequelizeAuto('Rest_info','root','chan159263',{
//   host:'localhost',
//   port:'3306'
// });

class App {
    constructor () {
        this.app = express();

        const server = this.app.listen( 3000, function(){
            console.log('Express listening on port : 3000');
        })

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        
        // var runSequelizeAuto = auto.run((err)=>{
        //     if(err) throw err;
        // })

        var dbConnection = function(){
            // DB authentication
            db.sequelize.authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
                return db.sequelize.sync();
            })
            .then(() => {
                console.log('DB Sync complete.');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });
        }

        // var setViewEngine = function() {
        var getViewEngine = function (app) {
            nunjucks.configure('template', {
                autoescape: true,
                express: app
            });
        }
        dbConnection();
        // runSequelizeAuto();
        getViewEngine(this.app);
        this.app.use(require('./controllers'))
        // testConnect();
        // getRouting();
        // setViewEngine();
    }
}

module.exports = new App().app;