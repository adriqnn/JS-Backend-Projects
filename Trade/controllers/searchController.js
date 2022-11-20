const { hasUser } = require('../middlewares/guards');
const { getModelWithSearch, getAll } = require('../services/modelService');
const searchController = require('express').Router();

searchController.get('/', hasUser(), async (req, res) => {
    const result = await getAll();
    res.render('search', {
        title: 'Seach Page',
        result
    });
});

searchController.post('/', hasUser(), async (req, res) => {
    if(!req.body.search){
        res.redirect('/search');
    };
    let result = [];
    const paymentMethod = req.body.paymentMethod;
    if(req.body.search && req.body.paymentMethod){
        const query = req.body.search;
        const method = req.body.paymentMethod;
        result = await getModelWithSearch(query, method);
    };
    const check = {};
    if(req.body.paymentMethod){
        if(paymentMethod == 'crypto-wallet'){
            check.isWaller = true;
        }else if(paymentMethod == 'credit-card'){
            check.isCredit= true;
        }else if(paymentMethod == 'debit-card'){
            check.isDebit = true;       
        }else if(paymentMethod == 'paypal'){
            check.isPaypal = true;               
        };
    };
    res.render('search', {
        title: 'Search Page',
        search: req.body.search,
        user: req.user,
        result,
        check
    });
});

module.exports = searchController;