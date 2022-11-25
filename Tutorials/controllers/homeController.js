const { getAll } = require('../services/courseService');
const homeController = require('express').Router();

homeController.get('/', async (req, res) => {
    let courses = await getAll();
    if(req.user){
        courses.sort((a,b) => a.createdAt.localeCompare(b.createdAt));
        //const dates = courses.map(e => new Date(Number(e.createdAt)));
        courses.map(e => e.createdAt = new Date(Number(e.createdAt)));
        if(req.query.search){
            const query = req.query.search.toString().toLowerCase();
            courses = courses.filter(e => e.title.toString().toLowerCase().includes(query));
        };
        res.render('user-home', {
            title: 'Home Page',
            user: req.user,
            courses,
            search: req.query.search,
            //courses: Object.assign(courses, {dates: dates})
        });
    }else{
        const ccc = courses.sort((a,b) => b.students.length - a.students.length).slice(0, 3);
        res.render('guest-home', {
            title: 'Home Page',
            user: req.user,
            ccc
        });
    };
});

homeController.get('/search', async (req, res) => {
    console.log('search');
    res.redirect('/');

});

module.exports = homeController;