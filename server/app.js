const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const redis = require('redis');
const csrf = require('csurf');
const fileUpload = require('express-fileupload');

// Setup port connection.
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Setup port connection with database.
const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/TechChat';

// Setup mongoose options to use newer functionality
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

// Connecting to mongoose.
mongoose.connect(dbURL, mongooseOptions, (err) => {
  if (err) {
    console.log('Could not connect to database.');
    throw err;
  }
});

// Setup Redis port and hostname.
let redisURL = {
  hostname: 'redis-14000.c257.us-east-1-3.ec2.cloud.redislabs.com',
  port: 14000,
};

// Configure Redis account to application.
let redisPASS = 'TPfdDV5bRfzBjcKFbHbozoLGfwfxGMqL';
if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  [, redisPASS] = redisURL.auth.split(':');
}
const redisClient = redis.createClient({
  host: redisURL.hostname,
  port: redisURL.port,
  password: redisPASS,
});

// Pull in our routes
const router = require('./router.js');

const app = express();
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/faviconChatt.png`));
app.disable('x-powered-by');

// Add our fileUpload plugin. This will take any data uploaded with the 'multipart/formdata'
// encoding type, and add them to the req.files object in our requests.
app.use(fileUpload());

app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));

// Use these attributes per session created.
app.use(session({
  key: 'sessionid',
  store: new RedisStore({
    client: redisClient,
  }),
  secret: 'Domo Arigato',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));

// Use handlebars as the default layout.
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);

// Setup cookie parser.
app.use(cookieParser());

// csrf must come AFTER app.use(cookieParser());
// and app.use(SESSION({.....});
// SHOULD COME BEFORE the router
// csrf token per user interaction.
app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  console.log('Missing CSRF token!');
  return false;
});

router(app);

// Starting application.
app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}.`);
});
