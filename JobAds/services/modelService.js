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
    existing.headline = model.headline;
    existing.location = model.location;
    existing.companyName = model.companyName;
    existing.companyDescription = model.companyDescription;
    await existing.save();
};

async function deleteById(modelId){
    await Model.findByIdAndRemove(modelId);
};

async function action(modelId, userId){
    const model = await Model.findById(modelId);
    model.list.push(userId);
    await model.save();
};

async function getOwnerName(modelId){
    const model = await Model.findById(modelId).populate('owner');
    return model.owner.email;
};

async function getByIdPopulated(modelId){
    return await Model.findById(modelId).populate('list').lean();
};

async function searchByEmail(query){
    const model = await Model.find({}).populate('owner').lean();
    const newModel =  model.filter(e => e.owner.email.toLowerCase() == query);
    return newModel;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById,
    action,
    getOwnerName,
    getByIdPopulated,
    searchByEmail
};