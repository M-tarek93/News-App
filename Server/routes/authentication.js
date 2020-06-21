const router = require('express').Router();
const UserModel = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticated = require('../middleware/authorization').authenticated();



const login = async (req, res) => {
    const { body: { email, password } } = req;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).send('No user was found with this email');
        if (await bcrypt.compare(password, user.password)){
            const accessToken = generateAccessToken(user);
            const accessTokenP1 = accessToken.split('.').slice(0,2).join('.');
            const accessTokenP2 = accessToken.split(".")[2];
            res.cookie('accessTokenP1',accessTokenP1,{secure: false, sameSite: true, expires: new Date(Date.now() + 31536000000)});
            res.cookie('accessTokenP2',accessTokenP2,{secure: false, httpOnly: true, expires: new Date(Date.now() + 31536000000)});
            res.status(200).send(user.sources);
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch {
        res.status(500).send('Internal server error');
    }
}

const generateAccessToken = (userData) => {
    const {password,__v,email,fullName,...user} = userData._doc 
    return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
}


const logout = async (req, res) => {
    res.clearCookie('accessTokenP1');
    res.clearCookie('accessTokenP2');
    res.sendStatus(200)
}


router.post('/login', login);
router.post('/logout', logout);
router.get('/checkAuth', authenticated, async (req, res, next) => {
    req.user ? res.sendStatus(200) : res.sendStatus(443);
})

module.exports = router;