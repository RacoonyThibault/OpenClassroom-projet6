const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({

    userId : { type: String, required: true },

    title: { type: String, required: true },

    author: { type: String, required: true },

    genre : { type: String, required: true },

    year: { type: Number, required: true },

    imageUrl: { type: String, required: true },

    ratings: [new mongoose.Schema({userId: String,
    grade: Number}, { _id: false })
    ],

    averageRating: { type: Number, required: true }

});



module.exports = mongoose.model('Books', bookSchema);
