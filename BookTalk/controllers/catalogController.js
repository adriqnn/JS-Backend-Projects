const { getAll } = require('../services/bookService');
const catalogController = require('express').Router();

catalogController.get('/', async (req, res) => {
    const books = await getAll();
    res.render('catalog', {
        title: 'Catalog Page',
        user: req.user,
        books
    });
});

module.exports = catalogController;