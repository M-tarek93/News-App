const redisClient = require("redis").createClient();
const userModel = require('../models/users');

export const checkSourcesCache = () => {
  return (req, res, next) => {
    redisClient.get("sources", (err, sources) => {
      if (err) {
        res.status(500);
      }
      //if no match found
      if (sources != null) {
        res.send(JSON.parse(sources));
      } else {
        //proceed to next middleware function
        next();
      }
    });
  };
};

export const checkStreamCache = () => {
    return async (req, res, next) => {
      const user = await userModel.findOne({_id:req.user._id});
      redisClient.get(user.sources.sort().toString(), (err, articles) => {
        if (err) {
          res.status(500);
        }
        //if no match found
        if (articles != null) {
          res.send(JSON.parse(articles));
        } else {
          //proceed to next middleware function
          req.user = user;
          next();
        }
      });
    };
  };
  