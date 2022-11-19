const { hasUser } = require('../middlewares/guards');
const { create, getById, update, deleteById, action, getOwnerName, getBidderName, closeAuction, getAllUsersClosedAuctions } = require("../services/modelService");
const { parseError } = require('../util/parser');
const modelController = require('express').Router();

modelController.get('/create', hasUser(), (req, res) => {
    res.user = req.user;
    console.log(res.user);
    res.render('create', {
        title: 'Create Model'
    });
});

modelController.post('/create', hasUser(), async (req, res) => {
    const model = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        imageUrl: req.body.imageUrl,
        price: Number(req.body.price),
        owner: req.user._id
    };
    try{
        if(req.body.title == '' || req.body.category == '' ||  req.body.price == ''){
            throw new Error('Title, Category and Price are required fields!')
        };
        const result = await create(model);
        res.redirect('/catalog');
    }catch(err){
        const check = {};
        if(model.category == 'Vehicles'){
            check.isVehicle = true;
        }else if(model.category == 'Real Estate'){
            check.isRealEstate = true;
        }else if(model.category == 'Electronics'){
            check.isElectronics = true;
        }else if(model.category == 'Furniture'){
            check.isFurniture = true;
        }else if(model.category == 'Other'){
            check.isOther = true;
        };
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
    const owner = await getOwnerName(req.params.id);
    if(req.user){
        if(model.owner == req.user._id){
            const bidder = {};
            if(model.bidder){
                bidder.bidder = await getBidderName(req.params.id);
            };
            model.isOwner = true;
            res.render('details-owner', {
                title: 'Model Details',
                model,
                owner,
                bidder
            });
            return;
        }else if(model.bidder){
            if(model.bidder.toString() == req.user._id){
                model.isHighestBidder = true;
            };
        };
    };
    res.render('details', {
        title: 'Model Details',
        model,
        owner
    });
});

modelController.get('/:id/edit', hasUser(), async (req, res) => {
    const model = await getById(req.params.id);
    if(model.owner != req.user._id){
        return res.redirect('/')
    };
    const check = {};
    if(model.category == 'Vehicles'){
        check.isVehicle = true;
    }else if(model.category == 'Real Estate'){
        check.isRealEstate = true;
    }else if(model.category == 'Electronics'){
        check.isElectronics = true;
    }else if(model.category == 'Furniture'){
        check.isFurniture = true;
    }else if(model.category == 'Other'){
        check.isOther = true;
    };
    if(model.bidder){
        model.priceDisabled = true;
    };
    res.render('edit', {
        title: 'Edit Model',
        model,
        check,
        price: model.price
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
        category: req.body.category,
        imageUrl: req.body.imageUrl
    };
    try{
        if(req.body.title == '' || req.body.category == ''){
            throw new Error('Title and Category are required fields!')
        };
        const result = await update(req.params.id, edited);
        res.redirect(`/model/${req.params.id}/details`);
    }catch(err){
        const check = {};
        if(model.category == 'Vehicles'){
            check.isVehicle = true;
        }else if(model.category == 'Real Estate'){
            check.isRealEstate = true;
        }else if(model.category == 'Electronics'){
            check.isElectronics = true;
        }else if(model.category == 'Furniture'){
            check.isFurniture = true;
        }else if(model.category == 'Other'){
            check.isOther = true;
        };
        if(model.bidder){
            edited.priceDisabled = true;
        };
        res.render('edit', {
            title: 'Edit Model',
            model: Object.assign(edited, {_id: req.params.id}),
            errors: parseError(err),
            check,
            price: model.price
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

modelController.post('/:id/action', hasUser(), async(req, res) => {
    const model = await getById(req.params.id);
    const owner = await getOwnerName(req.params.id);
    const bid = Number(req.body.bid);
    try{
        if(model.owner == req.user._id){
            model.isOwner = true;
            throw new Error('Cannot bid on your own listing!');
        };
        if(model.bidder){
            if(model.bidder = req.user._id){
                model.isBidder = true;
                throw new Error('You have the current highest bid');
            };
        };
        if(req.body.bid){
            if(bid <= model.price){
                throw new Error('Bid must be higher thant the current price!');
            };
        }else{
            throw new Error('You need to add a bid!')
        };
        await action(req.params.id, req.user._id, bid);
        res.redirect(`/model/${req.params.id}/details`);
    }catch(err){
        if(model.owner == req.user._id){
            const bidder = {};
            if(model.bidder){
                bidder.bidder = await getBidderName(req.params.id);
            };
            model.isOwner = true;
            res.render('details-owner', {
                title: 'Model Details',
                model,
                owner,
                bidder,
                errors: parseError(err)
            });
        }else if(model.bidder){
            if(model.bidder == req.user._Id){
                model.isHighestBidder = true;
            };
        };
        res.render('details', {
            title: 'Model Details',
            model,
            owner,
            errors: parseError(err)
        });
    };
});

modelController.get('/closed', hasUser(), async(req, res) => {
    const catalog = await getAllUsersClosedAuctions(req.user._id);
    console.log(catalog);
    res.render('closed-auctions', {
        title: 'Closed Auction',
        catalog
    });
});

modelController.get('/:id/close', hasUser(), async(req, res) => {
    const model = await getById(req.params.id);
    if(model.owner != req.user._id){
        return res.redirect('/')
    };
    await closeAuction(req.params.id, req.user._id);
    res.redirect('/model/closed');
});

module.exports = modelController;