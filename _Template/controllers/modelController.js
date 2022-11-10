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
    // const model = {
    //     : req.body.,
    //     : req.body.,
    //     : req.body.,
    //     : req.body.,
    //     : req.body.,
    //     : req.body.,
    //     : req.body.,
    // }
    try{
        if(Object.values(model).some(v => !v)){
            throw new Error('All fields are required')
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
    const model = await getById(req.params.id);
    if(req.user){
        if(model.owner == req.user._id){
            model.isOwner = true;
        // }else if(model...............map(e => e.toString()).includes(req.user._id.toString())){
        //     model.action = true;
        // }
        }
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
    // const edited = {
    //     : req.body.,
    //     : req.body.,
    //     : req.body.,
    //     : req.body.,
    //     : req.body.,
    //     : req.body.
    // }
    try{
        if(Object.values(edited).some(v => !v)){
            throw new Error('All fields are required')
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









module.exports = modelController;