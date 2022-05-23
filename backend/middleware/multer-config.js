//importer multer
const multer = require('multer');

// dictionnaire d'extensions à traduire
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//objet de configuration de multer: comprend 2 éléments : destination, et filename
const storage = multer.diskStorage({
  //indiquer la destination des fichiers sauvegardés
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  //indiquer à multer le nom de fichier à utiliser
  filename: (req, file, callback) => {
    // génèrer nom du fichier, éliminer les espaces avec split et join
    const name = file.originalname.split(' ').join('_');
     //créer l'extention du fichier
    const extension = MIME_TYPES[file.mimetype];
     //  génèrer un nom, ajout d'un time-stamp et extension
    callback(null, name + Date.now() + '.' + extension);
  }
});

/* exportr le middleware multer configuré en passant l'objet storage, 
avec single pour un fichier image unique */
module.exports = multer({storage}).single('image');