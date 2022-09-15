const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

module.exports = (req, res, next) => {

  const GOOGLE_CLIENT_ID = '900707419893-iej4d6ap24tgjgc6d3ffqbf7r1s64a9a.apps.googleusercontent.com';
  const GOOGLE_CLIENT_SECRET = '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';
  
  passport.use(new GoogleStrategy({
      clientID:     GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/google/callback",
      passReqToCallback   : true
    },
    function(request, accessToken, refreshToken, profile, done) {
        
        return done(null, profile);
      
    }
  ));

  passport.serializeUser(function(user, done){
    
    done(null, user);
    
  });

  passport.deserializeUser(function(user, done){
    user.jwt = jwt.sign(
      {
        email: user.email, 
        userId: user.id
      }, 
      'accessTokenKey', 
      {expiresIn: '7d'}  //expiry of the token is 7 days
    );
    
    
    done(null, user);
  });

  next();

}