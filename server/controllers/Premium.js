const models = require('../models');

const { Premium } = models;
const { Account } = models;

// Renders chatting page.
const premiumPage = (req, res) => {
    Premium.PremiumModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }

    return res.render('premium', { csrfToken: req.csrfToken(), premium: docs });
  });
};

// Creates chats between users based on responses entered.
const makePremium = (req, res) => {
  if (!req.body.email) {
    return res.status(400).json({ error: 'A email is required' });
  }

  const premiumData = {
    email: req.body.email,
    owner: req.session.account._id,
  };

  console.log(req.session.account);

  const newPremium = new Premium.PremiumModel(premiumData);

  const premiumPromise = newPremium.save();

  premiumPromise.then(() => res.status(200).json({ redirect: '/premium' }));

  premiumPromise.catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error occured.' });
  });
  return premiumPromise;
};

// Obtains the note subitted by the user and is displayed to just that user.
const getPremium = (request, response) => {
    const req = request;
    const res = response;
  
    return Premium.PremiumModel.findByOwner(req.session.account._id, (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occured.' });
      }
  
      return res.status(200).json({ premium: docs });
    });
  };

module.exports.premiumPage = premiumPage;
module.exports.getPremium = getPremium;
module.exports.makePremium = makePremium;

