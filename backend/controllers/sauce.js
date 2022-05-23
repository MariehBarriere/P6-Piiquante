//Importer le modèle de la sauce
const Sauce = require('../models/Sauce');

//importer le package fs de node pour avoir accès aux différentes opérations liées au système de fichiers
const fs = require('fs');

//Ajouter une sauce: POST
exports.createSauce = (req, res, next) => {
  console.log(req.body.sauce);
  //récupérer le champs de la requête en le transformant en objet
    const sauceObject = JSON.parse(req.body.sauce);
     //créer une nouvelle instance de sauce
    const sauce = new Sauce({
      ...sauceObject,
      //générer l'url de l'image: http /https + nom d'hôte + nom du fichier
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
      likes: 0, dislikes: 0
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
  };

  //Modifier une sauce: PUT avec la méthode updateOne
  exports.modifySauce = (req, res, next) => {
    //Opérateur terniaire pour vérifier s'il existe un fichier image
    const sauceObject = req.file ?
      {
        //si il y a un fichier, on récupère la chaîne de caractère et on la parse en objet js
        ...JSON.parse(req.body.sauce),
        //modifier l'image url
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      //sinon on prend le corps de la requête, on utilise le paramètre id pour trouver la sauce et la modifier avec le même _id
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
  };
  
  //Supprimer une sauce si sauce.userId est l'auteur de la requête
  exports.deleteSauce = (req, res, next) => {
     //recherche la sauce
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        //récupérer le nom du fichier grâce à l'url de l'image
        const filename = sauce.imageUrl.split('/images/')[1];
         //supprimer le fichier avec fs.unlink
        fs.unlink(`images/${filename}`, () => {
          //quand fichier supprimé, on supprime l'ojet de la base de données
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

//Recupérer une seule sauce avec la méthode findOne : GET
  exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

//Récupérer toutes les sauces avec la méthode find :GET
exports.getAllSauce = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};


//---------------- export du middleware et fonction likeSauce----------

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then(sauces => {

     // Selon la valeur recue pour 'like' dans la requête :
     switch (req.body.like) {
      //Si 1 dislike :
     case -1:
          Sauce.updateOne({ _id: req.params.id }, {
              $inc: {dislikes:1},
              $push: {usersDisliked: req.body.userId},
          })
              .then(() => res.status(201).json({ message: 'Dislike ajouté !'}))
              .catch( error => res.status(400).json({ error }));
          break;
      
      // -1 like ou -1 dislike :
      case 0:
          //case -1 like :
          if (sauces.usersLiked.find(user => user === req.body.userId)) {
              Sauce.updateOne({ _id : req.params.id }, {
                  $inc: {likes:-1},
                  $pull: {usersLiked: req.body.userId}
              })
                  .then(() => res.status(201).json({message: ' Like retiré !'}))
                  .catch( error => res.status(400).json({ error }));
          }

          //case -1 dislike :
          if (sauces.usersDisliked.find(user => user === req.body.userId)) {
              Sauce.updateOne({ _id : req.params.id }, {
                  $inc: {dislikes:-1},
                  $pull: {usersDisliked: req.body.userId}
              })
                  .then(() => res.status(201).json({message: ' Dislike retiré !'}))
                  .catch( error => res.status(400).json({ error }));
          }
          break;
      
      // +1 Like :
      case 1:
          Sauce.updateOne({ _id: req.params.id }, {
            //incrémenter le champs 'likes'
            $inc: { likes:1},
              $push: { usersLiked: req.body.userId}
          })
              .then(() => res.status(201).json({ message: 'Like ajouté !'}))
              .catch( error => res.status(400).json({ error }));
          break;
      default:
          return res.status(500).json({ error });
        }
})
.catch(error => res.status(500).json({ error }));
};

