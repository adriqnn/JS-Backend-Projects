const {Schema, model, Types} = require('mongoose');
const URL_PATTERN = /^https?:\/\/.+$/i;
const DATE_PATTERN = /^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/i;

const modelSchema = new Schema({
    title:{
        type: String, 
        required: true,
        minlength: [6, 'Title should be at least 6 character long!']
    },
    keyword:{
        type: String, 
        required: true,
        minlength: [6, 'Title should be at least 6 character long!']
    },
    location:{
        type: String, 
        required: true,
        maxlength: [15, 'Location should be a maximum of 15 characters long!']
    },
    dateOfCreation:{
        type: String, 
        required: true,
        validate: {validator: (value) => DATE_PATTERN.test(value), message: 'Date should be in xx.xx.xxxx format!'}
    },
    image:{
        type: String, 
        required: true,
        validate: {validator: (value) => URL_PATTERN.test(value), message: 'Image URL is not valid.'}
    },
    description:{
        type: String, 
        required: true,
        minlength: [8, 'Description should be at least 8 characters long!']
    },
    owner:{
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    list:{
        type: [Types.ObjectId],
        default: [],
        ref: 'User'
    },
    raitingOfPost:{
        type: Number, 
        required: true,
        default: 0
    }
});

const Model = model('Model', modelSchema);
module.exports = Model;