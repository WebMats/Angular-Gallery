const { buildSchema } = require('graphql');


module.exports = buildSchema(`
    type Post {
        id: String!
        title: String!
        content: String!
        imageURL: String!
    }
    input PostInput {
        title: String!
        content: String!
        imageURL: String!
    }
    type RootQuery {
        posts: [Post!]
        post(id: String!): Post!
    }
    type RootMutation {
        createPost(postInput: PostInput!): String!
        deletePost(postId: String!): String!
        updatePost(postId: String, updateInput: PostInput): Post!
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)