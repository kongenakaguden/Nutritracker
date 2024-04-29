// setUser.js
function setUser(req, res, next) {
    if (req.session.user) {
      req.user = req.session.user;
    }
    next();
  }
  
  module.exports = setUser;
  