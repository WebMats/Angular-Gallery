const Post = require('mongoose').model('Post');

const normalizePost = (post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
})

module.exports = {
    posts: async () => {
        try {
            const fetchedPosts = await Post.find();
            return fetchedPosts.map(normalizePost);
        } catch (err) {
            console.log(err);
        }
    },
    createPost: async ({ postInput }, req) => {
        // if (false) {
        //     console.log('if TRUE')
        // }
        const post = new Post({ title: postInput.title, content: postInput.content });
        try {
            const savedPost = await post.save();
            return savedPost.id
        } catch (err) {
            console.log(err)
        }
    },
    deletePost: async ({ postId }) => {
        try {
            await Post.deleteOne({ id: postId });
            return 'Deleted'
        } catch (err) {
            console.log(err);
        }
    }
}
