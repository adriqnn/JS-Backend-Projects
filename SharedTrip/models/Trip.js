const {Schema, model, Types} = require('mongoose');
const URL_PATTERN = /^https?:\/\/.+$/i;

const tripSchema = new Schema ({
    startPoint:{
        type: String,
        required: true,
        minlength: [4, 'The start point should be at least 4 characters long!']
    },
    endPoint:{
        type: String,
        required: true,
        minlength: [4, 'The end point should be at least 4 characters long!']
    },
    date:{
        type: String,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    carImage:{
        type: String,
        required: true,
        validate: {validator: (value) => URL_PATTERN.test(value), message: 'Image URL is not valid.'}
    },
    carBrand:{
        type: String,
        required: true,
        minlength: [4, 'Car brand should be at least 4 characters long!']
    },
    seats:{
        type: Number,
        required: true,
        min: [0, 'Seats should be between 0 and 4!'],
        max: [4, 'Seats should be between 0 and 4!']
    },
    price:{
        type: Number,
        required: true,
        min: [1, 'Price should be between 1 and 50!'],
        max: [50, 'Price should be between 1 and 50!']
    },
    description:{
        type: String,
        required: true,
        minlength: [10, 'Description should be at least 10 characters long!']
    },
    owner:{
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    buddies:{
        type: [Types.ObjectId],
        default: [],
        ref: 'User'
    }
});

const Trip = model('Trip', tripSchema);
module.exports = Trip;