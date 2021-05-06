const models = require('../models');

const { Chat } = models;
const { Account } = models;

// Switches the users account to include no advertisements.
const makePremium = (req, res) => {
  Account.AccountModel.findOne({ _id: req.session.account._id }, (err, doc) => {
    // Error Handling Here
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred making account to premium.' });
    }
    const account = doc;
    account.subscribed = true;

    req.session.account.subscribed = true;

    const savePromise = account.save();

    savePromise.then(() => res.status(200).json({
      redirect: '/chat',
    }));

    savePromise.catch((err2) => {
      console.log(err2);
      return res.status(400).json({ error: 'An error occurred in creating account for premium.' });
    });
    return savePromise;
  });
};

// Obtains if the user is subscribed or not in order to turn off advertisments.
const getPremium = (req, res) => {
  if (req.session.account.subscribed) {
    return res.status(200).json({ subscribed: true });
  }

  return res.status(200).json({ subscribed: false });
};

// Gathers chat responses from all users.
const getAllChats = (req, res) => {
  Chat.ChatModel.find({}, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred obtaining all chat responses on chatting page.' });
    }
    return res.status(200).json({ chat: docs });
  });
};

// Renders chatting page.
const chatPage = (req, res) => Chat.ChatModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred with the chat page.' });
  }
  console.log(req.session.account.subscribed);
  return res.render('app', {
    csrfToken: req.csrfToken(),
    chat: docs,
    subscribed: req.session.account.subscribed,
    username: req.session.account.username,
  });
});

// Creates chats between users based on responses entered.
const makeChat = (req, res) => {
  if (!req.body.response) {
    return res.status(400).json({ error: 'A response is required.' });
  }

  const chatData = {
    response: req.body.response,
    username: req.session.account.username,
    owner: req.session.account._id,
  };

  const newChat = new Chat.ChatModel(chatData);

  const chatPromise = newChat.save();

  chatPromise.then(() => res.status(200).json({ redirect: '/chat' }));

  chatPromise.catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error occured with creating a chat response.' });
  });
  return chatPromise;
};

// Deletes the message from the database.
const deleteMessage = (req, res) => {
  if (!req.query._id) {
    return res.status(400).json({ error: 'Message ID Required.' });
  }
  return Chat.ChatModel.deleteOne({ _id: req.query._id }, (err) => {
    console.log('Data deleted'); // Success

    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred with deleting a message.' });
    }

    return res.status(200).json({ redirect: '/chat' });
  });
};

// Renders the friends page for a user.
const friendsPage = (req, res) => {
  Account.AccountModel.findByUsername(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred with friends list page.' });
    }

    return res.render('app3', {
      csrfToken: req.csrfToken(),
      account: docs,
      subscribed: req.session.account.subscribed,
      username: req.session.account.username,
    });
  });
};

// Adding a friend after the button has been pressed
// and uses the id of the user to add them as a friend.
const makeFriend = (req, res) => {
  Account.AccountModel.findOne({ _id: req.session.account._id }, (err, doc) => {
    // Error Handling Here
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred with finding friend to add.' });
    }

    if (doc.friendsList.toObject().includes(req.query.username)
    || doc.friendsList.toObject().includes(req.session.account.username)) {
      return res.status(204).send();
    }

    doc.friendsList.push(req.query.username);
    const savePromise = doc.save();

    savePromise.then(() => res.status(200).json({ redirect: '/getFriendsList' }));

    savePromise.catch((err2) => {
      console.log(err2);
      return res.status(400).json({ error: 'An error occurred adding friend to list.' });
    });
    return savePromise;
  });
};

// Creates the friends list based on users IDs.
const getFriendsList = (req, res) => Account.AccountModel.findOne(
  { _id: req.session.account._id }, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred with obtaining friends list.' });
    }
    return res.status(200).json({ friend: doc.friendsList });
  },
).lean();

// Deletes the friend from the database.
const deleteFriend = (req, res) => {
  if (!req.query.friend) {
    return res.status(400).json({ error: 'Username is required to delete friend.' });
  }

  return Account.AccountModel.findOne({ _id: req.session.account._id }, (err, doc) => {
    console.log('Data deleted'); // Success

    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred with finding friend to add.' });
    }

    doc.friendsList.pull(req.query.friend);
    const savePromise = doc.save();
    savePromise.then(() => res.status(200).json({ redirect: '/friends' }));

    savePromise.catch((err2) => {
      console.log(err2);
      return res.status(400).json({ error: 'An error occurred with deleting friend from database.' });
    });
    return savePromise;
  });
};

module.exports.chatPage = chatPage;
module.exports.getChat = getAllChats;
module.exports.make = makeChat;
module.exports.deleteMessage = deleteMessage;
module.exports.getFriendsList = getFriendsList;
module.exports.friendsPage = friendsPage;
module.exports.makeFriend = makeFriend;
module.exports.deleteFriend = deleteFriend;
module.exports.makePremium = makePremium;
module.exports.getPremium = getPremium;
