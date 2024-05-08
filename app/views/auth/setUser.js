// setUser.js

// Middleware-funktion til at tilføje brugeroplysninger til anmodningen, hvis de findes i sessionen
function setUser(req, res, next) {
  // Kontrollerer, om sessionen og brugeroplysninger er tilgængelige
  if (req.session && req.session.user) {
    // Tilføjer brugeroplysninger fra sessionen til `req`-objektet
    req.user = req.session.user;
    // Logger brugeroplysningerne til debugging-formål
    console.log('User set in req.user:', req.user);
  }
  
  // Fortsætter til næste middleware-funktion eller rutehåndterer
  next();
}

// Eksporterer `setUser`-funktionen, så den kan bruges i andre moduler
module.exports = setUser;