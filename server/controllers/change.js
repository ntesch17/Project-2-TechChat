const models = require('../models');

const { Account } = models;

// Renders the password change page.
const changePage = (req, res) => {
  res.status(200).render('changelogin', { csrfToken: req.csrfToken() });
};

// Changing the password of the user logged in then redirecting them to change loggin page.
const changeLogin = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws

  req.body.newPass = `${req.body.newPass}`;
  req.body.newPass2 = `${req.body.newPass2}`;

  if (!req.body.newPass || !req.body.newPass2) {
    return res.status(400).json({ error: 'All fields are required! ' });
  }

  if (req.body.newPass !== req.body.newPass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  return Account.AccountModel.generateHash2(req.body.newPass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newPassword = new Account.AccountModel(accountData);

    const savePromise = newPassword.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newPassword);
      res.status(200).json({ redirect: '/change' });
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

// Gains a csrf token from each user interaction.
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.changePage = changePage;
module.exports.changeLogin = changeLogin;
module.exports.getToken = getToken;
