const {Schema, model, Types} = require('mongoose');
const URL_PATTERN = /^https?:\/\/.+$/i;

const housingSchema = new Schema({
    name:{
        type: String,
        required: true,
        minlength: [6, 'The name should be at least 6 characters long.']
    },
    type:{
        type: String,
        enum: ['Appartment', 'Villa', 'House', 'Other'],
        default: 'Other',
        required: true,

    },
    year:{
        type: Number,
        required: true,
        min: [1850, 'The year should be between 1850 and 2021.'],
        max: [2021, 'The year should be between 1850 and 2021.']
    },
    city:{
        type: String,
        required: true,
        minlength: [4, 'The city should be at least 4 characters long.']
    },
    homeImage:{
        type: String,
        required: true,
        validate: {validator: (value) => URL_PATTERN.test(value), message: 'Image URL is not valid.'}
    },
    propertyDescription:{
        type: String,
        required: true,
        maxlength: [60, 'Property description should be less than 60 characters long.']
    },
    availablePieces:{
        type: Number,
        required: true,
        min: [0, 'Available pieces should be between 0 and 10.'],
        max: [10, 'Available pieces should be between 0 and 10.']
    },
    rentees:{
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

const Housing = model('Housing', housingSchema);
module.exports = Housing;