const swaggerUi = require('swagger-ui-express');
const swaggereJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        components: {},
        info: {
            title: "FlavorUs Backend API",
            description: "backend api specification for android Native application front level development",
            contact: {
                name: "chanyeopLim",
                email: "chan1202@konkuk.ac.kr"
            },
            servers: ["https://www.flavorus.shop"]
        }
    },
    apis: ['./controllers/app/index.js', 'app.js', './swagger/*']
};
const specs = swaggereJsdoc(options);
module.exports = { swaggerUi, specs };
