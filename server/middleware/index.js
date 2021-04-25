// Requiring thjat the user is logged in.
const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }
  return next();
};

// Reguiring that a users logged out.
const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/maker');
  }

  return next();
};

// Requires that the users interaction is secure.
const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }

  return next();
};

// Bypass security if needed.
const bypassSecure = (req, res, next) => {
  next();
};

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

// Node environment type.
if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
