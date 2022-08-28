import logger from '@/components/logger';
import User from '@/models/User';

const jwtMiddleware = require('express-jwt'),
  UnauthorizedError = require('express-jwt').UnauthorizedError,
  Url = require('url-parse');

// We pass a secret token into the NodeJS process via an environment variable.
// We will use this token to sign cookies and JWTs
const AUTH_SECRET_TOKEN = process.env.SECRET_TOKEN;

module.exports = {
  loadUser: preloadUserMiddleware,
  checkUser: checkUserLoadedMiddleware,
  jwtProtected: jwtMiddleware({
    secret: AUTH_SECRET_TOKEN,
    getToken: getToken,
    userProperty: 'jwtUser',
  }),
  jwtPublic: jwtMiddleware({
    credentialsRequired: false,

    userProperty: 'jwtUser',
    secret: AUTH_SECRET_TOKEN,
    getToken: getToken,
  }),
};

function getToken(req) {
  let token = null;
  if (req.headers.authorization && req.headers.authorization.split(' ')[0].toLowerCase() === 'bearer') {
    // Handle token presented as a Bearer token in the Authorization header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    // Handle token presented as URI param
    token = req.query.token;
  } else if (req.cookies && req.cookies.token) {
    // Handle token presented as a cookie parameter
    token = req.cookies.token;
  }
  req.authToken = token;
  return token;
}

async function preloadUserMiddleware(req, res, next) {
  let userId = req.jwtUser ? req.jwtUser.id : null;

  try {
    if (userId) {
      let model = await User.findOne({_id: userId});

      if (model) {
        req.user = model;

        let url = new Url(req.get('origin') ? req.get('origin') : req.headers.referer);
        req.userDomain = `${url.protocol}//${url.host}`;
      }

      next();
    } else {
      next();
    }
  } catch (err) {
    logger.error(err);
    next();
  }
}

function checkUserLoadedMiddleware(req, res, next) {
  let userId = req.user ? req.user.id : null;

  if (!userId) {
    next(new UnauthorizedError('user_not_found', 'User not found by this token'));
  } else {
    next();
  }
}
