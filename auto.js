const SequelizeAuto = require('sequelize-auto');
const auto = new SequelizeAuto("Rest_info", "root", "chan159263", {
    host: "localhost",
    port: "3306",
    dialect: "mysql",
});

auto.run(err => {
    if(err) throw err;
    console.log("complete!");
})