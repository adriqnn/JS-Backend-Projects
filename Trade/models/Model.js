const {Schema, model, Types} = require('mongoose');
const URL_PATTERN = /^https?:\/\/.+$/i;

const modelSchema = new Schema({
    name:{
        type: String,
        required: true,
        minlength: [2, 'Name should be at least 2 characters long!']
    },
    image:{
        type: String,
        required: true,
        validate: {validator: (value) => URL_PATTERN.test(value), message: 'Image URL is not valid.'}
    },
    price:{
        type: Number,
        required: true,
        min: [0, 'Price should be a positive number!']
    },
    cryptoDescription:{
        type: String,
        required: true,
        minlength: [10, 'Description should be at least 10 characters long!']
    },
    paymentMethod:{
        type: String,
        enum: ['crypto-wallet', 'credit-card', 'debit-card', 'paypal'],
        required: true,
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
