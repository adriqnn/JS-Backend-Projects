const { hasUser } = require('../middlewares/guards');
const { create, getById, getAuthorName, update, deleteById, sharePublication } = require('../services/publicationService');
const { parseError } = require('../util/parser');
const publicationController = require('express').Router();

publicationController.get('/create', hasUser(), (req, res) => {
    res.render('create', {
        title: 'Create Publication'
    });
});

publicationController.post('/create', hasUser(), async (req, res) => {
    let certificate = req.body.certificateOfAuthenticity;
    if(certificate != 'Yes' && certificate != 'No'){
        if(certificate == 'no'){
            certificate = 'No'
        }else if(certificate == 'yes'){
            certificate = 'Yes'
        }else{
            certificate = 'No'
        };
    };
    const publication = {
        title: req.body.title,
        paintingTechnique: req.body.paintingTechnique,
        artPicture: req.body.artPicture,
        certificateOfAuthenticity: certificate,
        author: req.user._id
    };
    try{
        if(Object.values(publication).some(v => !v)){
            throw new Error('All fields are required.');
        };
        const result = await create(publication);
        res.redirect('/gallery');
    }catch(err){
        res.render('create', {
            title: 'Create Publication',
            body: publication,
            errors: parseError(err)
        });
    };
});

publicationController.get('/:id/details', async (req, res) => {
    const publication = await getById(req.params.id);
    const authorName = await getAuthorName(req.params.id);
    publication.authorName = authorName;
    if(req.user){
        if(publication.author == req.user._id){
            publication.isOwner = true;
        }else if(publication.shares.map(s => s.toString()).includes(req.user._id.toString())){
            publication.hasShared = true;
        };
    };
    res.render('details', {
        title: 'Publication Details',
        publication
    });
});

publicationController.get('/:id/edit', hasUser(), async (req, res) => {
    const publication = await getById(req.params.id);
    if(publication.author != req.user._id){
        return res.redirect('/');
    };
    res.render('edit', {
        title: 'Edit Publication',
        publication
    });
});

publicationController.post('/:id/edit', hasUser(), async (req, res) => {
    const publication = await getById(req.params.id);
    if(publication.author != req.user._id){
        return res.redirect('/');
    };
    let certificate = req.body.certificateOfAuthenticity;
    if(certificate != 'Yes' && certificate != 'No'){
        if(certificate == 'no'){
            certificate = 'No'
        }else if(certificate == 'yes'){
            certificate = 'Yes'
        }else{
            certificate = 'No'
        };
    };
    const edited = {
        title: req.body.title,
        paintingTechnique: req.body.paintingTechnique,
        artPicture: req.body.artPicture,
        certificateOfAuthenticity: certificate
    };
    try{
        if(Object.values(edited).some(v => !v)){
            throw new Error('All fields are required.')
        };
        const result = await update(req.params.id, edited);
        res.redirect(`/publication/${req.params.id}/details`);
    }catch(err){
        res.render('edit', {
            title: 'Edit Publication',
            publication: Object.assign(edited, {_id: req.params.id}),
            errors: parseError(err)
        });
    };
});

publicationController.get('/:id/delete', hasUser(), async(req, res) => {
    const publication = await getById(req.params.id);
    if(publication.author != req.user._id){
        return res.redirect('/');
    };
    await deleteById(req.params.id);
    res.redirect('/gallery');
});

publicationController.get('/:id/share', hasUser(), async(req, res) => {
    const publication = await getById(req.params.id);
    try{
        if(publication.author == req.user._id){
            publication.isOwner = true;
            throw new Error('Cannot share your own publication.');
        };
        if(publication.shares.map(s => s.toString()).includes(req.user._id.toString())){
            publication.hasShared = true;
            throw new Error('Cannot share a publication twice.');
        };
        await sharePublication(req.params.id, req.user._id);
        res.redirect(`/`);
    }catch(err){
        res.render('details', {
            title: 'Publication Details',
            publication,
            errors: parseError(err)
        });
    };
});

module.exports = publicationController;