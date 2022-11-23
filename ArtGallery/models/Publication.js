const {Schema, model, Types} = require('mongoose');
const URL_PATTERN = /^https?:\/\/.+$/i;

const publicationSchema = new Schema({
    title:{
        type: String,
        required: true,
        minlength: [6, 'Title should be at least 6 characters long.']
    },
    paintingTechnique:{
        type: String,
        required: true,
        maxlength: [15, 'Painting technique should be less than 15 characters long.']
    },
    artPicture:{
        type: String,
        required: true,
        validate: {validator: (value) => URL_PATTERN.test(value), message: 'Image URL is not valid.'}
    },
    certificateOfAuthenticity:{
        type: String,
        enum: ['Yes', 'No'],
        default: 'No',
        required: true  
    },
    author:{
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    shares:{
        type: [Types.ObjectId],
        default: [],
        ref: 'User'
    }
});

const Publication = model('Publication', publicationSchema);
module.exports = Publication;