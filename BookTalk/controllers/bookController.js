const { hasUser } = require('../middlewares/guards');
const { create, getById, update, deleteById, wish } = require('../services/bookService');
const { parseError } = require('../util/parser');
const bookController = require('express').Router();

bookController.get('/create', hasUser(), (req, res) => {
    res.render('create', {
        title: 'Create Book'
    });
});

bookController.post('/create', hasUser(), async (req, res) => {
    const book = {
        title: req.body.title,
        author: req.body.author,
        image: req.body.image,
        bookreview: req.body.bookreview,
        genre: req.body.genre,
        stars: Number(req.body.stars),
        owner: req.user._id
    };
    try{
        if(Object.values(book).some(v => !v)){
            throw new Error('All fields are required')
        };
        const result = await create(book);
        res.redirect('/catalog');
    }catch(err){
        res.render('create', {
            title: 'Create Book',
            body: book,
            errors: parseError(err)
        });
    };
});

bookController.get('/:id/details', async (req, res) => {
    const book = await getById(req.params.id);
    if(req.user){
        if(book.owner == req.user._id){
            book.isOwner = true;
        }else if(book.wishingList.map(b => b.toString()).includes(req.user._id.toString())){
            book.isWished = true;
        };
    };
    res.render('details', {
        title: 'Book Details',
        book
    });
});

bookController.get('/:id/edit', hasUser(), async (req, res) => {
    const book = await getById(req.params.id);
    if(book.owner != req.user._id){
        return res.redirect('/');
    };
    res.render('edit', {
        title: 'Edit Book',
        book
    });
});

bookController.post('/:id/edit', hasUser(), async (req, res) => {
    const book = await getById(req.params.id);
    if(book.owner != req.user._id){
        return res.redirect('/')
    };
    const edited = {
        title: req.body.title,
        author: req.body.author,
        image: req.body.image,
        bookreview: req.body.bookreview,
        genre: req.body.genre,
        stars: Number(req.body.stars)
    };
    try{
        if(Object.values(edited).some(v => !v)){
            throw new Error('All fields are required')
        };
        const result = await update(req.params.id, edited);
        res.redirect(`/book/${req.params.id}/details`);
    }catch(err){
        res.render('edit', {
            title: 'Edit Book',
            book: Object.assign(edited, {_id: req.params.id}),
            errors: parseError(err)
        });
    };
});

bookController.get('/:id/delete', hasUser(), async (req, res) => {
    const book = await getById(req.params.id);
    if(book.owner != req.user._id){
        return res.redirect('/');
    };
    await deleteById(req.params.id);
    res.redirect('/catalog');
});

bookController.get('/:id/wish', hasUser(), async (req, res) => {
    const book = await getById(req.params.id);
    try{
        if(book.owner == req.user._id){
            book.isOwner = true;
            throw new Error('Cannot with your own listing!');
        };
        if(book.wishingList.map(b => b.toString()).includes(req.user._id.toString())){
            book.isWished = true;
            throw new Error('Cannot wish a book twice');
        }
        await wish(req.params.id, req.user._id);
        res.redirect(`/book/${req.params.id}/details`);
    }catch(err){
        if(book.owner == req.user._id){
            book.isOwner = true;
        };
        if(book.wishingList.map(b => b.toString()).includes(req.user._id.toString())){
            book.isWished = true;
        };
        res.render('details', {
            title: 'Book Details',
            book,
            errors: parseError(err)
        });
    };
});

module.exports = bookController;