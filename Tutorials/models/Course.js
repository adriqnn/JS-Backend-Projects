const {Schema, model, Types} = require('mongoose');
const URL_PATTERN = /^https?:\/\/.+$/i;

const courseSchema = new Schema({
    title: {
        type: String, 
        required: true, 
        unique: true,
        minlength: [4, 'The Title should be at least 4 characters long!']
    },
    description: {
        type: String, 
        required: true, 
        minlength: [20, 'Description cannot be fewer than 20 characters!'],
        maxlength: [50, 'Description cannot be longer than 50 characters!']
    },
    imageUrl: {
        type: String, 
        required: true,
        validate: {validator: (value) => URL_PATTERN.test(value), message: 'Image URL is not valid!'}
    },
    duration: {
        type: String, 
        required: true
    },
    createdAt: {
        type: String, 
        required: true
    },
    students:{
        type: [Types.ObjectId], default: [], ref: 'User',
        required: true
    },
    owner:{
        type: Types.ObjectId, ref: 'User',
        required: true
    }
});

courseSchema.index({title: 1}, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const Course = model('Course', courseSchema);
module.exports = Course;