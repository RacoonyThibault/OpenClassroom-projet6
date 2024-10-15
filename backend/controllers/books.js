const Books = require('../models/books');
const rating = require('../models/books');
const fs = require('fs');

exports.getAllBooks = (req, res, next) => {
    Books.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    const book = new Books({
        ...bookObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    book.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
    Books.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ?
    {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Books.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
    Books.findOne({ _id: req.params.id })
    .then(book => {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Books.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.rateBook = (req, res, next) => {
    Books.findOne({ _id: req.params.id })
    .then(book => {
        const rating = req.body.rating;
        const userId = req.body.userId;
        const grade = req.body.grade;
        const averageRating = book.averageRating;
        const ratingObject = { userId, grade };
        book.rating.push(ratingObject);
        let sum = 0;
        book.rating.forEach(element => {
            sum += element.grade;
        });
        book.averageRating = sum / book.rating.length;
        book.save()
        .then(() => res.status(201).json({ message: 'Note enregistrée !'}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.deleteRating = (req, res, next) => {
    Books.findOne({ _id: req.params.id })
    .then(book => {
        const userId = req.body.userId;
        const grade = req.body.grade;
        const ratingObject = { userId, grade };
        const index = book.rating.findIndex(element => element.userId === userId);
        book.rating.splice(index, 1);
        let sum = 0;
        book.rating.forEach(element => {
            sum += element.grade;
        });
        book.averageRating = sum / book.rating.length;
        book.save()
        .then(() => res.status(200).json({ message: 'Note supprimée !'}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getRating = (req, res, next) => {
    Books.findOne({ _id: req.params.id })
    .then(book => {
        const userId = req.body.userId;
        const rating = book.rating.find(element => element.userId === userId);
        res.status(200).json(rating);
    })
    .catch(error => res.status(404).json({ error }));
};

exports.getAllRatings = (req, res, next) => {
    Books.findOne({ _id: req.params.id })
    .then(book => {
        res.status(200).json(book.rating);
    })
    .catch(error => res.status(404).json({ error }));
};

exports.getAverageRating = (req, res, next) => {
    Books.findOne({ _id: req.params.id })
    .then(book => {
        res.status(200).json(book.averageRating);
    })
    .catch(error => res.status(404).json({ error }));
};
