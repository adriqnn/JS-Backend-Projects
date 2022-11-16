const authController = require("../controllers/authController");
const catalogController = require("../controllers/catalogController");
const homeController = require("../controllers/homeController");
const modelController = require("../controllers/modelController");
const searchController = require("../controllers/searchController");
const defaultController = require("../controllers/defaultController");

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/model', modelController);
    app.use('/catalog', catalogController);
    app.use('/search', searchController);
    app.all('*', defaultController);
};