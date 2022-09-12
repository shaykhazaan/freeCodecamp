const express = require('express');
const { body } = require('express-validator/check');

const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

//GET /auth/signup
router.get('/signup', authController.getSignup);

//POST/PUT  /auth/signup
router.post('/signup', authController.postSignup);

//GET
router.get('/signin', authController.getSignin);

//POST  /auth/signin
router.post('/signin', authController.postSignin);

module.exports = router;







//Validation logic through express-validator package
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