const express = require('express');
const server = express();
const helmet = require('helmet');
const mongoose = require('mongoose');


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

// MONGOOSE MODELS
require('./models/post');

// ROUTES
const postsRoutes = require('./routes/posts');

server.use('/api/posts', postsRoutes);

// MONGODB
mongoose.connect(`mongodb+srv://${process.env.ATLAS_USER}:${process.env.MONGODB_ATLAS_PW}@cluster0-b3gd5.mongodb.net/
${process.env.MONGODB_ATLAS_DB}?retryWrites=true`,{ useNewUrlParser: true }).then((_) => {
    console.log('Connection to MongoDB was successful');
}).catch((err) => {
    console.log(err);
});


const PORT = process.env.PORT || '5000';
server.listen(PORT, () => {console.log(`Listening on port ${PORT}....`)});