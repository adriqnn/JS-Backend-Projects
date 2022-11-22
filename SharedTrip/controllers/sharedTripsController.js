const { getAll } = require('../services/tripService');
const sharedTripController = require('express').Router();

sharedTripController.get('/', async (req, res) => {
    const trips = await getAll();
    res.render('shared-trips', {
        title: 'Shared Trips',
        user: req.user, 
        trips
    });
});

module.exports = sharedTripController;