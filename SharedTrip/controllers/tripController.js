const { hasUser } = require('../middlewares/guards');
const { create, getById, getBuddies, getOwner, update, deleteById, buddyTrip } = require('../services/tripService');
const { parseError } = require('../util/parser');
const tripController = require('express').Router();

tripController.get('/create', hasUser(), (req, res) => {
    res.render('create', {
        title: 'Create Trip'
    });
});

tripController.post('/create', hasUser(), async (req, res) => {
    const trip = {
        startPoint: req.body.startPoint,
        endPoint: req.body.endPoint,
        date: req.body.date,
        time: req.body.time,
        carImage: req.body.carImage,
        carBrand: req.body.carBrand,
        seats: Number(req.body.seats),
        price: Number(req.body.price),
        description: req.body.description,
        owner: req.user._id
    };
    try{
        if(Object.values(trip).some(v => !v)){
            throw new Error('All fields are required');
        };
        const result = await create(trip);
        res.redirect('/shared-trips');
    }catch(err){
        res.render('create', {
            title: 'Create Trip',
            body: trip,
            errors: parseError(err)
        });
    };
});

tripController.get('/:id/details', async (req, res) => {
    const trip = await getById(req.params.id);
    const buddies = await getBuddies(req.params.id);
    const owner = await getOwner(req.params.id);
    if(trip.seats > 0){
        trip.available = true;
    };
    if(req.user){
        if(trip.owner == req.user._id){
            trip.isOwner = true;
        }else if(trip.buddies.map(b => b.toString()).includes(req.user._id.toString())){
            trip.isBuddy = true;
        };
    };
    res.render('details', {
        title: 'Trip Details',
        trip,
        buddies,
        owner
    });
});

tripController.get('/:id/edit', hasUser(), async (req, res) => {
    const trip = await getById(req.params.id);
    if(trip.owner != req.user._id){
        return res.redirect('/');
    };
    res.render('edit', {
        title: 'Edit Trip',
        trip
    });
});

tripController.post('/:id/edit', hasUser(), async (req, res) => {
    const trip = await getById(req.params.id);
    if(trip.owner != req.user._id){
        return res.redirect('/');
    };
    const edited = {
        startPoint: req.body.startPoint,
        endPoint: req.body.endPoint,
        date: req.body.date,
        time: req.body.time,
        carImage: req.body.carImage,
        carBrand: req.body.carBrand,
        seats: Number(req.body.seats),
        price: Number(req.body.price),
        description: req.body.description,
    };
    try{
        if(Object.values(edited).some(v => !v)){
            throw new Error('All fields are required')
        };
        const result = await update(req.params.id, edited);
        res.redirect(`/trip/${req.params.id}/details`);
    }catch(err){
        res.render('edit', {
            title: 'Edit Trip',
            trip: Object.assign(edited, {_id: req.params.id}),
            errors: parseError(err)
        });
    };
});

tripController.get('/:id/delete', hasUser(), async (req, res) => {
    const trip = await getById(req.params.id);
    if(trip.owner != req.user._id){
        return res.redirect('/');
    };
    await deleteById(req.params.id);
    res.redirect("/shared-trips");
});

tripController.get('/:id/buddy', hasUser(), async (req, res) => {
    const trip = await getById(req.params.id);
    try{
        if(trip.owner == req.user._id){
            trip.isOwner = true;
            throw new Error('Cannot join your own trip!');
        };
        if(trip.buddies.map(b => b.toString()).includes(req.user._id.toString())){
            trip.isBuddy = true;
            throw new Error('Cannot join a trip twice!');
        };
        await buddyTrip(req.params.id, req.user._id);
        res.redirect(`/trip/${req.params.id}/details`);
    }catch(err){
        const trip = await getById(req.params.id);
        const buddies = await getBuddies(req.params.id);
        const owner = await getOwner(req.params.id);
        if(trip.owner == req.user._id){
            trip.isOwner = true;
        };
        if(trip.seats > 0){
            trip.available = true;
        };
        if(trip.buddies.map(b => b.toString()).includes(req.user._id.toString())){
            trip.isBuddy = true;
        };
        res.render('details', {
            title: 'Trip Details',
            trip,
            buddies,
            owner,
            errors: parseError(err)
        });

    };
});

module.exports = tripController;