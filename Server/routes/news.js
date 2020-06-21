const router = require('express').Router();
const userModel = require('../models/users');
const authenticated = require('../middleware/authorization').authenticated();
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

router.get('/sources', authenticated, async (req, res, next) => {
    try {
        const response = await newsapi.v2.sources();
        res.send(response.sources);
    } catch {
        res.status(500).send("Internal server error while getting resources");
    }
})

const handleSubscription = (subscribe) => {
    return async(req, res) => {
        const { id } = req.params
        const conditions = { 
            _id : req.user._id, 
            sources : subscribe ? { $ne: id } : { $eq: id } 
        }
        const updateStatement = subscribe ? {$push: { sources: id }} : {$pull: { sources: id }};
        const options = { new: true }

        try {
            const user = await userModel.findOneAndUpdate(conditions, updateStatement, options);
            user ? res.status(200).send(user.sources) : res.send('already done');
        } catch {
            res.status(500).send("Internal server error while subscribing/unsubscribing");
        }
    }
}

router.get('/subscribe/:id', authenticated, handleSubscription(true));

router.get('/unsubscribe/:id', authenticated, handleSubscription(false));

router.get('/stream', authenticated, async (req, res, next) => {
    try {
        const user = await userModel.findOne({_id:req.user._id});
        const response = await newsapi.v2.everything({ sources: user.sources.toString()});
        res.send(response.articles);
    } catch {
        res.status(500).send("Internal server error while getting articles stream");
    }
})

module.exports = router;