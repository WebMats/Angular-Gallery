const { Schema, ...mongoose } = require('mongoose');

const postSchema = Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }
});

mongoose.model('Post', postSchema);