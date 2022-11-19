const {Schema, model, Types} = require('mongoose');
const URL_PATTERN = /^https?:\/\/.+$/i;

const modelSchema = new Schema({
    title:{
        type: String, 
        required: true,
        minlength: [4, 'Title should be at least 4 characters long!']
    },
    description:{
        type: String,
        maxlength: [200, 'Description should be less than 200 characters long!']
    },
    category:{
        type: String, 
        required: true,
        enum: ['Vehicles', 'Real Estate', 'Electronics', 'Furniture', 'Other']
    },
    imageUrl:{
        type: String,
        //validate: {validator: (value) => URL_PATTERN.test(value), message: 'Image URL is not valid.'}
    },
    price:{
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative!']
    },
    owner:{
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    closed:{
        type: Boolean,
        required: true,
        default: false
    },
    bidder:{
        type: Types.ObjectId,
        ref: 'User'
    }
});

const Model = model('Model', modelSchema);
module.exports = Model;