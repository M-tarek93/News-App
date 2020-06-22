const router = require('express').Router();
const user_model = require('../models/users');


// User registeration route
router.post('/', async (req, res, next) => {
    try {
        // Extracting user data from the body 
        const { fullName, email, password } = req.body;
        // Creating the user with the provided data
        await user_model.create({
            fullName,
            email: email.toLowerCase(),
            password,
        })
        // Sending a success response
        res.sendStatus(200);
    } catch (e){
        // if email is already exist, Sending an error code of 421
        if (e.code === 11000) res.status(421).json(e);
        // if other validation rules error, Sending an error code of 422 
        else if (e.name === 'ValidationError') res.sendStatus(422);
        // if internal server error send a server-error response
        else res.status(500).send("Internal server error");
    }
})

module.exports = router;