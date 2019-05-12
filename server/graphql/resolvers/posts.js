const Post = require('mongoose').model('Post');
const { normalizePost } = require('./shared');

module.exports = {
    post: async ({ id }) => {
        try {
            const post = await Post.findById(id);
            return normalizePost(post);
        } catch (err) {
            console.log(err)
        }
    },
    createPost: async ({ postInput }, req) => {
        const post = new Post({ 
            title: postInput.title, 
            content: postInput.content, 
            imageURL: postInput.imageURL,
            creator: req.mongoID
        });
        try {
            const savedPost = await post.save();
            return savedPost.id
        } catch (err) {
            console.log(err)
        }
    },
    updatePost: async ({ postId, updateInput }, req) => {
        const updatedPost = new Post({ _id: postId, ...updateInput, creator: req.mongoID });
        try {
            await Post.updateOne({ _id: postId, creator: req.mongoID }, updatedPost)
            return normalizePost(updatedPost);
        } catch (err) {
            console.log(err)
        }
    },
    deletePost: async ({ postId }, req) => {
        try {
            await Post.deleteOne({ _id: postId, creator: req.mongoID });
            return 'Deleted'
        } catch (err) {
            console.log(err);
        }
    }
}
