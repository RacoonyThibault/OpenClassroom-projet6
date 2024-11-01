const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.replace(/[^a-zA-Z0-9.]/g, '').split('.')[0];
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + "_"+ Date.now() + '.' + extension);
    }
});

module.exports = multer({storage: storage}).single('image');

module.exports.resizeImage = async (req, res, next) => {
    if (!req.file) {
      return next();
    }
  
    const filePath = req.file.path;
    const fileName = req.file.filename;
    const outputFilePath = path.join('images', `resized_${fileName}`);

      try {
        sharp(filePath)
      .resize({ width: 206, height: 260 })
      .toFile(outputFilePath)
      .then(() => {
        sharp.cache(false);

        fs.unlink(filePath, (err) => {
          if (err) {
              console.error(err);
              return next(err);
          }

          req.file.path = outputFilePath;
          next();
        });
      })
      .catch(err => {
        console.log(err);
        return next();
      });
  
    } catch (err) {
        console.error('An error occurred during image processing:', err);
        return next(err);
    }
  };