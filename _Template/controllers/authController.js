const { isGuest } = require('../middlewares/guards');
const { register, login } = require('../services/userService');
const { parseError } = require('../util/parser');
const authController = require('express').Router();
const validator = require('validator');

authController.get('/register', isGuest(), (req, res) => {
    //TODO replace with actual view by assignment
    res.render('register', {
        title: 'Register Page'
    });
});

// if(validator.isEmail(req.body.email) == false){
//     throw new Error('Invalid email!');
// };

authController.post('/register', isGuest(), async (req, res) => {
    try{
        //TODO add all fields and have the validation either here or inside the model
        if(req.body.username == '' || req.body.password == ''){
            throw new Error('All fields are required!');
        };
        if(req.body.password != req.body.repass){
            throw new Error('Passwords don\'t match!');
        };
        //TODO set correct password length
        if(req.body.password.length < 3){
            throw new Error('Password must be at least 3 characters long!');
        };
        //TODO add all fields
        const token = await register(req.body.username, req.body.password);
        //TODO check assignment to see if register creates session
        res.cookie('token', token);
        //TODO replace with redirect from document
        res.redirect('/');
    }catch(error){
        const errors = parseError(error);
        //TODO add error display to actual template
        res.render('register', {
            title: 'Register Page',
            errors,
            body:{
                //TODO add all the fields to the template
                username: req.body.username
            }
        });
    };   
});

authController.get('/login', isGuest(), (req, res) => {
    //TODO replace wiht actual view by assignment
    res.render('login', {
        title: 'Login Page'
    });
});

authController.post('/login', isGuest(), async (req, res) => {
    try{
        const token = await login(req.body.username, req.body.password);
        res.cookie('token', token);
        //TODO replace with redirect by assignment
        res.redirect('/');
    }catch(error){
        const errors = parseError(error);
        res.render('login', {
            title: 'Login Page',
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