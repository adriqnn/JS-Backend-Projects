const { getHousingWithSearch } = require('../services/housingService');
const searchController = require('express').Router();

searchController.get('/', async (req, res) => {
    let housings = [];
    if(req.query.search){
        const query = req.query.search;
        housings = await getHousingWithSearch(query);
        console.log(housings);
    };
    res.render('search', {
        title: 'Search Housing',
        user: req.user,
        housings
    });
});

module.exports = searchController;