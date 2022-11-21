const {Schema, model, Types} = require('mongoose');
const URL_PATTERN = /^https?:\/\/.+$/i;

const bookSchema = new Schema({
    title:{
        type: String,
        required: true,
        minlength: [2, 'Title should be at least 2 characters long!']
    },
    author:{
        type: String,
        required: true,
        minlength: [5, 'Author\'s name should be at least 5 characters long!']
    },
    image:{
        type: String,
        required: true,
        validate: {validator: (value) => URL_PATTERN.test(value), message: 'Image URL is not valid!'}
    },
    bookreview:{
        type: String,
        required: true,
        minlength: [10, 'The review should be a minimum of 10 character long!']
    },
    genre:{
        type: String,
        required: true,
        minlength: [3, 'Genre should be at least 3 characters long!']
    },
    stars:{
        type: Number,
        required: true,
        min: [1, 'Stars should be between 1 and 5!'],
        max: [5, 'Stars should be between 1 and 5!']
    },
    wishingList:{
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

const Book = model('Book', bookSchema);
module.exports = Book;