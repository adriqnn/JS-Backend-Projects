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
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        isPublic: req.body.isPublic == 'on' ? true : false,
        createdAt: Date.now(),
        owner: req.user._id
    };
    try{
        if(req.body.title == '' || req.body.description == '' || req.body.imageUrl == ''){
            throw new Error('All fields are required!')
        };
        const result = await create(model);
        res.redirect('/');
    }catch(err){
        res.render('create', {
            title: 'Create Model',
            body: model,
            errors: parseError(err)
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
        return res.redirect('/')
    };
    res.render('edit', {
        title: 'Edit Model',
        model
    });
});

modelController.post('/:id/edit', hasUser(), async (req, res) => {
    const model = await getById(req.params.id);
    if(model.owner != req.user._id){
        return res.redirect('/')
    };
    const edited = {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        isPublic: req.body.isPublic == 'on' ? true : false
    };
    try{
        if(req.body.title == '' || req.body.description == '' || req.body.imageUrl == ''){
            throw new Error('All fields are required!')
        };
        const result = await update(req.params.id, edited);
        res.redirect(`/model/${req.params.id}/details`);
    }catch(err){
        res.render('edit', {
            title: 'Edit Model',
            model: Object.assign(edited, {_id: req.params.id}),
            errors: parseError(err)
        });
    };
});

modelController.get('/:id/delete', hasUser(), async (req, res) => {
    const model = await getById(req.params.id);
    if(model.owner != req.user._id){
        return res.redirect('/');
    };
    await deleteById(req.params.id);
    res.redirect('/');
});

modelController.get("/:id/action", hasUser(), async (req, res) => {
    const model = await getById(req.params.id);
    try{
        if(model.owner == req.user._id){
            model.isOwner = true;
            throw new Error('Cannot like your own listing!');
        };
        if(model.list.map(e => e.toString()).includes(req.user._id.toString())){
            model.action = true;
            throw new Error('Cannot like twice!');
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