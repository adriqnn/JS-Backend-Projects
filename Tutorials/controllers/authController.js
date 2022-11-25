const { register, login } = require('../services/userService');
const { parseError } = require('../util/parser');
const authController = require('express').Router();
const validator = require('validator');
const { isGuest } = require('../middlewares/guards');

authController.get('/register',isGuest(), (req, res) => {
    res.render('register', {
        title: 'Register Page'
    });
});

authController.post('/register', async (req, res) => {
    try{
        if(req.body.username == '' || req.body.password == ''){
            throw new Error('All fields are required!');
        };
        if(req.body.password != req.body.repass){
            throw new Error('Passwords don\'t match!');
        };
        if(validator.default.isAlphanumeric(req.body.username) == false || req.body.username.length < 5){
            throw new Error('Username must be at least 5 character(only english letter and digits are allowed)!');
        };
        if(validator.default.isAlphanumeric(req.body.password) == false || req.body.password.length < 5){
            throw new Error('Password must be at least 5 character(only english letter and digits are allowed)!');
        };
        const token = await register(req.body.username, req.body.password);
        res.cookie('token', token);
        res.redirect('/');
    }catch(error){
        const errors = parseError(error);
        res.render('register', {
            title: 'Register Page',
            errors,
            body:{
                username: req.body.username
            }
        });
    };
});

authController.get('/login', isGuest(), (req, res) => {
    res.render('login', {
        title: 'Login page'
    });
});

authController.post('/login', async (req, res) => {
    try{
        const token = await login(req.body.username, req.body.password);
        res.cookie('token', token);
        res.redirect('/');
    }catch(error){
        const errors = parseError(error);
        res.render('login', {
            title: 'Login page',
            errors,
            body:{
                username: req.body.username
            }
        });
    };
});

authController.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = authController;