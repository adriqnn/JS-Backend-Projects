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
    // existing. = model.;
    // existing. = model.;
    // existing. = model.;
    // existing. = model.;
    // existing. = model.;
    // existing. = model.;
    await existing.save();
};

async function deleteById(modelId){
    await Model.findByIdAndRemove(modelId);
};

async function action(modelId, userId){
    const model = await Model.findById(modelId);
    //TODO push into the list
    await model.save();
};

//TODO bonus methods

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById,
    action
};