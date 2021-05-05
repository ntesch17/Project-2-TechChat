const models = require('../models');

const { Account } = models;

// Creates the login page.
const loginPage = (req, res) => res.status(200).render('login', { csrfToken: req.csrfToken() });

// Creates the password change page.
const changePage = (req, res) => res.status(200).render('changelogin', { csrfToken: req.csrfToken() });

// Password change function then redirecting them to login page.
const changeLogin = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.oldPass = `${req.body.oldPass}`;
  req.body.newPass = `${req.body.newPass}`;
  req.body.newPass2 = `${req.body.newPass2}`;

  const username = `${req.session.account.username}`;

  if (!req.body.oldPass || !req.body.newPass || !req.body.newPass2) {
    return res.status(400).json({ error: 'All fields are required! ' });
  }

  if (req.body.newPass !== req.body.newPass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  return Account.AccountModel.authenticate(username, req.body.oldPass, (err, account) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }

    return Account.AccountModel.generateHash(req.body.newPass, (salt, hash) => {
      const updateAccount = account;

      updateAccount.password = hash;

      updateAccount.salt = salt;

      const savePromise = updateAccount.save();

      savePromise.then(() => res.status(200).json({ redirect: '/login' }));

      savePromise.catch(() => {
        console.log(err);

        return res.status(400).json({ error: 'An error occured!' });
      });
    });
  });
};

// Logs the user out and destroys there session.
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// Login method for a user and then redirecting them to chat page.
const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password! ' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.status(200).json({ redirect: '/chat' });
  });
};

// Signup method for a user to enter a username and a password,
// retyping the password, and then redirecting them to chat page.
const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required! ' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
      subscribed: false,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.status(200).json({ redirect: '/chat' });
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

// Gains csrf token per user interaction.
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

// 404 page.
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
