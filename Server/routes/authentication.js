const router = require('express').Router();
const UserModel = require('../models/users');
const RefreshTokens = require('../models/refreshTokens');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const login = async (req, res) => {
    const { body: { email, password } } = req;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).send('No user was found with this email');
        if (await bcrypt.compare(password, user.password)){
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user._id);
            const expAt = Math.ceil(Date.now() / 1000) + 20;
            await RefreshTokens.findOneAndUpdate({ user }, {token: refreshToken }, {upsert: true, new: true, setDefaultsOnInsert: true});
            res.status(200).json({accessToken, refreshToken, expAt});
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch {
        res.status(500).send('Internal server error');
    }
}

const generateAccessToken = (userData) => {
    const {password,__v,...user} = userData._doc 
    return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' });
}

const generateRefreshToken = (user) => {
    return jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d'});
}

const regenerateAccessToken = async (req, res) => {
    const { body: { refreshToken } } = req;
    if (!refreshToken) return res.status(402).send('No refresh token was provided');
    const token = await RefreshTokens.findOne({token: refreshToken});
    if (!token) return res.status(403).send('Not authorized');
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(401).send('Invalid token');
        UserModel.findOne({ _id: user.user }).then((user) => {
            const accessToken = generateAccessToken(user);
            const expAt = Math.ceil(Date.now() / 1000) + 20;
            res.json({ accessToken, expAt })
        });
    })
}

const getUser = (req,res,next) => {
    const { body: { token } } = req
    if (!token) return res.status(401).send('Not authorized');
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send('Not authorized');
        req.user = user;
        res.json(user)
    })
}

const logout = async (req, res) => {
    const { body: { refreshToken } } = req
    try{
        const token = await RefreshTokens.findOneAndDelete({ token: refreshToken });
        if (!token) return res.status(402).send("Token not found");
        res.sendStatus(204)
    }catch{
        res.sendStatus(500)
    }
}


router.post('/login', login);
router.post('/me', getUser);
router.post('/refresh', regenerateAccessToken);
router.post('/logout', logout);

module.exports = router;