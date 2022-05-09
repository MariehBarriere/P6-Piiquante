const mongoose = require('mongoose');
//mongoose-unique-validator appliqué au shéma = 1user=1pswd 
const uniqueValidator = require('mongoose-unique-validator');
//on ajoute unique: true pour éviter que d'autres users utilisent la même adresse
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);