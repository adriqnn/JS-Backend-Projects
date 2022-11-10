const searchController = require('express').Router();

searchController.get('/', async (req, res) => {
    res.render('search', {
        title: 'Search Page',
        user: req.user
    });
});

module.exports = searchController;