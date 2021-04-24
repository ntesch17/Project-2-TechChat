const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.status(200).render('login', { csrfToken: req.csrfToken() });
};

const changePage = (req, res) => {
  res.status(200).render('changelogin', { csrfToken: req.csrfToken() });
};

const changeLogin = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws

  req.body.newPass = `${req.body.newPass}`;
  req.body.newPass2 = `${req.body.newPass2}`;

  if (!req.body.newPass || !req.body.newPass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required! ' });
  }

  if (req.body.newPass !== req.body.newPass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match!' });
  }

  return Account.AccountModel.generateHash2(req.body.newPass, (salt, hash) => {
    const accountData = {

      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/login' });
    });

    savePromise.catch((err) => {
      console.log(err);

      //   if (err.code === 11000) {
      //     return res.status(400).json({ error: 'Username already in use.' });
      //   }

      return res.status(400).json({ error: 'An error occured!' });
    });
  });
};
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'RAWR! All fields are required!' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password! ' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.status(200).json({ redirect: '/chat' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required! ' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match!' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.status(200).json({ redirect: '/chat' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occured!' });
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.notFound = notFound;
module.exports.changePage = changePage;
module.exports.changeLogin = changeLogin;
