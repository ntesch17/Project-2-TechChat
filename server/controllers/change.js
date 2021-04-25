const models = require('../models');

const { Change } = models;

// Renders the password change page.
const changePage = (req, res) => {
  res.render('changelogin', { csrfToken: req.csrfToken() });
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

  return Change.ChangeAccountModel.generateHash(req.body.newPass, (salt, hash) => {
    const accountData = {

      salt,
      password: hash,
    };

    const newAccount = new Change.ChangeAccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Change.ChangeAccountModel.toAPI(newAccount);
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
