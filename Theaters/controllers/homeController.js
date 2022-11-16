const { hasUser } = require('../middlewares/guards');
const { getAll, getAllPublic, getAllSorted } = require('../services/modelService');

const homeController = require('express').Router();

homeController.get('/', async (req, res) => {
    const models = await getAll();
    const publicModels = await getAllPublic();
    if(req.user){
        const catalog = publicModels.sort((a,b) => a.createdAt.localeCompare(b.createdAt));
        res.render('home-user', {
            title: 'Home Page',
            user: req.user,
            catalog
        });
    }else{
        const catalog = publicModels.sort((a,b) => b.list.length - a.list.length).slice(0, 3);
        res.render('home-guest', {
            title: 'Home Page',
            user: req.user,
            catalog
        });
    };
});

homeController.get('/sort-by-date', hasUser(), async(req, res) => {
    const publicModels = await getAllPublic();
    //const catalog = publicModels.sort((a,b) => b.createdAt.localeCompare(a.createdAt));
    const catalog = await getAllSorted();
    res.render('home-user', {
        title: 'Home Page',
        user: req.user,
        catalog
    });
});

homeController.get('/sort-by-likes', hasUser(), async(req, res) => {
    const publicModels = await getAllPublic();
    const catalog = publicModels.sort((a,b) => b.list.length - a.list.length).slice(0,1);
    res.render('home-user', {
        title: 'Home Page',
        user: req.user,
        catalog
    });
});

module.exports = homeController;