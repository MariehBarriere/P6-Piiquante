// importer mongoose
const mongoose = require('mongoose');

//schéma de données avec la fonct° 'schéma'qui requiert un objet
const sauceSchema = mongoose.Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  //gestion des likes et dislikes
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersLiked: { type: [String]},
  usersDisliked: { type: [String]},
  userId: { type: String, required: true },
});

//exporter le modèle terminé: nom + schéma
module.exports = mongoose.model('Sauce', sauceSchema);