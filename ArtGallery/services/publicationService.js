const Publication = require("../models/Publication");

async function getAll(){
    return Publication.find({}).lean();
};

async function getById(id){
    return Publication.findById(id).lean();
};

async function create(publication){
    return await Publication.create(publication);
}
;
async function update(id, publication){
    const existing = await Publication.findById(id);
    existing.title = publication.title;
    existing.paintingTechnique = publication.paintingTechnique;
    existing.artPicture = publication.artPicture;
    existing.certificateOfAuthenticity = publication.certificateOfAuthenticity;
    await existing.save();
}
;
async function deleteById(id){
    await Publication.findByIdAndRemove(id);
};

async function sharePublication(publicationId, userId){
    const publication = await Publication.findById(publicationId);
    publication.shares.push(userId);
    await publication.save();
};

async function getAuthorName(id){
    const publication = await Publication.findById(id).populate('author');
    return publication.author.username;
};

async function getByUserShares(userId){
    return await Publication.find({shares: userId}).lean();
};

async function getByUserOwner(userId){
    return await Publication.find({author: userId}).lean();
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById,
    sharePublication,
    getAuthorName,
    getByUserShares,
    getByUserOwner
};