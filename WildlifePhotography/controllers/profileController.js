const { getOwnPosts } = require('../services/modelService');

const profileController = require('express').Router();

profileController.get('/', async (req, res) => {
    const catalog = await getOwnPosts(req.user._id)
    res.render('profile', {
        title: 'Profile Page',
        user: req.user,
        catalog
    });
});

module.exports = profileController;