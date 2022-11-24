const { create, getById, getTenantsByHousingId, update, deleteById, rentHousing } = require('../services/housingService');
const { parseError } = require('../util/parser');
const { hasUser } = require("../middlewares/guards");
const { getUserById } = require('../services/userService');
const housingController = require('express').Router();

housingController.get('/create', hasUser(), (req, res) => {
    res.render('create', {
        title: 'Create Housing'
    });
});

housingController.post('/create', hasUser(), async (req, res) => {
    let other = req.body.type;
    if(other != 'Appartment' && other != 'Villa' && other != 'House'){
        if(other == 'appartment'){
            other = 'Appartment';
        }else if(other == 'villa'){
            other = 'Villa';
        }else if(other == 'house'){
            other = 'House';
        }else{
            other = 'Other';
        };
    };
    const housing = {
        name: req.body.name,
        type: other,
        year: Number(req.body.year),
        city: req.body.city,
        homeImage: req.body.homeImage,
        propertyDescription: req.body.propertyDescription,
        availablePieces: Number(req.body.availablePieces),
        owner: req.user._id
    };
    try{
        if(Object.values(housing).some(v => !v)){
            throw new Error('All fields are required');
        };
        const result = await create(housing);
        res.redirect('/renting');
    }catch(err){
        res.render('create', {
            title: 'Create housing',
            body: housing,
            errors: parseError(err)
        });
    };
});

housingController.get('/:id/details', async (req, res) => {
    const housing = await getById(req.params.id);
    const tenants = housing.rentees.join(', ');
    const h = await getTenantsByHousingId(req.params.id);
    const t = h.rentees.map(e => e.name).join(', ');
    if(housing.rentees.length == 0){
        housing.isEmpty = true;
    };
    housing.tenants = tenants;
    housing.t = t;
    if(req.user){
        if(housing.owner == req.user._id){
            housing.isOwner = true;
        }else if(housing.rentees.map(r => r.toString()).includes(req.user._id.toString())){
            housing.isRenter = true;
        };
    };
    if(housing.availablePieces > 0){
        housing.isRentable = true;
    };
    res.render('details', {
        title: 'Housing Details',
        housing
    });
});

housingController.get('/:id/edit', hasUser(), async (req, res) => {
    const housing = await getById(req.params.id);
    if(housing.owner != req.user._id){
        return res.redirect('/');
    };
    res.render('edit', {
        title: 'Edit Housing',
        housing
    });
});

housingController.post('/:id/edit', hasUser(), async (req, res) => {
    const housing = await getById(req.params.id);
    if(housing.owner != req.user._id){
        return res.redirect('/');
    };
    let other = req.body.type;
    if(other != 'Appartment' && other != 'Villa' && other != 'House'){
        if(other == 'appartment'){
            other = 'Appartment';
        }else if(other == 'villa'){
            other = 'Villa';
        }else if(other == 'house'){
            other = 'House';
        }else{
            other = 'Other';
        };
    };
    const edited = {
        name: req.body.name,
        type: other,
        year: Number(req.body.year),
        city: req.body.city,
        homeImage: req.body.homeImage,
        propertyDescription: req.body.propertyDescription,
        availablePieces: Number(req.body.availablePieces)
    };
    try{
        if(Object.values(edited).some(v => !v)){
            throw new Error('All fields are required');
        };
        const result = await update(req.params.id, edited);
        res.redirect(`/housing/${req.params.id}/details`);
    }catch(err){
        res.render('edit', {
            title: 'Edit Housing',
            housing: Object.assign(edited, {_id: req.params.id}),
            errors: parseError(err)
        });
    };
});

housingController.get('/:id/delete', hasUser(), async (req, res) => {
    const housing = await getById(req.params.id);
    if(housing.owner != req.user._id){
        return res.redirect('/');
    };
    await deleteById(req.params.id);
    res.redirect('/renting');
});

housingController.get('/:id/rent', hasUser(), async (req, res) => {
    const housing = await getById(req.params.id);
    try{
        if(housing.owner == req.user._id){
            housing.isOwner = true;
            throw new Error('Cannot rent your own housing');
        };
        if(housing.rentees.map(r => r.toString()).includes(req.user._id.toString())){
            housing.isRenter = true;
            throw new Error('Cannot book twice');
        };
        await rentHousing(req.params.id, req.user._id);
        res.redirect(`/housing/${req.params.id}/details`);
    }catch(err){
        const tenants = housing.rentees.join(', ')
        if(housing.rentees.length == 0){
            housing.isEmpty = true;
        };
        housing.tenants = tenants;
        if(housing.availablePieces > 0){
            housing.isRentable = true;
        };
        res.render('details', {
            title: 'Housing Details',
            housing,
            errors: parseError(err)
        });
    };
});

module.exports = housingController;