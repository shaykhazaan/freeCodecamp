const express = require('express');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const PORT = process.env.PORT || 3000;

const isAuth = require('./middleware/is-auth');

const authRoutes = require('./routes/auth');
//const txnController = require('./controllers/transaction');
const courseController = require('./controllers/course');


const passport = require('passport');
const { cookie } = require('express-validator');
require('./middleware/auth-google');

const app = express();

app.use(cookieParser());
app.use(session({secret: 'secretkey'}));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.set('views', 'views');

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'includes')));

//To prevent the cors errors when accessed through different means.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'content-type, Authorization');
  next();
  
});

app.use('/auth', authRoutes);

app.get('/', (req, res, next) => {
  res.render('index', {pageTitle: 'freeCodeCamp'});
});

app.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/protected',
        failureRedirect: '/auth/failure'
    })
);

app.get('/learn', courseController.getCourses);

app.get('/protected', isAuth,  (req, res, next) => {
  res.send(`Hello <b><i></i></b><br><h2>This is a jwt authenticated page.</h2>`);
  // console.log(req.user);
});

app.get('/logout', (req, res) => {
  
  res.clearCookie('jwt');
  // res.clearCookie('connect.sid');
  //delete req.user['jwt'];
  res.send('Logged Out!');
  
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({message: message});
});


mongoose
  .connect(
    'mongodb+srv://dbUser:dbUser@cluster0.phflj.mongodb.net/freeCodecamp?retryWrites=true', { useNewUrlParser: true }
  )
  .then(result => {
   
    app.listen(3000, ()=> {
        console.log(`App listening on port 3000 \n db connected`);
    });
  })
  .catch(err => {
    console.log(err);
  });