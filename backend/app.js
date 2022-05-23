//importer express pour simplifier la création de l'API
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://mhb_LA:MooGo2022@cluster0.tzkdt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use(helmet());

//attribuer un middleware à une route spécifique de votre application avec app.use
app.use((req, res, next) => {
  //accéder à notre API depuis n'importe quelle origine ( '*' )
    res.setHeader('Access-Control-Allow-Origin', '*');
  //ajouter les headers mentionnés aux requêtes envoyées vers notre API  
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  //envoyer des requêtes avec les méthodes mentionnées
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  //body-parser est un morceau de middleware express qui lit l'entrée d'un formulaire et le stocke en js
  app.use(bodyParser.json());

  app.use('/images', express.static(path.join(__dirname, 'images')));

 app.use('/api/sauces', sauceRoutes);
 app.use('/api/auth', userRoutes);

 //exporter notre application 'app'
module.exports = app;

