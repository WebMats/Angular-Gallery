const { Schema, ...mongoose } = require('mongoose');

const postSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageURL: { type: String, required: true },
});

mongoose.model('Post', postSchema);