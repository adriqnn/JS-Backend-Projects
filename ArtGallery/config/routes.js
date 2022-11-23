const authController = require("../controllers/authController");
const defaultController = require("../controllers/defaultController");
const galleryController = require("../controllers/galleryController");
const homeController = require("../controllers/homeController");
const profileController = require("../controllers/profileController");
const publicationController = require("../controllers/publicationController");

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/publication', publicationController);
    app.use('/profile', profileController);
    app.use('/gallery', galleryController);
    app.all('*', defaultController);
};