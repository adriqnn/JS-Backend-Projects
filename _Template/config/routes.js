const authController = require("../controllers/authController");
const catalogController = require("../controllers/catalogController");
const defaultController = require("../controllers/defaultController");
const homeController = require("../controllers/homeController");
const modelController = require("../controllers/modelController");
const profileController = require("../controllers/profileController");
const searchController = require("../controllers/searchController");

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/model', modelController);

    //TODO fix if needed to the right address
    app.use('/catalog', catalogController);
    //TODO add profile/searchController for bonus task
    app.use('/search', searchController);
    //TODO add profile/searchController for bonus task
    app.use('/profile', profileController);
    //TODO leave/remove defaultController from here and controllers depending on the application
    app.all('*', defaultController);
};