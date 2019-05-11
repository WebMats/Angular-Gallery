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
        // if (false) {
        //     console.log('if TRUE')
        // }
        const post = new Post({ 
            title: postInput.title, 
            content: postInput.content, 
            imageURL: postInput.imageURL 
        });
        try {
            const savedPost = await post.save();
            return savedPost.id
        } catch (err) {
            console.log(err)
        }
    },
    updatePost: async ({ postId, updateInput }) => {
        const updatedPost = new Post({ _id: postId, ...updateInput });
        try {
            await Post.updateOne({ _id: postId }, updatedPost)
            return normalizePost(updatedPost);
        } catch (err) {
            console.log(err)
        }
    },
    deletePost: async ({ postId }) => {
        try {
            await Post.deleteOne({ _id: postId });
            return 'Deleted'
        } catch (err) {
            console.log(err);
        }
    }
}
