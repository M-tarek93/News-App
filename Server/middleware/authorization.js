const jwt = require("jsonwebtoken");

// Check if req user is authenticated
const authenticated = () => {
  return (req, res, next) => {
    // if the user have a signed cookie holding the access token
    if (req.signedCookies.accessTokenP1) {
      // Re-assemble the splitted access token
      let token =
        req.signedCookies.accessTokenP1 + "." + req.signedCookies.accessTokenP2;
      // Calling the verification method to check its validity
      verifyToken(token, req, res, next);
    } else {
      // No token was provided
      res.sendStatus(401);
    }
  };
};
// Used to verify if the token is valid
const verifyToken = (token, req, res, next) => {
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userData) => {
    // token expired or not valid
    if (err) res.sendStatus(402);
    else {
      // attaching the user instance to the req
      req.user = userData.user;
      next();
    }
  });
};

module.exports = {
  authenticated,
};
