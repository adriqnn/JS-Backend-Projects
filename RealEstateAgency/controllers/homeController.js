const { getAll } = require('../services/housingService');
const homeController = require('express').Router();

homeController.get('/', async (req, res) => {
    const housings = await getAll();
    const showHousings = housings.slice(-3);

    res.render('home', {
        title: 'Home Page',
        user: req.user,
        showHousings
    });
});

module.exports = homeController;