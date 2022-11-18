const {Schema, model, Types} = require('mongoose');

const userSchema = new Schema({
    email:{
        type: String, 
        required: true, 
        unique: true
    },
    hashedPassword:{
        type: String, 
        required: true
    },
    descriptionOfSkills:{
        type: String, 
        required: true,
        maxlength: [40, 'Description should be a maximum of 40 characters!']
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