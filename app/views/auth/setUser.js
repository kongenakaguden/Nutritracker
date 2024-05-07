// setUser.js
function setUser(req, res, next) {
  if (req.session && req.session.user) {
      req.user = req.session.user;
      console.log('User set in req.user:', req.user);
  }
  next();
}
  
  module.exports = setUser;
  