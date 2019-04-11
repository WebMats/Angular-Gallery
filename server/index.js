const express = require('express');
const server = express();
const helmet = require('helmet');


server.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
})
server.use(helmet());
server.use(express.json());

// ROUTES
const postsRoutes = require('./routes/posts');

server.use('/api/posts', postsRoutes);



const PORT = process.env.PORT || '5000';
server.listen(PORT, () => {console.log(`Listening on port ${PORT}....`)});