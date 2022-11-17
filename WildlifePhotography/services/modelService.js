const Model = require('../models/Model');

async function getAll(){
    return Model.find({}).lean();
};

async function getById(modelId){
    return Model.findById(modelId).lean();
};

async function getByIdForDetails(modelId){
    return Model.findById(modelId).populate('owner').populate('list').lean();
};

async function create(model){
    return await Model.create(model);
};

async function update(modelId, model){
    const existing = await Model.findById(modelId);
    existing.title = model.title;
    existing.keyword = model.keyword;
    existing.location = model.location;
    existing.dateOfCreation = model.dateOfCreation;
    existing.image = model.image;
    existing.description = model.description;
    await existing.save();
};

async function deleteById(modelId){
    await Model.findByIdAndRemove(modelId);
};

async function action(modelId, userId){
    const model = await Model.findById(modelId);
    await model.save();
};

async function upvote(modelId, userId){
    const model = await Model.findById(modelId);
    model.raitingOfPost = model.raitingOfPost + 1;
    model.list.push(userId);
    await model.save();
};

async function downvote(modelId, userId){
    const model = await Model.findById(modelId);
    model.raitingOfPost = model.raitingOfPost - 1;
    model.list.push(userId);
    await model.save();
};

async function getOwnPosts(userId){
    return await Model.find({owner: userId}).populate('owner').lean();
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById,
    action,
    getByIdForDetails,
    upvote,
    downvote,
    getOwnPosts
};