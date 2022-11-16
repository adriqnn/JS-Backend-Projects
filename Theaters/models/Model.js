const {Schema, model, Types} = require('mongoose');
const URL_PATTERN = /^https?:\/\/.+$/i;

const modelSchema = new Schema({
    title:{
        type: String, 
        required: true,
        unique: true
    },
    description:{
        type: String, 
        required: true,
        maxlength: [50, 'Description can be a maximum of 50 characters long!']
    },
    imageUrl:{
        type: String, 
        required: true
    },
    isPublic:{
        type: Boolean, 
        required: true,
        default: false
    },
    createdAt:{
        type: String,
        required: true
    },
    list:{
        type: [Types.ObjectId],
        default: [],
        ref: 'User'
    },
    owner:{
        type: Types.ObjectId,
        ref: 'User',
        required: true
    }
});

modelSchema.index({title: 1}, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const Model = model('Model', modelSchema);
module.exports = Model;