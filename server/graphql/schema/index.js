const { buildSchema } = require('graphql');


module.exports = buildSchema(`
    type Post {
        id: String!
        title: String!
        content: String!
    }
    type RootQuery {
        posts: [Post!]
    }
    input PostInput {
        title: String!
        content: String!
    }
    type RootMutation {
        createPost(postInput: PostInput!): String!
        deletePost(postId: String!): String!
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)