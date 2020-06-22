const router = require("express").Router();
const userModel = require("../models/users");
const authenticated = require("../middleware/authorization").authenticated();
const sourcesCache = require("../middleware/cache").checkSourcesCache();
const streamCache = require("../middleware/cache").checkStreamCache();
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
const redisClient = require("redis").createClient();

// when the user requests the sources list the request must pass through the authentication
// and cache middleware
router.get("/sources", authenticated, sourcesCache, async (req, res, next) => {
  try {
    // Getting the new list if it's not cached
    const response = await newsapi.v2.sources();
    // Storing it in Redis cache with expiry time of 3 hours as sources don't change frequently
    redisClient.setex("sources", 10800, JSON.stringify(response.sources));
    // Sending the list to the user
    res.send(response.sources);
  } catch {
    // if any error occured send error response
    res.status(500).send("Internal server error");
  }
});

// Generic method to subscribe/unsubscribe from a source
const handleSubscription = (subscribe) => {
  return async (req, res) => {
    // extracting the source id
    const { id } = req.params;
    // match the user based on his _id and sources array
    const conditions = {
      _id: req.user._id,
      sources: subscribe ? { $ne: id } : { $eq: id },
    };
    // Push or pull to/from the sources array
    const updateStatement = subscribe
      ? { $push: { sources: id } }
      : { $pull: { sources: id } };
    // Getting the new updated document as a result
    const options = { new: true };

    try {
      // Update the sources
      const user = await userModel.findOneAndUpdate(
        conditions,
        updateStatement,
        options
      );
      // Sending the new sources list to the user if updated
      if (user) {
        res.cookie("sources", JSON.stringify(user.sources), {
          secure: false,
          sameSite: true,
          expires: new Date(Date.now() + 31536000000),
        });
        res.sendStatus(200)
      } else res.send("already done");
    } catch {
      // if any error occured send error response
      res.status(500).send("Internal server error");
    }
  };
};

// Subscribe route
router.post("/subscribe/:id", authenticated, handleSubscription(true));
// Unsubscribe route
router.post("/unsubscribe/:id", authenticated, handleSubscription(false));

// News feed(articles) route
// Check if user is authenticated and the articles aren't chached before proceeding
router.get("/stream", authenticated, streamCache, async (req, res, next) => {
  try {
    // Getting the user articles if it's not cached
    const response = await newsapi.v2.everything({
      sources: req.user.sources.toString(),
    });
    // Storing the articles using Redis using the sorted sources array as a key
    // to enable other users with the same sources list to get them
    // and setting the expiry time for 5 min to be updated
    redisClient.setex(
      req.user.sources.sort().toString(),
      300,
      JSON.stringify(response.articles)
    );
    // Sending articles to the user
    res.send(response.articles);
  } catch {
    // if any error occured send error response
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
