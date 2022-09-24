const express = require('express');
const { check } = require('express-validator/check');
const passport = require('passport');
const googleAuth = require('../middleware/auth-google');
const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

//GET /auth/signup
router.get('/signup', authController.getSignup);

//POST/  /auth/signup
router.post('/signup', check('email').isEmail() , authController.postSignup);

//GET
router.get('/signin', authController.getSignin);

//POST  /auth/signin
router.post('/signin', authController.postSignin);

//Google Authentication
router.get('/google', googleAuth,
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get('/failure', (req, res) => {
    res.send('Something went wrong');
});

module.exports = router;








// [
//     body('email')
//     .isEmail()
//     .withMessage('please enter a valid email')
//     .custom((value, { req }) => {
//         return User.findOne({email: value}).then(userDoc => {
//             if (userDoc) {
//                 return Promise.reject('E-mail address already exists!')
//             }
//         });
//     })
//     .normalizeEmail(),
//     body()
// ]