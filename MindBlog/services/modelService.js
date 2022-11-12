const Model = require('../models/Model');

async function getAll(){
    return Model.find({}).lean();
};

async function getById(modelId){
    return Model.findById(modelId).lean();
};

async function getByIdPopulateOwner(modelId){
    return Model.findById(modelId).populate('owner').populate('list').lean();
};

async function create(model){
    return await Model.create(model);
};

async function update(modelId, model){
    const existing = await Model.findById(modelId);
    existing.title = model.title;
    existing.image = model.image;
    existing.content = model.content;
    existing.blogCategory = model.blogCategory;
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

async function getOwnPosts(userId){
    return await Model.find({owner: userId}).lean();
};

async function getFollowedPosts(userId){
    return await Model.find({list: userId}).lean();
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById,
    action,
    getByIdPopulateOwner,
    getOwnPosts,
    getFollowedPosts
};