module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

// Version alternative avec gestion d'erreur plus détaillée
/*
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(err => {
      console.error(`Async error caught: ${err.message}`);
      next(err);
    });
  };
};
*/