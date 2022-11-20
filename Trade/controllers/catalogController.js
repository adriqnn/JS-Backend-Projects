const { getAll } = require('../services/modelService');
const catalogController = require('express').Router();

catalogController.get('/', async (req, res) => {
    const catalog = await getAll();
    res.render('catalog', {
        title: 'Catalog Page',
        user: req.user,
        catalog
    });
});

module.exports = catalogController;