const catalogController = require('express').Router();

catalogController.get('/', async (req, res) => {
    res.render('catalog', {
        title: 'Catalog Page',
        user: req.user
    });
});

module.exports = catalogController;