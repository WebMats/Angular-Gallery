export const signUpGQL = (email, firebaseId, token) => (`
    mutation SignUp {
        signup(signupInput: { email: "${email}", firebaseId: "${firebaseId}", token: "${token}" }) {
            firebaseId
            email
            mongoId
        }
    }
`)

export const signInGQL = (email, firebaseId, token) => (`
    query SignIn {
        signin(signinInput: { email: "${email}", firebaseId: "${firebaseId}", token: "${token}" }) {
            firebaseId
            email
            mongoId
        }
    }
`)