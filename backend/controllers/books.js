const Books = require('../models/books');


exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    const book = new Books({
        ...bookObject,
        imageUrl: req.file.path
    });
    console.log(book);
    book.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
    Books.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
    Books.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
}

exports.deleteBook = (req, res, next) => { 
    Books.findOne({ _id: req.params.id })
    .then(book => {
        if (req.auth.userId !== book.userId) {
            return res.status(403).json({ message: 'Action non autorisée !'});
        }
    Books.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }))
})};

exports.modifyBook = (req, res, next) => {
    Books.findOne({ _id: req.params.id })
    .then(book => {
        if (req.auth.userId !== book.userId) {
            return res.status(403).json({ message: 'Action non autorisée !'});
        }
        const bookObject = JSON.parse(req.body.book);
        Books.updateOne({ _id: req.params.id }, {...bookObject,imageUrl: req.file.path, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
    })};

    exports.rateBook = (req, res, next) => {
        Books.findOne({_id: req.params.id})
        .then(book => {
            if (book.ratings.find(rating => rating.userId === req.auth.userId)) {
                return res.status(403).json({ message: 'Action non autorisée !'});
            }
            const ratingObject = book.ratings;
            ratingObject.push({userId: req.body.userId, grade: req.body.rating});
            const newAverageRating = ratingObject.reduce((acc, rating) => acc + rating.grade, 0) / ratingObject.length
            Books.updateOne({ _id: req.params.id }, {
            ratings: ratingObject,
            averageRating: newAverageRating})
                .then(() => { 
                    Books.findOne({_id: req.params.id}).then(book => res.status(200).json(book))
                }).catch(error => res.status(400).json({ error }))
            })};