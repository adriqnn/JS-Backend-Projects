const { getByUserShares, getByUserOwner } = require('../services/publicationService');

const profileController = require('express').Router();

profileController.get('/', async (req, res) => {
    const publicationsByOwner = await getByUserOwner(req.user._id);
    const publicationsByShares = await getByUserShares(req.user._id);

    const publicationsOwnerString = publicationsByOwner.map(e => e.title).join(', ');
    const publicationsSharesString = publicationsByShares.map(e => e.title).join(', ');

    res.render('profile', {
        title: 'Profile Page',
        user: req.user,
        publicationsOwnerString,
        publicationsSharesString
    });
});

module.exports = profileController;