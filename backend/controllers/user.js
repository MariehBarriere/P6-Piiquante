//importer bcrypt et on le require pour hasher mot de passe
const bcrypt = require('bcrypt')
//importer jsonwebtoken pour créer et vérifier des tokens
const jwt = require('jsonwebtoken');

//enregistrer et lire new user dans middleware
const User = require('../models/User')

//signup pour création de news users dans database à partir de l'inscript°frontend
exports.signup = (req, res, next) => {
  console.log(req.body.password);
  //recupérer le hash, l'enregistrer dans un nouvel user, enregistrer le hash en mot de passe
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        //enregistrer le user dans database
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

  //Connexion d'user existant: middleware fonct° login
  exports.login = (req, res, next) => {
    //récupérer le user de database
    User.findOne({ email: req.body.email })
      .then(user => {
        //si email incorrect: pas de user
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        //si user, comparer password sent par user qui veut se connecter: hash du user dans database
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
             //si compare ok, utiliser fonct° 'sign' pour encoder un new token contenant un payload (données encodées dans le token): clé secrète temporaire
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                  { userId: user._id },
                  'RANDOM_TOKEN_SECRET',
                  { expiresIn: '24h' }
                )
              });
            })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };