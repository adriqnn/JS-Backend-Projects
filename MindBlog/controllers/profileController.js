const { getOwnPosts, getFollowedPosts } = require('../services/modelService');
const profileController = require('express').Router();

profileController.get('/', async (req, res) => {
    const created = await getOwnPosts(req.user._id);
    const followed = await getFollowedPosts(req.user._id);
    res.render('profile', {
        title: 'Profile Page',
        user: req.user,
        created,
        followed
    });
});

module.exports = profileController;