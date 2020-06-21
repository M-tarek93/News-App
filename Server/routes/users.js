const router = require('express').Router();
const user_model = require('../models/users');


router.post('/', async (req, res, next) => {

    try {
        const { fullName, email, password } = req.body;
        const user = await user_model.create({
            fullName,
            email: email.toLowerCase(),
            password,
        })
        res.json(user);
    } catch (e){
        if (e.code === 11000) res.status(421).json(e)
        else if (e.name === 'ValidationError') res.status(422).json(e);
        else res.status(500).send("Internal server error while registering");
    }

})

module.exports = router;