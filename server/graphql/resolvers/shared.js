module.exports.normalizePost = (post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    imageURL: post.imageURL
})