const express = require('express');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('../middlewares/session');
const trimBody = require('../middlewares/trimBody');

module.exports = (app) => {
    const hbs = handlebars.create({
        extname: '.hbs'
    });
    //linking hbs as usual extension for the engine
    app.engine('hbs', hbs.engine);
    app.set('view engine', '.hbs');
    //parses the body and puts into the req
    app.use(express.urlencoded({extended: true}));
    //load static files from here
    app.use('/static', express.static('static'));
    //add cookie parser
    app.use(cookieParser());
    //verify session
    app.use(session());
    //trims the input in req.body
    app.use(trimBody('password'));
};