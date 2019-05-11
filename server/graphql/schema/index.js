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
    }
    input SignInput {
        firebaseId: String!
        email: String!
        token: String!
    }
    type RootQuery {
        posts: [Post!]
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