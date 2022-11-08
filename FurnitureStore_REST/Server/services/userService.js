const User = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = 'zxc';
const tokenBlacklist = new Set();

async function register(email, password){
    const existing = await User.findOne({email}).collation({locale: 'en', strength: 2});
    if(existing){
        throw new Error('Email is taken!');
    };
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({email, hashedPassword});
    return createToken(user);
};

async function login(email, password){
    const user = await User.findOne({email}).collation({locale: 'en', strength: 2});
    if(!user){
        throw new Error('Incorrect email or password!');
    };
    const match = await bcrypt.compare(password, user.hashedPassword);
    if(!match){
        throw new Error('Incorrect email or password!');
    };
    return createToken(user);
};

async function logout(token){
    tokenBlacklist.add(token);
};

function createToken(user){
    const payload = {
        _id: user._id,
        email: user.email
    };
    return {
        _id: user._id,
        email: user.email,
        accessToken: jwt.sign(payload, JWT_SECRET)
    };
};

function parseToken(token){
    if(tokenBlacklist.has(token)){
        throw new Error('Token is blacklisted!');
    };
    return jwt.verify(token, JWT_SECRET);
};

module.exports = {
    register,
    login,
    logout,
    parseToken
};