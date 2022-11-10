const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = 'zxc';

//TODO add all fields
async function register(username, password){
    const existing = await User.findOne({username}).collation({locale: 'en', strength: 2});
    if(existing){
        throw new Error('Username is taken!');
    };
    const hashedPassword = await bcrypt.hash(password, 10);
    //TODO add all fields to the user
    const user = await User.create({
        username,
        hashedPassword
    });
    //TODO see assignment if registration creates user session
    const token = createSession(user);
    return token;
};

async function login(username, password){
    const user = await User.findOne({username}).collation({locale: 'en', strength: 2});
    if(!user){
        throw new Error('Incorrect username or password!');
    };
    const hasMatch = await bcrypt.compare(password, user.hashedPassword);
    if(hasMatch == false){
        throw new Error('Incorrect username or password!');
    };
    const token = createSession(user);
    return token;
};
//TODO all fields to the payload
function createSession({_id, username}){
    const payload = {
        _id,
        username
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