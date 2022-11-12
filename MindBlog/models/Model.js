const {Schema, model, Types} = require('mongoose');
const URL_PATTERN = /^https?:\/\/.+$/i;

const modelSchema = new Schema({
    title:{
        type: String, 
        required: true,
        minlength: [5, 'Title must be at least 5 characters long!'],
        maxlength: [50, 'Title cannot be more than 50 characters long!']
    },
    image:{
        type: String, 
        required: true,
        validate: {validator: (value) => URL_PATTERN.test(value), message: 'Image URL is not vlaid!'}
    },
    content:{
        type: String, 
        required: true,
        minlength: [10, 'Content should be at least 10 caracters long!']
    },
    blogCategory:{
        type: String, 
        required: true,
        minlength: [3, 'Category should be at least 3 characters long!']
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

const Model = model('Model', modelSchema);
module.exports = Model;