const { hasUser } = require('../middlewares/guards');
const { getByUserBooking } = require('../services/hotelService');
const profileController = require('express').Router();

profileController.get('/', hasUser(), async (req, res) => {
    const bookings = await getByUserBooking(req.user._id);
    res.render('profile', {
        title: 'Profile Page',
        //user: req.user - will modify session if we put directly into user;
        //user: Object.assign({bookings: bookings.map(b => b.name)} , req.user)
        user: Object.assign({bookings} , req.user)
    });
});

module.exports = profileController;