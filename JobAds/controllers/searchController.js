const { searchByEmail } = require('../services/modelService');
const searchController = require('express').Router();

searchController.get('/', async (req, res) => {
    let offers = [];
    const catalog = {};

    if(req.query.search){
        const query = req.query.search.toLowerCase();
        offers = await searchByEmail(query);
    };
    if(offers.length > 0){
        catalog.offers = offers;
    };
    catalog.s = req.query.search;
    res.render('search', {
        title: 'Search Page',
        user: req.user,
        catalog
    });
});

module.exports = searchController;