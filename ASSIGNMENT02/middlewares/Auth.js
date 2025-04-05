const isAuthenticated = (req, res, next) => {
  console.log('Estado autenticado:', req.isAuthenticated());
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = isAuthenticated;