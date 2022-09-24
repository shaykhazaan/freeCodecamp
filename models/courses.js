const mongoose = require('mongoose');

const schema = mongoose.Schema;

const courseSchema = new schema({
    Title: {
        type: String,
        required: true
    },
    Duration: {
        type: String,
        required: true
    }
    
});

module.exports = mongoose.model('course', courseSchema);