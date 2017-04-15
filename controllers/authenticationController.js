module.exports = function(app) {
    return function(req, res) {
      if (!req.isAuthenticated() & req.url != '/login')
        res.sendStatus(401);
      else
          next();
    }
}
