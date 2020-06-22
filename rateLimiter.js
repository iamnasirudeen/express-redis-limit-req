const redis = require("redis");

function apiLimiter(config) {
  return function (req, res, next) {
    const ipAdrress =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null);

    const {
      redisURL,
      expiration,
      max,
      message,
      statusCode,
      whiteList,
    } = config;

    // Make sure max is an Integer
    if (typeof max !== "number") throw new Error("Max has to be in Integer");

    // Make sure redisURL was specified
    if (typeof redisURL == "undefined")
      throw new Error("redisURL was not specified");

    // Make sure expiration is an integer
    if (typeof expiration !== "number")
      throw new Error("Expiration has to be an Integer");

    // Make sure whiteList is an array if defined
    if (typeof whiteList !== "undefined" && !Array.isArray(whiteList)) {
      throw new Error("WhiteList has to be an Array");
    }

    // Connect to redis client
    const client = redis.createClient(redisURL);

    if (req) {
      client.get(ipAdrress, (err, redisCount) => {
        if (err) return next(er);

        // check if whitelist has an IP address in it
        if (Array.isArray(whiteList) && whiteList.length > 0) {
          if (whiteList.indexOf(ipAdrress) > -1) return next();
        }

        // convert redisCount from string to an integer
        let requestAmount = parseInt(redisCount);

        if (redisCount == null) {
          client.setex(ipAdrress, expiration, 1);
          return next();
        }

        if (requestAmount !== undefined && requestAmount < max) {
          client.incr(ipAdrress);
          return next();
        }

        if (requestAmount !== undefined && requestAmount == max) {
          const response = message == undefined ? "Too many Requests" : message;
          const status =
            typeof statusCode !== "number"
              ? 429
              : statusCode == undefined
              ? 429
              : statusCode;
          return res.status(status).send({ status, message: response });
        }
      });
    }
  };
}

module.exports = apiLimiter;
