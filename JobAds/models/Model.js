const {Schema, model, Types} = require('mongoose');
const URL_PATTERN = /^https?:\/\/.+$/i;

const modelSchema = new Schema({
    headline:{
        type: String, 
        required: true,
        minlength: [4, 'Headline should be at least 4 characters long!']
    },
    location:{
        type: String, 
        required: true,
        minlength: [8, 'Location should be at least 8 characters long!']
    },
    companyName:{
        type: String, 
        required: true,
        minlength: [3, 'Company name should be at least 3 characters long!']
    },
    companyDescription:{
        type: String, 
        required: true,
        maxlength: [40, 'Company description should be less than 40 characters long!']
    },
    owner:{
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    list: {
        type: [Types.ObjectId],
        default: [],
        ref: 'User'
    }
});

const Model = model('Model', modelSchema);
module.exports = Model;