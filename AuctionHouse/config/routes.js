const authController = require("../controllers/authController");
const catalogController = require("../controllers/catalogController");
const defaultController = require("../controllers/defaultController");
const homeController = require("../controllers/homeController");
const modelController = require("../controllers/modelController");

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/model', modelController);
    app.use('/catalog', catalogController);
    app.all('*', defaultController);
};