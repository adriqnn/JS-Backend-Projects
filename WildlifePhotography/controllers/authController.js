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
        if(req.body.firstName == '' || req.body.lastName == '' || req.body.email == '' || req.body.password == ''){
            throw new Error('All fields are required!');
        };
        if(validator.isAlpha(req.body.firstName) == false){
            throw new Error('First name should be written with latin letters!')
        };
        if(validator.isAlpha(req.body.lastName) == false){
            throw new Error('Last name should be written with latin letters!')
        };
        if(validator.isEmail(req.body.email) == false){
            throw new Error('Invalid email!');
        };
        if(req.body.password != req.body.repass){
            throw new Error('Passwords don\'t match!');
        };
        if(req.body.password.length < 4){
            throw new Error('Password must be at least 4 characters long!');
        };
        const token = await register(req.body.firstName, req.body.lastName, req.body.email, req.body.password);
        res.cookie('token', token);
        res.redirect('/');
    }catch(error){
        const errors = parseError(error);
        res.render('register', {
            title: 'Register Page',
            errors,
            body:{
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
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