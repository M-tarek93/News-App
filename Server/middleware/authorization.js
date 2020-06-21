const jwt = require('jsonwebtoken');

const authenticated = () => {
    return (req, res, next) => {
        if (req.cookies.accessTokenP1) {
            let token = req.cookies.accessTokenP1 + "." + req.cookies.accessTokenP2;
            verifyToken(token, req, res, next);
        } else {
            // no token was provided
            res.sendStatus(401);
        }
    }
}

const verifyToken = (token, req, res, next) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userData) => {
        // token expired or not valid
        if (err) res.sendStatus(402);
        req.user = userData.user;
        next();
    });
}

module.exports = {
    authenticated
}