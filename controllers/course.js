const Course = require('../models/courses');

exports.getCourses = (req, res, next) => {
   
    Course.find()
    .then( data => {
        res.render('learn', {
            pageTitle: 'Learn to Code',
            courseData: data
        });
    })
    .catch(err => {
        console.log(err);
    })
    // res.render('/learn');
}