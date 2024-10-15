const mongoose = require('mongoose');



const ratingSchema = mongoose.Schema({

    userId: { type: String, required: true },

    grade: { type: Number, required: true }

});



const bookSchema = mongoose.Schema({

    userId : { type: String, required: true },

    title: { type: String, required: true },

    author: { type: String, required: true },

    description: { type: String, required: true },

    imageUrl: { type: String, required: true },

    rating: { type: [ratingSchema], required: true },

    averageRating: { type: Number, required: true }

});



module.exports = mongoose.model('Books', bookSchema);
module.exports = mongoose.model('Rating', ratingSchema);