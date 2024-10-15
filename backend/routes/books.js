const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/books');
const auth = require('../middleware/auth');

router.get('/', bookCtrl.getAllBooks);
router.post('/',auth, bookCtrl.createBook);
router.get('/:id', bookCtrl.getOneBook);
router.put('/:id',auth, bookCtrl.modifyBook);
router.delete('/:id',auth, bookCtrl.deleteBook);

module.exports = router;