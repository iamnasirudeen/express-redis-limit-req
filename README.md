# Express Redis Rate Limit

Basic rate-limiting middleware for Express. Use to limit repeated requests to public APIs and/or endpoints.

# Installation

```
$ npm install express-redis-rate-limit
```

# Usage

```
const RateLimit = require("express-redis-rate-limit");
const limiter = RateLimit({
  redisURL: "redis://127.0.0.1:6379", // redis connection url
  expiration: 3600, // 1 hour
  max: 10, // limit each IP to 10 requests per expiration
  message: "Too many requests.", // Message that should be sent back to the user, Default is Too many request
  statusCode: 429, // Status code to be returned. Default is 429
})

// apply to all requests
app.use(limiter)

```

# Configuration

- **redisURL**: Redis connection URL
- **expiration**: second - how long each rate limiting IP address exists for
- **max**: Max number of connections during expiration before sending a 429 response.
- **message**: Error message sent to user when max is exceeded. Defaults to 'Too many requests.'
- **statusCode**: HTTP status code returned when max is exceeded. Defaults to `429`.

# License

MIT © Olohundare Nasirudeen <https://github.com/iamnasirudeen>
