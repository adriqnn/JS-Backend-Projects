const {Schema, model, Types} = require('mongoose');

const userSchema = new Schema({
    firstName:{
        type: String, 
        required: true,
        minlength: [3, 'First name must be at least 3 characters long']
    },
    lastName:{
        type: String, 
        required: true,
        minlength: [5, 'Last name must be at least 5 characters long']
    },
    email: {
        type: String, 
        required: true, 
        unique: true
    },
    hashedPassword: {
        type: String, 
        required: true}
});

userSchema.index({email: 1}, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const User = model('User', userSchema);
module.exports = User;