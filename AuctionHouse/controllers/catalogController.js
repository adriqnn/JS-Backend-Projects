const { getAll, getAllNonCloser } = require('../services/modelService');
const catalogController = require('express').Router();

catalogController.get('/', async (req, res) => {
    const catalog = await getAllNonCloser();
    res.render('browse', {
        title: 'Catalog Page',
        user: req.user,
        catalog
    });
});

module.exports = catalogController;