const admin = require('firebase-admin');
const User = require('mongoose').model('User');

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    admin.auth().verifyIdToken(token).then((result) => {
        User.findOne({ firebaseId: result.user_id }).then(user => {
            if (!user) {
                res.status(401).json({error: "You are not authorized"})
            } else {
                req.mongoID = user.id;
                next();
            }
        }).catch(err => {
            console.log(err);
            res.status(401).json({error: "You are not authorized"})
        })
    }).catch((err) => {
        console.log(err)
        res.status(401).json("Do not tamper with authentication tokens")
    });
}