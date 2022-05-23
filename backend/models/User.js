// importer mongoose
const mongoose = require('mongoose');

//mongoose-unique-validator appliqué au shéma = 1user=1pswd 
const uniqueValidator = require('mongoose-unique-validator');

//ajouter 'unique: true' pour que d'autres users n'utilisent la même adresse
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//ajouter le validateur comme plugin au schema avant d'en faire un modèle
userSchema.plugin(uniqueValidator);

//exporter ce schéma sous forme de modèle
module.exports = mongoose.model('User', userSchema);
