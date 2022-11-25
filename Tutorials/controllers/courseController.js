const { hasUser } = require('../middlewares/guards');
const { create, getById, update, deleteById, enrollInCourse } = require('../services/courseService');
const { parseError } = require('../util/parser');
const courseController = require('express').Router();

courseController.get('/create', (req, res) => {
    res.render('create-course', {
        title: 'Create Course'
    });
});

courseController.post('/create', async (req, res) => {
    const course = {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        duration: req.body.duration,
        createdAt: Date.now().toString(),
        owner: req.user._id
    };
    try{
        if(Object.values(course).some(v => !v)){
            throw new Error('All fields are required!');
        };
        const result = await create(course);
        res.redirect('/');
    }catch(err){
        res.render('create-course', {
            title: 'Create Course',
            body: course,
            errors: parseError(err)
        });
    };
});

courseController.get('/:id/details', hasUser(), async (req,res) => {
    const course = await getById(req.params.id);
    if(course.owner == req.user._id){
        course.isOwned = true;
    }else if(course.students.map(s => s.toString()).includes(req.user._id.toString())){
        course.isEnrolled = true;
    };
    res.render('course-details', {
        title: 'Course Details',
        course
    });
});

courseController.get('/:id/edit', async (req, res) => {
    const course = await getById(req.params.id);
    if(course.owner != req.user._id){
        return res.redirect('/');
    };
    res.render('edit-course', {
        title: 'Edit Course',
        course
    });
});

courseController.post('/:id/edit', async (req, res) => {
    const course = await getById(req.params.id);
    if(course.owner != req.user._id){
        return res.redirect('/');
    };
    const edited = {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        duration: req.body.duration
    };
    try{
        if(Object.values(edited).some(v => !v)){
            throw new Error('All fields are required!');
        };
        const result = await update(req.params.id, edited);
        res.redirect(`/course/${req.params.id}/details`);
    }catch(err){
        res.render('edit-course', {
            title: 'Edit Course',
            course: Object.assign(edited, {_id: req.params.id}),
            errors: parseError(err)
        });
    };
});

courseController.get('/:id/delete', async (req, res) => {
    const course = await getById(req.params.id);
    if(course.owner != req.user._id){
        return res.redirect('/');
    };
    await deleteById(req.params.id);
    res.redirect('/');
});

courseController.get('/:id/enroll', async (req, res) => {
    const course = await getById(req.params.id);
    try{
        if(course.owner == req.user._id){
            course.isOwner = true;
            throw new Error('Cannot enroll in your own course');
        };
        if(course.students.map(e => e.toString()).includes(req.user._id.toString())){
            course.isEnrolled = true;
            throw new Error('Cannot enroll twice');
        };
        await enrollInCourse(req.params.id, req.user._id);
        res.redirect(`/course/${req.params.id}/details`);
    }catch(err){
        res.render('course-detials', {
            title: 'Course Details',
            course,
            errors: parseError(err)
        });
    };
});

module.exports = courseController;