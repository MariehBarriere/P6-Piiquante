const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  console.log(req.body.sauce);
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
      likes: 0, dislikes: 0
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
  };

  exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
  };
  
  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

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

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then(sauces => {

     // Selon la valeur recue pour 'like' dans la requête :
     switch (req.body.like) {
      //Si +1 dislike :
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

