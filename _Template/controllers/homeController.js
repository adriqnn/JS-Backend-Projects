const homeController = require('express').Router();

//TODO add additional functionality
homeController.get('/', async (req, res) => {
    res.render('home', {
        title: 'Home Page',
        user: req.user
    });
});

module.exports = homeController;