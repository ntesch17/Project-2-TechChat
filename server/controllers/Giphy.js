const models = require('../models');
const { AccountModel } = require('../models/Account');

const { Search } = models;





const gifPage = (req, res) => {
    Search.SearchModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }

    return res.render('app4', { csrfToken: req.csrfToken(), search: docs });
  });
};

const makeGif = (req, res) => {
  if (!req.body.search || !req.body.limit) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  const gifData = {
    search: req.body.search,
    limit: req.body.limit,
    owner: req.session.account._id,
  };

  console.log(req.session.account);

  const newGif = new Chat.SearchModel(gifData);

  const gifPromise = newGif.save();

  gifPromise.then(() => res.json({ redirect: '/search' }));

  gifPromise.catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error occured.' });
  });
  return gifPromise;
};




module.exports.gifPage = gifPage;

module.exports.makeGif = makeGif;

