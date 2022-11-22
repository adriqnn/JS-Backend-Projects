const { getUserTrips } = require('../services/tripService');
const profileController = require('express').Router();

profileController.get('/', async (req, res) => {
    const trips = await getUserTrips(req.user._id);
    console.log(trips);
    res.render('profile', {
        title: 'Profile',
        user: req.user,
        trips
    })
});

module.exports = profileController;
