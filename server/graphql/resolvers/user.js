const admin = require('firebase-admin')
const User = require('mongoose').model('User');
admin.initializeApp();

const normalizeUser = (user) => ({
    mongoId: user.id,
    firebaseId: user.firebaseId,
    email: user.email
})

module.exports = {
    signup: async ({ signupInput }) => {
        if (await isFirebaseToken(signupInput.token, signupInput.firebaseId)) {
            const registerUser = new User({
                firebaseId: signupInput.firebaseId,
                email: signupInput.email
                })
            try {
                const registeredUser = await registerUser.save();
                return normalizeUser(registeredUser);
            } catch (err) {
                console.log(err);
                return err;
            }
        } else {
            return new Error('You are not authenticated')
        }
    },
    signin: async ({ signinInput }) => {
        if (await isFirebaseToken(signinInput.token, signinInput.firebaseId)) {
            const fetchedUser = await User.findOne({ firebaseId: signinInput.firebaseId })
            return normalizeUser(fetchedUser);
        } else {
            return new Error('You are not authenticated')
        }
    }
}

function isFirebaseToken(token, firebaseId) {
    if (!token || !firebaseId) {
        return false
    }
    return admin.auth().verifyIdToken(token).then(decodedToken => {
        return decodedToken.user_id === firebaseId
    }).catch((err) => {
        console.log(err)
        return false
    });
}