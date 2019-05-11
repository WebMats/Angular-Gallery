const { Schema, ...mongoose } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userModel = new Schema({
    firebaseId: { type: String, required: true, unique: true },
    email: { type: String, required: true }
})

userModel.plugin(uniqueValidator)

mongoose.model('User', userModel);