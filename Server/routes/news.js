const router = require('express').Router();
const userModel = require('../models/users');
const authenticated = require('../middleware/authorization').authenticated();
const sourcesCache = require('../middleware/cache').checkSourcesCache();
const streamCache = require('../middleware/cache').checkStreamCache();
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
const redisClient = require('redis').createClient();

router.get('/sources', authenticated, sourcesCache, async (req, res, next) => {
    try {
        const response = await newsapi.v2.sources();
        redisClient.setex('sources', 3600, JSON.stringify(response.sources));
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

router.post('/subscribe/:id', authenticated, handleSubscription(true));

router.post('/unsubscribe/:id', authenticated, handleSubscription(false));

router.get('/stream', authenticated, streamCache, async (req, res, next) => {
    try {
        const response = await newsapi.v2.everything({ sources: req.user.sources.toString()});
        redisClient.setex(req.user.sources.sort().toString(), 300, JSON.stringify(response.articles));
        res.send(response.articles);
    } catch (e){
        console.log(e)
        res.status(500).send("Internal server error while getting articles stream");
    }
})

module.exports = router;