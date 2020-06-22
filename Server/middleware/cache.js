const redisClient = require("redis").createClient();
const userModel = require("../models/users");

// Middleware to check if the sources list is already cached
export const checkSourcesCache = () => {
  return (req, res, next) => {
    // Retrieving it from Redis
    redisClient.get("sources", (err, sources) => {
      // if it encounters error send error code
      if (err) {
        res.status(500);
      }
      // if match found send the result to the user
      if (sources != null) {
        res.send(JSON.parse(sources));
      } else {
        // if it's not exist proceed to next middleware function
        next();
      }
    });
  };
};

// Middleware to check if the articles list for the requested sources is already cached
export const checkStreamCache = () => {
  return async (req, res, next) => {
    // Getting the up-to date user data from the database
    const user = await userModel.findOne({ _id: escape(req.user._id) });
    // Sort the user sources array and check if it's articles are cached
    // Sorting data is because many users may have the same sources
    redisClient.get(user.sources.sort().toString(), (err, articles) => {
      // if it encounters error send error code
      if (err) {
        res.status(500);
      }
      // if match found send the result to the user
      if (articles != null) {
        res.send(JSON.parse(articles));
      } else {
        // if it's not exist proceed to next middleware function
        req.user = user;
        next();
      }
    });
  };
};
