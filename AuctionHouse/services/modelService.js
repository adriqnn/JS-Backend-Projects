const Model = require('../models/Model');

async function getAll(){
    return Model.find({}).lean();
};

async function getById(modelId){
    return Model.findById(modelId).lean();
};

async function create(model){
    return await Model.create(model);
};

async function update(modelId, model){
    const existing = await Model.findById(modelId);
    existing.title = model.title;
    existing.description = model.description;
    existing.category = model.category;
    existing.imageUrl = model.imageUrl;
    await existing.save();
};

async function deleteById(modelId){
    await Model.findByIdAndRemove(modelId);
};

async function action(modelId, userId, bid){
    const model = await Model.findById(modelId);
    model.bidder = userId;
    model.price = bid;
    await model.save();
};

async function getOwnerName(modelId){
    const model = await Model.findById(modelId).populate('owner');
    return model.owner.firstName + ' ' + model.owner.lastName;
};

async function getBidderName(modelId){
    const model = await Model.findById(modelId).populate('bidder');
    return model.bidder.firstName + ' ' + model.bidder.lastName;
};

async function getAllNonCloser(){
    return await Model.find({closed: false}).lean();
};

async function closeAuction(modelId, userId){
    const model = await Model.findById(modelId);
    model.closed = true;
    await model.save();
};

async function getAllUsersClosedAuctions(userId){
    return await Model.find({owner: userId, closed: true}).populate('bidder').lean();
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById,
    action,
    getOwnerName,
    getBidderName,
    getAllNonCloser,
    closeAuction,
    getAllUsersClosedAuctions
};