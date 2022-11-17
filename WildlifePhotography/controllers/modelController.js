const { hasUser } = require('../middlewares/guards');
const { create, getById, update, deleteById, action, getByIdForDetails, upvote, downvote } = require("../services/modelService");
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
        keyword: req.body.keyword,
        location: req.body.location,
        dateOfCreation: req.body.dateOfCreation,
        image: req.body.image,
        description: req.body.description,
        owner: req.user._id
    };
    try{
        if(Object.values(model).some(v => !v)){
            throw new Error('All fields are required!')
        };
        const result = await create(model);
        res.redirect('/catalog');
    }catch(err){
        res.render('create', {
            title: 'Create Model',
            body: model,
            errors: parseError(err)
        });
    };
});

modelController.get('/:id/details', async (req, res) => {
    const model = await getByIdForDetails(req.params.id);
    if(req.user){
        if(model.owner._id == req.user._id){
            model.isOwner = true;
        }else if(model.list.map(e => e._id.toString()).includes(req.user._id.toString())){
            model.action = true;
        };
    };
    
    if(model.raitingOfPost == 0 && model.list.length == 0){
        model.noOne = true;
    };
    if(model.list.length > 0){
        model.users = model.list.map(e => e.email).join(", ");
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
        keyword: req.body.keyword,
        location: req.body.location,
        dateOfCreation: req.body.dateOfCreation,
        image: req.body.image,
        description: req.body.description
    };
    try{
        if(Object.values(edited).some(v => !v)){
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
    res.redirect('/catalog');
});

modelController.get('/:id/upvote', hasUser(), async (req, res) => {
    const model = await getByIdForDetails(req.params.id);
    try{
        if(model.owner._id == req.user._id){
            model.isOwner = true;
            throw new Error('Cannot upvote your own listing!');
        };
        if(model.list.map(e => e._id.toString()).includes(req.user._id.toString())){
            model.action = true;
            throw new Error('Cannot upvote twice!');
        };
        await upvote(req.params.id, req.user._id);
        res.redirect(`/model/${req.params.id}/details`);
    }catch(err){
        if(model.owner._id == req.user._id){
            model.isOwner = true;
        };
        if(model.list.map(e => e._id.toString()).includes(req.user._id.toString())){
            model.action = true;
        };
        if(model.raitingOfPost == 0 && model.list.length == 0){
            model.noOne = true;
        };
        if(model.list.length > 0){
            model.users = model.list.map(e => e.email).join(", ");
        };
        res.render('details', {
            title: 'Model Details',
            model,
            errors: parseError(err)
        });
    };
});

modelController.get('/:id/downvote', hasUser(), async (req, res) => {
    const model = await getById(req.params.id);
    try{
        if(model.owner._id == req.user._id){
            model.isOwner = true;
            throw new Error('Cannot downvote your own listing!');
        };
        if(model.list.map(e => e._id.toString()).includes(req.user._id.toString())){
            model.action = true;
            throw new Error('Cannot downvote twice!');
        };
        await downvote(req.params.id, req.user._id);
        res.redirect(`/model/${req.params.id}/details`);
    }catch(err){
        if(model.owner._id == req.user._id){
            model.isOwner = true;
        };
        if(model.list.map(e => e._id.toString()).includes(req.user._id.toString())){
            model.action = true;
        };
        if(model.raitingOfPost == 0 && model.list.length == 0){
            model.noOne = true;
        };
        if(model.list.length > 0){
            model.users = model.list.map(e => e.email).join(", ");
        };
        res.render('details', {
            title: 'Model Details',
            model,
            errors: parseError(err)
        });
    };
});

module.exports = modelController;