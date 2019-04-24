const router = require('express').Router();
const Post = require('mongoose').model('Post');

router.get('/', (req, res, next) => {
    const posts = [
          { id: "rand1", title: 'First Post Title', content: 'First Post Content' },
          { id: "rand2", title: 'Second Post Title', content: 'Second Post Content' },
          { id: "rand3", title: 'Third Post Title', content: 'Third Post Content' }
        ]
    res.status(200).json(posts);
})

router.post('/', async (req, res, next) => {
    const { title, content } = req.body;
    if ( !title || !content ) {
        return res.status(404).json({ message: "Please include both title and content for a new post" })
    }
    try {
        const post = new Post({ title, content })
        await post.save();
        res.status(200).json({ message: "New Post created" })
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
})

module.exports = router;