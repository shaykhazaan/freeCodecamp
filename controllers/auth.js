const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getSignup = (req, res, next) => {
  res.render('auth/signup');
}

exports.postSignup = (req, res, next) => {
    const name = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    bcrypt
      .hash(password, 12)
      .then(hashedPw => {
        const user = new User({
            name: name,
            email: email,
            password: hashedPw            
        });
        return user.save();
      })
      .then(result => {
        const AccessToken = jwt.sign(
          {
            email: email,
            userId: result._id.toString()
          },
          'accessTokenKey',
        );
        const refreshToken = jwt.sign(
          {
            email: email,
            userId: result._id.toString()
          },
          'refreshTokenKey'
        );
        res.status(201).send({message: 'User Created', userId: result._id, accessToken: AccessToken, refreshToken: refreshToken })
      })
      .catch(err => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
      })

};

exports.getSignin = (req, res, next) => {
  // if (req.cookies.jwt || req.user.jwt){
  //   res.redirect('/protected');
  // }
  res.render('auth/signin');
}

exports.postSignin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({email: email})
    .then(user => {
        if (!user) {
            const error = new Error('A user with this email does not exist');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
        if (!isEqual) {
            const error = new Error('wrong password');
            error.statusCode = 404;
            throw error;            
        }
        const token = jwt.sign(
          {
            email: loadedUser.email, 
            userId: loadedUser._id.toString()
          }, 
          'accessTokenKey', 
          {expiresIn: '7d'}  //expiry of the token is 7 days
        );
        const refreshToken = jwt.sign(
          {
            email: loadedUser.email,
            userId: loadedUser._id.toString()
          },
          'refreshTokenKey',
          { expiresIn: '5m'}  //expiry of the token is 5 minutes
        );
        
        res.cookie('jwt',token);
        res.status(200).redirect('/protected');
        
        //.send({message: 'logged in successfully', accessToken: token, refreshToken: refreshToken});
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
    
};
