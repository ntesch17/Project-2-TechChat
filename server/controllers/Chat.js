const models = require('../models');

const { Chat } = models;

const getAllChats = (req, res) => {
  Chat.ChatModel.find({}, (err, docs) => res.json({ chat: docs }));
};

const chatPage = (req, res) => {
  Chat.ChatModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }

    return res.render('app2', { csrfToken: req.csrfToken(), chat: docs });
  });
};

const makeChat = (req, res) => {
  if (!req.body.response) {
    return res.status(400).json({ error: 'RAWR! A response is required' });
  }

  const chatData = {
    response: req.body.response,
    username: req.body.username,
    owner: req.session.account._id,
  };

  const newChat = new Chat.ChatModel(chatData);

  const chatPromise = newChat.save();

  chatPromise.then(() => res.json({ redirect: '/chat' }));

  chatPromise.catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error occured.' });
  });
  return chatPromise;
};

module.exports.chatPage = chatPage;
module.exports.getChat = getAllChats;
module.exports.make = makeChat;
