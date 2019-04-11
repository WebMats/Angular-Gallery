const router = require('express').Router();


router.get('/', (req, res, next) => {
    const posts = [
          { id: "rand1", title: 'First Post Title', content: 'First Post Content' },
          { id: "rand2", title: 'Second Post Title', content: 'Second Post Content' },
          { id: "rand3", title: 'Third Post Title', content: 'Third Post Content' }
        ]
    res.status(200).json(posts);
})

module.exports = router;