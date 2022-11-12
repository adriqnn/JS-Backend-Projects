const { getAll } = require('../services/modelService');
const homeController = require('express').Router();

homeController.get('/', async (req, res) => {
    const catalog = (await getAll()).slice(-3);
    res.render('home', {
        title: 'Home Page',
        user: req.user,
        catalog
    });
});

module.exports = homeController;