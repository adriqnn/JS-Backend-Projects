const { isGuest } = require('../middlewares/guards');
const { register, login } = require('../services/userService');
const { parseError } = require('../util/parser');
const authController = require('express').Router();
const validator = require('validator');

authController.get('/register', isGuest(), (req, res) => {
    res.render('register', {
        title: 'Register Page'
    });
});

authController.post('/register', isGuest(), async (req, res) => {
    try{
        if(validator.isEmail(req.body.email) == false){
            throw new Error('Invalid email!');
        };
        if(req.body.email == '' || req.body.password == '' || req.body.descriptionOfSkills == ''){
            throw new Error('All fields are required!');
        };
        if(req.body.password != req.body.repass){
            throw new Error('Passwords don\'t match!');
        };
        if(req.body.password.length < 5){
            throw new Error('Password must be at least 5 characters long!');
        };
        const token = await register(req.body.email, req.body.password, req.body.descriptionOfSkills);
        res.cookie('token', token);
        res.redirect('/');
    }catch(error){
        const errors = parseError(error);
        res.render('register', {
            title: 'Register Page',
            errors,
            body:{
                email: req.body.email,
                descriptionOfSkills: req.body.descriptionOfSkills
            }
        });
    };   
});

authController.get('/login', isGuest(), (req, res) => {
    res.render('login', {
        title: 'Login Page'
    });
});

authController.post('/login', isGuest(), async (req, res) => {
    try{
        const token = await login(req.body.email, req.body.password);
        res.cookie('token', token);
        res.redirect('/');
    }catch(error){
        const errors = parseError(error);
        res.render('login', {
            title: 'Login Page',
            errors,
            body:{
                email: req.body.email
            }
        });
    };
});

authController.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = authController;