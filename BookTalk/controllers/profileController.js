const { getWishListOfUser } = require('../services/bookService');
const profileController = require('express').Router();

profileController.get('/', async (req, res) => {
    const books = await getWishListOfUser(req.user._id);
    res.render('profile', {
        title: 'Profile Page',
        user: req.user,
        books
    });
});

module.exports = profileController;