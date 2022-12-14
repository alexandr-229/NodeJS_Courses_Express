const { Schema, model } = require('mongoose');

const course = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    authorName: {
        type: String,
        required: true,
    },
    authorEmail: {
        type: String,
        required: true,
    },
});

module.exports = model('Course', course);
