//importer jwt pour vérifier les tokens
const jwt = require('jsonwebtoken');

// exporter le middleware d'authentification
module.exports = (req, res, next) => {
  try {
    //récupérer le token dans le header authorization, split retourne un tableau avec bearer en 0 et token en 1
    const token = req.headers.authorization.split(' ')[1];
    //décoder le token avec verify (token, clé secrète sera plus longue avec userId)
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //récupérer le userId du token
    const userId = decodedToken.userId;
    //ajouter le userId du token à l'objet requête
    req.auth = { userId };
    // vérifier que le userId de la requête correspond à celui du token
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};