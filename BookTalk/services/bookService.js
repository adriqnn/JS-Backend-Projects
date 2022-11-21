const Book = require('../models/Book');

async function getAll(){
    return Book.find({}).lean();
};

async function getById(id){
    return Book.findById(id).lean();
};

async function create(publication){
    return await Book.create(publication);
};

async function update(id, model){
    const existing = await Book.findById(id);
    existing.title = model.title;
    existing.author = model.author;
    existing.image = model.image;
    existing.bookreview = model.bookreview;
    existing.genre = model.genre;
    existing.stars = model.stars;
    await existing.save();
};

async function deleteById(id){
    await Book.findByIdAndRemove(id);
};

async function wish(modelId, userId){
    const book = await Book.findById(modelId);
    book.wishingList.push(userId);
    await book.save();
};

async function getWishListOfUser(userId){
    return await Book.find({wishingList: userId}).lean();
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById,
    wish, 
    getWishListOfUser
};