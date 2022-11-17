const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = 'zxc';

async function register(firstName, lastName, email, password){
    const existing = await User.findOne({email}).collation({locale: 'en', strength: 2});
    if(existing){
        throw new Error('Email is taken!');
    };
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        firstName,
        lastName,
        email,
        hashedPassword
    });
    const token = createSession(user);
    return token;
};

async function login(email, password){
    const user = await User.findOne({email}).collation({locale: 'en', strength: 2});
    if(!user){
        throw new Error('Incorrect email or password!');
    };
    const hasMatch = await bcrypt.compare(password, user.hashedPassword);
    if(hasMatch == false){
        throw new Error('Incorrect email or password!');
    };
    const token = createSession(user);
    return token;
};

function createSession({_id, firstName, lastName, email}){
    const payload = {
        _id,
        firstName,
        lastName,
        email
    };
    const token = jwt.sign(payload, JWT_SECRET);
    return token;
};

function verifyToken(token){
    return jwt.verify(token, JWT_SECRET);
};

module.exports = {
    register,
    login,
    verifyToken
};