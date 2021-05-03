const models = require('../models');

const { Chat } = models;
const { Account } = models;


const privateChatPage = (req, res) => {
  Chat.ChatModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }

    return res.render('app6', { csrfToken: req.csrfToken(), chat: docs });
  });
};

const getPrivateChat = (req, res) => {
  console.log(req.query._id)
  return Chat.ChatModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured.' });
    }

    return res.json({ chat: docs });
  });
  // Chat.ChatModel.findOne({ _id: req.session.account._id }, (err, doc) => {
  //   // Error Handling Here
  //   if (err) {
  //     console.log(err);
  //     return res.status(400).json({ error: 'An error occurred.' });
  //   }
  //   let updatePrivate = doc;

  //   updatePrivate.owner = req.query._id;

  //   updatePrivate.username = req.session.account.username;

  //   // doc.friendsList.push(req.query.username);
  //   const savePromise = updatePrivate.save();

  //   savePromise.then(() => res.status(200).json({ redirect: '/getPrivateChat' }));

  //   savePromise.catch((err2) => {
  //     console.log(err2);
  //     return res.status(400).json({ error: 'An error occurred.' });
  //   });
  //   return savePromise;
  // });
};

const makePrivateChat = (req, res) => {
  console.log(req.query._id);
  console.log(req.session.account._id);
  Account.AccountModel.findOne({ _id: req.query._id }, (err, doc) => {
    // Error Handling Here
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }
    const chatData = {
      
      username: req.query.username,
      owner: req.query._id,
    };
    //doc.friendsList.push(req.query.username);
    const newChat = new Chat.ChatModel(chatData);
    const savePromise = newChat.save();

    savePromise.then(() => res.status(200).json({ redirect: '/privateChat' }));

    savePromise.catch((err2) => {
      console.log(err2);
      return res.status(400).json({ error: 'An error occurred.' });
    });
    return savePromise;
  });
};

const deletePrivateMessage = (req, res) => {
  console.log(req.query._id)
  if (req.query._id) {
    Chat.ChatModel.deleteOne({ _id: req.query._id }, (err) => {
      console.log('Data deleted'); // Success

      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred.' });
      }

      return res.status(200).json({ success: 'Data Deleted.' });
    });
  }
};

const makePremium = (req,res) => {
  Account.AccountModel.findOne({ _id: req.session.account._id }, (err, doc) => {
    // Error Handling Here
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }
    let account = doc;
    account.subscribed = true;

    req.session.account.subscribed = true;

    const savePromise = account.save();

    savePromise.then(() => res.status(200).send());

    savePromise.catch((err2) => {
      console.log(err2);
      return res.status(400).json({ error: 'An error occurred.' });
    });
    return savePromise;
  });
  
}

const getPremium = (req,res) => {
  if(req.session.account.subscribed) {
    return res.status(200).json({ subscribed: true});
  }
  else {
    return res.status(200).json({ subscribed: false});
  }
  
}

// Gathers chat responses from all users.
const getAllChats = (req, res) => {
  Chat.ChatModel.find({}, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }
    return res.status(200).json({ chat: docs });
  });
};

// Renders chatting page.
const chatPage = (req, res) => {
  Chat.ChatModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }
    console.log(req.session.account.subscribed)
    return res.render('app', { csrfToken: req.csrfToken(), chat: docs, subscribed: req.session.account.subscribed });
  });
};

// Creates chats between users based on responses entered.
const makeChat = (req, res) => {
  if (!req.body.response) {
    return res.status(400).json({ error: 'A response is required' });
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

    return res.status(400).json({ error: 'An error occured.' });
  });
  return chatPromise;
};

// Deletes the message from the database.
const deleteMessage = (req, res) => {
  if (req.query._id) {
    Chat.ChatModel.deleteOne({ _id: req.query._id }, (err) => {
      console.log('Data deleted'); // Success

      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred.' });
      }

      return res.status(200).json({ success: 'Data Deleted.' });
    });
  }
};

// Renders the friends page for a user.
const friendsPage = (req, res) => {
  Account.AccountModel.findByUsername(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }

    return res.render('app3', { csrfToken: req.csrfToken(), account: docs, subscribed: req.session.account.subscribed });
  });
};

// Adding a friend after the button has been pressed
// and uses the id of the user to add them as a friend.
const makeFriend = (req, res) => {
  Account.AccountModel.findOne({ _id: req.session.account._id }, (err, doc) => {
    // Error Handling Here
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }

    doc.friendsList.push(req.query.username);
    const savePromise = doc.save();

    savePromise.then(() => res.status(200).json({ redirect: '/getFriendsList' }));

    savePromise.catch((err2) => {
      console.log(err2);
      return res.status(400).json({ error: 'An error occurred.' });
    });
    return savePromise;
  });
};

// Creates the friends list based on users ids.
const getFriendsList = (req, res) => {
  Account.AccountModel.findOne({ _id: req.session.account._id }, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }
    return res.status(200).json({ friend: doc.friendsList });
  }).lean();
};

// Deletes the message from the database.
const deleteFriend = (req, res) => {
  if (req.query.friend) {
    console.log('here');
    Account.AccountModel.deleteOne({ friend: req.query.friend }, (err) => {
      console.log('Data deleted'); // Success

      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred.' });
      }

      return res.status(200).json({ success: 'Data Deleted.' });
    });
  }
};

module.exports.chatPage = chatPage;
module.exports.getChat = getAllChats;
module.exports.make = makeChat;
module.exports.deleteMessage = deleteMessage;
module.exports.privateChatPage = privateChatPage;
module.exports.getPrivateChat = getPrivateChat;
module.exports.makePrivate = makePrivateChat;
module.exports.deletePrivateMessage = deletePrivateMessage;
module.exports.getFriendsList = getFriendsList;
module.exports.friendsPage = friendsPage;
module.exports.makeFriend = makeFriend;
module.exports.deleteFriend = deleteFriend;
module.exports.makePremium = makePremium;
module.exports.getPremium = getPremium;

