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
    existing.name = model.name;
    existing.image = model.image;
    existing.price = model.price;
    existing.cryptoDescription = model.cryptoDescription;
    existing.paymentMethod = model.paymentMethod;
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

async function getModelWithSearch(query, method){
    const models = await getAll();
    const returnModels = models.filter(e => e.name.toLowerCase() == query.toLowerCase() && e.paymentMethod == method);
    return returnModels;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById,
    action,
    getModelWithSearch
};