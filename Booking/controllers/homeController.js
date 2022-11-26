const { getAll } = require('../services/hotelService');
const homeController = require('express').Router();

homeController.get('/', async (req, res) => {
    console.log(req.user);

    const hotels = await getAll();
    res.render('home', {
        title: 'Home Page',
        //user: req.user,
        hotels
    });
});

module.exports = homeController;