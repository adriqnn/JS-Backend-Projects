const { getAll } = require('../services/housingService');
const rentController = require('express').Router();

rentController.get('/', async (req, res) => {
    const housings = await getAll();
    res.render('apt', {
        title: 'Rent Page',
        user: req.user,
        housings
    });
});

module.exports = rentController;