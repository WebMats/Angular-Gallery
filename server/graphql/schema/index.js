const { buildSchema } = require('graphql');


module.exports = buildSchema(`
    type User {
        mongoId: ID!
        firebaseId: String!
        email: String!
    }
    input SignInput {
        firebaseId: String!
        email: String!
        token: String!
    }
    type RootQuery {
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