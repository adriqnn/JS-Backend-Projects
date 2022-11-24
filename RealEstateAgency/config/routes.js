const authController = require("../controllers/authController");
const defaultController = require("../controllers/defaultController");
const homeController = require("../controllers/homeController");
const housingController = require("../controllers/housingController");
const rentController = require("../controllers/rentController");
const searchController = require("../controllers/searchController");

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/housing', housingController);
    app.use('/renting', rentController);
    app.use('/search', searchController);
    app.all('*', defaultController);
};