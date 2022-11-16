const Model = require('../models/Model');

async function getAll(){
    return Model.find({}).lean();
};

async function getAllPublic(){
    return Model.find({isPublic: true}).lean();
};

async function getAllSorted(){
    return Model.aggregate(
        [
            { "$project":{
                "title": 1,
                "description": 1,
                "imageUrl": 1,
                "isPublic": 1,
                "createdAt": 1,
                "list": 1,
                "owner": 1,
                "length": { "$size": "$list"}
            }},
            {"$sort": {"length": -1}},
            {"$limit": 2}
        ],
    );
};

async function getAllSortedByDate(){
    return Model.find({}).sort({ createdAt : 1 }).lean();
};

async function getById(modelId){
    return Model.findById(modelId).lean();
};

async function create(model){
    const title = model.title;
    const existing = await Model.findOne({title}).collation({locale: 'en', strength: 2});
    if(existing){
        throw new Error('There is a theater with that name!');
    };
    return await Model.create(model);
};

async function update(modelId, model){
    const existing = await Model.findById(modelId);
    existing.title = model.title;
    existing.description = model.description;
    existing.imageUrl = model.imageUrl;
    existing.isPublic = model.isPublic;
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

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById,
    action,
    getAllPublic,
    getAllSorted,
    getAllSortedByDate
};