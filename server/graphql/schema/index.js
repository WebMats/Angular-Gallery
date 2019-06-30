const { buildSchema } = require('graphql');


module.exports = buildSchema(`
    type User {
        mongoId: ID!
        firebaseId: String!
        email: String!
    }
    type Post {
        id: String!
        title: String!
        content: String!
        imageURL: String!
        creator: ID!
    }
    type PaginatedPosts {
        posts: [Post!]
        cursor: String
        page: Int!
        total: Int!
    }
    input SignInput {
        firebaseId: String!
        email: String!
        token: String!
    }
    type RootQuery {
        posts(pageSize: Int, after: String, next: Boolean): PaginatedPosts!
        signin(signinInput: SignInput): User!
    }
    type RootMutation {
        signup(signupInput: SignInput!): User!
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)