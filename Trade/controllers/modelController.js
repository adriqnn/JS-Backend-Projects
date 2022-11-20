const { hasUser } = require('../middlewares/guards');
const { create, getById, update, deleteById, action } = require("../services/modelService");
const { parseError } = require('../util/parser');
const modelController = require('express').Router();

modelController.get('/create', hasUser(), (req, res) => {
    res.render('create', {
        title: 'Create Model'
    });
});

modelController.post('/create', hasUser(), async (req, res) => {
    const model = {
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        cryptoDescription: req.body.cryptoDescription,
        paymentMethod: req.body.paymentMethod,
        owner: req.user._id
    };
    try{
        if(Object.values(model).some(v => !v)){
            throw new Error('All fields are required!')
        };
        const result = await create(model);
        res.redirect('/catalog');
    }catch(err){
        const check = {};
        if(model.paymentMethod){
            if(model.paymentMethod == 'crypto-wallet'){
                check.isWaller = true;
            }else if(model.paymentMethod == 'credit-card'){
                check.isCredit= true;
            }else if(model.paymentMethod == 'debit-card'){
                check.isDebit = true;       
            }else if(model.paymentMethod == 'paypal'){
                check.isPaypal = true;               
            };
        };
        console.log(check)
        res.render('create', {
            title: 'Create Model',
            body: model,
            errors: parseError(err),
            check
        });
    };
});

modelController.get('/:id/details', async (req, res) => {
    const model = await getById(req.params.id);
    if(req.user){
        if(model.owner == req.user._id){
            model.isOwner = true;
        }else if(model.list.map(e => e.toString()).includes(req.user._id.toString())){
            model.action = true;
        };
    };
    res.render('details', {
        title: 'Model Details',
        model
    });
});

modelController.get('/:id/edit', hasUser(), async (req, res) => {
    const model = await getById(req.params.id);
    if(model.owner != req.user._id){
        return res.redirect('/');
    };
    const check = {};
        if(model.paymentMethod){
            if(model.paymentMethod == 'crypto-wallet'){
                check.isWaller = true;
            }else if(model.paymentMethod == 'credit-card'){
                check.isCredit= true;
            }else if(model.paymentMethod == 'debit-card'){
                check.isDebit = true;       
            }else if(model.paymentMethod == 'paypal'){
                check.isPaypal = true;               
            };
        };
    res.render('edit', {
        title: 'Edit Model',
        model,
        check
    });
});

modelController.post('/:id/edit', hasUser(), async (req, res) => {
    const model = await getById(req.params.id);
    if(model.owner != req.user._id){
        return res.redirect('/')
    };
    const edited = {
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        cryptoDescription: req.body.cryptoDescription,
        paymentMethod: req.body.paymentMethod
    };
    try{
        if(Object.values(edited).some(v => !v)){
            throw new Error('All fields are required!')
        };
        const result = await update(req.params.id, edited);
        res.redirect(`/model/${req.params.id}/details`);
    }catch(err){
        const check = {};
        if(model.paymentMethod){
            if(model.paymentMethod == 'crypto-wallet'){
                check.isWaller = true;
            }else if(model.paymentMethod == 'credit-card'){
                check.isCredit= true;
            }else if(model.paymentMethod == 'debit-card'){
                check.isDebit = true;       
            }else if(model.paymentMethod == 'paypal'){
                check.isPaypal = true;               
            };
        };
        res.render('edit', {
            title: 'Edit Model',
            model: Object.assign(edited, {_id: req.params.id}),
            errors: parseError(err),
            check
        });
    };
});

modelController.get('/:id/delete', hasUser(), async (req, res) => {
    const model = await getById(req.params.id);
    if(model.owner != req.user._id){
        return res.redirect('/')
    };
    await deleteById(req.params.id);
    res.redirect('/catalog');
});

modelController.get('/:id/action', hasUser(), async (req, res) => {
    const model = await getById(req.params.id);
    try{
        if(model.owner == req.user._id){
            model.isOwner = true;
            throw new Error('Cannot buy your own listing!');
        };
        if(model.list.map(e => e.toString()).includes(req.user._id.toString())){
            model.action = true;
            throw new Error('Cannot buy twice');
        };
        await action(req.params.id, req.user._id);
        res.redirect(`/model/${req.params.id}/details`);
    }catch(err){
        if(model.owner == req.user._id){
            model.isOwner = true;
        };
        if(model.list.map(e => e.toString()).includes(req.user._id.toString())){
            model.action = true;
        };
        res.render('details', {
            title: 'Model Details',
            model,
            errors: parseError(err)
        });
    };
});

module.exports = modelController;