const { getAll } = require('../services/publicationService');
const galleryController = require('express').Router();

galleryController.get('/', async (req, res) => {
    const publications = await getAll();
    res.render('gallery', {
        title: 'Gallery Page',
        user: req.user,
        publications
    });
});

module.exports = galleryController;