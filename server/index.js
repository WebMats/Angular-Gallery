const express = require('express');
const server = express();
const helmet = require('helmet');
const mongoose = require('mongoose');
const graphqlHttp = require('express-graphql');


server.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
})
server.use(helmet());
server.use(express.json());

// MONGOOSE MODELS
require('./models/post');
require('./models/user');

// MIDDLEWARES
const authorization = require('./middleware/authorization');

// GRAPHQL
const resolvers = require('./graphql/resolvers');
const schema = require('./graphql/schema');

const protectedSchema = require('./graphql/schema/protected');
const protectedResolvers = require('./graphql/resolvers/protected');
server.use('/graphql', graphqlHttp({
    schema,
    rootValue: resolvers,
    graphiql: true,
}))
server.use('/protected', authorization, graphqlHttp({
    schema: protectedSchema,
    rootValue: protectedResolvers,
    graphiql: true
}))

// MONGODB
mongoose.connect(`mongodb+srv://${process.env.ATLAS_USER}:${process.env.MONGODB_ATLAS_PW}@cluster0-b3gd5.mongodb.net/${process.env.MONGODB_ATLAS_DB}?retryWrites=true`,{ useNewUrlParser: true, useCreateIndex: true }).then((_) => {
    console.log('Connection to MongoDB was successful');
}).catch((err) => {
    console.log(err);
});
const PORT = process.env.PORT || '5000';
server.listen(PORT, () => {console.log(`Listening on port ${PORT}....`)});