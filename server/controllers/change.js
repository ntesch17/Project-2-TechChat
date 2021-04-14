const models = require('../models');

const { Change } = models;


const changeLogin = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws

  req.body.newPass = `${req.body.newPass}`;
  req.body.newPass2 = `${req.body.newPass2}`;

  if ( !req.body.newPass || !req.body.newPass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required! ' });
  }

  if (req.body.newPass !== req.body.newPass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match!' });
  }

  return Change.ChangeAccountModel.generateHash(req.body.newPass, (salt, hash) => {
    const accountData = {
      
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Change.ChangeAccountModel.toAPI(newAccount);
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

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};


module.exports.changeLogin = changeLogin;
module.exports.getToken = getToken;
