const {Schema, model, Types} = require('mongoose');
const URL_PATTERN = /^https?:\/\/.+$/i;

// minlength: [10, '']
// maxlength: [10, '']
// min: [0, '']
// max: [10, '']
// validate: {validator: (value) => URL_PATTERN.test(value), message: 'Image URL is not vlaid.'}
// list:{
//     type: [Types.ObjectId],
//     default: [],
//     ref: 'User'
// }
// owner:{
//     type: Types.ObjectId,
//     ref: 'User',
//     required: true
// }

const modelSchema = new Schema({

});

const Model = model('Model', modelSchema);
module.exports = Model;