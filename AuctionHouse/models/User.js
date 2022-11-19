const {Schema, model, Types} = require('mongoose');

const userSchema = new Schema({
    email:{
        type: String, 
        required: true, 
        unique: true
    },
    firstName:{
        type: String, 
        required: true,
        minlength: [1, 'First name should be at least 1 character long!']
    },
    lastName:{
        type: String, 
        required: true,
        minlength: [1, 'Last name should be at least 1 character long!']
    },
    hashedPassword: {
        type: String, 
        required: true
    }
});

userSchema.index({email: 1}, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const User = model('User', userSchema);
module.exports = User;