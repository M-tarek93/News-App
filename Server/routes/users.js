const router = require('express').Router();
const user_model = require('../models/users');


router.post('/', async (req, res, next) => {

    try {
        const { fullName, email, password } = req.body;
        const user = await user_model.create({
            fullName,
            email,
            password,
        })
        res.json(user);
    } catch {
        res.status(500).send("Internal server error while registering");
    }

})

module.exports = router;