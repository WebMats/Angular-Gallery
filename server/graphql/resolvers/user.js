const admin = require('firebase-admin')
const User = require('mongoose').model('User');
const Post = require('mongoose').model('Post');
const { normalizePost } = require('./shared');
const Paginator = require('./utils')
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
    },
    posts: async ({ pageSize = 5, after, next = true }) => {
        try {
            const fetchedPosts = await Post.find();
            if (!fetchedPosts[0]) {
                return {posts: [], cursor: 0, page: 0, total: 0}
            }
            const paginator = new Paginator(fetchedPosts, after, pageSize)
            let paginatedPosts = []
            if (!next) {
                paginator.setCursorToPrevPage();
            }
            paginatedPosts = paginator.next()
            return {
                posts: paginatedPosts.map(normalizePost),
                cursor: paginator.getCursor(),
                page: paginator.getPage(),
                total: paginator.getLength()
            };
        } catch (err) {
            console.log(err);
        }
    },
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