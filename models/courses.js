const mongoose = require('mongoose');

const schema = mongoose.Schema;

const courseSchema = new schema({
    courseTitle: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    }
    
});

module.exports = mongoose.model('course', courseSchema);